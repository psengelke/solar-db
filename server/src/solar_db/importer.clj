(ns solar-db.importer
  (:require [dk.ative.docjure.spreadsheet :as sheet]
            [solar-db.db :as db]
            [tick.core :as t]
            [xtdb.api :as xt])
  (:import (java.time.format DateTimeFormatter)))

(defn- str->date
  [s]
  (t/parse-date s (DateTimeFormatter/ofPattern "yyyy/MM/dd")))

(defn- str->month
  [s]
  (str->date (str s "/01")))

(defn- str->year
  [s]
  (str->date (str s "/01/01")))

(defn- str->timestamp
  [s]
  (t/parse-date-time s (DateTimeFormatter/ofPattern "yyyy/MM/dd HH:mm:ss")))

(defn- str->decimal
  [s]
  (if (empty? s)
    0.0
    (Double/parseDouble s)))

(defn- parse-soc
  [s]
  (if (empty? s)
    0.0
    (/ (str->decimal s) 100.0)))

(defn- read-detailed-data
  [filename]

  (let [data (->> (sheet/load-workbook filename)
                  (sheet/select-sheet "Sheet1")
                  (sheet/select-columns
                    {:A :plant
                     :B :timestamp
                     :D :production
                     :E :consumption
                     :F :grid
                     :G :grid-draw
                     :H :grid-feed
                     :I :battery
                     :J :battery-charge
                     :K :battery-discharge
                     :L :soc}))]

    ;; Ensure that all columns are mapped correctly.
    (assert (= {:plant             "Plant Name"
                :timestamp         "Updated Time"

                :production        "Production Power(W)"
                :consumption       "Consumption Power(W)"

                :grid              "Grid Power(W)"
                :grid-draw         "Purchasing Power(W)"
                :grid-feed         "Feed-in Power(W)"

                :battery           "Battery Power(W)"
                :battery-charge    "Charging Power(W)"
                :battery-discharge "Discharging Power(W)"
                :soc               "SoC(%)"}

               (first data)))

    (->> data rest

         (map

           (comp
             #(assoc % :xt/id (hash [(:plant %) (:timestamp %) :detailed]))
             #(-> %

                  (assoc :granularity :detailed)

                  (update :timestamp str->timestamp)

                  (update :production str->decimal)
                  (update :consumption str->decimal)

                  (update :grid str->decimal)
                  (update :grid-draw str->decimal)
                  (update :grid-feed str->decimal)

                  (update :battery str->decimal)
                  (update :battery-charge str->decimal)
                  (update :battery-discharge str->decimal)

                  (update :soc parse-soc))))

         (sort-by :timestamp))))

(defn- import-detailed-data!
  [filename]
  (let [node (db/get-node)]
    (->> filename
         read-detailed-data
         (map #(vector ::xt/put %))
         (xt/submit-tx node)
         (xt/await-tx node))))

(defn- assoc-self-sufficiency
  [e]

  (let [consumption (:consumption e)
        grid-draw   (:grid-draw e)
        self-use    (max 0 (- consumption grid-draw))]

    (assoc e :self-sufficiency
             (if (pos? consumption)
               (/ self-use consumption)
               0))))

(defn- read-daily-data
  [filename]

  (let [data (->> (sheet/load-workbook filename)
                  (sheet/select-sheet "Sheet1")
                  (sheet/select-columns
                    {:A :plant
                     :B :date
                     :D :production
                     :E :consumption
                     :F :grid-feed
                     :G :grid-draw
                     :H :battery-charge
                     :I :battery-discharge}))]

    ;; Ensure that all columns are mapped correctly.
    (assert (= {:plant             "Plant Name",
                :date              "Updated Time",
                :production        "Production-Today(kWh)",
                :consumption       "Consumption-Today(kWh)",
                :grid-feed         "Feed-in Power-Today(kWh)",
                :grid-draw         "Energy Purchased-Today(kWh)",
                :battery-charge    "Energy Charged-This Day(kWh)",
                :battery-discharge "Energy Discharged-This Day(kWh)"}

               (first data)))

    (->> data rest

         (map

           (comp
             #(assoc % :xt/id (hash [(:plant %) (:date %) :daily]))
             #(-> %
                  (assoc :granularity :daily)
                  (update :date str->date)
                  (update :production str->decimal)
                  (update :consumption str->decimal)
                  (update :grid-feed str->decimal)
                  (update :grid-draw str->decimal)
                  (update :battery-charge str->decimal)
                  (update :battery-discharge str->decimal)
                  assoc-self-sufficiency)))

         (sort-by :date))))

(defn- import-daily-data!
  [filename]
  (let [node (db/get-node)]
    (->> filename
         read-daily-data
         (mapv #(vector ::xt/put %))
         (xt/submit-tx node)
         (xt/await-tx node))))

(defn- read-monthly-data
  [filename]

  (let [data (->> (sheet/load-workbook filename)
                  (sheet/select-sheet "Sheet1")
                  (sheet/select-columns
                    {:A :plant
                     :B :date
                     :D :production
                     :E :consumption
                     :F :grid-feed
                     :G :grid-draw
                     :H :battery-charge
                     :I :battery-discharge}))]

    ;; Ensure that all columns are mapped correctly.
    (assert (= {:plant             "Plant Name",
                :date              "Updated Time",
                :production        "Production-This Month(kWh)",
                :consumption       "Consumption-This Month(kWh)",
                :grid-feed         "Feed-in Power-This Month(kWh)",
                :grid-draw         "Energy Purchased-This Month(kWh)",
                :battery-charge    "Energy Charged-This Month(kWh)",
                :battery-discharge "Energy Discharged-This Month(kWh)"}

               (first data)))

    (->> data rest

         (map (comp
                #(assoc % :xt/id (hash [(:plant %) (:date %) :monthly]))
                #(-> %
                     (assoc :granularity :monthly)
                     (update :date str->month)
                     (update :production str->decimal)
                     (update :consumption str->decimal)
                     (update :grid-feed str->decimal)
                     (update :grid-draw str->decimal)
                     (update :battery-charge str->decimal)
                     (update :battery-discharge str->decimal)
                     assoc-self-sufficiency)))

         (sort-by :date))))

(defn- import-monthly-data!
  [filename]
  (let [node (db/get-node)]
    (->> filename
         read-monthly-data
         (mapv #(vector ::xt/put %))
         (xt/submit-tx node)
         (xt/await-tx node))))

(defn- read-yearly-data
  [filename]

  (let [data (->> (sheet/load-workbook filename)
                  (sheet/select-sheet "Sheet1")
                  (sheet/select-columns
                    {:A :plant
                     :B :date
                     :D :production
                     :E :consumption
                     :F :grid-feed
                     :G :grid-draw
                     :H :battery-charge
                     :I :battery-discharge}))]

    ;; Ensure that all columns are mapped correctly.
    (assert (= {:plant             "Plant Name",
                :date              "Updated Time",
                :production        "Production-This Year(kWh)",
                :consumption       "Consumption-This Year(kWh)",
                :grid-feed         "Feed-in Power-This Year(kWh)",
                :grid-draw         "Energy Purchased-This Year(kWh)",
                :battery-charge    "Energy Charged-This Year(kWh)",
                :battery-discharge "Energy Discharged-This Year(kWh)"}

               (first data)))

    (->> data rest

         (map (comp
                #(assoc % :xt/id (hash [(:plant %) (:date %) :yearly]))
                #(-> %
                     (assoc :granularity :yearly)
                     (update :date str->year)
                     (update :production str->decimal)
                     (update :consumption str->decimal)
                     (update :grid-feed str->decimal)
                     (update :grid-draw str->decimal)
                     (update :battery-charge str->decimal)
                     (update :battery-discharge str->decimal)
                     assoc-self-sufficiency)))

         (sort-by :date))))

(defn- import-yearly-data!
  [filename]
  (let [node (db/get-node)]
    (->> filename
         read-yearly-data
         (mapv #(vector ::xt/put %))
         (xt/submit-tx node)
         (xt/await-tx node))))

(comment

  #_(import-detailed-data! "resources/temp/jan2024.xlsx")

  (xt/q
    (xt/db (db/get-node))
    '{:find  [(count ?e)]
      :where [[?e :granularity :detailed]]})

  #_(import-daily-data! "resources/temp/daily2024.xlsx")

  (xt/q
    (xt/db (db/get-node))
    '{:find  [(count ?e)]
      :where [[?e :granularity :daily]]})

  #_(->> "resources/temp/monthly2021-2024.xlsx"
         import-monthly-data!)

  (xt/q
    (xt/db (db/get-node))
    '{:find  [(count ?e)]
      :where [[?e :granularity :monthly]]})

  #_(->> "resources/temp/yearly2023-2024.xlsx"
         import-yearly-data!)

  (xt/q
    (xt/db (db/get-node))
    '{:find  [(count ?e)]
      :where [[?e :granularity :yearly]]})

  )

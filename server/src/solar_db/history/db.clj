(ns solar-db.history.db
  (:require
   [tick.core]
   [xtdb.api :as xt]))

(defn fetch-temporal-bounds
  "Fetches the temporal bounds of historical data, by granularity."
  [db]
  (->> (xt/q db
        '{:find  [?granularity (min ?t) (max ?t)]
          :where [[?e :granularity ?granularity]
                  (or-join [?e ?granularity ?t]
                           (and [(= ?granularity :detailed)] [?e :timestamp ?t])
                           [?e :date ?t])]})

  (reduce (fn [acc [granularity min-t max-t]]
            (assoc acc granularity [min-t max-t]))
          {})))

(defn fetch-detailed-history
  "Fetches detailed history for a period of time, at a 5-minute interval."
  [db req]

  (->> (xt/q db
             '{:find  [(pull ?e [*])]
               :in    [?lb ?ub]
               :where [[?e :granularity :detailed]
                       [?e :timestamp ?timestamp]
                       [(>= ?timestamp ?lb)]
                       [(<= ?timestamp ?ub)]]}
             (:start-timestamp req)
             (:end-timestamp req))

       (map first)
       (sort-by :timestamp)))

(defn fetch-soc-stats
  "Fetches state of charge (SOC) statistics aggregated by time interval over a day, for a period
  of time."
  [db req]

  (->> (xt/q db

             '{:find  [?time
                       (min ?soc)
                       (max ?soc)
                       (avg ?soc)
                       (median ?soc)
                       (variance ?soc)
                       (stddev ?soc)]

               :in    [?lb ?ub]
               :where [[?e :granularity :detailed]
                       [?e :timestamp ?timestamp]
                       [(>= ?timestamp ?lb)]
                       [(<= ?timestamp ?ub)]
                       [(tick.core/time ?timestamp) ?time]
                       [?e :soc ?soc]]}

             (:start-timestamp req)
             (:end-timestamp req))

       (map (fn [[time min max avg median variance std-dev]]
              {:time     time
               :min      min
               :max      max
               :avg      avg
               :median   median
               :variance variance
               :std-dev  std-dev}))

       (sort-by :time)))

(defn fetch-detailed-stats
  "Fetches detailed statistics aggregated by time interval over a day, for a period of time."
  [db req]

  (->> (xt/q
         db

         '{:find  [?time

                   ;; Production
                   (min ?production)
                   (max ?production)
                   (avg ?production)
                   (median ?production)
                   (stddev ?production)

                   ;; Consumption
                   (min ?consumption)
                   (max ?consumption)
                   (avg ?consumption)
                   (median ?consumption)
                   (stddev ?consumption)

                   ;; Grid
                   (min ?grid)
                   (max ?grid)
                   (avg ?grid)
                   (median ?grid)
                   (stddev ?grid)

                   ;; Battery
                   (min ?battery)
                   (max ?battery)
                   (avg ?battery)
                   (median ?battery)
                   (stddev ?battery)

                   ;; Solar
                   (min ?solar)
                   (max ?solar)
                   (avg ?solar)
                   (median ?solar)
                   (stddev ?solar)

                   ;; State of Charge
                   (min ?soc)
                   (max ?soc)
                   (avg ?soc)
                   (median ?soc)
                   (stddev ?soc)]

           :in    [?lb ?ub]

           :where [[?e :granularity :detailed]

                   [?e :timestamp ?timestamp]
                   [(>= ?timestamp ?lb)]
                   [(<= ?timestamp ?ub)]
                   [(tick.core/time ?timestamp) ?time]

                   [?e :production ?production]
                   [?e :consumption ?consumption]
                   [?e :grid-draw ?grid]
                   [?e :battery-discharge ?battery]
                   [(- ?consumption ?grid ?battery) ?solar-]
                   [(max 0 ?solar-) ?solar]
                   [?e :soc ?soc]]}

         (:start-timestamp req)
         (:end-timestamp req))

       (map (fn [[time
                  min-production max-production avg-production median-production std-dev-production
                  min-consumption max-consumption avg-consumption median-consumption std-dev-consumption
                  min-grid max-grid avg-grid median-grid std-dev-grid
                  min-battery max-battery avg-battery median-battery std-dev-battery
                  min-solar max-solar avg-solar median-solar std-dev-solar
                  min-soc max-soc avg-soc median-soc std-dev-soc]]

              {:time                      time

               ;; Production
               :min-production            min-production
               :max-production            max-production
               :avg-production            avg-production
               :median-production         median-production
               :std-dev-production        std-dev-production
               :std-dev-production-range  [(max min-production (- avg-production std-dev-production))
                                           (min max-production (+ avg-production std-dev-production))]

               ;; Consumption
               :min-consumption           min-consumption
               :max-consumption           max-consumption
               :avg-consumption           avg-consumption
               :median-consumption        median-consumption
               :std-dev-consumption       std-dev-consumption
               :std-dev-consumption-range [(max min-consumption (- avg-consumption std-dev-consumption))
                                           (min max-consumption (+ avg-consumption std-dev-consumption))]

               ;; Grid
               :min-grid                  min-grid
               :max-grid                  max-grid
               :avg-grid                  avg-grid
               :median-grid               median-grid
               :std-dev-grid              std-dev-grid
               :std-dev-grid-range        [(max min-grid (- avg-grid std-dev-grid))
                                           (min max-grid (+ avg-grid std-dev-grid))]

               ;; Battery
               :min-battery               min-battery
               :max-battery               max-battery
               :avg-battery               avg-battery
               :median-battery            median-battery
               :std-dev-battery           std-dev-battery
               :std-dev-battery-range     [(max min-battery (- avg-battery std-dev-battery))
                                           (min max-battery (+ avg-battery std-dev-battery))]

               ;; Solar
               :min-solar                 min-solar
               :max-solar                 max-solar
               :avg-solar                 avg-solar
               :median-solar              median-solar
               :std-dev-solar             std-dev-solar
               :std-dev-solar-range       [(max min-solar (- avg-solar std-dev-solar))
                                           (min max-solar (+ avg-solar std-dev-solar))]

               ;; State of Charge
               :min-soc                   min-soc
               :max-soc                   max-soc
               :avg-soc                   avg-soc
               :median-soc                median-soc
               :std-dev-soc               std-dev-soc
               :std-dev-soc-range         [(max min-soc (- avg-soc std-dev-soc))
                                           (min max-soc (+ avg-soc std-dev-soc))]}))

       (sort-by :time)))

(defn fetch-history
  "Fetches history for a period of time, based on the given `:granularity` in req."
  [db {:keys [start-date end-date granularity] :as _req}]

  (->> (xt/q db
             '{:find  [(pull ?e [*])]
               :in    [?lb ?ub ?granularity]
               :where [[?e :granularity ?granularity]
                       [?e :date ?date]
                       [(>= ?date ?lb)]
                       [(<= ?date ?ub)]]}

             start-date
             end-date
             granularity)

       (map first)
       (sort-by :date)))

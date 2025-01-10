(ns solar-db.history.db
  (:require [solar-db.db :as db]
            [tick.core :as t]
            [xtdb.api :as xt]))

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
                       [(t/time ?timestamp) ?time]
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

(comment

  (fetch-detailed-history
    (xt/db (db/get-node))
    {:start-timestamp #time/date-time"2024-01-01T00:00"
     :end-timestamp   #time/date-time"2024-01-31T23:59:59"})

  (fetch-soc-stats
    (xt/db (db/get-node))
    {:start-timestamp #time/date-time"2024-01-01T00:00"
     :end-timestamp   #time/date-time"2024-01-31T23:59:59"})

  (fetch-history
    (xt/db (db/get-node))
    {:start-date  #time/date"2024-01-01"
     :end-date    #time/date"2024-01-31"
     :granularity :daily})

  (fetch-history
    (xt/db (db/get-node))
    {:end-date #time/date "2021-01-31",
     :granularity :daily,
     :start-date #time/date "2021-01-01"})


  )

(ns solar-db.history.routes
  (:require [solar-db.history.route-handlers :as rh]))

(def routes

  [["/history/fetch/temporal-bounds"
    {:get {:summary   "Fetches the temporal bounds of historical data, by granularity."
           :responses {200 {:body :schema/FetchHistoryTemporalBoundsResponse}}
           :handler   rh/fetch-temporal-bounds}}]

   ["/history/fetch/detailed"
    {:post {:summary    "Fetches detailed history for a period of time, at a 5-minute interval."
            :parameters {:body :schema/FetchDetailedHistoryRequest}
            :responses  {200 {:body :schema/FetchDetailedHistoryResponse}}
            :handler    rh/fetch-detailed-history}}]

   ["/history/fetch/soc-stats"
    {:post {:summary    "Fetches state of charge (SOC) statistics aggregated by time interval over a day, for a period of time."
            :parameters {:body :schema/FetchSocStatsRequest}
            :responses  {200 {:body :schema/FetchSocStatsResponse}}
            :handler    rh/fetch-soc-stats}}]

   ["/history/fetch/detailed-stats"
    {:post {:summary    "Fetches detailed statistics aggregated by time interval over a day, for a period of time."
            :parameters {:body :schema/FetchDetailedHistoryStatsRequest}
            :responses  {200 {:body :schema/FetchDetailedHistoryStatsResponse}}
            :handler    rh/fetch-detailed-stats}}]

   ["/history/fetch"
    {:post {:summary    "Fetches history for a period of time."
            :parameters {:body :schema/FetchHistoryRequest}
            :responses  {200 {:body :schema/FetchHistoryResponse}}
            :handler    rh/fetch-history}}]])

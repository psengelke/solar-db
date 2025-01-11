(ns solar-db.history.route-handlers
  (:require [ring.util.response :as res]
            [solar-db.db :as db]
            [solar-db.history.db :as history.db]
            [solar-db.validation.core :as v]
            [xtdb.api :as xt]))

(defn fetch-detailed-history
  "Fetches detailed history for a period of time, at a 5-minute interval."
  [req]
  (let [req' (-> req :parameters :body)
        _    (v/validate :schema/FetchDetailedHistoryRequest req')
        db   (xt/db (db/get-node))]
    (res/response {:data (history.db/fetch-detailed-history db req')})))

(defn fetch-soc-stats
  "Fetches state of charge (SOC) statistics aggregated by time interval over a day, for a period"
  [req]
  (let [req' (-> req :parameters :body)
        _    (v/validate :schema/FetchSocStatsRequest req')
        db   (xt/db (db/get-node))]
    (res/response {:data (history.db/fetch-soc-stats db req')})))

(defn fetch-history
  "Fetches history for a period of time."
  [req]
  (let [req' (-> req :parameters :body)
        _    (v/validate :schema/FetchHistoryRequest req')
        db   (xt/db (db/get-node))]
    (res/response {:data (history.db/fetch-history db req')})))

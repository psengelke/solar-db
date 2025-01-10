(ns solar-db.router.routes
  (:require [solar-db.history.routes :as history]))

(def routes
  (concat
    history/routes))

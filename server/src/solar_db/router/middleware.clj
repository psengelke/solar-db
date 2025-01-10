(ns solar-db.router.middleware
  (:require [ring.middleware.cors :as ring.cors]
            [reitit.ring.middleware.exception :as rrm.exception]))

(defn cors-middleware
  "A middleware that adds CORS headers to requests."
  [handler]
  (ring.cors/wrap-cors
    handler
    :access-control-allow-origin [#".*"]
    :access-control-allow-methods [:get :post :put :patch :delete]))

(defn- -ex-middleware-wrapper
  [handler exception request]
  (.printStackTrace exception)
  (handler exception request))

(def exception-middleware
  (rrm.exception/create-exception-middleware
    {::rrm.exception/wrap -ex-middleware-wrapper}))

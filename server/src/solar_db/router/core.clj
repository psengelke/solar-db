(ns solar-db.router.core
  (:require [malli.util :as mu]
            [muuntaja.core :as m]
            [reitit.coercion.malli]
            [reitit.dev.pretty :as pretty]
            [reitit.ring :as ring]
            [reitit.ring.coercion :as coercion]
            [reitit.ring.malli]
            [reitit.ring.middleware.multipart :as multipart]
            [reitit.ring.middleware.muuntaja :as muuntaja]
            [reitit.ring.middleware.parameters :as parameters]
            [reitit.ring.spec :as spec]
            [ring.adapter.jetty :as jetty]
            [solar-db.router.malli]
            [solar-db.router.middleware :as middleware]
            [solar-db.router.routes :as routes])
  (:import (org.eclipse.jetty.server Server)))

(def ^:private router-options
  {:validate  spec/validate
   :exception pretty/exception

   :data
   {:coercion
    (reitit.coercion.malli/create
      {:error-keys       #{:coercion :in :schema :value :errors :humanized}
       :compile          mu/closed-schema
       :validate         false
       :strip-extra-keys true
       :default-values   true
       :options          nil})

    :muuntaja m/instance
    :middleware
    [middleware/exception-middleware
     middleware/cors-middleware
     parameters/parameters-middleware
     muuntaja/format-negotiate-middleware
     muuntaja/format-response-middleware
     muuntaja/format-request-middleware
     coercion/coerce-response-middleware
     coercion/coerce-request-middleware
     multipart/multipart-middleware]}})

(def ^:private router
  (ring/ring-handler
    (ring/router routes/routes router-options)
    (ring/routes (ring/create-default-handler))))

(def ^{:private         true
       :clj-reload/keep true}
  jetty-server
  (atom nil))

(defn- -stop-server!
  [^Server server]
  (when server (.stop server)))

(defn- -start-server!
  []
  (let [port   11111
        server (jetty/run-jetty #'router {:port port :join? false})]
    (println (format "The server is running on @ http://localhost:%s" port))
    server))

(defn restart!
  []
  (swap! jetty-server
         (fn [server]
           (-stop-server! server)
           (-start-server!))))

(defn start! [] (restart!))

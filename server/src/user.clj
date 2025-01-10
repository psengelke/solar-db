(ns user
  (:require [clj-reload.core :as cr]
            [solar-db.archivist :as archivist]
            [solar-db.db :as db]
            [solar-db.router.core :as router])
  (:import
    (clojure.lang IPersistentMap)
    (java.io Writer)))

; Don't use namespaced maps by default in the REPL.
(defmethod print-method IPersistentMap [m, ^Writer w]
  (#'clojure.core/print-meta m w)
  (#'clojure.core/print-map m #'clojure.core/pr-on w))

#_{:clj-kondo/ignore [:unused-private-var]}
(defn- after-cr-reload!
  []
  (router/restart!))

(cr/init
  {:dirs        ["src"]
   :reload-hook 'after-cr-reload!})

(defn start! [] (router/start!))
(defn restart! [] (cr/reload))

(comment

  (db/get-node)

  (archivist/archive!)

  (start!)
  (restart!)

  )

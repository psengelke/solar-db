(ns user
  (:require [solar-db.archivist :as archivist]
            [solar-db.db :as db])
  (:import
    (clojure.lang IPersistentMap)
    (java.io Writer)))

; Don't use namespaced maps by default in the REPL.
(defmethod print-method IPersistentMap [m, ^Writer w]
  (#'clojure.core/print-meta m w)
  (#'clojure.core/print-map m #'clojure.core/pr-on w))

(comment

  (db/get-node)

  (archivist/archive!)

  )

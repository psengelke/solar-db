(ns validation.core
  (:require [malli.core :as m]))

(defn validate
  [schema value]
  ;; todo throw 400 exception
  (m/validate schema value)
  )

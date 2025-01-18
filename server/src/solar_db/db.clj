(ns solar-db.db
  (:require
    [clojure.java.io :as io]
    [xtdb.api :as xt]))

(def ^:private tx-log-file "resources/xtdb/tx-log")
(def ^:private doc-store-file "resources/xtdb/doc-store")
(def ^:private index-store-file "resources/xtdb/index-store")

(def ^{:private         true
       :clj-reload/keep true}
  -node
  "An atom that holds the current XTDB node."
  (atom nil))

(defn- ->kv-store
  "A helper function for configuring an aspect of the database."
  [dir]
  {:kv-store {:xtdb/module 'xtdb.rocksdb/->kv-store
              :db-dir      (io/file dir)
              :sync?       true}})

(defn- make-resource-dirs
  "Creates the database resource directories, iff they do not exist."
  []
  (run! #(-> % (str "/stub") io/make-parents)
        [tx-log-file
         doc-store-file
         index-store-file]))

(defn- start-xtdb!
  "Starts XTDB and sets the node."
  []
  (make-resource-dirs)

  (->> (xt/start-node
         {:xtdb/tx-log         (->kv-store tx-log-file)
          :xtdb/document-store (->kv-store doc-store-file)
          :xtdb/index-store    (->kv-store index-store-file)})
       (reset! -node)))

(defn stop-xtdb!
  "Stops the current node and clears it."
  []
  (when-let [node @-node]
    (when (compare-and-set! -node node nil)
      (.close node))))

(defn get-node
  "Gets an XTDB node."
  []
  (or @-node
      (locking -node
        (or @-node
            (do (start-xtdb!)
                @-node)))))
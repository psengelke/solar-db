(ns solar-db.archivist
  (:require [clojure.java.io :as io]
            [tick.core :as t])
  (:import (java.io File FileInputStream)
           (java.util.zip ZipEntry ZipOutputStream)))

(defn- add-file-to-zip
  [out ^File file base-path]
  (let [entry-name (.replaceFirst (.getPath file) (str base-path File/separator) "")]
    (when-not (.isDirectory file)
      (let [entry (ZipEntry. entry-name)]
        (.putNextEntry out entry)
        (with-open [input-stream (FileInputStream. file)]
          (io/copy input-stream out))
        (.closeEntry out)))))

(defn- add-folder-to-zip
  [out folder base-path]
  (doseq [file (.listFiles folder)]
    (if (.isDirectory file)
      (add-folder-to-zip out file base-path)
      (add-file-to-zip out file base-path))))

(defn archive!
  "Creates an archive of the `resources` folder."
  []

  (let [in        (io/file "resources")
        base-path (.getPath in)
        out       (io/file (str "out/backups/solar-db_" (t/now) ".zip"))]

    (io/make-parents out)
    (with-open [zip-file (ZipOutputStream. (io/output-stream out))]
      (add-folder-to-zip zip-file in base-path))))

(comment

  (archive!)

  )

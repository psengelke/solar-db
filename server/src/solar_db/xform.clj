(ns solar-db.xform
  (:require [clojure.string :as str]))

(defn- kebab-case->camel-case
  "Converts a string of the form `a-b-c` to `aBC`."
  [s]
  (let [parts (str/split s #"-")]
    (when (seq parts)
      (->> parts rest
           (map str/capitalize)
           (cons (first parts))
           (str/join)))))

(defn- camel-case->kebab-case
  "Transforms a string of the form `aBC` to `a-b-c`."
  [s]
  (as-> s $
        (str/split $ #"(?=[A-Z])")
        (map str/lower-case $)
        (str/join "-" $)))

(defn keyword->str
  "Transforms a keyword of the form `:my-namespace/my-name` to `myNamespace_myName`."
  [k]
  (when (keyword? k)
    (let [ns (-> k namespace str)
          n  (-> k name str)]
      (->> [ns n]
           (map kebab-case->camel-case)
           (remove str/blank?)
           (str/join "_")))))

(defn str->keyword
  "Transforms a string of the form `myNamespace_myName` to `:my-namespace/my-name`."
  [s]
  (when (string? s)
    (let [parts (as-> s $ (str/split $ #"_") (map camel-case->kebab-case $))]
      (if (= 2 (count parts))
        (keyword (first parts) (second parts))
        (keyword (first parts))))))

(ns solar-db.router.malli
  (:require
    [malli.core :as m]
    [malli.registry :as mr]
    [solar-db.history.malli :as history]
    [tick.core :as t]))

(defn create-decoder
  [f] (fn [v] (try (f v) (catch Exception _ v))))

(def ^:private LocalDateSchema
  "A schema for a date without a time component."
  (m/-simple-schema
    {:type            :time/local-date
     :pred            t/date?
     :type-properties {:error/message      "should be a date"
                       :decode             (create-decoder t/date)
                       :encode             str
                       :decode/string      (create-decoder t/date)
                       :encode/string      str
                       :decode/json        (create-decoder t/date)
                       :encode/json        str
                       :json-schema/type   "string"
                       :json-schema/format "date"}}))

(def ^:private LocalDateTimeSchema
  "A schema for a date with a time component."
  (m/-simple-schema
    {:type            :time/local-date-time
     :pred            t/date-time?
     :type-properties {:error/message      "should be a date-time"
                       :decode             (create-decoder t/date-time)
                       :encode             str
                       :decode/string      (create-decoder t/date-time)
                       :encode/string      str
                       :decode/json        (create-decoder t/date-time)
                       :encode/json        str
                       :json-schema/type   "string"
                       :json-schema/format "date-time"}}))

(def ^:private LocalTime
  "A schema for a time without a date component."
  (m/-simple-schema
    {:type            :time/local-time
     :pred            t/time?
     :type-properties {:error/message      "should be a time"
                       :decode             (create-decoder t/time)
                       :encode             str
                       :decode/string      (create-decoder t/time)
                       :encode/string      str
                       :decode/json        (create-decoder t/time)
                       :encode/json        str
                       :json-schema/type   "string"
                       :json-schema/format "time"}}))

(def ^:private ext-schemas
  {:time/local-date      LocalDateSchema
   :time/local-date-time LocalDateTimeSchema
   :time/local-time      LocalTime})

(mr/set-default-registry!
  (mr/composite-registry
    history/schemas
    (m/default-schemas)
    ext-schemas))

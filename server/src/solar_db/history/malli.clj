(ns solar-db.history.malli)

(def ^:private FetchHistoryRequest
  [:map
   [:granularity [:enum :daily :monthly :yearly]]
   [:start-date :time/local-date]
   [:end-date :time/local-date]])

(def ^:private FetchHistoryResponse
  [:map
   [:data
    [:vector
     [:map
      [:plant :string]
      [:date :time/local-date]
      [:granularity [:enum :daily :monthly :yearly]]
      [:production :double]
      [:consumption :double]
      [:grid-feed :double]
      [:grid-draw :double]
      [:battery-discharge :double]
      [:battery-charge :double]
      [:self-sufficiency :double]]]]])

(def ^:private FetchDetailedHistoryRequest
  [:map
   [:start-timestamp :time/local-date-time]
   [:end-timestamp :time/local-date-time]])

(def ^:private FetchDetailedHistoryResponse
  [:map
   [:data
    [:vector
     [:map
      [:plant :string]
      [:granularity [:enum :detailed]]
      [:timestamp :time/local-date-time]
      [:production :double]
      [:consumption :double]
      [:grid :double]
      [:grid-draw :double]
      [:grid-feed :double]
      [:battery :double]
      [:battery-charge :double]
      [:battery-discharge :double]
      [:soc :double]]]]])

(def ^:private FetchSocStatsRequest
  [:map
   [:start-timestamp :time/local-date-time]
   [:end-timestamp :time/local-date-time]])

(def ^:private FetchSocStatsResponse
  [:map
   [:data
    [:vector [:map
              [:time :time/local-time]
              [:min :double]
              [:max :double]
              [:avg :double]
              [:median :double]
              [:variance :double]
              [:std-dev :double]]]]])

(def schemas
  {:schema/FetchHistoryRequest          FetchHistoryRequest
   :schema/FetchHistoryResponse         FetchHistoryResponse
   :schema/FetchDetailedHistoryRequest  FetchDetailedHistoryRequest
   :schema/FetchDetailedHistoryResponse FetchDetailedHistoryResponse
   :schema/FetchSocStatsRequest         FetchSocStatsRequest
   :schema/FetchSocStatsResponse        FetchSocStatsResponse})

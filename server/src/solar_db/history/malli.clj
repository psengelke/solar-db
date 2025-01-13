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

(def ^:private FetchDetailedHistoryStatsRequest
  [:map
   [:start-timestamp :time/local-date-time]
   [:end-timestamp :time/local-date-time]])

(def ^:private FetchDetailedHistoryStatsResponse
  [:map
   [:data
    [:vector [:map

              [:time :time/local-time]

              [:min-production :double]
              [:max-production :double]
              [:avg-production :double]
              [:median-production :double]
              [:std-dev-production :double]
              [:std-dev-production-range [:tuple :double :double]]

              [:min-consumption :double]
              [:max-consumption :double]
              [:avg-consumption :double]
              [:median-consumption :double]
              [:std-dev-consumption :double]
              [:std-dev-consumption-range [:tuple :double :double]]

              [:min-grid :double]
              [:max-grid :double]
              [:avg-grid :double]
              [:median-grid :double]
              [:std-dev-grid :double]
              [:std-dev-grid-range [:tuple :double :double]]

              [:min-battery :double]
              [:max-battery :double]
              [:avg-battery :double]
              [:median-battery :double]
              [:std-dev-battery :double]
              [:std-dev-battery-range [:tuple :double :double]]

              [:min-solar :double]
              [:max-solar :double]
              [:avg-solar :double]
              [:median-solar :double]
              [:std-dev-solar :double]
              [:std-dev-solar-range [:tuple :double :double]]

              [:min-soc :double]
              [:max-soc :double]
              [:avg-soc :double]
              [:median-soc :double]
              [:std-dev-soc :double]
              [:std-dev-soc-range [:tuple :double :double]]]]]])

(def ^:private FetchHistoryTemporalBoundsResponse
  [:map
   [:detailed [:tuple :time/local-date-time :time/local-date-time]]
   [:daily [:tuple :time/local-date :time/local-date]]
   [:monthly [:tuple :time/local-date :time/local-date]]
   [:yearly [:tuple :time/local-date :time/local-date]]])

(def schemas
  {:schema/FetchHistoryRequest                FetchHistoryRequest
   :schema/FetchHistoryResponse               FetchHistoryResponse
   :schema/FetchDetailedHistoryRequest        FetchDetailedHistoryRequest
   :schema/FetchDetailedHistoryResponse       FetchDetailedHistoryResponse
   :schema/FetchSocStatsRequest               FetchSocStatsRequest
   :schema/FetchSocStatsResponse              FetchSocStatsResponse
   :schema/FetchDetailedHistoryStatsRequest   FetchDetailedHistoryStatsRequest
   :schema/FetchDetailedHistoryStatsResponse  FetchDetailedHistoryStatsResponse
   :schema/FetchHistoryTemporalBoundsResponse FetchHistoryTemporalBoundsResponse})

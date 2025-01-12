export enum HistoryGranularity {
    detailed = "detailed",
    daily = "daily",
    monthly = "monthly",
    yearly = "yearly",
}

export interface FetchDetailedHistoryRequest {
    startTimestamp: string,
    endTimestamp: string,
}

export interface DetailedHistoryDatum {
    plant: string,
    granularity: HistoryGranularity.detailed,
    timestamp: string,
    production: number,
    consumption: number,
    grid: number,
    gridDraw: number,
    gridFeed: number,
    battery: number,
    batteryCharge: number,
    batteryDischarge: number,
    soc: number,
}

export interface FetchDetailedHistoryResponse {
    data: DetailedHistoryDatum[],
}

export interface FetchHistoryRequest {
    granularity: string,
    startDate: string,
    endDate: string,
}

export interface HistoryData {
    plant: string;
    date: string;
    granularity: HistoryGranularity.daily | HistoryGranularity.monthly | HistoryGranularity.yearly;
    production: number;
    consumption: number;
    gridFeed: number;
    gridDraw: number;
    batteryDischarge: number;
    batteryCharge: number;
    selfSufficiency: number;
}

export interface FetchHistoryResponse {
    data: HistoryData[];
}

export interface FetchSocStatsRequest {
    startTimestamp: string,
    endTimestamp: string,
}

export interface SocStatsData {
    time: string;
    min: number;
    max: number;
    avg: number;
    median: number;
    variance: number;
    stdDev: number;
}

export interface FetchSocStatsResponse {
    data: SocStatsData[],
}

export async function fetchDetailedHistory
(args: { request: FetchDetailedHistoryRequest })
    : Promise<FetchDetailedHistoryResponse> {

    const response = await fetch("http://localhost:11111/history/fetch/detailed", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(args.request),
    });

    if (!response.ok) throw response;
    return response.json();

}

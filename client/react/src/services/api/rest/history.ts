export enum HistoryGranularity {
    detailed = "detailed",
    daily = "daily",
    monthly = "monthly",
    yearly = "yearly",
}

export interface FetchHistoryTemporalBoundsResponse {
    detailed: [string, string],
    daily: [string, string],
    monthly: [string, string],
    yearly: [string, string],
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

export interface HistoryDatum {
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
    data: HistoryDatum[];
}

export interface FetchSocStatsRequest {
    startTimestamp: string,
    endTimestamp: string,
}

export interface SocStatsDatum {
    time: string;
    min: number;
    max: number;
    avg: number;
    median: number;
    variance: number;
    stdDev: number;
}

export interface FetchSocStatsResponse {
    data: SocStatsDatum[],
}

export interface DetailedStatsDatum {
    time: string;
    minProduction: number;
    maxProduction: number;
    avgProduction: number;
    medianProduction: number;
    stdDevProduction: number;
    stdDevProductionRange: [number, number];
    minConsumption: number;
    maxConsumption: number;
    avgConsumption: number;
    medianConsumption: number;
    stdDevConsumption: number;
    stdDevConsumptionRange: [number, number];
    minGrid: number;
    maxGrid: number;
    avgGrid: number;
    medianGrid: number;
    stdDevGrid: number;
    stdDevGridRange: [number, number];
    minBattery: number;
    maxBattery: number;
    avgBattery: number;
    medianBattery: number;
    stdDevBattery: number;
    stdDevBatteryRange: [number, number];
    minSoc: number;
    maxSoc: number;
    avgSoc: number;
    medianSoc: number;
    stdDevSoc: number;
    stdDevSocRange: [number, number];
}

export interface FetchDetailedStatsRequest {
    startTimestamp: string,
    endTimestamp: string,
}

export interface FetchDetailedStatsResponse {
    data: DetailedStatsDatum[],
}

export async function fetchHistoryTemporalBounds
(): Promise<FetchHistoryTemporalBoundsResponse> {

    const response = await fetch("http://localhost:11111/history/fetch/temporal-bounds", {
        method: "GET",
    });

    if (!response.ok) throw response;
    return response.json();

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

export async function fetchHistory
(args: { request: FetchHistoryRequest })
    : Promise<FetchHistoryResponse> {

    const response = await fetch("http://localhost:11111/history/fetch", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(args.request),
    });

    if (!response.ok) throw response;
    return response.json();

}

export async function fetchSocStats
(args: { request: FetchSocStatsRequest })
    : Promise<FetchSocStatsResponse> {

    const response = await fetch("http://localhost:11111/history/fetch/soc-stats", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(args.request),
    });

    if (!response.ok) throw response;
    return response.json();

}

export async function fetchDetailedStats
(args: { request: FetchDetailedStatsRequest })
    : Promise<FetchDetailedStatsResponse> {

    const response = await fetch("http://localhost:11111/history/fetch/detailed-stats", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(args.request),
    });

    if (!response.ok) throw response;
    return response.json();

}

import useColorScheme from "@/hooks/useColorScheme.ts";
import colors from "tailwindcss/colors";
import {DateTime} from "luxon";
import {Area, AreaChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis} from "recharts";
import {DetailedHistoryDatum} from "@/services/api/rest/history.ts";

interface DetailedHistoryChartProps {
    data: DetailedHistoryDatum[],
}

export default function DetailedHistoryChart(props: DetailedHistoryChartProps) {

    const darkMode = useColorScheme() === "dark";
    const palette = {
        gray: darkMode ? colors.gray[300] : colors.gray[500],
        blue: darkMode ? colors.blue[400] : colors.blue[500],
        red: darkMode ? colors.red[400] : colors.red[500],
        purple: darkMode ? colors.purple[400] : colors.purple[500],
        yellow: darkMode ? colors.yellow[400] : colors.yellow[500],
        background: darkMode ? colors.gray[900] : colors.gray[50],
    };

    const yTickFormat = Intl.NumberFormat("en-US", {notation: "compact", unitDisplay: "narrow"});
    const yTickFormatter = (v: number) => yTickFormat.format(v);
    const xTickFormatter = (v: string) => DateTime.fromISO(v).toFormat("HH:mm");

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart
                syncId="single-day-x"
                data={props.data}
            >

                <XAxis
                    dataKey="timestamp"
                    tickFormatter={xTickFormatter}
                    tick={{fill: palette.gray, fontSize: 10}}
                    strokeWidth={0}
                    tickMargin={8}
                    tickLine={false}
                />

                <YAxis
                    domain={["dataMin", "dataMax"]}
                    type={"number"}
                    tickFormatter={yTickFormatter}
                    tick={{fill: palette.gray, fontSize: 10}}
                    strokeWidth={0}
                    tickMargin={8}
                    tickLine={false}
                />

                <Tooltip content={ChartTooltip} cursor={false}/>

                {[
                    {key: "production", color: palette.blue},
                    {key: "consumption", color: palette.red},
                    {key: "grid", color: palette.purple},
                    {key: "batteryDischarge", color: palette.yellow},
                ].map(({key, color}) => (<Area
                    key={key}
                    dataKey={key}
                    type="monotone"
                    stroke={color}
                    strokeWidth={2}
                    fill={color}
                    fillOpacity={0.1}
                    activeDot={{stroke: palette.background}}
                />))}

            </AreaChart>
        </ResponsiveContainer>
    );

};

const ChartTooltip = (props: TooltipProps<any, any>) => {

    const {active, payload, label} = props;
    if (!active || !payload) {
        return null;
    }

    const data = payload.reduce((m: any, p) => {
        m[p.dataKey as string] = p;
        return m;
    }, {}) as any;

    return (

        <div className={"p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md"}>
            <div className={"text-center"}>
                <span>{DateTime.fromISO(label).toFormat("HH:mm")}</span>
            </div>
            <div className={"flex flex-col gap-2"}>

                <ChartTooltipSeriesPoint
                    label={"Production"}
                    value={data.production?.value}
                    color={data.production?.stroke}
                />

                <ChartTooltipSeriesPoint
                    label={"Consumption"}
                    value={data.consumption?.value}
                    color={data.consumption?.stroke}
                />

                <ChartTooltipSeriesPoint
                    label={"Grid"}
                    value={data.grid?.value}
                    color={data.grid?.stroke}
                />

                <ChartTooltipSeriesPoint
                    label={"Battery Discharge"}
                    value={data.batteryDischarge?.value}
                    color={data.batteryDischarge?.stroke}
                />

            </div>
        </div>

    );

}

interface ChartTooltipSeriesPointProps {
    label: string;
    value: number;
    color: string;
}

const ChartTooltipSeriesPoint = (props: ChartTooltipSeriesPointProps) => {

    const fmt = Intl.NumberFormat("en-US", {notation: "compact", unitDisplay: "narrow"});
    const fmtValue = fmt.format(props.value) + " Watts";

    return (
        <div className={"flex gap-3 justify-between items-center"}>
            <div className={"flex gap-2 items-center"}>
                <div className={"rounded-full h-[10px] w-[10px]"}
                     style={{backgroundColor: props.color}}
                />
                <span className={"text-gray-700 dark:text-gray-300"}>{props.label}</span>
            </div>
            <span className={"text-gray-700 dark:text-gray-300"}>{fmtValue}</span>
        </div>
    );
}

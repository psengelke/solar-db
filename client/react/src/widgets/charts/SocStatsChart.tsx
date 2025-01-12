import {
    Area,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
    XAxis,
    YAxis
} from "recharts";
import useColorScheme from "@/hooks/useColorScheme.ts";
import colors from "tailwindcss/colors";
import {SocStatsDatum} from "@/services/api/rest/history.ts";
import {useMemo} from "react";

interface SocStatsChartProps {
    data: SocStatsDatum[];
}

export default function SocStatsChart(props: SocStatsChartProps) {

    const data = useMemo(() => (
        props.data.map(d => (
            {
                ...d,
                stdDevRange: [
                    Math.max(d.avg - d.stdDev, d.min),
                    Math.min(d.avg + d.stdDev, d.max),
                ],
            }
        ))
    ), [props.data]);

    const darkMode = useColorScheme() === "dark";
    const palette = {
        gray: darkMode ? colors.gray[300] : colors.gray[500],
        blue: darkMode ? colors.blue[400] : colors.blue[500],
        red: darkMode ? colors.red[400] : colors.red[500],
        green: darkMode ? colors.green[400] : colors.green[500],
        cyan: darkMode ? colors.violet[400] : colors.violet[500],
        stdDev: darkMode ? colors.gray[700] : colors.gray[300],
        background: darkMode ? colors.gray[900] : colors.gray[50],
    };

    const yTickFormat = Intl.NumberFormat("en-US", {style: "percent"});
    const yTickFormatter = (v: number) => yTickFormat.format(v);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <ComposedChart syncId="single-day-x" data={data}>

                <XAxis
                    dataKey="time"
                    tick={{fill: palette.gray, fontSize: 10}}
                    strokeWidth={0}
                    tickMargin={8}
                    tickLine={false}
                />

                <YAxis
                    domain={[0, 1]}
                    type={"number"}
                    tickFormatter={yTickFormatter}
                    tick={{fill: palette.gray, fontSize: 10}}
                    strokeWidth={0}
                    tickMargin={8}
                    tickLine={false}
                />

                <Tooltip content={ChartTooltip} cursor={false}/>

                <Area
                    type="monotone"
                    dataKey={"stdDevRange"}
                    stroke={"none"}
                    fill={palette.stdDev}
                    dot={false}
                    activeDot={false}
                />

                {[
                    {key: "max", color: palette.blue},
                    {key: "min", color: palette.red},
                    {key: "median", color: palette.cyan},
                    {key: "avg", color: palette.green},
                ].map(({key, color}) => (
                    <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={color}
                        strokeWidth={2.5}
                        strokeLinecap={"round"}
                        dot={false}
                        activeDot={{stroke: palette.background}}
                    />
                ))}

            </ComposedChart>
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
        <div className={"bg-gray-50 dark:bg-gray-800 p-2 rounded-lg shadow-lg"}>

            <p className={"text-gray-700 dark:text-gray-300 pb-2 w-full text-center"}>
                {label}
            </p>

            <div className={"flex flex-col gap-1"}>

                <ChartTooltipSeriesPoint
                    label={"Min"}
                    value={data.min?.value}
                    color={data.min?.stroke}
                />

                <ChartTooltipSeriesPoint
                    label={"Max"}
                    value={data.max?.value}
                    color={data.max?.stroke}
                />

                <ChartTooltipSeriesPoint
                    label={"Avg"}
                    value={data.avg?.value}
                    color={data.avg?.stroke}
                />

                <ChartTooltipSeriesPoint
                    label={"Median"}
                    value={data.median?.value}
                    color={data.median?.stroke}
                />

            </div>
        </div>
    );

};

interface ChartTooltipSeriesPointProps {
    label: string;
    value: number;
    color: string;
}

const ChartTooltipSeriesPoint = (props: ChartTooltipSeriesPointProps) => {

    const fmt = Intl.NumberFormat("en-US", {style: "percent"});
    const fmtValue = fmt.format(props.value);

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

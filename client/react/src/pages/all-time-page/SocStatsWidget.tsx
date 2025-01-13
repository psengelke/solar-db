import Card from "@/widgets/card/Card.tsx";
import CardHeader from "@/widgets/card/CardHeader.tsx";
import CardTitle from "@/widgets/card/CardTitle.tsx";
import {useAppSelector} from "@/store/hooks.ts";
import usePalette from "@/hooks/usePalette.ts";
import colors from "tailwindcss/colors";
import {
    Area,
    ComposedChart, Line,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
    XAxis,
    YAxis
} from "recharts";

export default function SocStatsWidget() {
    return (
        <Card className={"w-full"}>
            <CardHeader>
                <CardTitle>State of Charge</CardTitle>
            </CardHeader>
            <Chart/>
        </Card>
    );
}

const Chart = () => {

    const data = useAppSelector(state => state.allTimePage.detailedStats);
    const palette = usePalette({
        text: [colors.gray[500], colors.gray[300]],
        min: [colors.red[500], colors.red[300]],
        max: [colors.blue[500], colors.blue[300]],
        median: [colors.violet[500], colors.violet[300]],
        avg: [colors.green[500], colors.green[300]],
    });

    const yTickFormat = Intl.NumberFormat("en-US", {style: "percent"});
    const yTickFormatter = (v: number) => yTickFormat.format(v);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <ComposedChart syncId="single-day-x" data={data}>

                <XAxis
                    dataKey="time"
                    tick={{fill: palette.text, fontSize: 10}}
                    strokeWidth={0}
                    tickMargin={8}
                    tickLine={false}
                />

                <YAxis
                    domain={[0, 1]}
                    type={"number"}
                    tickFormatter={yTickFormatter}
                    tick={{fill: palette.text, fontSize: 10}}
                    strokeWidth={0}
                    tickMargin={8}
                    tickLine={false}
                />

                <Tooltip content={ChartTooltip} cursor={false}/>

                <Area
                    type="monotone"
                    dataKey={"stdDevSocRange"}
                    stroke={"none"}
                    fill={palette.avg}
                    fillOpacity={0.2}
                    dot={false}
                    activeDot={false}
                />

                {[
                    {key: "maxSoc", color: palette.max},
                    {key: "minSoc", color: palette.min},
                    {key: "medianSoc", color: palette.median},
                    {key: "avgSoc", color: palette.avg},
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

}

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
                    value={data.minSoc?.value}
                    color={data.minSoc?.color}
                />

                <ChartTooltipSeriesPoint
                    label={"Max"}
                    value={data.maxSoc?.value}
                    color={data.maxSoc?.stroke}
                />

                <ChartTooltipSeriesPoint
                    label={"Avg."}
                    value={data.avgSoc?.value}
                    color={data.avgSoc?.color}
                />

                <ChartTooltipSeriesPoint
                    label={"σ"}
                    value={data.stdDevSocRange?.value}
                    color={data.stdDevSocRange?.color}
                />

                <ChartTooltipSeriesPoint
                    label={"Median"}
                    value={data.medianSoc?.value}
                    color={data.medianSoc?.color}
                />

            </div>
        </div>
    );

};

interface ChartTooltipSeriesPointProps {
    label: string;
    value: number | [number, number];
    color: string;
}

const ChartTooltipSeriesPoint = (props: ChartTooltipSeriesPointProps) => {

    const fmt = Intl.NumberFormat("en-US", {style: "percent"});
    const fmtValue =  Array.isArray(props.value)
        ? `${fmt.format(props.value[0])} - ${fmt.format(props.value[1])}`
        : fmt.format(props.value);

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

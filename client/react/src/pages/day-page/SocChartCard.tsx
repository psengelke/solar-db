import usePalette from "@/hooks/usePalette.ts";
import { useAppSelector } from "@/store/hooks.ts";
import Card from "@/widgets/card/Card.tsx";
import CardHeader from "@/widgets/card/CardHeader.tsx";
import CardTitle from "@/widgets/card/CardTitle.tsx";
import ChartTooltipContent from "@/widgets/charts/ChartTooltipContent.tsx";
import ChartTooltipItem from "@/widgets/charts/ChartTooltipItem.tsx";
import ChartTooltipTitle from "@/widgets/charts/ChartTooltipTitle.tsx";
import { DateTime } from "luxon";
import {
    Area,
    ComposedChart,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
    XAxis,
    YAxis
} from "recharts";
import colors from "tailwindcss/colors";

export default function SocChartCard() {
    return (
        <Card className={"w-full"}>
            <CardHeader>
                <CardTitle>State of Charge</CardTitle>
            </CardHeader>
            <Chart />
        </Card>
    );
}

const formatTimestamp = (timestamp: string) => DateTime.fromISO(timestamp).toLocaleString(DateTime.TIME_SIMPLE);
const percentageFormatter = Intl.NumberFormat("en-US", { style: "percent" });
const formatPercentage = (value: number) => percentageFormatter.format(value);

const Chart = () => {

    const data = useAppSelector(state => state.dayPage.detailedHistory);
    const palette = usePalette({
        text: [colors.gray[500], colors.gray[300]],
        soc: [colors.green[500], colors.green[300]],
    });

    const yTickFormatter = formatPercentage;
    const xAxisFormatter = formatTimestamp;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <ComposedChart syncId="single-day-x" data={data}>

                <XAxis
                    dataKey="timestamp"
                    tickFormatter={xAxisFormatter}
                    tick={{ fill: palette.text, fontSize: 10 }}
                    strokeWidth={0}
                    tickMargin={8}
                    tickLine={false}
                />

                <YAxis
                    domain={[0, 1]}
                    type={"number"}
                    tickFormatter={yTickFormatter}
                    tick={{ fill: palette.text, fontSize: 10 }}
                    strokeWidth={0}
                    tickMargin={8}
                    tickLine={false}
                />

                <Tooltip content={ChartTooltip} cursor={false} />

                <Area
                    type="monotone"
                    dataKey={"soc"}
                    stroke={palette.soc}
                    strokeWidth={2.5}
                    fill={palette.soc}
                    fillOpacity={0.2}
                    dot={false}
                    activeDot={{ stroke: "transparent" }}
                />

            </ComposedChart>
        </ResponsiveContainer>
    );

}

const ChartTooltip = (props: TooltipProps<any, any>) => {

    const { active, payload } = props;
    if (!active || !payload || !payload.length) {
        return null;
    }

    const point = payload[0] as any;
    const label = formatTimestamp(props.label);
    const value = formatPercentage(point.value);

    return (
        <div className={"bg-gray-50 dark:bg-gray-800 p-2 rounded-lg shadow-lg"}>

            <ChartTooltipTitle>{label}</ChartTooltipTitle>

            <ChartTooltipContent>

                <ChartTooltipItem
                    label={"SOC"}
                    value={value}
                    color={point.color}
                />

            </ChartTooltipContent>
        </div>
    );

};

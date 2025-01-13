import Card from "@/widgets/card/Card.tsx";
import CardHeader from "@/widgets/card/CardHeader.tsx";
import CardTitle from "@/widgets/card/CardTitle.tsx";
import {useAppSelector} from "@/store/hooks.ts";
import usePalette from "@/hooks/usePalette.ts";
import colors from "tailwindcss/colors";
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
import ChartTooltipItem from "@/widgets/charts/ChartTooltipItem.tsx";
import ChartTooltipContent from "@/widgets/charts/ChartTooltipContent.tsx";
import ChartTooltipTitle from "@/widgets/charts/ChartTooltipTitle.tsx";

export default function SocChartWidget() {
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
                    activeDot={{stroke: "transparent", r: 1}}
                />

                {[
                    {key: "maxSoc", color: palette.max},
                    {key: "minSoc", color: palette.min},
                    {key: "medianSoc", color: palette.avg}
                ].map(({key, color}) => (<Line
                    key={key}
                    dataKey={key}
                    type="monotone"
                    stroke={color}
                    strokeWidth={1}
                    strokeDasharray={"1 1"}
                    dot={false}
                    activeDot={{stroke: "transparent", r: 2}}
                />))}

                {[
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

            <ChartTooltipTitle>{label}</ChartTooltipTitle>

            <ChartTooltipContent>

                <_ChartTooltipItem
                    label={"Avg."}
                    value={data.avgSoc?.value}
                    color={data.avgSoc?.color}
                />

                <_ChartTooltipItem
                    variant={"secondary"}
                    label={"Median"}
                    value={data.medianSoc?.value}
                    color={data.medianSoc?.color}
                />

                <_ChartTooltipItem
                    variant={"secondary"}
                    label={"Spread"}
                    value={data.stdDevSocRange?.value}
                    color={data.stdDevSocRange?.color}
                />

                <_ChartTooltipItem
                    label={"Min"}
                    value={data.minSoc?.value}
                    color={data.minSoc?.color}
                />

                <_ChartTooltipItem
                    label={"Max"}
                    value={data.maxSoc?.value}
                    color={data.maxSoc?.stroke}
                />

            </ChartTooltipContent>
        </div>
    );

};

interface _ChartTooltipItemProps {
    variant?: "primary" | "secondary";
    label: string;
    value: number | [number, number];
    color: string;
}

const _ChartTooltipItem = (props: _ChartTooltipItemProps) => {

    const fmt = Intl.NumberFormat("en-US", {style: "percent"});
    const fmtValue = Array.isArray(props.value)
        ? `${fmt.format(props.value[0])} - ${fmt.format(props.value[1])}`
        : fmt.format(props.value);

    return (
        <ChartTooltipItem
            variant={props.variant}
            label={props.label}
            value={fmtValue}
            color={props.color}
        />
    );
}

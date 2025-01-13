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
import ChartTooltipBase from "@/widgets/charts/ChartTooltipBase.tsx";
import ChartTooltipTitle from "@/widgets/charts/ChartTooltipTitle.tsx";
import ChartTooltipContent from "@/widgets/charts/ChartTooltipContent.tsx";

export default function ConsumptionChartCard() {
    return (
        <Card className={"w-full"}>
            <CardHeader>
                <CardTitle>Consumption By Source</CardTitle>
            </CardHeader>
            <Chart/>
        </Card>
    );
}

function Chart() {

    const data = useAppSelector(state => state.allTimePage.detailedStats);
    const palette = usePalette({
        text: [colors.gray[500], colors.gray[300]],
        grid: [colors.purple[500], colors.purple[300]],
        solar: [colors.teal[500], colors.teal[300]],
        battery: [colors.orange[500], colors.orange[300]],
    });

    const yTickFormat = Intl.NumberFormat("en-US", {notation: "compact", unitDisplay: "narrow"});
    const yTickFormatter = (v: number) => yTickFormat.format(v);

    return (
        <ResponsiveContainer width="100%" height={300}>

            <ComposedChart
                syncId="single-day-x"
                data={data}
            >

                <XAxis
                    dataKey="time"
                    tick={{fill: palette.text, fontSize: 10}}
                    strokeWidth={0}
                    tickMargin={8}
                    tickLine={false}
                />

                <YAxis
                    domain={["dataMin", "dataMax"]}
                    type={"number"}
                    tickFormatter={yTickFormatter}
                    tick={{fill: palette.text, fontSize: 10}}
                    strokeWidth={0}
                    tickMargin={8}
                    tickLine={false}
                />

                <Tooltip content={_ChartTooltip} cursor={false}/>

                {[
                    {key: "stdDevGridRange", color: palette.grid},
                    {key: "stdDevBatteryRange", color: palette.battery},
                    {key: "stdDevSolarRange", color: palette.solar},
                ].map(({key, color}) => (<Area
                    key={key}
                    dataKey={key}
                    type="monotone"
                    stroke={"none"}
                    fill={color}
                    fillOpacity={0.4}
                    dot={false}
                    activeDot={{stroke: "transparent", r: 1}}
                />))}

                {[
                    {key: "maxGrid", color: palette.grid},
                    {key: "minGrid", color: palette.grid},
                    {key: "maxBattery", color: palette.battery},
                    {key: "minBattery", color: palette.battery},
                    {key: "maxSolar", color: palette.solar},
                    {key: "minSolar", color: palette.solar},
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
                    {key: "avgGrid", color: palette.grid},
                    {key: "avgBattery", color: palette.battery},
                    {key: "avgSolar", color: palette.solar},
                ].map(({key, color}) => (<Line
                    key={key}
                    dataKey={key}
                    type="monotone"
                    stroke={color}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{stroke: palette.background}}
                />))}

            </ComposedChart>

        </ResponsiveContainer>
    );

}

const _ChartTooltip = (props: TooltipProps<any, any>) => {

    const {active, payload, label} = props;
    if (!active || !payload) {
        return null;
    }

    const data = payload.reduce((m: any, p) => {
        m[p.dataKey as string] = p;
        return m;
    }, {}) as any;

    return (

        <ChartTooltipBase>

            <ChartTooltipTitle>{label}</ChartTooltipTitle>

            <ChartTooltipContent>

                <_ChartTooltipItem
                    label={"Grid"}
                    value={data.avgGrid?.value}
                    color={data.avgGrid?.color}
                />

                <_ChartTooltipItem
                    variant={"secondary"}
                    label={"Spread"}
                    value={data.stdDevGridRange?.value}
                    color={data.stdDevGridRange?.color}
                />

                <_ChartTooltipItem
                    variant={"secondary"}
                    label={"Min/Max"}
                    value={[data.minGrid?.value, data.maxGrid?.value]}
                    color={data.minGrid?.color}
                />

                <_ChartTooltipItem
                    label={"Battery"}
                    value={data.avgBattery?.value}
                    color={data.avgBattery?.color}
                />

                <_ChartTooltipItem
                    variant={"secondary"}
                    label={"Spread"}
                    value={data.stdDevBatteryRange?.value}
                    color={data.stdDevBatteryRange?.color}
                />

                <_ChartTooltipItem
                    variant={"secondary"}
                    label={"Min/Max"}
                    value={[data.minBattery?.value, data.maxBattery?.value]}
                    color={data.minBattery?.color}
                />

                <_ChartTooltipItem
                    label={"Solar"}
                    value={data.avgSolar?.value}
                    color={data.avgSolar?.color}
                />

                <_ChartTooltipItem
                    variant={"secondary"}
                    label={"Spread"}
                    value={data.stdDevSolarRange?.value}
                    color={data.stdDevSolarRange?.color}
                />

                <_ChartTooltipItem
                    variant={"secondary"}
                    label={"Min/Max"}
                    value={[data.minSolar?.value, data.maxSolar?.value]}
                    color={data.minSolar?.color}
                />

            </ChartTooltipContent>
        </ChartTooltipBase>

    );

}

interface _ChartTooltipItemProps {
    variant?: "primary" | "secondary";
    label: string;
    value: number | [number, number];
    color: string;
}

const _ChartTooltipItem = (props: _ChartTooltipItemProps) => {

    const fmt = Intl.NumberFormat("en-US", {notation: "compact", unitDisplay: "narrow"});
    const fmtValue = Array.isArray(props.value)
        ? `${fmt.format(props.value[0])} - ${fmt.format(props.value[1])} Watts`
        : fmt.format(props.value) + " Watts";

    return (

        <ChartTooltipItem
            variant={props.variant}
            label={props.label}
            value={fmtValue}
            color={props.color}
        />

    );
}

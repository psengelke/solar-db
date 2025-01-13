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
import ChartTooltipBase from "@/widgets/charts/ChartTooltipBase.tsx";

export default function ProductionAndConsumptionChartCard() {
    return (
        <Card className={"w-full"}>
            <CardHeader>
                <CardTitle>Production vs Consumption</CardTitle>
            </CardHeader>
            <Chart/>
        </Card>
    );
}

function Chart() {

    const data = useAppSelector(state => state.allTimePage.detailedStats);
    const palette = usePalette({
        text: [colors.gray[500], colors.gray[300]],
        production: [colors.blue[500], colors.blue[300]],
        consumption: [colors.red[500], colors.red[300]],
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
                    {key: "stdDevProductionRange", color: palette.production},
                    {key: "stdDevConsumptionRange", color: palette.consumption},
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
                    {key: "maxProduction", color: palette.production},
                    {key: "minProduction", color: palette.production},
                    {key: "maxConsumption", color: palette.consumption},
                    {key: "minConsumption", color: palette.consumption}
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
                    {key: "avgProduction", color: palette.production},
                    {key: "avgConsumption", color: palette.consumption}
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
                    label={"Production"}
                    value={data.avgProduction?.value}
                    color={data.avgProduction?.color}
                />

                <_ChartTooltipItem
                    variant={"secondary"}
                    label={"Spread"}
                    value={data.stdDevProductionRange?.value}
                    color={data.minProduction?.color}
                />


                <_ChartTooltipItem
                    variant={"secondary"}
                    label={"Min/Max"}
                    value={[data.minProduction?.value, data.maxProduction?.value]}
                    color={data.minProduction?.color}
                />

                <_ChartTooltipItem
                    label={"Consumption"}
                    value={data.avgConsumption?.value}
                    color={data.avgConsumption?.color}
                />

                <_ChartTooltipItem
                    variant={"secondary"}
                    label={"Spread"}
                    value={data.stdDevConsumptionRange?.value}
                    color={data.minConsumption?.color}
                />

                <_ChartTooltipItem
                    variant={"secondary"}
                    label={"Min/Max"}
                    value={[data.minConsumption?.value, data.maxConsumption?.value]}
                    color={data.minConsumption?.color}
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

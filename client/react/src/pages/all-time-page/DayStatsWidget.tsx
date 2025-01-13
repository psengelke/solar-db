import Card from "@/widgets/card/Card.tsx";
import CardHeader from "@/widgets/card/CardHeader.tsx";
import CardTitle from "@/widgets/card/CardTitle.tsx";
import {useAppSelector} from "@/store/hooks.ts";
import usePalette from "@/hooks/usePalette.ts";
import colors from "tailwindcss/colors";
import {DateTime} from "luxon";
import {
    Area,
    ComposedChart, Line,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
    XAxis,
    YAxis
} from "recharts";

export default function DayStatsWidget() {
    return (
        <Card className={"w-full"}>
            <CardHeader>
                <CardTitle>Production & Consumption</CardTitle>
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
        grid: [colors.purple[500], colors.purple[300]],
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

                <Tooltip content={ChartTooltip} cursor={false}/>

                {[
                    {key: "stdDevProductionRange", color: palette.production},
                    {key: "stdDevConsumptionRange", color: palette.consumption},
                    {key: "stdDevGridRange", color: palette.grid},
                    {key: "stdDevBatteryRange", color: palette.battery},
                ].map(({key, color}) => (<Area
                    key={key}
                    dataKey={key}
                    type="monotone"
                    strokeWidth={0}
                    fill={color}
                    fillOpacity={0.4}
                    dot={false}
                    activeDot={false}
                />))}

                {[
                    {key: "avgProduction", color: palette.production},
                    {key: "avgConsumption", color: palette.consumption},
                    {key: "avgGrid", color: palette.grid},
                    {key: "avgBattery", color: palette.battery},
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
                    value={data.avgProduction?.value}
                    color={data.avgProduction?.color}
                />

                <ChartTooltipSeriesPoint
                    label={"Consumption"}
                    value={data.avgConsumption?.value}
                    color={data.avgConsumption?.color}
                />

                <ChartTooltipSeriesPoint
                    label={"Grid"}
                    value={data.avgGrid?.value}
                    color={data.avgGrid?.color}
                />

                <ChartTooltipSeriesPoint
                    label={"Battery"}
                    value={data.avgBattery?.value}
                    color={data.avgBattery?.color}
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

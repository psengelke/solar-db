import DashboardWidgetHeader from "@/features/dashboard/DashboardWidgetHeader.tsx";
import DashboardWidget from "@/features/dashboard/DashboardWidget.tsx";
import DashboardWidgetTitle from "@/features/dashboard/DashboardWidgetTitle.tsx";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {useEffect} from "react";
import {
    fetchSocStats,
    selectSocStatsDateRange, setSocStatsEndDate,
    setSocStatsStartDate
} from "@/features/dashboard/dashboardSlice.ts";
import useColorScheme from "@/hooks/useColorScheme.ts";
import colors from "tailwindcss/colors";
import {Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import DateField from "@/components/inputs/DateField.tsx";

const SocStatsWidget = () => {

    const dispatch = useAppDispatch();
    useEffect(() => void dispatch(fetchSocStats()), []);
    const [startDate, endDate] = useAppSelector(selectSocStatsDateRange);

    return (

        <DashboardWidget className={"w-full"}>

            <DashboardWidgetHeader>
                <DashboardWidgetTitle>SOC Stats</DashboardWidgetTitle>
                <div className={"flex items-center gap-4"}>
                    <DateField
                        label={"Start Date"}
                        value={startDate}
                        onChange={date => date && dispatch(setSocStatsStartDate(date))}
                    />
                    –
                    <DateField
                        label={"End Date"}
                        value={endDate}
                        onChange={date => date && dispatch(setSocStatsEndDate(date))}
                    />
                </div>
            </DashboardWidgetHeader>

            <Chart/>

        </DashboardWidget>

    );

}

export default SocStatsWidget;

const Chart = () => {
    const data = useAppSelector(state => state.dashboard.socStats.data);

    const darkMode = useColorScheme() === "dark";
    const palette = {
        gray: darkMode ? colors.gray[300] : colors.gray[500],
        blue: darkMode ? colors.blue[400] : colors.blue[500],
        red: darkMode ? colors.red[400] : colors.red[500],
        green: darkMode ? colors.green[400] : colors.green[500],
        cyan: darkMode ? colors.cyan[400] : colors.cyan[500],
        grey: darkMode ? colors.gray[900] : colors.gray[400],
    };

    const yTickFormat = Intl.NumberFormat("en-US", {style: "percent"});
    const yTickFormatter = (v: number) => yTickFormat.format(v);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <ComposedChart syncId="single-day-x" data={data}>
                <XAxis
                    dataKey="time"
                    tick={{fill: palette.gray, fontSize: 10}}
                    stroke={palette.gray}
                    tickMargin={8}
                    tickLine={false}
                />
                <YAxis
                    domain={[0, 1]}
                    type={"number"}
                    tickFormatter={yTickFormatter}
                    tick={{fill: palette.gray, fontSize: 10}}
                    stroke={palette.gray}
                    tickMargin={8}
                    tickLine={false}
                />
                <Tooltip/>
                <Area
                    type="monotone"
                    dataKey={"stdDevRange"}
                    stroke={"none"}
                    fill={palette.grey}
                    strokeWidth={2}
                    dot={false}
                    activeDot={false}
                />
                {[
                    {key: "max", color: palette.blue},
                    {key: "min", color: palette.red},
                    {key: "avg", color: palette.green},
                    {key: "median", color: palette.cyan},
                ].map(({key, color}) => (
                    <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                    />
                ))}
            </ComposedChart>
        </ResponsiveContainer>
    );
};

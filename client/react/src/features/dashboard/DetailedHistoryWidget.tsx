import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {
    fetchDetailedHistory,
    selectDetailedHistoryDateRage, setDetailedHistoryEndDate,
    setDetailedHistoryStartDate,
} from "@/features/dashboard/dashboardSlice.ts";
import {DateTime} from "luxon";
import {Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import colors from "tailwindcss/colors";
import useColorScheme from "@/hooks/useColorScheme.ts";
import DashboardWidget from "@/features/dashboard/DashboardWidget.tsx";
import DashboardWidgetTitle from "@/features/dashboard/DashboardWidgetTitle.tsx";
import DashboardWidgetHeader from "@/features/dashboard/DashboardWidgetHeader.tsx";
import DateField from "@/components/inputs/DateField.tsx";

/**
 * A widget that displays detailed history data for a solar installation.
 * @constructor
 */
const DetailedHistoryWidget = () => {

    const dispatch = useAppDispatch();
    useEffect(() => void dispatch(fetchDetailedHistory()), []);
    const [startDate, endDate] = useAppSelector(selectDetailedHistoryDateRage);

    return (
        <DashboardWidget className={"w-full"}>

            <DashboardWidgetHeader>
                <DashboardWidgetTitle>Detailed History</DashboardWidgetTitle>
                <div className={"flex items-center gap-4"}>

                    <DateField
                        label={"Start Date"}
                        value={startDate}
                        onChange={date => date && dispatch(setDetailedHistoryStartDate(date))}
                    />

                    –

                    <DateField
                        label={"End Date"}
                        value={endDate}
                        onChange={date => date && dispatch(setDetailedHistoryEndDate(date))}
                    />

                </div>
            </DashboardWidgetHeader>

            <Chart/>

        </DashboardWidget>
    );

}

export default DetailedHistoryWidget;

const Chart = () => {

    const data = useAppSelector(state => state.dashboard.detailedHistory.data);

    const darkMode = useColorScheme() === "dark";
    const palette = {
        gray: darkMode ? colors.gray[300] : colors.gray[500],
        blue: darkMode ? colors.blue[400] : colors.blue[500],
        red: darkMode ? colors.red[400] : colors.red[500],
        purple: darkMode ? colors.purple[400] : colors.purple[500],
        yellow: darkMode ? colors.yellow[400] : colors.yellow[500],
    };

    const yTickFormat = Intl.NumberFormat("en-US", {notation: "compact", unitDisplay: "narrow"});
    const yTickFormatter = (v: number) => yTickFormat.format(v);
    const xTickFormatter = (v: string) => DateTime.fromISO(v).toFormat("HH:mm");

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart
                syncId="single-day-x"
                data={data}
            >

                <XAxis
                    dataKey="timestamp"
                    tickFormatter={xTickFormatter}
                    tick={{fill: palette.gray, fontSize: 10}}
                    stroke={palette.gray}
                    tickMargin={8}
                    tickLine={false}
                />

                <YAxis
                    domain={["dataMin", "dataMax"]}
                    type={"number"}
                    tickFormatter={yTickFormatter}
                    tick={{fill: palette.gray, fontSize: 10}}
                    stroke={palette.gray}
                    tickMargin={8}
                    tickLine={false}
                />

                <Tooltip/>

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
                    fillOpacity={0.2}
                />))}

            </AreaChart>
        </ResponsiveContainer>
    );

};

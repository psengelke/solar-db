import {ReactNode, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {
    fetchDetailedHistory,
    selectDetailedHistoryDateRage,
    setDetailedHistoryStartDate,
} from "@/features/dashboard/dashboardSlice.ts";
import classNames from "classnames";
import {DateTime} from "luxon";
import {Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import colors from "tailwindcss/colors";
import useColorScheme from "@/hooks/useColorScheme.ts";
import DashboardWidget from "@/features/dashboard/DashboardWidget.tsx";
import DashboardWidgetTitle from "@/features/dashboard/DashboardWidgetTitle.tsx";
import DashboardWidgetHeader from "@/features/dashboard/DashboardWidgetHeader.tsx";

/**
 * A widget that displays detailed history data for a solar installation.
 * @constructor
 */
const DetailedHistoryWidget = () => {

    const dispatch = useAppDispatch();
    useEffect(() => void dispatch(fetchDetailedHistory()), []);

    const data = useAppSelector(state => state.dashboard.detailedHistory.data);
    const [startDate] = useAppSelector(selectDetailedHistoryDateRage);

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
        <DashboardWidget className={"w-full"}>

            <DashboardWidgetHeader>
                <DashboardWidgetTitle>Detailed History</DashboardWidgetTitle>
                <div>

                    <DateField
                        label={"Start Date"}
                        value={startDate}
                        onChange={date => date && dispatch(setDetailedHistoryStartDate(date))}
                    />

                </div>
            </DashboardWidgetHeader>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>

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
                        dataKey={key}
                        type="monotone"
                        stroke={color}
                        strokeWidth={2}
                        fill={color}
                        fillOpacity={0.2}
                    />))}

                </AreaChart>
            </ResponsiveContainer>

        </DashboardWidget>
    );

}

export default DetailedHistoryWidget;

interface DateFieldProps {
    label?: string;
    placeholder?: string;
    value: DateTime | null | undefined;
    onChange: (date: DateTime | null) => void;
}

const DateField = (props: DateFieldProps) => {

    const initStringVal = props.value?.toFormat("yyyy-MM-dd");
    const [stringVal, setStringVal] = useState(initStringVal);
    useEffect(() => void setStringVal(initStringVal), [initStringVal]);

    const [focused, setFocused] = useState(false);

    return (

        <InputBase focused={focused}>

            <input

                className={classNames({
                    "bg-transparent focus:outline-none w-full text-base ml-1": true,
                    "transition-colors duration-200": true,
                    "placeholder:text-transparent": !focused,
                })}

                placeholder={props.placeholder}
                value={stringVal}
                onChange={e => {

                    const v = e.target.value;
                    setStringVal(v);

                    const dv = v ? DateTime.fromFormat(v, "yyyy-MM-dd") : null;
                    if (dv == null || dv.isValid) props.onChange(dv);

                }}

                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}

            />

            <InputLabel shrink={focused || !!stringVal}>
                {props.label}
            </InputLabel>

            <IconButton
                icon={<Icon name={"event"}/>}
                onClick={() => {
                    // todo show picker
                }}/>

        </InputBase>

    );
}

interface IconButtonProps {
    icon: ReactNode;
    onClick: () => void;
    ariaLabel?: string;
}

const IconButton = (props: IconButtonProps) => {
    const {icon, onClick, ariaLabel} = props;
    return (
        <button
            onClick={onClick}
            className={classNames(
                "flex items-center justify-center p-2 rounded-full transition-colors duration-200",
                "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
                "hover:bg-gray-400 dark:hover:bg-gray-600",
            )}
            aria-label={ariaLabel}
        >
            {icon}
        </button>
    );
};

interface IconProps {
    name: string;
}

const Icon = (props: IconProps) => {
    const {name} = props;
    return (<span className="material-symbols-rounded red">{name}</span>);
};

interface InputLabelProps {
    shrink: boolean;
    children?: ReactNode;
}

const InputLabel = (props: InputLabelProps) => (
    props.children
        ? <label
            className={classNames({
                "absolute left-2 transition-all duration-200 px-1 z-[1] pointer-events-none": true,
                "text-xs -top-2.5": props.shrink,
                "text-base top-1/2 -translate-y-1/2": !props.shrink,
            })}
        >
            {props.children}
            <span
                className={classNames({
                    "absolute left-0 right-0 bottom-0 h-1/2 z-[-1]": true,
                    "transition-all duration-200": true,
                    "bg-gray-300 dark:bg-gray-700": props.shrink,
                })}
            />
        </label>
        : null
);

interface InputBaseProps {
    focused: boolean;
    children?: ReactNode;
}

const InputBase = (props: InputBaseProps) => (
    <div
        className={classNames(
            "relative flex items-center rounded-lg p-2",
            "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
            {
                "outline outline-2 outline-gray-700": !props.focused,
                "outline outline-2 outline-blue-500": props.focused
            },
        )}
    >
        {props.children}
    </div>
);

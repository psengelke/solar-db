import classNames from "classnames";

interface ChartTooltipItemProps {
    variant?: "primary" | "secondary";
    label: string;
    value: string;
    color: string;
}

export default function ChartTooltipItem(props: ChartTooltipItemProps) {

    const variant = props.variant ?? "primary";
    const isPrimary = variant === "primary";

    return (
        <div className={classNames({
            "flex gap-3 justify-between items-center": true,
            "text-gray-700 dark:text-gray-300 text-sm": isPrimary,
            "text-gray-500 dark:text-gray-500 text-xs": !isPrimary,
        })}>
            <div className={"flex gap-2 items-center"}>
                <div className={"rounded-full h-[10px] w-[10px]"}
                     style={{backgroundColor: isPrimary ? props.color : "transparent"}}
                />
                <p>{props.label}</p>
            </div>
            <p>{props.value}</p>
        </div>
    );

};

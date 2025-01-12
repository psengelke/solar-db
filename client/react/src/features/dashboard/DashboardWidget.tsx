import {ReactNode} from "react";
import classNames from "classnames";

export default function DashboardWidget(props: DashboardWidgetProps) {
    return (<div
        className={classNames(
            "flex flex-col self-start rounded-2xl p-4 overflow-hidden",
            "bg-gray-200 dark:bg-gray-600",
            props.className,
        )}
    >
        {props.children}
    </div>);

};

interface DashboardWidgetProps {
    className?: string | undefined,
    children: ReactNode,
}

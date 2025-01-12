import {ReactNode} from "react";
import classNames from "classnames";

export default function DashboardWidgetHeader(props: DashboardWidgetHeaderProps) {
    return (<div className={classNames(
        "flex justify-between pb-2 items-center",
        props.className,
    )}>
        {props.children}
    </div>);
}

interface DashboardWidgetHeaderProps {
    className?: string | undefined;
    children: ReactNode;
}

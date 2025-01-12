import {ReactNode} from "react";

export default function DashboardWidgetTitle(props: DashboardWidgetTitleProps) {
    return (<p className={"text-xl"}>{props.children}</p>);
}

interface DashboardWidgetTitleProps {
    children: ReactNode;
}

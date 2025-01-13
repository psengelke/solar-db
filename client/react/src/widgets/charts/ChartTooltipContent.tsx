import {ReactNode} from "react";

interface ChartTooltipContentProps {
    children: ReactNode;
}

export default function ChartTooltipContent(props: ChartTooltipContentProps) {
    return (
        <div className={"flex flex-col gap-2"}>
            {props.children}
        </div>
    );
}

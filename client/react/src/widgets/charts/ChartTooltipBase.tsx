import {ReactNode} from "react";

interface ChartTooltipBaseProps {
    children: ReactNode;
}

export default function ChartTooltipBase(props: ChartTooltipBaseProps) {
    return (
        <div className={"p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md"}>
            {props.children}
        </div>
    );
}

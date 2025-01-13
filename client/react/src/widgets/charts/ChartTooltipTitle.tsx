import {ReactNode} from "react";

interface ChartTooltipTitleProps {
    children: ReactNode;
}

export default function ChartTooltipTitle(props: ChartTooltipTitleProps) {
    return (
        <p className={"text-gray-700 dark:text-gray-300 pb-2 w-full text-center"}>
            {props.children}
        </p>
    );
}

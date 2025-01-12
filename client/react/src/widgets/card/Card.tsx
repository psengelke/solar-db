import {ReactNode} from "react";
import classNames from "classnames";

export default function Card(props: CardProps) {
    return (<div
        className={classNames(
            "flex flex-col rounded-2xl p-4 overflow-hidden",
            "border-[1px] border-gray-300 dark:border-gray-700",
            props.className,
        )}
    >
        {props.children}
    </div>);
};

interface CardProps {
    className?: string | undefined,
    children: ReactNode,
}

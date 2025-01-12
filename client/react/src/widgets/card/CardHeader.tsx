import {ReactNode} from "react";
import classNames from "classnames";

export default function CardHeader(props: CardHeader) {
    return (<div className={classNames(
        "flex justify-between pb-2 items-center",
        props.className,
    )}>
        {props.children}
    </div>);
}

interface CardHeader {
    className?: string | undefined;
    children: ReactNode;
}

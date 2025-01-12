import {ReactNode} from "react";

export default function CardTitle(props: CardTitle) {
    return (<p className={"text-lg"}>{props.children}</p>);
}

interface CardTitle {
    children: ReactNode;
}

import {ReactNode} from "react";

interface PageProps {
    children?: ReactNode;
}

export default function Page(props: PageProps) {
    return (
        <div className={"flex flex-col overflow-auto flex-grow pt-4 px-4"}>
            {props.children}
            <div className={"h-4"}/>
        </div>
    );
}

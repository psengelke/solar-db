import {ReactNode} from "react";
import classNames from "classnames";

interface InputBaseProps {
    focused: boolean;
    fullWidth?: boolean;
    children?: ReactNode;
}

export default function InputBase(props: InputBaseProps) {
    return (
        <div
            className={classNames(
                "relative flex items-center rounded-lg pl-2 pr-2",
                "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
                {
                    "outline outline-2 outline-gray-700": !props.focused,
                    "outline outline-2 outline-blue-500": props.focused,
                    "w-full": props.fullWidth,
                    "w-fit": !props.fullWidth,
                },
            )}
        >
            {props.children}
        </div>
    );
}

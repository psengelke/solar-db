import {ReactNode} from "react";
import classNames from "classnames";

interface InputLabelProps {
    shrink: boolean;
    children?: ReactNode;
}

export default function InputLabel(props: InputLabelProps) {
    return (
        props.children
            ? <label
                className={classNames({
                    "absolute left-2 transition-all duration-200 px-1 z-[1] pointer-events-none": true,
                    "text-xs -top-2.5": props.shrink,
                    "text-base top-1/2 -translate-y-1/2": !props.shrink,
                })}
            >
                {props.children}
                <span
                    className={classNames({
                        "absolute left-0 right-0 bottom-0 h-1/2 z-[-1]": true,
                        "transition-all duration-200": true,
                        "bg-gray-300 dark:bg-gray-700": props.shrink,
                    })}
                />
            </label>
            : null
    );
}

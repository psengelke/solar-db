import {ReactNode} from "react";
import classNames from "classnames";

interface IconButtonProps {
    icon: ReactNode;
    onClick: () => void;
    ariaLabel?: string;
}

export default function IconButton(props: IconButtonProps) {
    const {icon, onClick, ariaLabel} = props;
    return (
        <button
            onClick={onClick}
            className={classNames(
                "flex items-center justify-center p-2 rounded-full transition-colors duration-200",
                "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
                "hover:bg-gray-400 dark:hover:bg-gray-600",
            )}
            aria-label={ariaLabel}
        >
            {icon}
        </button>
    );
};

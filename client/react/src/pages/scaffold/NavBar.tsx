import {NavLink} from "react-router";
import {RouteNames} from "@/routing/routes.ts";
import {useCallback} from "react";
import classNames from "classnames";

const routes = [
    {path: RouteNames.home, label: "All Time"},
    {path: RouteNames.day, label: "Day"},
    {path: RouteNames.month, label: "Month"},
    {path: RouteNames.year, label: "Year"}
];

interface NavBarProps {
    scrolled: boolean,
}

export default function NavBar(props: NavBarProps) {

    const getClassName = useCallback(({isActive}: {
        isActive: boolean
    }): string | undefined => isActive ? "text-blue-500 dark:text-blue-300" : undefined, []);

    return (
        <div className={classNames(
            "flex gap-4 p-4",
            {"bg-white dark:bg-gray-800": props.scrolled},
        )}>
            {routes.map(route => (
                <NavLink
                    key={route.path}
                    to={route.path}
                    className={getClassName}
                >
                    {route.label}
                </NavLink>
            ))}
        </div>
    );
}

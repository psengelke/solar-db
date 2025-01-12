import {Outlet} from "react-router";
import NavBar from "@/pages/scaffold/NavBar.tsx";
import {useEffect, useState} from "react";

const OUTLET_ID = "__scaffold_outlet__";

export default function Scaffold() {

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = (e: Event) => {
            const target = e.target as HTMLElement;
            setScrolled(target.scrollTop > 0);
        };
        const outlet = document.getElementById(OUTLET_ID);
        outlet?.addEventListener("scroll", handleScroll);
        return () => void outlet?.removeEventListener("scroll", handleScroll);
    }, []);

    return (<div className={"flex flex-col h-full"}>
        <NavBar scrolled={scrolled}/>
        <div id={OUTLET_ID} className={"flex-grow overflow-auto"}>
            <Outlet/>
        </div>
    </div>);
}

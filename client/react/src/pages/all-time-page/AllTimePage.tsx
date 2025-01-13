import Page from "@/widgets/page/Page.tsx";
import SocStatsWidget from "@/pages/all-time-page/SocStatsWidget.tsx";
import DayStatsWidget from "@/pages/all-time-page/DayStatsWidget.tsx";
import {useAppDispatch} from "@/store/hooks.ts";
import {useEffect} from "react";
import {fetchData} from "@/pages/all-time-page/allTimePageSlice.ts";

export default function AllTimePage() {

    const dispatch = useAppDispatch();
    useEffect(() => void dispatch(fetchData()), [dispatch]);

    return (
        <Page>
            <div className={"flex flex-wrap gap-4"}>
                <DayStatsWidget/>
                <SocStatsWidget/>
            </div>
        </Page>
    );

}

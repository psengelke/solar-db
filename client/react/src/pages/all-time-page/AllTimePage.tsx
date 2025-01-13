import Page from "@/widgets/page/Page.tsx";
import SocChartWidget from "@/pages/all-time-page/SocChartWidget.tsx";
import ProductionAndConsumptionChartCard from "@/pages/all-time-page/ProductionAndConsumptionChartCard.tsx";
import {useAppDispatch} from "@/store/hooks.ts";
import {useEffect} from "react";
import {fetchData} from "@/pages/all-time-page/allTimePageSlice.ts";
import ConsumptionChartCard from "@/pages/all-time-page/ConsumptionChartCard.tsx";

export default function AllTimePage() {

    const dispatch = useAppDispatch();
    useEffect(() => void dispatch(fetchData()), [dispatch]);

    return (
        <Page>
            <div className={"flex flex-wrap gap-4"}>
                <ProductionAndConsumptionChartCard/>
                <ConsumptionChartCard/>
                <SocChartWidget/>
            </div>
        </Page>
    );

}

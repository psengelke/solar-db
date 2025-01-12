import Card from "@/widgets/card/Card.tsx";
import CardHeader from "@/widgets/card/CardHeader.tsx";
import CardTitle from "@/widgets/card/CardTitle.tsx";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {useEffect} from "react";
import SocStatsChart from "@/widgets/charts/SocStatsChart.tsx";
import {fetchSocStats} from "@/pages/day-page/dayPageSlice.ts";

export default function SocStatsWidget() {

    const dispatch = useAppDispatch();
    useEffect(() => void dispatch(fetchSocStats()), []);
    const data = useAppSelector(state => state.dayPage.socStats);

    return (
        <Card className={"w-full"}>
            <CardHeader>
                <CardTitle>State of Charge</CardTitle>
            </CardHeader>
            <SocStatsChart data={data}/>
        </Card>
    );

}

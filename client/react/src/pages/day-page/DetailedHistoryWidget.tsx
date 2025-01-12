import Card from "@/widgets/card/Card.tsx";
import CardHeader from "@/widgets/card/CardHeader.tsx";
import CardTitle from "@/widgets/card/CardTitle.tsx";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {useEffect} from "react";
import {fetchDetailedHistory} from "@/pages/day-page/dayPageSlice.ts";
import DetailedHistoryChart from "@/widgets/charts/DetailedHistoryChart.tsx";

export default function DetailedHistoryWidget() {

    const dispatch = useAppDispatch();
    useEffect(() => void dispatch(fetchDetailedHistory()), []);
    const data = useAppSelector(state => state.dayPage.detailedHistory);

    return (
        <Card className={"w-full"}>
            <CardHeader>
                <CardTitle>Production & Consumption</CardTitle>
            </CardHeader>
            <DetailedHistoryChart data={data}/>
        </Card>
    );
}

import { useAppSelector } from "@/store/hooks";
import Card from "@/widgets/card/Card.tsx";
import CardHeader from "@/widgets/card/CardHeader.tsx";
import CardTitle from "@/widgets/card/CardTitle.tsx";

export default function SocStatsWidget() {

    const data = useAppSelector(state => state.dayPage.detailedHistory);

    return (
        <Card className={"w-full"}>
            <CardHeader>
                <CardTitle>State of Charge</CardTitle>
            </CardHeader>
            {/* <SocStatsChart data={data}/> */}
        </Card>
    );

}

import Card from "@/widgets/card/Card.tsx";
import CardHeader from "@/widgets/card/CardHeader.tsx";
import CardTitle from "@/widgets/card/CardTitle.tsx";

export default function DayStatsWidget() {
    return (
        <Card className={"w-full"}>
            <CardHeader>
                <CardTitle>Day Trends</CardTitle>
            </CardHeader>
        </Card>
    );
}

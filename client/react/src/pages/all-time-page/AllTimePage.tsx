import Page from "@/widgets/page/Page.tsx";
import SocStatsWidget from "@/pages/all-time-page/SocStatsWidget.tsx";
import DayStatsWidget from "@/pages/all-time-page/DayStatsWidget.tsx";

export default function AllTimePage() {
    return (
        <Page>
            <div className={"flex flex-wrap gap-4"}>
                <DayStatsWidget/>
                <SocStatsWidget/>
            </div>
        </Page>
    );
}

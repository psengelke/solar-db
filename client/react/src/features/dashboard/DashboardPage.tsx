import DetailedHistoryWidget from "@/features/dashboard/DetailedHistoryWidget.tsx";
import SocStatsWidget from "@/features/dashboard/SocStatsWidget.tsx";

const DashboardPage = () => {

    return (
        <div className={"flex flex-col flex-grow overflow-auto"}>
            <div className="flex p-4 gap-4 flex-wrap items-start">

                <DetailedHistoryWidget/>
                <SocStatsWidget/>

                {/*    todo DetailedStatsWidget*/}
                {/*    todo HistoryWidget - Bars*/}

            </div>
        </div>
    );
};

export default DashboardPage;

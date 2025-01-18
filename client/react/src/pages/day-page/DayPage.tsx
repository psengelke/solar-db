import { fetchDetailedHistory, selectDate, setDate } from "@/pages/day-page/dayPageSlice.ts";
import DetailedHistoryWidget from "@/pages/day-page/DetailedHistoryWidget.tsx";
import { useAppDispatch, useAppSelector } from "@/store/hooks.ts";
import IconButton from "@/widgets/buttons/IconButton.tsx";
import Icon from "@/widgets/Icon.tsx";
import DateField from "@/widgets/inputs/DateField.tsx";
import Page from "@/widgets/page/Page.tsx";
import { DateTime } from "luxon";
import { useCallback, useEffect } from "react";
import SocChartCard from "./SocChartCard";

export default function DayPage() {

    const dispatch = useAppDispatch();
    useEffect(() => void dispatch(fetchDetailedHistory()), []);

    return (
        <Page>
            <div className={"flex flex-wrap gap-4"}>
                <Controls/>
                <DetailedHistoryWidget/>
                <SocChartCard/>
            </div>
        </Page>
    );
}

function Controls() {

    const dispatch = useAppDispatch();
    const date = useAppSelector(selectDate);

    const onDateChanged = useCallback(
        (date?: DateTime | null) => date && dispatch(setDate(date)),
        [dispatch]);

    const incDate = useCallback(() => onDateChanged(date?.plus({day: 1})), [date, onDateChanged]);
    const decDate = useCallback(() => onDateChanged(date?.minus({day: 1})), [date, onDateChanged]);

    return (
        <div className={"flex w-full items-center justify-center gap-4"}>

            <IconButton icon={<Icon name={"chevron_left"}/>} onClick={decDate}/>

            <DateField
                value={date}
                onChange={onDateChanged}
            />

            <IconButton icon={<Icon name={"chevron_right"}/>} onClick={incDate}/>

        </div>
    );
}

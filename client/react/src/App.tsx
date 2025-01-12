import {BrowserRouter, Route, Routes} from "react-router";
import {Provider as ReduxProvider} from "react-redux";
import {store} from "@/store/store.ts";
import {RouteNames} from "@/routing/routes.ts";
import AllTimePage from "@/pages/all-time-page/AllTimePage.tsx";
import MonthViewPage from "@/pages/month-page/MonthViewPage.tsx";
import YearViewPage from "@/pages/year-page/YearViewPage.tsx";
import DayPage from "@/pages/day-page/DayPage.tsx";
import Scaffold from "@/pages/scaffold/Scaffold.tsx";

export default function App() {
    return (
        <ReduxProvider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route element={<Scaffold/>}>
                        <Route index element={<AllTimePage/>}/>
                        <Route path={RouteNames.day} element={<DayPage/>}/>
                        <Route path={RouteNames.month} element={<MonthViewPage/>}/>
                        <Route path={RouteNames.year} element={<YearViewPage/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </ReduxProvider>
    );
}

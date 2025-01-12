import {BrowserRouter, Route, Routes} from "react-router";
import DashboardPage from "@/features/dashboard/DashboardPage.tsx";
import {Provider as ReduxProvider} from "react-redux";
import {store} from "@/store/store.ts";

export default function App() {
    return (
        <ReduxProvider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route index element={<DashboardPage/>}/>
                </Routes>
            </BrowserRouter>
        </ReduxProvider>
    );
}

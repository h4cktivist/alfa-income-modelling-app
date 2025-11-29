import {Route, Routes} from "react-router";
import AllClients from "../pages/AllClients.tsx";
import NewClient from "../pages/NewClient.tsx";
import NotFound from "../pages/NotFound.tsx";


const AppRoutes = () => {
    const navigationRoutes = [
        {
            path: "/all",
            element: <AllClients/>,
        },
        {
            path: "/",
            element: <NewClient/>,
        },
        {
            path: "*",
            element: <NotFound/>,
        },
    ]
    return (

        <Routes>
            {navigationRoutes.map(route => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                />
            ))}
        </Routes>
    )
}

export default AppRoutes;
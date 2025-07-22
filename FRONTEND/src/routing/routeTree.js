import { createRootRoute } from "@tanstack/react-router"
import RootLayout from "../RootLayout"
import { homePageRoute } from "./homepage"
import { authRoute } from "./auth.route"
import { dashboardRoute } from "./dashboard"
import ErrorComponent from "../components/ErrorComponent"

export const rootRoute = createRootRoute({
    component: RootLayout,
    errorComponent: ErrorComponent
})
export const routeTree = rootRoute.addChildren([
    homePageRoute,
    authRoute,
    dashboardRoute
])  
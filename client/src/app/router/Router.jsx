import { Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import useAuthStore from "@/modules/auth/state/auth-store"
import { getDefaultRouteForRole } from "@/constants/roles"
import RoleProtectedRoute from "@/shared/components/RoleProtectedRoute"
import { publicRoutes, protectedRoutes, NotFoundElement } from "./routerConfig"

const Home = publicRoutes.find((r) => r.path === '/login')
const PageFallback = () => <div className="p-8 text-center">Loading...</div>

const Router = () => {
    const accessToken = useAuthStore((state) => state.accessToken)
    const user = useAuthStore((state) => state.user)

    return(
        <BrowserRouter>
            <Suspense fallback={<PageFallback/>}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            accessToken ? 
                            <Navigate to={getDefaultRouteForRole(user?.role)} replace/>
                            : <Home/>
                        }   
                    />

                    {publicRoutes.map(({ path, element: Element}) => (
                        <Route key={path} path={path} element={<Element/>}/>
                    ))}

                    {protectedRoutes.map(({path, element: Element, roles}) => (
                        <Route
                            key={path}
                            path={path}
                            element={
                                <RoleProtectedRoute allowedRoles={roles}>
                                    <Element/>
                                </RoleProtectedRoute>
                            }
                        />
                    ))}
                    <Route path="*" element={<NotFoundElement/>}/>
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default Router;
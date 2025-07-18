import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function GuestRoutes() {
    const { auth } = useAuth();

    return (
        <>
            {!auth.accessToken ? <Outlet /> : <Navigate to="/" />}
        </>
    )
}

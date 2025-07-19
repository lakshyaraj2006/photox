import { AuthProvider } from "@/context/AuthProvider";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export const AuthLayout = () => {
    return (
        <AuthProvider>
            <ToastContainer 
                autoClose={2500}
            />
            <Outlet />
        </AuthProvider>
    )
}
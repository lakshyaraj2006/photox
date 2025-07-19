import {Outlet} from "react-router-dom";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthProvider";
import { ToastContainer } from "react-toastify";

export const RootLayout = () => {
    return (
        <AuthProvider>
            <Navbar />
            <ToastContainer 
                autoClose={2500}
            />
            <Outlet />
        </AuthProvider>
    )
}

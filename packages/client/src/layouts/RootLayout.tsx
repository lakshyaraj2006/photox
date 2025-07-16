import {Outlet} from "react-router-dom";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthProvider";

export const RootLayout = () => {
    return (
        <AuthProvider>
            <Navbar />
            <Outlet />
        </AuthProvider>
    )
}

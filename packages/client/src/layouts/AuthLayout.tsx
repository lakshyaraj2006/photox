import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export const AuthLayout = () => {
    return (
        <>
            <ToastContainer 
                autoClose={2500}
            />
            <Outlet />
        </>
    )
}
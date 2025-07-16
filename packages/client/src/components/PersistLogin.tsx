import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import { useAuth } from "../hooks/useAuth";
import { AxiosError } from "axios";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (error) {
                if (error instanceof AxiosError) {
                    console.log(error.response.data)
                }
                else {
                    console.log("Something went wrong!")
                };
            } finally {
                setIsLoading(false);
            }
        }

        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    }, [])

    return (
        <>
            {isLoading
                ? <p>Loading...</p>
                : <Outlet />}
        </>
    )
}

export default PersistLogin;
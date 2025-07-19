import type { UserCredentials } from "@/context/AuthProvider";
import axiosInstance from "@/lib/axios";
import { useAuth } from "./useAuth";

const useLogout = () => {
    const { auth, setAuth } = useAuth();

    const logout = async () => {
        setAuth({} as UserCredentials);

        try {
            await axiosInstance.post('/auth/logout', null, {
                headers: { 'Authorization': `Bearer ${auth.accessToken}` },
                withCredentials: true
            })
        } catch (error) {
            console.log(error);
        }
    }

    return logout;
}

export default useLogout;
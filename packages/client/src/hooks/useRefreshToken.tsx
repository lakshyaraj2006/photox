import axiosInstance from "@/lib/axios";
import { useAuth } from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axiosInstance.post('/auth/refresh-token', null, {
            withCredentials: true
        });
        const {accessToken, userId} = response.data.data;
        setAuth(prev => {

            return { ...prev, accessToken, userId };
        })

        return response.data.accessToken
    }

    return refresh;
}

export default useRefreshToken;
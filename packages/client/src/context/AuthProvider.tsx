import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import React, { createContext, useEffect, useState } from "react";

export interface UserCredentials {
    accessToken: string,
    userId: string
};

export interface UserProfile {
    _id: string,
    name: string,
    username: string,
    email: string,
    image: string,
    albums: string[],
    photos: string[],
    __v: string,
    updatedAt: Date,
    createdAt: Date
}
interface AuthContextType {
    auth: UserCredentials,
    setAuth: React.Dispatch<React.SetStateAction<UserCredentials>>,
    profile: UserProfile,
    setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>,
    getUserProfile: () => Promise<void>
}

const AuthContext = createContext({} as AuthContextType);

const AuthProvider = ({ children }: React.PropsWithChildren) => {
    const [auth, setAuth] = useState<UserCredentials>({} as UserCredentials);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (auth.accessToken) {
            getUserProfile();
        }
    }, [auth])

    const getUserProfile = async () => {
        try {
            const response = await axiosInstance.get('/user/profile', {
                headers: {
                    'Content-Type': 'application/json',
                    ...(auth.accessToken && {
                        'Authorization': `Bearer ${auth.accessToken}`
                    })
                }
            });
            setProfile(response.data.data as UserProfile);
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response.data);
            } else {
                console.error("Something went wrong!")
            }
        }
    };

    const contextData = {
        auth,
        setAuth,
        profile,
        setProfile,
        getUserProfile
    }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext as default, AuthProvider };

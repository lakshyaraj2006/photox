import React, { createContext, useState } from "react";

export interface UserCredentials {
    accessToken: string,
    userId: string
};

interface AuthContextType {
    auth: UserCredentials,
    setAuth: React.Dispatch<React.SetStateAction<UserCredentials>>
}

const AuthContext = createContext({} as AuthContextType);

const AuthProvider = ({ children }: React.PropsWithChildren) => {
    const [auth, setAuth] = useState<UserCredentials>({} as UserCredentials);

    const contextData = {
        auth,
        setAuth
    }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext as default, AuthProvider };

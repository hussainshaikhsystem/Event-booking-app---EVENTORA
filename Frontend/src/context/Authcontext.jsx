import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setuser] = useState(null);
    const [loading, setloading] = useState(true);
    useEffect(() => {
        const storeduser = localStorage.getItem("user");
        if(storeduser){
           setuser(JSON.parse(storeduser))
        }
        setloading(false)
    }, [])
    const login = (userdata) => {
        setuser(userdata);
        localStorage.setItem("user", JSON.stringify(userdata))
        localStorage.setItem('token', userdata.token);
    }
    const logout = () => {
        setuser(null);
        localStorage.removeItem("user")
        localStorage.removeItem("token")
    }
    return (
     <AuthContext.Provider value={{user, loading , login , logout}}>
        {children}
     </AuthContext.Provider>
    )
}
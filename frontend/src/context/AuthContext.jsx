import { createContext } from "react";
const AuthContext = createContext();
import { useContext, useState } from "react";
import { useEffect } from "react";
import { supabase } from "../supabaseClient";

export const AuthContextProvider = ({ children }) => {
    const [session, setSession] = useState(undefined);
    const signUpNewUser = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        if (error) {
            console.log("Error signing up:", error.message);
        } else {
            console.log("User signed up:", data);
        }
    }
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);
    const signInUser = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return { data, error }; // return to handle in Login
    };      
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.log("Error signing out:", error.message);
        } else {
            console.log("User signed out");
        }
    };
    return (
        <AuthContext.Provider value={{ session, signUpNewUser, signInUser, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const UserAuth = () => {
    return useContext(AuthContext);
}
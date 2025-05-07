import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [session, setSession] = useState(undefined);
    const [loading, setLoading] = useState(true);

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
        // Get initial session
        const initSession = async () => {
            setLoading(true);
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
            setLoading(false);
        };
        
        initSession();

        // Set up auth state listener
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });
        
        // Clean up subscription
        return () => {
            if (authListener && authListener.subscription) {
                authListener.subscription.unsubscribe();
            }
        };
    }, []);

    const signInUser = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    };      

    const signInWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/profile'
            }
        });
        return { data, error };
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
        <AuthContext.Provider value={{ 
            session, 
            loading, 
            signUpNewUser, 
            signInUser, 
            signInWithGoogle,
            signOut 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const UserAuth = () => {
    return useContext(AuthContext);
}
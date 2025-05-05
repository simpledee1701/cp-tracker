import { createBrowserRouter } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Start from "./pages/Start";
import PrivateRoute from "./components/PrivateRoute";
import LeetcodePage from "./pages/LeetcodePage";
import CodechefPage from "./pages/CodechefPage";
import CodeforcesPage from "./pages/CodeforcesPage";
import Home from "./pages/Home";
import Contest from "./pages/Contest";
import ProfileForm from "./pages/ProfileForm";

export const router = createBrowserRouter([
    { path: "/", element: <Start /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/login", element: <Login /> },
    { 
        path: "/profile", 
        element: (
            <PrivateRoute>
                <Profile />
            </PrivateRoute>
        )
    },
    { 
        path: "/home", 
        element: (
            <PrivateRoute>
                <Home />
            </PrivateRoute>
        )
    },
    { 
        path: "/contest", 
        element: (
            <PrivateRoute>
                <Contest />
            </PrivateRoute>
        )
    },
    { 
        path: "/leetcode", 
        element: (
            <PrivateRoute>
                <LeetcodePage />
            </PrivateRoute>
        )
    },
    { 
        path: "/codechef", 
        element: (
            <PrivateRoute>
                <CodechefPage />
            </PrivateRoute>
        )
    },
    { 
        path: "/codeforces", 
        element: (
            <PrivateRoute>
                <CodeforcesPage />
            </PrivateRoute>
        )
    },
    { 
        path: "/profileform", 
        element: (
            <PrivateRoute>
                <ProfileForm />
            </PrivateRoute>
        )
    },
]);
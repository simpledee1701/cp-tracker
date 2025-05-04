import {createBrowserRouter} from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Start from "./pages/Start";
import PrivateRoute from "./components/PrivateRoute";
export const router = createBrowserRouter([
    { path : "/", element: <Start/>},
    { path : "/signup", element: <SignUp/> },   
    { path : "/login", element: <Login/> },
    { 
        path : "/profile", element:(
        <PrivateRoute>
            <Profile/>
        </PrivateRoute>
        )
    },
])
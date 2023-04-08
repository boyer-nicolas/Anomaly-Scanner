import "@fontsource/jetbrains-mono";
import "@fontsource/poppins"
import React from "react";
import ReactDOM from "react-dom/client";
import
{
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider
} from "react-router-dom";

import Auth from "./lib/Auth";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Home from "./pages/Home";
import Scan from "./pages/scan/Scan";
import SendScannedCodes from "./pages/scan/Send";
import Error from "./pages/Error";
import Login from "./pages/auth/Login";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/auth/ForgotPassword";
import EmailConfirmed from "./pages/auth/EmailConfirmed";
import './styles/globals.css';
import "./scss/swal/sweetalert2.scss";

const auth = new Auth();
const isAuthenticated = auth.isAuthenticated();
let isAdmin = false;
if (isAuthenticated)
{
    isAdmin = auth.isAdmin();
}


const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {isAuthenticated ? (
                <Route element={<MainLayout />} errorElement={<Error />}>
                    <Route
                        exact
                        index
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/scan"
                        element={<Scan />}
                    />

                    <Route
                        path="/scan/envoi"
                        element={<SendScannedCodes />}
                    />

                    <Route
                        path="/profil"
                        element={<Profile />}
                    />

                    {isAdmin && (
                        <Route
                            path="/parametres"
                            element={<Settings />}
                        />
                    )}
                </Route>
            ) : (
                <Route element={<AuthLayout />} errorElement={<Error />}>
                    <Route
                        exact
                        index
                        path="/"
                        element={<Login />}
                    />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route
                        path="/email-confirmed"
                        element={<EmailConfirmed />}
                    />
                </Route>
            )}
        </>

    )
);


ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
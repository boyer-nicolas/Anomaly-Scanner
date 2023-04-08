import Container from "../components/Container";
import
{
    BiMoon
} from 'react-icons/bi';
import React from "react";
import Cookies from "js-cookie";
import { ToastContainer } from 'react-toastify';
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default class AuthLayout extends React.Component
{
    constructor(props)
    {
        super(props);
        this.props = props;
    }

    handleThemeChange()
    {
        let availableThemes = ["light", "night"];
        let currentTheme = document.querySelector('html').getAttribute('data-theme');
        let nextTheme = availableThemes[(availableThemes.indexOf(currentTheme) + 1) % availableThemes.length];

        Cookies.set('theme', nextTheme);

        document.querySelector('html').setAttribute('data-theme', nextTheme);
    }

    componentDidMount()
    {
        const theme = Cookies.get('theme');
        if (theme === undefined)
        {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
            {
                Cookies.set('theme', 'night');
            }
            else
            {
                Cookies.set('theme', 'light');
            }
        }
        document.querySelector('html').setAttribute('data-theme', theme);
    }

    render()
    {
        return (
            <Container>
                <div className="navbar bg-base-100">
                    <div className="flex-1">
                        <NavLink to="/" className="btn btn-ghost normal-case text-xl">MTAS</NavLink>
                    </div>
                    <div className="flex-none">
                        <button className="btn btn-ghost btn-circle" onClick={() => this.handleThemeChange()}>
                            <BiMoon size={24} />
                        </button>
                    </div>
                </div>
                <Outlet />
                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </Container>
        )
    }
}
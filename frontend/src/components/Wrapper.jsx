import
{
    BiCheckCircle,
    BiMoon,
    BiUser,
    BiLogOut
} from 'react-icons/bi'
import React from "react";
import Barcode from '../lib/Barcode';
import { NavLink } from "react-router-dom"
import Auth from '../lib/Auth';
import NavItems from './NavItems';
import Cookies from 'js-cookie';

export default class TopNav extends React.Component
{
    constructor(props)
    {
        super(props);

        this.children = props.children;

        this.barcode = new Barcode();
        this.state = {
            barcodes: this.barcode.getAll(),
            theme: "sombre"
        }
        this.auth = new Auth();

        this.user = this.auth.getUser();
    }

    handleThemeChange()
    {
        let availableThemes = ["light", "night"];
        let currentTheme = document.querySelector('html').getAttribute('data-theme');
        let nextTheme = availableThemes[(availableThemes.indexOf(currentTheme) + 1) % availableThemes.length];

        Cookies.set('theme', nextTheme);

        this.setState({ theme: nextTheme === "night" ? "clair" : "sombre" });

        document.querySelector('html').setAttribute('data-theme', nextTheme);
    }

    componentDidMount()
    {
        this.periodicScan();
        const theme = Cookies.get('theme');
        if (theme === undefined)
        {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
            {
                Cookies.set('theme', 'night');
                this.setState({ theme: "clair" });
            }
            else
            {
                Cookies.set('theme', 'light');
                this.setState({ theme: "sombre" });
            }
        }
        else
        {
            Cookies.get('theme') === "night" ? this.setState({ theme: "clair" }) : this.setState({ theme: "sombre" });
        }
        document.querySelector('html').setAttribute('data-theme', theme);

        // Close drawer on navlink click
        const navLinks = document.querySelectorAll('.menu a');
        navLinks.forEach((navLink) =>
        {
            navLink.addEventListener('click', () =>
            {
                document.getElementById('my-drawer-3').checked = false;
            });
        });
    }

    periodicScan()
    {
        setInterval(() =>
        {
            this.setState({
                barcodes: this.barcode.getAll()
            });
        }, 1000);
    }

    render()
    {
        return (
            <>
                <div className="drawer drawer-end">
                    <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content flex flex-col">
                        <div className="navbar bg-base-100">
                            <div className="flex-1">
                                <NavLink className="btn btn-ghost normal-case text-xl" to="/">MTAS</NavLink>
                            </div>
                            <div className="flex-none hidden lg:block">
                                <ul className="menu menu-horizontal">
                                    <NavItems />
                                </ul>
                            </div>
                            <div className="flex-none">

                                <div className="dropdown dropdown-end">
                                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                                        <div className="indicator">
                                            <BiCheckCircle size={24} />
                                            <span className="badge badge-sm indicator-item">{this.state.barcodes.length} </span>
                                        </div>
                                    </label>
                                    <div tabIndex={0}
                                        className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow">
                                        <div className="card-body">
                                            <span
                                                className="font-bold text-lg">{this.state.barcodes.length} pneus scannés</span>
                                            {this.state.barcodes.length > 0 ?
                                                (
                                                    <>
                                                        <ul>
                                                            {this.state.barcodes.map((barcode, index) =>
                                                            {
                                                                return (
                                                                    <li key={index}>{barcode}</li>
                                                                )
                                                            })
                                                            }
                                                        </ul>
                                                        <div className="card-actions">
                                                            <NavLink to='/scan/envoi' className="btn btn-primary btn-block">
                                                                Envoyer au service qualité
                                                            </NavLink>
                                                        </div>
                                                    </>
                                                ) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="dropdown dropdown-end hidden lg:block">
                                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                                        <div className="indicator">
                                            <BiUser size={24} />
                                        </div>
                                    </label>
                                    <ul tabIndex={0} className="mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                                        <li className="px-2 py-4">
                                            <h5 className='mb-0 pt-0 text-lg font-semibold'>Nicolas Boyer</h5>
                                            <p className='text-slate- hover:text-blue-600 mt-0 pt-0'>nicolas@niwee.fr</p>
                                        </li>
                                        <hr />
                                        <li className="px-2 py-1">
                                            <NavLink to='/profil'>
                                                <BiUser size={24} />
                                                Mon Profil
                                            </NavLink>
                                        </li>
                                        <li className="px-2 py-1">
                                            <button onClick={() => this.handleThemeChange()}>
                                                <BiMoon size={24} />
                                                Mode {this.state.theme}
                                            </button>
                                        </li>
                                        <li className="px-2 py-1">
                                            <a onClick={(e) => this.auth.logout(e)}>
                                                <BiLogOut size={24} />
                                                Déconnexion
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex-none lg:hidden">
                                    <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                                    </label>
                                </div>

                            </div>
                        </div>
                        {this.children}
                    </div>
                    <div className="drawer-side">
                        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
                        <ul className="menu p-4 w-80 bg-base-100">
                            <NavItems />
                        </ul>

                    </div>
                </div>
            </>
        )
    }
}
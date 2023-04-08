import React from 'react';
import { NavLink } from 'react-router-dom';
import
{
    BiLogOut,
    BiHomeAlt,
    BiScan,
    BiUser,
    BiCog
} from 'react-icons/bi'
import Auth from '../lib/Auth';

export default function NavItems()
{
    const auth = new Auth();
    return (
        <>
            <li>
                <NavLink className="mx-1" to='/'>
                    <BiHomeAlt size={24} className="lg:hidden" />
                    Accueil
                </NavLink>
            </li>
            <li>
                <NavLink className="mx-1" to='/scan'>
                    <BiScan size={24} className="lg:hidden" />
                    Scanner
                </NavLink>
            </li>
            <li className='lg:hidden'>
                <NavLink className="mx-1" to='/profil'>
                    <BiUser size={24} className="lg:hidden" />
                    Profil
                </NavLink>
            </li>
            {auth.isAdmin() && (
                <li>
                    <NavLink className="mx-1" to='/parametres'>
                        <BiCog size={24} className="lg:hidden" />
                        Paramètres
                    </NavLink>
                </li>
            )}
            <li className='lg:hidden mt-auto'>
                <a onClick={(e) => auth.logout(e)}>
                    <BiLogOut size={24} className="lg:hidden" />
                    Déconnexion
                </a>
            </li>
        </>
    )
}
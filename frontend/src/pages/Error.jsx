import React from 'react'
import { Link } from 'react-router-dom'
import { useRouteError } from 'react-router-dom';
import Auth from "../lib/Auth"

export default function Error()
{
    const error = useRouteError();

    const errorCode = error?.status;
    console.log(error);

    const auth = new Auth();

    let state = {
        errorCode: errorCode,
        errorMessage: error?.statusText,
    }

    switch (errorCode)
    {
        case 404:
            state.errorMessage = "La page demandée n'existe pas.";
            break;
        case 500:
            state.errorMessage = "Une erreur est survenue.";
            break;
        default:
            state.errorMessage = "Une erreur est survenue.";
    }


    React.useEffect(() =>
    {
        document.title = 'MTAS - Erreur';

        if (!auth.isAuthenticated())
        {
            const currentPage = window.location.pathname;
            if (currentPage !== "/")
            {
                window.location.href = "/";
            }
        }
    }, []);


    return (
        <div className="hero">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-2xl mb-4 font-bold">{state.errorMessage}</h1>
                    <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
                </div>
            </div>
        </div>
    );
}

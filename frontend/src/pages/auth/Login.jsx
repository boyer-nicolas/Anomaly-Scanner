import React from "react";
import
{
    BiShow,
    BiHide,
} from 'react-icons/bi';
import Auth from '../../lib/Auth';
import classNames from 'classnames';
import { NavLink } from "react-router-dom";
import Toast from "../../lib/Toast"

export default function Login()
{
    const auth = new Auth();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [buttonText, setButtonText] = React.useState('Se connecter');
    const [passwordFieldType, setPasswordFieldType] = React.useState('password');

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setLoading(true);
        setError(false);
        setPassword('');
        setButtonText("Connexion");

        try
        {
            auth.login(email, password).then((res) =>
            {
                if (res.jwt)
                {
                    new Toast("Vous êtes connecté.", "success");
                    setButtonText("Redirection...");
                    window.location.href = '/';

                }
                else
                {
                    setError(true);
                    if (res.response)
                    {
                        new Toast(res.response.data.error.message, "error");
                    }
                    else
                    {
                        new Toast("Une erreur est survenue.", "error");
                    }
                    setLoading(false);
                    setButtonText("Réessayer");
                }
            });
        }
        catch (err)
        {
            setError(true);
            console.error(err);
            setLoading(false);
            setButtonText("Réessayer");
        }
    }


    return (
        <>
            <div className="container xl:w-1/2 lg:w-1/2 md:w-full sm:w-full mx-auto">
                <div className="w-full">
                    <div>
                        <h1 className="text-5xl font-bold">Bienvenue</h1>
                        <p className="mt-5">
                            Connectez-vous pour continuer.
                        </p>
                    </div>
                </div>

                <fieldset disabled={loading}>
                    <form className="mx-auto" onSubmit={handleSubmit}>
                        <div className="mb-4 relative">
                            <label className="label" htmlFor="email">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                placeholder="exemple@exemple.com"
                                className={classNames("input input-bordered w-full", error && "input-error")}
                                autoComplete="email"
                                name="email"
                                aria-labelledby="email"
                            />
                        </div>
                        <div className="mb-4 relative">
                            <label className="label" htmlFor="password">
                                <span className="label-text">Mot de passe</span>
                            </label>
                            <div className="absolute flex right-4 mt-1.5 items-center ml-2">
                                <button type="button" className="px-1 pt-1 block focus:outline-none" onClick={() => setPasswordFieldType(passwordFieldType === 'password' ? 'text' : 'password')}>
                                    {passwordFieldType === 'password' ? <BiShow size={24} /> : <BiHide size={24} />}
                                </button>
                            </div>
                            <input
                                type={passwordFieldType}
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                placeholder="************"
                                className={classNames("input input-bordered w-full", error && "input-error")}
                                autoComplete="current-password"
                                name="password"
                                aria-labelledby="password"
                            />

                        </div>
                        <div className="flex items-center justify-between">
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <input type="checkbox" className="checkbox checkbox-primary" name="rememberme" />
                                    <span className="label-text ml-2">Se souvenir de moi</span>
                                </label>
                            </div>
                            <div className="text-sm">
                                <NavLink to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Mot de passe oublié ?
                                </NavLink>
                            </div>
                        </div>
                        <div className="form-control mt-10">
                            <button type="submit" className={classNames("btn btn-primary", loading && "loading btn-disabled")}>{buttonText}</button>
                        </div>
                    </form>
                </fieldset>
            </div>
        </>
    )
}
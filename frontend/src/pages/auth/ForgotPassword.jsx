import React from "react"
import { NavLink } from "react-router-dom"
import classNames from "classnames";
import Api from "../../lib/Api";
import Toast from "../../lib/Toast"
import Swal from 'sweetalert2/dist/sweetalert2.js';

export default class ResetPassword extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            email: '',
            token: '',
            loading: false,
            password: '',
            passwordConfirmation: '',
            error: false,
            errorMessage: '',
            success: false,
            buttonText: 'Réinitialiser le mot de passe',
            canReset: false,
            emailSent: false,
        }

        this.api = Api();
    }

    componentDidMount()
    {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code !== null && code !== "")
        {
            this.setState({
                token: code,
                canReset: true,
            });
        }
    }

    setEmail = (email) =>
    {
        this.setState({ email: email });
    }

    handleForgotPassword()
    {
        if (this.state.email === '')
        {
            new Toast("Veuillez saisir votre email.", "error");
            return;
        }

        this.setState({
            loading: true,
            error: false,
            success: false,
            buttonText: "Réinitialisation du mot de passe",
        });

        try
        {
            this.api.post('/auth/forgot-password', {
                email: this.state.email,

            }).then((response) =>
            {
                this.setState({
                    success: true,
                    loading: false,
                    buttonText: "Réinitialisation du mot de passe",
                    emailSent: true,
                });

                new Toast("Un email vous a été envoyé.", "success");
            }
            ).catch((error) =>
            {
                this.setState({
                    error: true,
                    loading: false,
                    buttonText: "Réinitialisation du mot de passe",
                });
                new Toast(error.response.data.error.message, "error");
            });
        }
        catch (err)
        {
            this.setState({
                error: true,
                errorMessage: err.response.data.message,
                loading: false,
                buttonText: "Réessayer",
            });
        }
    }

    setPassword = (password) =>
    {
        this.setState({ password: password });
    }

    setPasswordConfirmation = (passwordConfirmation) =>
    {
        this.setState({ passwordConfirmation: passwordConfirmation });
    }

    handleResetPassword()
    {
        if (this.state.password === '' || this.state.passwordConfirmation === '')
        {
            new Toast("Veuillez saisir votre mot de passe.", "error");
            return;
        }

        if (this.state.password !== this.state.passwordConfirmation)
        {
            new Toast("Les mots de passe ne correspondent pas.", "error");
            return;
        }

        this.setState({
            loading: true,
            error: false,
            success: false,
            buttonText: "Réinitialisation du mot de passe",
        });

        try
        {
            this.api.post('/auth/reset-password', {
                password: this.state.password,
                passwordConfirmation: this.state.passwordConfirmation,
                code: this.state.token,
            }).then((response) =>
            {
                this.setState({
                    success: true,
                    loading: false,
                    buttonText: "Réinitialisation du mot de passe",
                });

                new Toast("Votre mot de passe a été réinitialisé.", "success");
                Swal.fire({
                    type: 'success',
                    title: 'Votre mot de passe a été réinitialisé.',
                    showConfirmButton: true,
                    timer: 1500
                }).then((confirmed) =>
                {
                    if (confirmed)
                    {
                        window.location.href = "/login";
                    }
                });
            }
            ).catch((error) =>
            {
                this.setState({
                    error: true,
                    loading: false,
                    buttonText: "Réinitialisation du mot de passe",
                });
                new Toast(error.response.data.error.message, "error");
            });
        }
        catch (err)
        {
            this.setState({
                error: true,
                errorMessage: err.response.data.message,
                loading: false,
                buttonText: "Réessayer",
            });
        }
    }

    handleSubmit(e)
    {
        e.preventDefault();

        if (this.state.canReset === false)
        {
            this.handleForgotPassword();
        }
        else
        {
            this.handleResetPassword();
        }
    }

    render()
    {
        return (
            <>
                <div className="container xl:w-1/2 lg:w-1/2 md:w-full sm:w-full mx-auto">
                    <div className="w-full">
                        <div>
                            <h1 className="text-5xl font-bold">Mot de passe oublié</h1>
                            <p className="mt-5">
                                Remplissez les champs ci-dessous pour réinitialiser votre mot de passe.
                            </p>
                        </div>
                    </div>
                    <fieldset disabled={this.state.loading || this.state.emailSent}>
                        <form className="mt-10" onSubmit={(e) => this.handleSubmit(e)}>
                            {this.state.canReset === false && (
                                <>
                                    <div className="mb-4 relative">
                                        <label className="label" htmlFor="email">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input
                                            type="email"
                                            onChange={(e) => this.setEmail(e.target.value)}
                                            value={this.state.email}
                                            placeholder="exemple@exemple.com"
                                            className={classNames("input input-bordered w-full", this.state.error && "input-error")}
                                            autoComplete="email"
                                            name="email"
                                            aria-labelledby="email"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm">
                                            <NavLink to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                Retour à la page de connexion
                                            </NavLink>
                                        </div>
                                    </div>
                                </>
                            )}

                            {this.state.canReset === true && (
                                <>
                                    <div className="mb-4 relative">
                                        <label className="label" htmlFor="password">
                                            <span className="label-text">Nouveau mot de passe</span>
                                        </label>
                                        <input
                                            type="password"
                                            onChange={(e) => this.setPassword(e.target.value)}
                                            value={this.state.password}
                                            placeholder="Nouveau mot de passe"
                                            className={classNames("input input-bordered w-full", this.state.error && "input-error")}
                                            autoComplete="new-password"
                                            name="password"
                                            aria-labelledby="password"
                                        />
                                    </div>
                                    <div className="mb-4 relative">
                                        <label className="label" htmlFor="password">
                                            <span className="label-text">Confirmation du mot de passe</span>
                                        </label>
                                        <input
                                            type="password"
                                            onChange={(e) => this.setPasswordConfirmation(e.target.value)}
                                            value={this.state.passwordConfirmation}
                                            placeholder="Confirmation du mot de passe"
                                            className={classNames("input input-bordered w-full", this.state.error && "input-error")}
                                            autoComplete="new-password"
                                            name="passwordConfirmation"
                                            aria-labelledby="password"
                                        />
                                    </div>
                                </>
                            )}

                            <button
                                className={classNames("btn btn-primary w-full mt-10", this.state.loading && "loading")}
                                type="submit"
                                disabled={this.state.loading || this.state.emailSent}
                            >
                                {this.state.buttonText}
                            </button>
                        </form>
                    </fieldset>
                </div>
            </ >
        )
    }
}
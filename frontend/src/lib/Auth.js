import Api from "./Api";
import Cookies from "js-cookie";
import Swal from 'sweetalert2/dist/sweetalert2.js';

/**
 * Extends API to connect to Strapi auth endpoints
 */
export default class Auth
{
    constructor()
    {
        this.api = Api();
    }

    login(email, password)
    {
        if (!email || !password)
        {
            return Promise.resolve({
                response: {
                    data: {
                        error: {
                            message: "Merci d'entrer un email et un mot de passe."
                        }
                    }
                }
            });
        }
        return this.api.post("/auth/local", {
            identifier: email,
            password: password
        }).then((response) =>
        {
            if (response.data.jwt)
            {

                return this.getUser(response.data.jwt)
                    .then((user) =>
                    {

                        if (Cookies.set("jwt", response.data.jwt))
                        {
                            return response.data;
                        } else
                        {
                            return Promise.resolve({
                                response: {
                                    data: {
                                        error: {
                                            message: "Une erreur est survenue."
                                        }
                                    }
                                }
                            });
                        }
                    })
                    .catch((error) =>
                    {
                        console.error(error);
                        return error;
                    });

            }
        })
            .catch((error) =>
            {
                console.error(error);
                if (error.response.data.error.message === "Your account email is not confirmed")
                {
                    Swal.fire({
                        title: "Email non confirmé",
                        text: "Veuillez confirmer votre email pour vous connecter.",
                        icon: "error",
                        confirmButtonText: "Renvoyer l'email de confirmation",
                        showCancelButton: true,
                        cancelButtonText: "Annuler"
                    }).then((result) =>
                    {
                        if (result.value)
                        {
                            Swal.fire({
                                title: 'Envoi en cours...',
                                allowOutsideClick: false,
                                showConfirmButton: false,
                                onBeforeOpen: () =>
                                {
                                    Swal.showLoading()
                                },
                            });
                            Swal.showLoading();

                            this.api.post("/auth/send-email-confirmation", {
                                email: email
                            }).then((response) =>
                            {
                                Swal.fire({
                                    title: "Email de confirmation envoyé",
                                    text: "Un email de confirmation vous a été envoyé.",
                                    icon: "success",
                                    confirmButtonText: "OK"
                                });
                            })
                                .catch((error) =>
                                {
                                    console.error(error);
                                    Swal.fire({
                                        title: "Erreur",
                                        text: "Une erreur est survenue.",
                                        icon: "error",
                                        confirmButtonText: "OK"
                                    });
                                });
                        }
                    })
                }
                return error;
            });
    }

    logout()
    {
        Cookies.remove("jwt");
        window.location.href = "/";
    }

    register(email, password)
    {
        return this.api.post("/auth/local/register", {
            email,
            password
        });
    }

    isAuthenticated()
    {
        return !!Cookies.get("jwt");
    }

    getUser(jwt)
    {
        if (!jwt)
        {
            jwt = Cookies.get("jwt") || "";
        }
        return this.api.get("/users/me", {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        }).then((user) =>
        {
            const id = user.data.id;
            if (user.role && user.role.name === "Admin")
            {
                this.setAdmin(true);
                return this.api.get(`/users/${id}?populate=*`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                }).then((user) =>
                {
                    return user.data;
                })
                    .catch((error) =>
                    {
                        console.error(error);
                        return error;
                    });
            }
            this.setAdmin(false);
            return user.data;
        })
            .catch((error) =>
            {
                console.error(error);
                return error;
            });
    }

    setAdmin(bool)
    {
        Cookies.set("isAdmin", bool);
    }

    isAdmin()
    {
        return Cookies.get("isAdmin");
    }

    checkPassword(password)
    {
        return this.getUser().then((user) =>
        {
            return this.login(user.email, password).then((response) =>
            {
                if (response.jwt)
                {
                    return true;
                }
                return response.response.data;
            });
        });
    }

    updatePassword(currentPassword, password, passwordConfirmation)
    {
        return this.api.post(`/auth/change-password`, {
            password: password,
            passwordConfirmation: passwordConfirmation,
            currentPassword: currentPassword
        }).then(response =>
        {
            return response.data;
        })
    }
}
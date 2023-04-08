import React from "react"
import Container from "../components/Container"
import Auth from "../lib/Auth"
import Loader from "../components/Loader"
import Users from "../lib/Users";
import Toast from "../lib/Toast";
import Swal from 'sweetalert2/dist/sweetalert2.js'

export default class Profile extends React.Component
{
    constructor(props)
    {
        super(props);
        this.auth = new Auth();
        this.users = new Users();

        this.state = {
            user: null,
            loading: true
        }
    }

    componentDidMount()
    {
        this.populate();
    }

    populate()
    {
        this.auth.getUser().then(user =>
        {
            this.setState({ user: user });

            this.firstName = user.firstName;
            this.lastName = user.lastName;
            this.email = user.email;

            this.userInitials = this.firstName.charAt(0) + this.lastName.charAt(0);

            this.setState({ loading: false });
        });
    }

    modifyProfile()
    {
        Swal.fire({
            title: "Modifier mon profil",
            html: `
                <div class="flex flex-col items-center justify-center" id="modify-password-modal">
                    <div class="flex flex-col items-center justify-center w-24 h-24 rounded-full bg-gray-200 text-gray-600 text-2xl font-bold">
                        ${this.userInitials}
                    </div>
                    <div class="flex flex-col items-center justify-center mt-4">
                        <h1 class="text-2xl font-bold">${this.firstName} ${this.lastName}</h1>
                        <p class="text-gray-600">${this.email}</p>
                    </div>
                </div>
                <div class="flex flex-col items-center justify-center mt-4">
                    <input type="text" id="modify-first-name" class="input input-bordered" placeholder="Prénom" value="${this.firstName}" />
                    <input type="text" id="modify-last-name" class="input input-bordered mt-2" placeholder="Nom" value="${this.lastName}" />
                    <input type="email" id="modify-email" class="input input-bordered mt-2" placeholder="Adresse email" value="${this.email}" />
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: "Modifier",
            cancelButtonText: "Annuler",
            focusConfirm: false,
            allowOutsideClick: false,
            preConfirm: () =>
            {
                try
                {
                    this.firstName = document.querySelector("#modify-first-name").value;
                    this.lastName = document.querySelector("#modify-last-name").value;
                    this.email = document.querySelector("#modify-email").value;
                }
                catch (e)
                {
                    new Toast("Une erreur est survenue, veuillez réessayer.", "error");
                    console.error(e);
                    throw new Error(e);
                }
            }
        }).then((result) =>
        {
            if (result.isConfirmed)
            {
                this.users.update(this.state.user.id, {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email
                }).then(() =>
                {
                    this.populate();
                    new Toast("Votre profil a été mis à jour !", "success");
                })
            }
        })

    }

    modifyPassword()
    {
        Swal.fire({
            title: "Modifier mon mot de passe",
            html: `
                <div class="flex flex-col items-center justify-center" id="modify-password-modal">
                    <div class="flex flex-col items-center justify-center w-24 h-24 rounded-full bg-gray-200 text-gray-600 text-2xl font-bold">
                        ${this.userInitials}
                    </div>
                    <div class="flex flex-col items-center justify-center mt-4">
                        <h1 class="text-2xl font-bold">${this.firstName} ${this.lastName}</h1>
                        <p class="text-gray-600">${this.email}</p>
                    </div>
                </div>
                <div class="flex flex-col items-center justify-center mt-4">
                    <input type="password" id="modify-password" class="input input-bordered" placeholder="Mot de passe actuel" autofocus autoComplete="current-password"/>
                    <input type="password" id="modify-new-password" class="input input-bordered mt-2" placeholder="Nouveau mot de passe" autoComplete="new-password"/>
                    <input type="password" id="modify-new-password-confirm" class="input input-bordered mt-2" placeholder="Confirmer le nouveau mot de passe" autoComplete="new-password"/>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: "Modifier",
            cancelButtonText: "Annuler",
            focusConfirm: false,
            allowOutsideClick: false,
            preConfirm: () =>
            {
                this.validationMessage = "";
                try
                {
                    this.password = document.querySelector("#modify-password").value;
                    this.newPassword = document.querySelector("#modify-new-password").value;
                    this.newPasswordConfirm = document.querySelector("#modify-new-password-confirm").value;

                    if (this.password === "" || this.newPassword === "" || this.newPasswordConfirm === "")
                    {
                        this.validationMessage = "Veuillez remplir tous les champs.";
                        throw new Error(this.validationMessage);
                    }

                    if (this.newPassword !== this.newPasswordConfirm)
                    {
                        this.validationMessage = "Les mots de passe ne correspondent pas.";
                        throw new Error(this.validationMessage);
                    }

                    return this.auth.updatePassword(this.password, this.newPassword, this.newPasswordConfirm).then((response) =>
                    {
                        if (response.status === 200)
                        {
                            this.populate();
                            new Toast("Votre mot de passe a été mis à jour !", "success");
                        }
                    })
                        .catch((e) =>
                        {
                            console.error(e);
                            this.validationMessage = e.response.data.error.message
                            Swal.showValidationMessage(
                                this.validationMessage || "Une erreur est survenue, veuillez réessayer."
                            )
                        });
                }
                catch (e)
                {
                    new Toast("Une erreur est survenue, veuillez réessayer.", "error");
                    Swal.showValidationMessage(
                        this.validationMessage || "Une erreur est survenue, veuillez réessayer."
                    )
                }
            }
        }).then((result) =>
        {
            if (result.isConfirmed)
            {
                new Toast("Votre mot de passe a été mis à jour !", "success")
            }
        }
        )
    }

    deleteAccount()
    {
        // TODO
    }

    render()
    {
        return (
            <Container>
                {this.state.loading ? (
                    <Loader />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-200 text-gray-600 text-2xl font-bold">
                            {this.userInitials}

                        </div>
                        <div className="flex flex-col items-center justify-center mt-4">
                            <h1 className="text-2xl font-bold">{this.firstName} {this.lastName}</h1>
                            <p className="text-gray-600">{this.email}</p>
                        </div>

                        <div className="flex flex-col items-center justify-center mt-4">
                            <button className="btn btn-primary" onClick={() => this.modifyProfile()}>Modifier mon profil</button>
                            <button className="btn btn-primary mt-2" onClick={() => this.modifyPassword()}>Modifier mon mot de passe</button>
                            <button className="btn btn-primary mt-2" onClick={() => this.deleteAccount()}>Supprimer mon compte</button>
                        </div>
                    </div>
                )}
            </Container>
        )
    }
}
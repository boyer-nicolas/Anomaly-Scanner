import React from "react"
import Container from "../components/Container"
import Auth from "../lib/Auth"
import Loader from "../components/Loader"
import Users from "../lib/Users"
import Roles from "../lib/Roles"
import
{
    BiLockAlt,
    BiTrashAlt,
    BiSave
} from "react-icons/bi"
import Swal from 'sweetalert2/dist/sweetalert2.js'
import classNames from "classnames"
import Options from "../lib/Options"
import Toast from "../lib/Toast"
export default class Settings extends React.Component
{
    constructor(props)
    {
        super(props);
        this.auth = new Auth();

        this.state = {
            user: null,
            loading: true,
            hasConfirmedPassword: true,
            users: {},
            roles: {},
            adminEmail: "service-qualité@michelin.fr",
            adminUser: {},
            qualityServiceEmail: "service-qualité@michelin.fr"
        }

        this.users = new Users();
        this.roles = new Roles();
        this.options = new Options();

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

            this.users.getAll().then(users =>
            {
                this.setState({ users: users })
                this.roles.getAll().then(roles =>
                {
                    this.setState({ roles: roles })

                    this.options.getAll().then(options =>
                    {
                        this.setState({
                            adminEmail: options.adminEmail,
                            adminUser: options.adminUser,
                            qualityServiceEmail: options.qualityServiceEmail,
                            loading: false
                        })
                    });

                });
            });
        });
    }

    promptForPassword()
    {
        return Swal.fire({
            title: 'Mot de passe',
            input: 'password',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Valider',
            showLoaderOnConfirm: true,
            preConfirm: (password) =>
            {
                if (!password)
                {
                    Swal.showValidationMessage(
                        `Veuillez saisir votre mot de passe`
                    )
                    return;
                }
                return this.auth.checkPassword(password).then(response =>
                {
                    if (response.error)
                    {
                        Swal.showValidationMessage(
                            response.error.message
                        )
                        return;
                    }
                    return response;
                })
                    .catch(error =>
                    {
                        Swal.showValidationMessage(
                            `Erreur: ${error}`
                        )
                    })
            }
        }).then((result) =>
        {
            if (result.isConfirmed)
            {
                this.setState({ hasConfirmedPassword: true });
                Swal.fire({
                    title: 'Mot de passe correct',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                })

                return true;
            }
        }
        )
            .catch(error =>
            {
                Swal.fire({
                    title: 'Erreur',
                    text: error,
                    icon: 'error',
                    confirmButtonText: 'Fermer'
                })

                return false;
            });
    }

    updateAdminEmail(e)
    {
        this.setState({ adminEmail: e.target.value });
    }

    updateQualityServiceEmail(e)
    {
        this.setState({ qualityServiceEmail: e.target.value });
    }

    updateAdminUser(e)
    {
        this.setState({ adminUser: e.target.value });
    }

    findMatchingRole(roleID)
    {
        const roles = this.state.roles;
        for (let i = 0; i < roles.length; i++)
        {
            if (roles[i].id == roleID)
            {
                return roles[i];
            }
        }
        return null;
    }

    updateUserRole(e, user)
    {
        const roleID = e.target.value;
        const userID = user.id;

        let matchingRole = this.findMatchingRole(roleID);

        if (matchingRole !== null)
        {
            user.role = matchingRole;

            const users = this.state.users;
            for (let i = 0; i < users.length; i++)
            {
                if (users[i].id == userID)
                {
                    users[i] = user;
                    this.setState({ users: users });
                    break;
                }
            }

        }
        else
        {
            throw new Error("Role " + roleID + " not found");
        }
    }

    saveSettings()
    {
        this.setState({ loading: true });
        this.options.saveAll({
            adminEmail: this.state.adminEmail,
            adminUser: this.state.adminUser,
            qualityServiceEmail: this.state.qualityServiceEmail
        }).then(response =>
        {
            if (response.error)
            {
                Toast.error(response.error.message);
                return;
            }
            new Toast("Les paramètres ont été sauvegardés.", "success");

            this.users.updateAll(this.state.users).then(response =>
            {
                this.setState({ loading: false });
                if (response.error)
                {
                    Swal.fire({
                        title: 'Erreur',
                        text: response.error.message,
                        icon: 'error',
                        confirmButtonText: 'Fermer'
                    })
                    return;
                }
                else
                {
                    new Toast("Les utilisateurs ont été mis à jour.", "success");
                    this.populate();
                }
            });
        });
    }

    render()
    {
        return (
            <Container>
                <div className="my-5 flex justify-between w-full">
                    <h1 className="text-2xl font-bold">Paramètres de l'application</h1>
                    {this.state.hasConfirmedPassword ? (
                        <button className="btn btn-sm btn-success" onClick={(e) => this.saveSettings(e)}>
                            Sauvegarder
                            <BiSave width={24} className="ml-2" />
                        </button>
                    ) : (
                        <button className="btn btn-sm btn-warning" onClick={(e) => this.promptForPassword(e)}>
                            Déverrouiller
                            <BiLockAlt width={24} className="ml-2" />
                        </button>
                    )}
                </div>
                <hr className="mb-5" />
                {
                    this.state.loading ? (
                        <Loader />
                    ) : (
                        <fieldset disabled={!this.state.hasConfirmedPassword}>
                            <section>
                                <h2 className="text-xl font-semibold mb-3">Administration</h2>
                                <div className="form-control w-full max-w-lg mb-3">
                                    <label className="label">
                                        <span className="label-text">Email d'adminisatration de l'application</span>
                                    </label>
                                    <input onChange={(e) => this.updateAdminEmail(e)} type="email" placeholder="exemple@exemple.fr" value={this.state.adminEmail} className="input input-bordered w-full max-w-lg" />
                                </div>

                                <div className="form-control w-full max-w-lg mb-3">
                                    <label className="label">
                                        <span className="label-text">Email du service qualité</span>
                                    </label>
                                    <input onChange={(e) => this.updateQualityServiceEmail(e)} type="email" placeholder="exemple@exemple.fr" value={this.state.qualityServiceEmail} className="input input-bordered w-full max-w-lg" />
                                </div>

                                <div className="form-control w-full max-w-lg mb-3">
                                    <label className="label">
                                        <span className="label-text">Administrateur principal</span>
                                    </label>
                                    <select className="select select-bordered" onChange={(e) => this.updateAdminUser(e)}>
                                        {this.state.users.map((user, index) =>
                                            <option readOnly selected={user.id == this.state.adminUser.id} key={index} value={user.id}>{user.firstName} {user.lastName}</option>
                                        )}
                                    </select>
                                </div>
                            </section>
                            <hr className="mb-5" />
                            <section className="max-w-sm sm:max-w-sm md:max-w-full mx-auto">
                                <div className="w-full flex justify-between mb-3">
                                    <h2 className="text-xl font-semibold">Utilisateurs</h2>
                                    <button className="btn btn-primary">
                                        Nouveau
                                    </button>
                                </div>
                                <div className="overflow-x-auto rounded" style={{
                                    overflowX: "auto"
                                }}>
                                    <table className="table w-full">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Prénom</th>
                                                <th>Nom</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.users.map((user, index) =>
                                                <tr key={index} className="hover">
                                                    <td>{user.id}</td>
                                                    <td>{user.firstName}</td>
                                                    <td>{user.lastName}</td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                        <select onChange={(e) => this.updateUserRole(e, user)} className="select select-bordered">
                                                            {this.state.roles.map((role, index) =>
                                                                <option
                                                                    readOnly
                                                                    value={role.id}
                                                                    selected={
                                                                        role.id == user.role.id ? true : false
                                                                    }
                                                                    key={index}
                                                                >
                                                                    {role.name}
                                                                </option>
                                                            )}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <button className={classNames("btn btn-sm btn-error text-white flex", !this.state.hasConfirmedPassword && "btn-disabled")} onClick={(e) => this.deleteUser(e)}>
                                                            Supprimer
                                                            <BiTrashAlt width={24} className="ml-2" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </fieldset>
                    )
                }
            </Container>
        )
    }
}
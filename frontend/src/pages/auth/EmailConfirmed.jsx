import React from "react"
import { NavLink } from "react-router-dom";

export default class EmailConfirmed extends React.Component
{
    constructor(props)
    {
        super(props);

    }

    componentDidMount()
    {

    }

    render()
    {
        return (
            <div className="container xl:w-1/2 lg:w-1/2 md:w-full sm:w-full mx-auto">
                <div className="w-full">
                    <div className="flex flex-col">
                        <h1 className="text-5xl font-bold">
                            Votre compte est désormais actif.
                        </h1>
                        <p className="my-5">
                            Vous pouvez maintenant vous connecter.
                        </p>
                        <NavLink to="/" className="btn btn-primary">Connexion</NavLink>
                    </div>
                </div>
            </div>
        )
    }
}
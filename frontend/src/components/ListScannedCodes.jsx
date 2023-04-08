import React from "react";
import Barcode from "../lib/Barcode.js";
import { Link } from "react-router-dom";
import { BiScan, BiSend } from "react-icons/bi";
import Swal from 'sweetalert2/dist/sweetalert2.js';

export default class ListScannedCodes extends React.Component
{
    constructor(props)
    {
        super(props);

        this.barcode = new Barcode();
        this.state = {
            barcodes: this.barcode.getAll()
        }
        this.showButton = props.showButton || false;
    }

    deleteScannedCode(barcode)
    {
        console.log(barcode);
        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: "Vous ne pourrez pas revenir en arrière !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        }).then((result) =>
        {
            if (result.isConfirmed)
            {
                this.delete(barcode);
                Swal.fire(
                    'Supprimé !',
                    'L\'anomalie a été supprimée.',
                    'success'
                )
            }
        })
    }

    delete(barcode)
    {
        this.barcode.remove(barcode);
        this.setState({
            barcodes: this.barcode.getAll()
        })
    }

    render()
    {
        return (

            this.state.barcodes.length > 0 ?
                (
                    <>
                        <p className="py-6">
                            Vous avez {this.state.barcodes.length} pneus en anomalie scannés.
                        </p>
                        <div className="overflow-x-auto mb-5">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>Numéro</th>
                                        <th>Identifiant</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.barcodes.map((barcode, index) =>
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{barcode}</td>
                                            <td>
                                                <button className="btn btn-error btn-sm text-white" onClick={() => this.deleteScannedCode(barcode)}>Supprimer</button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {this.showButton &&
                            (
                                <Link to='/scan/envoi' className="btn btn-primary w-full">
                                    <span className='mr-2'>Envoyer au service qualité</span>
                                    <BiSend size={24} />
                                </Link>
                            )}
                    </>
                )
                :
                (
                    <>
                        <p className="py-6">
                            Vous n'avez aucun pneu scanné pour le moment.
                            Pour commencer, cliquez sur le bouton ci-dessous.
                        </p>
                        <Link to='/scan' className="btn btn-primary">
                            <span className='mr-2'>Nouveau Scan</span>
                            <BiScan size={24} />
                        </Link>
                    </>
                )
        )
    }
}
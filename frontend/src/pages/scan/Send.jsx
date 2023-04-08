import React from "react";
import Container from "../../components/Container";
import ListScannedCodes from "../../components/ListScannedCodes";
import Barcode from '../../lib/Barcode';
import Loader from "../../components/Loader";
import Swal from 'sweetalert2/dist/sweetalert2.js'

export default class SendScannedCodes extends React.Component
{
    constructor(props)
    {
        super(props);
        this.barcode = new Barcode();
        this.state = {
            barcodes: this.barcode.getAll(),
            loading: true
        }
    }

    componentDidMount()
    {
        document.title = 'MTAS - Envoi';

        this.setState({
            loading: false
        })
    }

    sendScannedCodes()
    {
        Swal.fire({
            title: 'Confirmation',
            text: "Voulez-vous vraiment envoyer les codes scannés ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, envoyer !'
        }).then((result) =>
        {
            if (result.isConfirmed)
            {
                this.barcode.sendAll();
                Swal.fire(
                    'Envoyé !',
                    'Les codes scannés ont bien été envoyés.',
                    'success'
                )
            }
        })
    }

    render()
    {
        return (
            this.state.loading ? (
                <Loader />
            ) : (
                <Container>
                    <div className="text-center">
                        <ListScannedCodes showButton={false} />
                        {this.state.barcodes.length > 0 && (
                            <button className="btn btn-primary w-full" onClick={() => this.sendScannedCodes()}>Confirmer l'envoi</button>
                        )}
                    </div>
                </Container>
            )
        )
    }
}
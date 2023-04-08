import React from 'react'
import Barcode from '../../lib/Barcode';
import Container from "../../components/Container.jsx";
import Quagga from 'quagga';
import Swal from 'sweetalert2';
import Toast from "../../lib/Toast"

export default class Scan extends React.Component
{
    constructor(props)
    {
        super(props);

        this.barcode = new Barcode();
        this.state = {
            isLoading: true,
            barcodes: this.barcode.getAll(),
            loadingMessage: "Chargement...",
        }
    }

    componentDidMount()
    {
        document.title = 'MTAS - Scanner';

        try
        {
            this.startScanner();
        }
        catch (error)
        {
            this.setState({
                error: true,
                errorMessage: error.message,
            })
        }
    }

    startScanner()
    {
        const self = this;
        Quagga.init({
            inputStream: {
                name: "Scanner",
                type: "LiveStream",
                target: document.querySelector('#barcode-scanner')
            },
            decoder: {
                readers: ["code_128_reader"]
            }
        }, function (err)
        {
            if (err)
            {
                console.error(err);
                self.setState({
                    error: true,
                    errorMessage: err.message,
                    isLoading: false,
                })
                return
            }
            self.setState({
                isLoading: false,
            })
            Quagga.start();

        });

        Quagga.onDetected(data => this.handleScan(data));
    }

    promptAlreadyScanned(result)
    {
        Swal.fire({
            title: 'Anomalie déjà scannée',
            text: result.codeResult.code,
            icon: 'warning',
            confirmButtonText: 'Ok',
        }).then((data) =>
        {
            this.startScanner();
        });
    }

    handleScan(result)
    {
        if (result && result.codeResult && result.codeResult.code)
        {
            Quagga.stop();

            // Check if the barcode is already scanned
            if (this.barcode.exists(result.codeResult.code))
            {
                this.promptAlreadyScanned(result);
                return;
            }

            Swal.fire({
                title: 'Voulez-vous ajouter cette anomalie ?',
                text: result.codeResult.code,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Oui',
                cancelButtonText: 'Non',
            }).then((data) =>
            {
                if (data.isConfirmed)
                {
                    this.barcode.add(result.codeResult.code);
                    this.setState({
                        barcodes: this.barcode.getAll(),
                    })
                }
                new Toast("Anomalie #" + result.codeResult.code + " ajoutée", "success");
                this.startScanner();
            });
        }
    }

    render()
    {
        return (
            <Container>

                {this.state.error &&
                    (
                        <div className="alert alert-error shadow-lg">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    className="stroke-current flex-shrink-0 h-6 w-6" fill="none"
                                    viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p>Une erreur est survenue.</p>
                                    {this.state.errorMessage &&
                                        (
                                            <p>
                                                {this.state.errorMessage}
                                            </p>
                                        )}
                                </div>
                            </div>
                        </div>
                    )}
                <div id="barcode-scanner"></div>
                {this.state.isLoading ? (
                    <div className="fixed bottom-20 right-0 w-full">
                        <button className="btn btn-primary w-1/2 mx-auto flex loading btn-disabled" disabled>
                            {this.state.loadingMessage}
                        </button>
                    </div>
                ) : !this.state.error && (
                    <>
                        <div className="w-full fixed bottom-20">
                            <button className="btn btn-primary w-1/2 mx-auto block" onClick={() => this.handleScan()}>
                                Scanner
                            </button>
                        </div>
                    </>
                )
                }
            </Container>
        )
    }
}
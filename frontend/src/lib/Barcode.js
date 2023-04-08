import React from "react";
import Swal from 'sweetalert2'

export default class BarCode extends React.Component {
    constructor(props) {
        super(props);
        if (window.localStorage.getItem("barcodes") === null) {
            window.localStorage.setItem("barcodes", JSON.stringify([]));
        }

        if (window.localStorage.getItem("queue") === null) {
            window.localStorage.setItem("queue", JSON.stringify([]));
        }

        this.state = {
            existingCodes: this.getAll(),
            queueItems: this.getQueue(),
        }
    }

    componentDidMount() {
        this.periodicScan();
    }

    periodicScan() {
        setInterval(() => {
            this.setState({
                existingCodes: this.getAll()
            })
        }, 1000);
    }

    removeAll() {
        window.localStorage.setItem("barcodes", JSON.stringify([]));
    }

    remove(code) {
        for (let i = 0; i < this.state.existingCodes.length; i++) {
            if (this.state.existingCodes[i] === code) {
                this.state.existingCodes.splice(i, 1);
                window.localStorage.setItem("barcodes", JSON.stringify(this.state.existingCodes));
                return;
            }
        }
    }

    set(code) {
        this.state.existingCodes.push(code);
        window.localStorage.setItem("barcodes", JSON.stringify(this.state.existingCodes));
    }

    exists(code) {
        for (let i = 0; i < this.state.existingCodes.length; i++) {
            if (this.state.existingCodes[i] === code) {
                return true;
            }
        }

        return false;
    }

    get(code) {
        for (let i = 0; i < this.state.existingCodes.length; i++) {
            if (this.state.existingCodes[i].code === code) {
                return this.state.existingCodes[i];
            }
        }
    }

    getQueue() {
        return JSON.parse(window.localStorage.getItem("queue"));
    }

    getAll() {
        return JSON.parse(window.localStorage.getItem("barcodes"));
    }

    add(code) {
        if (!this.exists(code)) {
            this.set(code);
        }
    }

    removeFromQueue(code) {
        for (let i = 0; i < this.state.queueItems.length; i++) {
            if (this.state.queueItems[i] === code) {
                this.state.queueItems.splice(i, 1);
                window.localStorage.setItem("queue", JSON.stringify(this.state.queueItems));
                return;
            }
        }
    }

    queue(code) {
        this.state.queueItems.push(code);
        window.localStorage.setItem("queue", JSON.stringify(this.state.queueItems));
    }

    prompt(detectedBarCode, stream) {
        return new Promise((resolve, reject) => {
            try {
                const barCodeAlreadyScanned = this.exists(detectedBarCode);

                // Stop video stream
                stream.getTracks().forEach(track => track.stop());
                if (barCodeAlreadyScanned) {
                    Swal.fire({
                        title: 'Code barre déjà scanné',
                        text: "Code: " + detectedBarCode,
                        icon: 'warning',
                        confirmButtonText: 'Ok',
                    }).then((result) => {
                        if (result) {
                            resolve(true);
                        }

                        resolve(false);
                    });

                } else {
                    this.setState({
                        isLoading: true,
                    });

                    Swal.fire({
                        title: 'Code Barre Détecté',
                        text: "Code: " + detectedBarCode,
                        icon: 'success',
                        confirmButtonText: 'Poursuivre',
                        showCancelButton: true,
                        cancelButtonText: 'Annuler',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.set(detectedBarCode);
                            resolve(true);
                        }
                        if (result) {
                            resolve(true)
                        }

                        resolve(false);
                    });
                }
            } catch (e) {
                console.error(e);
                reject(e);
            }
        });
    }

    sendAll() {
        return new Promise((resolve, reject) => {
            try {
                this.setState({
                    isLoading: true,
                });

                const barCodes = this.getAll();
                if (barCodes.length === 0) {
                    Swal.fire({
                        title: 'Aucun code barre à envoyer',
                        icon: 'warning',
                        confirmButtonText: 'Ok',
                    }).then((result) => {
                        if (result) {
                            resolve(true);
                        }

                        resolve(false);
                    });
                } else {
                    Swal.fire({
                        title: 'Envoi des codes barres',
                        text: "Voulez-vous envoyer les codes barres ?",
                        icon: 'warning',
                        confirmButtonText: 'Envoyer',
                        showCancelButton: true,
                        cancelButtonText: 'Annuler',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.removeAll();
                            resolve(true);
                        }
                        if (result) {
                            resolve(true)
                        }

                        resolve(false);
                    });
                }
            } catch (e) {
                console.error(e);
                reject(e);
            }
        });
    }
}
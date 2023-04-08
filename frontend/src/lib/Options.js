import Api from './Api'

export default class Options {
    constructor() {
        this.api = Api();
    }

    getAll() {
        return this.api.get('/options?populate=*').then(response => {
            return response.data.data[0].attributes;
        })
    }

    saveAll(options) {
        return this.api.put('/options/1', {
            data: options
        }).then(response => {
            return response.data.data.attributes;
        })
    }

    adminEmail() {
        return this.api.get('/options?populate=*').then(response => {
            return response.data.data[0].attributes.adminEmail;
        })
    }

    adminUser() {
        return this.api.get('/options?populate=*').then(response => {
            return response.data.data[0].attributes.adminUser.data.attributes;
        })
    }

    qualityServiceEmail() {
        return this.api.get('/options?populate=*').then(response => {
            return response.data.data[0].attributes.qualityServiceEmail;
        })
    }
}
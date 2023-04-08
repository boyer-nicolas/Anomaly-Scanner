import Api from './Api'

export default class Roles {
    constructor() {
        this.api = Api();
    }

    getAll() {
        return this.api.get('/users-permissions/roles?populate=*').then(response => {
            // Remove "Public" & "Authenticated" roles
            response.data.roles = response.data.roles.filter(role => {
                return role.name !== "Public" && role.name !== "Authenticated";
            });
            return response.data.roles;
        })
    }
}
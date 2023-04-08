import Api from './Api'

export default class Users
{
    constructor()
    {
        this.api = Api();
    }

    getAll()
    {
        return this.api.get('/users?populate=*').then(response =>
        {
            return response.data;
        })
    }

    get(id)
    {
        return this.api.get(`/users/${id}?populate=*`).then(response =>
        {
            return response.data;
        })
    }

    create(data)
    {
        return this.api.post('/users', data).then(response =>
        {
            return response.data;
        })
    }

    update(id, userData)
    {
        // Strip id from userData
        return this.api.put(`/users/${id}`, userData).then(response =>
        {
            return response.data;
        })
            .catch(error =>
            {
                console.error(error);
            });
    }

    updateAll(users)
    {
        return new Promise((resolve, reject) =>
        {
            let promises = [];
            users.forEach(user =>
            {
                promises.push(this.update(user.id, user));
            });
            Promise.all(promises).then((response) =>
            {
                resolve(response);
            }).catch(error =>
            {
                reject(error);
            });
        })
    }

    delete(id)
    {
        return this.api.delete(`/users/${id}`).then(response =>
        {
            return response.data;
        })
    }
}
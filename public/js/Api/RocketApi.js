
export default class RocketApi {
    static #token = localStorage.getItem('jwt_token');
    static #login = null;
    static #password = null;
    static baseUrl = '/api';
    static loginEndpoint = '/api/login';
    static logoutEndpoint = '/api/logout';
    static userEndpoint = '/api/me';
    static requestsEnabled = false;



    static configureLoginEndpoint(entryPoint, loginEndpoint, logoutEndpoint, userEndpoint) {
        //console.log('Configure loginEndpoint', loginEndpoint, logoutEndpoint, userEndpoint);
        RocketApi.baseUrl = entryPoint || RocketApi.baseUrl;
        RocketApi.loginEndpoint = loginEndpoint || RocketApi.loginEndpoint;
        RocketApi.logoutEndpoint = logoutEndpoint || RocketApi.logoutEndpoint;
        RocketApi.userEndpoint = userEndpoint || RocketApi.userEndpoint;
    }

    static getLoginEndpoint() {
        return RocketApi.loginEndpoint;
    }
    static getLogoutEndpoint() {
        return RocketApi.logoutEndpoint;
    }
    static getUserEndpoint() {
        return RocketApi.userEndpoint;
    }

    static getBaseUrl() {
        return RocketApi.baseUrl;
    }

    static init() {

    }
    static async login(email = null, password = null, redirect = null) {
        if (null === email || null === password) {
            email = RocketApi.#login;
            password = RocketApi.#password;
        }
        try {
            const response = await fetch(RocketApi.getLoginEndpoint(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/ld+json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                                                username:email,
                                                password })
            });

            if (!response.ok) {
                throw new Error('Identifiants invalides');
            }

            const data = await response.json();
            this.#login = email;
            this.#password = password;
            console.log('Login success', this.#login);
            this.setToken(data.token);
            if (null !== redirect) {
                window.location.href = redirect;
            }
            return data.token;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    static setToken(token) {
        this.#token = token;
        localStorage.setItem('jwt_token', token);
    }

    static getToken() {
        return this.#token;
    }

    static logout() {
        this.setToken(null);
    }

    static isAuthenticated() {
        return this.getToken() !== null;
    }

    static async checkIsAuthenticated(redirectOnError = null) {
        let isAuthenticated = await this.callApi(this.getUserEndpoint());
        console.log('isAuthenticated',isAuthenticated, this.getUserEndpoint());
        if (isAuthenticated.code === 401) {
            this.logout();
            if (null !== redirectOnError) {
                window.location.href = redirectOnError;
            }
            return false;
        }
        return true;
    }

    static updateHeaderBearerToken(headers) {
        return RocketApi.getAuthorizationHeader( headers)
    }

    static async fetchAutoLogin(url, initOptions = {}) {
        const response =  await fetch(url, initOptions);
        // Test if login failed
        if (response.status === 401) {
            try {
                await RocketApi.login();
                this.updateHeaderBearerToken(initOptions.headers);
                return await RocketApi.fetchAutoLogin(url, initOptions);
            } catch(error) {
                alert('Erreur lors du login. Vos credentials sont-ils corrects ?');
            }
        } else {
            return response;
        }
    }

    static async callApi(endpoint, body = null, method = 'GET') {
        const options = {
            method,
            headers: {
                'Accept': 'application/ld+json',
                'Authorization': `Bearer ${this.getToken()}`
            }
        };

        if (body !== null) {
            options.headers['Content-Type'] = 'application/ld+json';
            options.body = JSON.stringify(body);
        }

        const response = await fetch(endpoint, options);
        return await response.json();
    }

    static getAuthorizationHeader(headers = {}) {
        const token = RocketApi.getToken?.();
        if (token) {
            headers['Authorization'] = 'Bearer ' + token;
        }
        return headers;
    }

    static getHeaders(withContentType = false, withAccept = true) {
        let headers = {
            ...this.getAuthorizationHeader()};
        headers = withAccept ? { ...headers, 'Accept': 'application/ld+json' } : headers;

        return withContentType ? { ...headers, 'Content-Type': 'application/ld+json' } : headers;
    }

    static async fetchCollection(resource, queryParams = '') {
        console.log('fetchCollection', resource, queryParams);
        const url = `${this.getBaseUrl()}/${resource}${queryParams ? '?' + queryParams : ''}`;

        const response = await fetch(url, { headers:this.getHeaders() });
        //const response = await fetch(hydraId, {...this.getHeaders()});
        if (!response.ok) {
            throw new Error(`Erreur ${response.status} lors de l'appel à ${url}`);
        }

        const json = await response.json();

        //console.log('fetchCollection', json);

        const output = {
            items: json['member'] || [],
            totalItems: json['totalItems'] ?? (json['member']?.length || 0),
            raw: json
        };

        //console.log('fetchCollection', output);

        return output;
    }

    static async fetchItem(resource, id) {
        const url = `${this.getBaseUrl()}/${resource}/${id}`;

        //const response = await fetch(hydraId, { headers:this.getHeaders() });
        const response = await fetch(url, this.getHeaders());
        if (!response.ok) {
            throw new Error(`Erreur ${response.status} lors de la récupération de ${resource}/${id}`);
        }

        return await response.json();
    }

    static async create(resource, data) {
        const url = `${this.getBaseUrl()}/${resource}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: this.getHeaders(true),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error['hydra:description'] || 'Erreur lors de la création');
        }

        return await response.json();
    }

    static async update(resource, id, data) {
        const url = `${this.getBaseUrl()}/${resource}/${id}`;

        data.id = id;
        const response = await fetch(url, {
            method: 'PUT',
            headers: this.getHeaders(true),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error['hydra:description'] || 'Erreur lors de la mise à jour');
        }

        return await response.json();
    }

    static async delete(resource, id) {
        const url = `${this.getBaseUrl()}/${resource}/${id}`;

        const response = await fetch(url, {
            method: 'DELETE',
            headers: this.getHeaders(false, false)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error['hydra:description'] || 'Erreur lors de la suppression');
        }

        return true;
    }
}

window.RocketApi = RocketApi;
RocketApi.init();
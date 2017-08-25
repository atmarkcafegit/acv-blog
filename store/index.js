import axios from 'axios'

const BASE_URL = 'http://localhost:3000';

export const state = () => ({
    authUser: null,
    posts: []
});

export const mutations = {
    SET_USER: function (state, user) {
        state.authUser = user
    },
    SET_POSTS: function (state, posts) {
        state.posts = posts;
    }
};

export const actions = {
    nuxtServerInit({commit}, {req}) {
        if (req.session && req.session.authUser) {
            commit('SET_USER', req.session.authUser)
        }
    },
    LOGIN({commit}, {username, password}) {
        return axios.post(`${BASE_URL}/login`, {
            username,
            password
        }).then((res) => {
            commit('SET_USER', res.data)
        });
    },
    LOGOUT({commit}) {
        return axios.post(`${BASE_URL}/logout`)
            .then(() => {
                commit('SET_USER', null)
            })
    },
    REGISTER({}, {username, password, email}) {
        return axios.post(`${BASE_URL}/register`, {
            username,
            password,
            email
        })
    },
    GET_POSTS({commit}) {
        return axios.get(`${BASE_URL}/api/posts`)
            .then(response => {
                commit('SET_POSTS', response.data);
            });
    }
};

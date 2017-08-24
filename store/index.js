import axios from 'axios'

export const state = () => ({
    authUser: null,
    posts: []
});

export const mutations = {
    SET_USER: function (state, user) {
        state.authUser = user
    },
    SET_POST_LIST: function (state, posts) {
        state.posts = posts;
    }
};

export const actions = {
    nuxtServerInit({commit}, {req}) {
        if (req.session && req.session.authUser) {
            commit('SET_USER', req.session.authUser)
        }
    },
    login({commit}, {username, password}) {
        return axios.post('/api/login', {
            username,
            password
        }).then((res) => {
            commit('SET_USER', res.data)
        })
            .catch((error) => {
                if (error.response.status === 401) {
                    throw new Error('Bad credentials')
                }
            })
    },
    logout({commit}) {
        return axios.post('/api/logout')
            .then(() => {
                commit('SET_USER', null)
            })
    },
    SET_POST_LIST({commit}) {
        return axios.get('http://localhost:3000/api/posts')
            .then(response => {
                commit('SET_POST_LIST', response.data);
            });
    }
};

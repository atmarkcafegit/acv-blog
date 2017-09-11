import axios from 'axios'

const BASE_URL = 'http://localhost:3000';

export const state = () => ({
    authUser: null,
    posts: [],
    post: {},
    lastRoute: '/',
    comments: [],
    authors: []
});

export const mutations = {
    SET_USER: function (state, user) {
        state.authUser = user
    },
    SET_POSTS: function (state, posts) {
        state.posts = posts;
    },
    SET_POST: function (state, post) {
        state.post = post;
    },
    SET_COMMENTS: function (state, comments) {
        state.comments = comments;
    },
    SET_HOT_AUTHORS: function (state, authors) {
        state.authors = authors;
    },
    SET_HOT_POSTS: function (state, posts) {
        state.hotPosts = posts;
    },
    SET_LAST_ROUTE: function (state, route) {
        state.lastRoute = route;
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
            if (res.data.ok)
                commit('SET_USER', res.data.user)
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
    GET_POSTS({commit}, page) {
        return axios.get(`${BASE_URL}/api/posts/${page ? page : ''}`)
            .then(response => {
                if (response.data.ok)
                    commit('SET_POSTS', response.data.posts);
            });
    },
    GET_POST({commit}, slug) {
        return axios.get(`${BASE_URL}/api/post/${slug}`)
            .then(response => {
                if (response.data.ok) {
                    commit('SET_POST', response.data.post);
                    commit('SET_COMMENTS', response.data.post.comments);
                }
            });
    },
    ADD_COMMENT({commit, state}, comment) {
        return axios.post(`${BASE_URL}/api/post/comment`, comment)
            .then(response => {
                if (response.data.ok) {
                    let comment = response.data.comment;
                    comment.user = state.authUser;

                    let comments = state.comments.slice();
                    comments.push(response.data.comment);

                    commit('SET_COMMENTS', comments);
                }
            });
    },
    DELETE_COMMENT({commit, state}, commentId) {
        return axios.delete(`${BASE_URL}/api/post/comment/${commentId}`)
            .then(response => {
                if (response.data.ok) {
                    let comments = state.comments.filter(item => {
                        return item._id !== commentId
                    });

                    commit('SET_COMMENTS', comments)
                }
            });
    },
    GET_HOT_AUTHORS({commit}) {
        return axios.get(`${BASE_URL}/api/hot-authors`)
            .then(response => {
                if (response.data.ok)
                    commit('SET_HOT_AUTHORS', response.data.authors);
            });
    },
    GET_HOT_POSTS({commit}) {
        return axios.get(`${BASE_URL}/api/hot-posts`)
            .then(response => {
                if (response.data.ok)
                    commit('SET_HOT_POSTS', response.data.posts);
            });
    }
};

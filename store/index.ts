import axios from 'axios'
import * as _ from 'lodash'

const BASE_URL = process.env.baseUrl;

export const state = () => ({
    authUser: null,
    posts: [],
    post: {},
    lastRoute: '/',
    comments: [],
    hotPosts: [],
    hotTags: [],
    tags: [],
    tagPosts: [],
    authors: []
});

export const mutations = {
    SET_USER: function (state, user) {
        state.authUser = user
    },
    SET_POSTS: function (state, posts) {
        state.posts = posts;
    },
    REMOVE_POST(state, post) {
        let cp =  state.posts.docs.indexOf(post);
        state.posts.docs.splice(cp, 1);
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
    SET_HOT_TAGS: function (state, tags) {
        state.hotTags = tags;
    },
    SET_TAGS(state, tags) {
        state.tags = tags;
    },
    SET_TAG_POSTS: function (state, posts) {
        state.tagPosts = posts;
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
    ADD_POST({}, post) {
        return axios.post(`${BASE_URL}/api/post`, post);
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
    UPDATE_POST({}, {slug, title, content, tags}) {
        return axios.put(`${BASE_URL}/api/post/${slug}`, {
            title: title,
            content: content,
            tags: tags
        });
    },
    DELETE_POST({commit, state}, slug) {
        return axios.delete(`${BASE_URL}/api/post/${slug}`).then(() => {
            let cp = _.find(state.posts.docs, item => {
                return (item as any).slug === slug
            });

            commit('REMOVE_POST', cp)
        })
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
    },
    GET_HOT_TAGS({commit}) {
        return axios.get(`${BASE_URL}/api/hot-tags`)
            .then(response => {
                if (response.data.ok)
                    commit('SET_HOT_TAGS', response.data.tags);
            });
    },
    GET_TAGS({commit}) {
        return axios.get(`${BASE_URL}/api/tags`)
            .then(response => {
                if (response.data.ok)
                    commit('SET_TAGS', response.data.tags);
            });
    },
    GET_TAG_POSTS({commit}, tag) {
        return axios.get(`${BASE_URL}/api/tag-posts/${tag}`)
            .then(response => {
                if (response.data.ok)
                    commit('SET_TAG_POSTS', response.data.posts);
            });
    }
};

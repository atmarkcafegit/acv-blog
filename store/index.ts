import axios from '../plugins/axios'
import * as _ from 'lodash'

export const state = () => ({
    authUser: null,
    user: null,
    users: [],
    posts: [],
    post: {},
    lastRoute: '/',
    comments: [],
    hotPosts: [],
    hotTags: [],
    tags: [],
    tagPosts: [],
    authors: [],
    liked: false
});

export const mutations = {
    SET_USER(state, user) {
        state.authUser = user
    },
    SET_POSTS(state, posts) {
        state.posts = posts;
    },
    REMOVE_POST(state, post) {
        let cp = state.posts.docs.indexOf(post);
        state.posts.docs.splice(cp, 1);
    },
    SET_POST(state, post) {
        state.post = post;
    },
    SET_COMMENTS(state, comments) {
        state.comments = comments;
    },
    SET_HOT_AUTHORS(state, authors) {
        state.authors = authors;
    },
    SET_HOT_POSTS(state, posts) {
        state.hotPosts = posts;
    },
    SET_HOT_TAGS(state, tags) {
        state.hotTags = tags;
    },
    SET_TAGS(state, tags) {
        state.tags = tags;
    },
    SET_TAG_POSTS(state, posts) {
        state.tagPosts = posts;
    },
    SET_LAST_ROUTE(state, route) {
        state.lastRoute = route;
    },
    SET_LIKED(state, liked) {
        state.liked = liked;
    }
};

export const actions = {
    nuxtServerInit({commit}, {req}) {
        if (req.session && req.session.authUser) {
            commit('SET_USER', req.session.authUser)
        }
    },
    LOGIN({commit}, {username, password}) {
        return axios.post(`/login`, {
            username,
            password
        }).then((res) => {
            if (res.data.ok)
                commit('SET_USER', res.data.user)
        });
    },
    LOGOUT({commit}) {
        return axios.post(`/logout`)
            .then(() => {
                commit('SET_USER', null)
            })
    },
    REGISTER({}, {username, password, email}) {
        return axios.post(`/register`, {
            username,
            password,
            email
        })
    },
    GET_POSTS({commit}, page) {
        return axios.get(`/api/posts/${page ? page : ''}`)
            .then(response => {
                if (response.data.ok)
                    commit('SET_POSTS', response.data.posts);
            });
    },
    ADD_POST({}, post) {
        return axios.post(`/api/post`, post);
    },
    GET_POST({commit, state}, slug) {
        return axios.get(`/api/post/${slug}`)
            .then(response => {
                if (response.data.ok) {
                    commit('SET_POST', response.data.post);
                    commit('SET_COMMENTS', response.data.post.comments);

                    let voteUser = _.find(response.data.post.votes, u => {
                        return u === state.authUser._id;
                    });

                    if (voteUser) {
                        commit('SET_LIKED', true)
                    } else {
                        commit('SET_LIKED', false)
                    }
                }
            });
    },
    UPDATE_POST({}, {slug, title, content, tags}) {
        return axios.put(`/api/post/${slug}`, {
            title: title,
            content: content,
            tags: tags
        });
    },
    DELETE_POST({commit, state}, slug) {
        return axios.delete(`/api/post/${slug}`).then(() => {
            let cp = _.find(state.posts.docs, item => {
                return (item as any).slug === slug
            });

            commit('REMOVE_POST', cp)
        })
    },
    ADD_COMMENT({commit, state}, comment) {
        return axios.post(`/api/post/comment`, comment)
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
        return axios.delete(`/api/post/comment/${commentId}`)
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
        return axios.get(`/api/hot-authors`)
            .then(response => {
                if (response.data.ok)
                    commit('SET_HOT_AUTHORS', response.data.authors);
            });
    },
    GET_HOT_POSTS({commit}) {
        return axios.get(`/api/hot-posts`)
            .then(response => {
                if (response.data.ok)
                    commit('SET_HOT_POSTS', response.data.posts);
            });
    },
    GET_HOT_TAGS({commit}) {
        return axios.get(`/api/hot-tags`)
            .then(response => {
                if (response.data.ok)
                    commit('SET_HOT_TAGS', response.data.tags);
            });
    },
    GET_TAGS({commit}) {
        return axios.get(`/api/tags`)
            .then(response => {
                if (response.data.ok)
                    commit('SET_TAGS', response.data.tags);
            });
    },
    GET_TAG_POSTS({commit}, tag) {
        return axios.get(`/api/tag-posts/${tag}`)
            .then(response => {
                if (response.data.ok)
                    commit('SET_TAG_POSTS', response.data.posts);
            });
    },
    LIKE({commit}, data) {
        return axios.post(`/api/post/vote`, data)
            .then(response => {
                if (response.data.ok) {
                    commit('SET_LIKED', true);
                }
            })
    },
    UNLIKE({commit}, data) {
        return axios.post(`/api/post/unvote`, data)
            .then(response => {
                if (response.data.ok) {
                    commit('SET_LIKED', false);
                }
            })
    }
};

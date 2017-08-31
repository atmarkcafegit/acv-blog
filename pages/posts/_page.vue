<template>
    <div class="container">
        <div class="row">
            <div class="col-md-8">
                <nuxt-link v-if="isLogged" class="btn btn-default" to="/post/new">New Post</nuxt-link>
            </div>
        </div>
        <div class="row" style="margin-top: 5px" >
            <div class="col-md-8">
                <div v-for="post, index in posts" class="panel panel-default">
                    <div class="panel-body">
                        <router-link :to="{path: '/post/' + post.slug}">
                            <h4 class="title"> {{post.title}}</h4>
                        </router-link>
                        <br>
                        <span class="user">Author: {{post.user.username}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" v-if="!!posts && posts.length > 0">
            <div class="col-md-8 text-center">
                <ul class="pagination">
                    <li>
                        <router-link :to="{path: '/posts/' + (postsInfo.page > 1? parseInt(postsInfo.page) - 1: 1)}">
                            <i class="fa fa-angle-left"></i>
                        </router-link>
                    </li>
                    <li v-if="postsInfo.page !== 1">
                        <router-link :to="{path: '/posts/1'}">1</router-link>
                    </li>
                    <li v-if="postsInfo.page - 2 > 1">
                        <a>...</a>
                    </li>
                    <li v-for="p in getRange(postsInfo.page - 2, postsInfo.page - 1)" v-if="p > 1">
                        <router-link :to="{path: '/posts/' + p }">{{p}}</router-link>
                    </li>
                    <li class="active">
                        <a>{{postsInfo.page}}</a>
                    </li>
                    <li v-for="p in getRange(postsInfo.page + 1, postsInfo.page + 2)" v-if="p < postsInfo.pages">
                        <router-link :to="{path: '/posts/' + p }">{{p}}</router-link>
                    </li>
                    <li v-if="postsInfo.pages - 2 > postsInfo.page">
                        <a>...</a>
                    </li>
                    <li v-if="postsInfo.page !== postsInfo.pages">
                        <router-link :to="{path: '/posts/' + postsInfo.pages}">{{postsInfo.pages}}</router-link>
                    </li>
                    <li>
                        <router-link
                                :to="{path: '/posts/' + (postsInfo.page < postsInfo.pages ? parseInt(postsInfo.page) + 1: postsInfo.pages) }">
                            <i class="fa fa-angle-right"></i>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        fetch({store, route}) {
            return store.dispatch('GET_POSTS', route.params.page ? parseInt(route.params.page) : null)
                .catch(() => {
                });
        },
        computed: {
            posts() {
                return this.$store.state.posts.docs;
            },
            postsInfo() {
                return this.$store.state.posts;
            },
            isLogged: function () {
                return !!this.$store.state.authUser;
            }
        },
        methods: {
            isPageActive(page) {
                return this.$store.state.posts.page === page;
            },
            getRange(start, end) {
                let array = [],
                    j = 0;

                for (let i = start; i <= end; i++) {
                    array[j] = i;
                    j++;
                }

                return array;
            }
        }
    }
</script>
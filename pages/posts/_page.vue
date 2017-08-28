<template>
    <div class="container">
        <div class="row">
            <div class="col-md-8">
                <nuxt-link v-if="isLogged" class="btn btn-default" to="/newpost">New Post</nuxt-link>
            </div>
        </div>
        <div class="row" style="margin-top: 5px">
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
        <div class="row">
            <div class="col-md-8 text-center">
                <ul class="pagination">
                    <li>
                        <a>
                            <i class="fa fa-angle-left"></i>
                        </a>
                    </li>
                    <li v-for="p in postsInfo.pages" :class="{active: isPageActive(p)}">
                        <router-link :to="{path: '/posts/' + p }">{{p}}</router-link>
                    </li>
                    <li>
                        <a>
                            <i class="fa fa-angle-right"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        fetch({store, route}) {
            return store.dispatch('GET_POSTS', route.params.page ? parseInt(route.params.page) : null);
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
            }
        }
    }
</script>
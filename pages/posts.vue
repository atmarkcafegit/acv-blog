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
    </div>
</template>
<script>
    export default {
        fetch({store}) {
            return store.dispatch('GET_POSTS');
        },
        computed: {
            posts() {
                return this.$store.state.posts.docs;
            },
            isLogged: function () {
                return !!this.$store.state.authUser;
            }
        }
    }
</script>
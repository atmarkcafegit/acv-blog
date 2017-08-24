<template>
    <div class="container">
        <nav class="navbar navbar-default">
            <div class="navbar-header">
                <nuxt-link to="/">
                    <img class="logo" src="/logo.png" alt="logo">
                </nuxt-link>
            </div>
            <ul class="nav navbar-nav">
                <nuxt-link tag="li" to="/posts">
                    <a>Posts</a>
                </nuxt-link>

                <nuxt-link tag="li" to="/tags">
                    <a>Tags</a>
                </nuxt-link>
            </ul>

            <nuxt-link v-if="!$store.state.authUser && $route.fullPath!=='/login'"
                       class="btn btn-default btn-login" to="/login">Login
            </nuxt-link>
            <a v-if="$store.state.authUser" class="btn btn-default btn-login" @click="logout()">
                Logout
            </a>
        </nav>
        <div class="row">
            <div class="col-md-12">
                <nuxt></nuxt>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        methods: {
            logout() {
                this.$store.dispatch('logout');
                this.$router.push('/');
            }
        }
    }
</script>
<style>
    .logo {
        width: 190px;
        margin-top: 10px;
        margin-right: 10px;
    }

    .btn-login {
        float: right;
        margin-top: 5px;
        margin-right: 5px;
    }
</style>
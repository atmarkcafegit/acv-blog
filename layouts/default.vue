<template>
    <div class="container">
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                            data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                        <span class="sr-only"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <nuxt-link class="navbar-brand" to="/">ACV BLOG</nuxt-link>
                </div>

                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav">
                        <nuxt-link v-for="t in tabs" :key="t.id" tag="li" :to="{path: t.path}"
                                   :class="{active: isActive(t.path)}">
                            <a>{{t.text}}</a>
                        </nuxt-link>
                    </ul>
                    <div v-if="!isLoginPath && !isLogged" class="nav navbar-nav navbar-right">
                        <nuxt-link to="/login" class="btn btn-default btn-login">LOGIN</nuxt-link>
                    </div>
                    <div v-if="isLogged" class="nav navbar-nav navbar-right">
                        <a class="btn btn-default btn-login" @click="logout">LOGOUT</a>
                    </div>
                    <form class="navbar-form navbar-right">
                        <div class="form-group">
                            <input class="form-control" placeholder="Search">
                        </div>
                        <button class="btn btn-default" style="margin-left: 5px">Submit</button>
                    </form>
                </div>
            </div>
        </nav>
        <nuxt></nuxt>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                tabs: [
                    {id: 0, text: 'POST', path: '/posts'},
                    {id: 1, text: 'TAGS', path: '/tags'}
                ]
            }
        },
        computed: {
            isLoginPath: function () {
                return this.$route.fullPath === '/login'
            },
            isLogged: function () {
                return !!this.$store.state.authUser;
            }
        },
        methods: {
            isActive(path) {
                return this.$route.fullPath === path;
            },
            logout() {
                this.$store.dispatch('LOGOUT')
                    .then(() => {
                        this.$router.push('/');
                    });
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
        margin-top: 7px;
    }
</style>
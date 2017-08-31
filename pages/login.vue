<template>
    <div class="panel-body">
        <h1>Login</h1>
        <hr>
        <form v-on:submit.prevent="login">
            <span v-show="errors.has('error')" class="alert-danger">{{ errors.first('error') }}</span>
            <div class="form-group">
                <label for="username">Username</label>
                <input v-validate.disabled data-vv-rules="required" class="form-control"
                       v-model="username" name="username" id="username" placeholder="Username"
                       data-vv-as="username">
                <span v-show="errors.has('username')" class="alert-danger">{{ errors.first('username') }}</span>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input v-validate.disabled data-vv-rules="required" name="password" type="password"
                       class="form-control" v-model="password" id="password" placeholder="********">
                <span v-show="errors.has('password')" class="alert-danger">{{ errors.first('password') }}</span>
            </div>
            <button class="btn btn-primary">Login</button>
            <nuxt-link class="btn btn-default" to="/register" style="margin-left: 5px">Register</nuxt-link>
            <hr>
        </form>
    </div>
</template>
<script>

    export default {
        layout: 'login',
        data() {
            return {
                error: null,
                username: null,
                password: null
            }
        },
        fetch({store, redirect}) {
            if (store.state.authUser)
                redirect('/')
        },
        methods: {
            login() {
                this.errors.clear();
                this.$validator.validateAll();
                if (!this.errors.any()) {
                    this.$store.dispatch('LOGIN', {
                        username: this.username,
                        password: this.password
                    }).then(() => {
                        this.$router.push('/');
                    }).catch(e => {
                        this.errors.add('error', e.response.data.message);
                    });
                }
            }
        }
    }
</script>
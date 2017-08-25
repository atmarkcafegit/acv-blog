<template>
    <div class="container">
        <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-6">
                <h1>Register</h1>
                <hr>
                <form v-on:submit.prevent="register">
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
                               class="form-control" v-model="password" id="password" placeholder="Password">
                        <span v-show="errors.has('password')" class="alert-danger">{{ errors.first('password') }}</span>
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword">Confirm Password</label>
                        <input v-validate.disabled data-vv-rules="required" name="confirmPassword" type="password"
                               class="form-control" v-model="confirmPassword" id="confirmPassword"
                               placeholder="Confirm Password">
                        <span v-show="errors.has('confirmPassword')"
                              class="alert-danger">{{ errors.first('confirmPassword') }}</span>
                    </div>
                    <div class="form-group">
                        <label for="password">E-mail</label>
                        <input v-validate.disabled data-vv-rules="required|email" name="email" type="email"
                               class="form-control" v-model="email" id="email"
                               placeholder="E-mail">
                        <span v-show="errors.has('email')"
                              class="alert-danger">{{ errors.first('email') }}</span>
                    </div>
                    <button class="btn btn-primary" @click="register">Submit</button>
                    <nuxt-link class="btn btn-default" style="margin-left: 5px" to="/login">Cancel</nuxt-link>
                    <hr>
                </form>
            </div>
            <div class="col-md-3"></div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                error: null,
                username: null,
                password: null,
                confirmPassword: null,
                email: null
            }
        },
        methods: {
            register() {
                this.errors.clear();
                this.$validator.validateAll();
                if (!this.errors.any()) {
                    this.$store.dispatch('REGISTER', {
                        username: this.username,
                        password: this.password,
                        email: this.email
                    }).then(() => {
                        this.$router.push('/login')
                    }).catch(e => {
                        this.errors.add('error', e.response.data.message);
                    })
                }
            }
        }
    }
</script>

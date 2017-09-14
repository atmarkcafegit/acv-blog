<template>
    <div class="panel-body">
        <h1>Đăng ký</h1>
        <hr>
        <form v-on:submit.prevent="register">
            <span v-show="errors.has('error')" class="alert-danger">{{ errors.first('error') }}</span>
            <div class="form-group">
                <label for="username">Tên đăng nhập</label>
                <input v-validate.disabled data-vv-rules="required" class="form-control"
                       v-model="username" name="username" id="username" placeholder="Username"
                       data-vv-as="username">
                <span v-show="errors.has('username')" class="alert-danger">{{ errors.first('username') }}</span>
            </div>
            <div class="form-group">
                <label for="password">Mật khẩu</label>
                <input v-validate.disabled data-vv-rules="required" name="password" type="password"
                       class="form-control" v-model="password" id="password" placeholder="Password">
                <span v-show="errors.has('password')" class="alert-danger">{{ errors.first('password') }}</span>
            </div>
            <div class="form-group">
                <label for="confirmPassword">Nhập lại mật khẩu</label>
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
            <button class="btn btn-primary">Đăng ký</button>
            <nuxt-link class="btn btn-default" style="margin-left: 5px" to="/login">Hủy</nuxt-link>
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
                password: null,
                confirmPassword: null,
                email: null
            }
        },
        methods: {
            register() {
                this.errors.clear();
                this.$validator.validateAll().then(() => {
                    if (!this.errors.any()) {
                        if (this.password !== this.confirmPassword) {
                            this.errors.add('confirmPassword', 'Password and confirm password does not match.');
                        } else {
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
                });
            }
        }
    }
</script>

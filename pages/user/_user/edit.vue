<template>
    <div class="container sitecontainer bgw">
        <div class="row">
            <div class="col-md-2"></div>
            <div class="col-md-8">
                <form v-on:submit.prevent="submit">
                    <div class="row form-group">
                        <div class="col-md-3 text-right">Tên đăng nhập</div>
                        <div class="col-md-9">
                            <input class="form-control" readonly :value="user.username"
                                   name="username" id="username" placeholder="Tên đăng nhập..."/>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-md-3 text-right">Tên hiển thị</div>
                        <div class="col-md-9">
                            <input v-validate.disabled data-vv-rules="required" class="form-control"
                                   v-model="displayName"
                                   name="displayName" id="displayName" data-vv-as="title"
                                   placeholder="Tên hiển thị..."/>
                            <span v-show="errors.has('displayName')" class="alert-danger">{{ errors.first('displayName')
                                }}</span>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-md-3 text-right"></div>
                        <div class="col-md-9">
                            <button class="btn btn-primary">Đổi mật khẩu</button>
                        </div>
                    </div>
                </form>
            </div>
            <div class="col-md-2"></div>
        </div>
    </div>
</template>
<script>
    export default {
        fetch({store, route}) {
            return Promise.all([
                store.dispatch('GET_USER', route.params.user)
            ]).catch(e => {
            })
        },
        data() {
            return {
                displayName: null
            }
        },
        computed: {
            user() {
                return this.$store.state.user;
            }
        },
        methods: {
            submit() {

            }
        }
    }
</script>
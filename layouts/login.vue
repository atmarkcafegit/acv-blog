<template>
    <div class="container login">
        <div class="row">
            <div class="col-sm-6 col-sm-offset-3">
                <div class="panel panel-default">
                    <nuxt></nuxt>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        beforeCreate: function () {
            if (typeof document !== 'undefined')
                document.body.className = 'login';
        }
    }
</script>
<style scoped>
    html.login, body.login {
        height: 100%;
        background: url(~/static/background-login.jpg);
        background-position: center top;
        background-size: 100% auto;
    }

    .login.container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>


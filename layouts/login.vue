<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-6 col-sm-offset-3">
                <div class="panel panel-default">
                    <nuxt></nuxt>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    html, body {
        height: 100%;
        background: url(~/static/background-login.jpg);
        background-position: center top;
        background-size: 100% auto;
    }
    .container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>


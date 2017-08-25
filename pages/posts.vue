<template>
    <div class="container">
        <div class="row">
            <div class="col-md-8">
                <nuxt-link v-if="isLogged" class="btn btn-default" to="/newpost">New Post</nuxt-link>
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
            isLogged: function () {
                return !!this.$store.state.authUser;
            }
        }
    }
</script>
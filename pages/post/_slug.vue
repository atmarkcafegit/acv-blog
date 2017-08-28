<template>
    <div class="row">
        <div class="col-md-8">
            <h2>{{post.title}}</h2>
            <vue-markdown>{{post.content}}</vue-markdown>
        </div>
    </div>
</template>
<script>
    import VueMarkdown from 'vue-markdown'
    export default {
        components: {
            VueMarkdown
        },
        fetch({store, route}) {
            return store.dispatch('GET_POST', route.params.slug);
        },
        computed: {
            post() {
                return this.$store.state.post;
            }
        }
    }
</script>
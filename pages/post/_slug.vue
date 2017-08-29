<template>
    <div>
        <div class="row">
            <div class="col-md-8">
                <h2>{{post.title}}</h2>
                <vue-markdown>{{post.content}}</vue-markdown>
            </div>
        </div>
        <div class="row">
            <div class="col-md-8">
                <router-link class="btn btn-default" to="/">Back</router-link>
            </div>
        </div>
        <div class="row" style="margin-top: 10px">
            <div class="col-md-8">
                <textarea v-model="content" class="form-control" placeholder="Comment..."></textarea>
                <a class="btn btn-default" style="margin-top: 10px" @click="addComment">Add Comment</a>
            </div>
        </div>
        <div class="row">
            <div class="col-md-8"></div>
        </div>
    </div>
</template>
<script>
    import VueMarkdown from 'vue-markdown'

    export default {
        components: {
            VueMarkdown
        },
        data() {
            return {
                content: null
            }
        },
        fetch({store, route}) {
            return store.dispatch('GET_POST', route.params.slug);
        },
        computed: {
            post() {
                return this.$store.state.post;
            }
        },
        methods: {
            addComment() {
                this.$store.dispatch('ADD_COMMENT', {
                    content: this.content,
                    userId: this.$store.state.authUser._id,
                    postId: this.$store.state.post._id
                }).then(() => {
                    console.log(this.$store.state.comments)
                })
            }
        }
    }
</script>
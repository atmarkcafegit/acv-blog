<template>
    <div class="container">
        <div class="row">
            <div class="col-md-8">
                <div class="row form-group">
                    <div class="col-md-12">
                        <h2>{{title}}</h2>
                        <vue-markdown :source="content"></vue-markdown>
                    </div>
                </div>
                <div class="row form-group">
                    <div class="col-md-12">
                        <input class="form-control" v-model="title" placeholder="Title..."/>
                    </div>
                </div>
                <div class="row form-group">
                    <div class="col-md-12">
                        <textarea class="form-control" placeholder="Content..." v-model="content"
                                  style="height: 200px"></textarea>
                    </div>
                </div>
                <div class="row form-group">
                    <div class="col-md-12 text-center">
                        <a class="btn btn-default" @click="submit">Submit</a>
                        <a style="margin-left: 5px" class="btn btn-default" @click="cancel">Cancel</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import VueMarkdown from 'vue-markdown'
    import axios from 'axios'

    export default {
        middleware: 'auth',
        components: {
            VueMarkdown
        },
        data() {
            return {
                title: '',
                content: ''
            }
        },
        methods: {
            submit() {
                axios.post('/api/post', {
                    title: this.title,
                    content: this.content,
                    id: this.$store.state.authUser.id
                }).then(() => {
                    this.$router.push('/')
                })
            },
            cancel() {
                this.$router.push('/')
            }
        }
    }
</script>
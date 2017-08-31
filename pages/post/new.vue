<template>
    <div class="container">
        <div class="row">
            <div class="col-md-8">
                <div class="row form-group">
                    <div class="col-md-12">
                        <input class="form-control" v-model="title" placeholder="Title..."/>
                    </div>
                </div>
                <div class="row form-group">
                    <div class="col-md-12">
                        <markdown-editor v-model="content"></markdown-editor>
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
    import editor from '../../components/editor.vue'
    import axios from 'axios'

    export default {
        middleware: 'auth',
        components: {
            editor
        },
        data() {
            return {
                title: '',
                content: '',
                test: null
            }
        },
        methods: {
            submit() {
                axios.post('/api/post', {
                    title: this.title,
                    content: this.content,
                    userId: this.$store.state.authUser._id
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
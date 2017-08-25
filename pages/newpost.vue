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
            </div>
        </div>
    </div>
</template>
<script>
    import VueMarkdown from 'vue-markdown'

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
        }
    }
</script>
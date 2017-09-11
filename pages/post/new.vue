<template>
    <div class="container-fluid" style="margin-top: 10px">
        <div class="row">
            <div class="col-md-12">
                <form v-on:submit.prevent="submit">
                    <div class="row form-group">
                        <div class="col-md-12">
                            <input v-validate.disabled data-vv-rules="required" class="form-control" v-model="title"
                                   name="title" id="title" data-vv-as="title" placeholder="Tiêu đề..."/>
                            <span v-show="errors.has('title')" class="alert-danger">{{ errors.first('title') }}</span>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-md-12">
                            <tags-input class="form-control" placeholder="Thêm thẻ tag..." :tags="tags"
                                        @tags-change="handleChange"></tags-input>
                        </div>
                    </div>
                    <div class="btn-group btn-group-lg">
                        <button type="button" :class="{btn: true, 'btn-default': true, active: mode === 1}"
                                @click="mode = 1">
                            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                        </button>
                        <button type="button" :class="{btn: true, 'btn-default': true, active: mode === 0}"
                                @click="mode = 0">
                            <i class="fa fa-columns" aria-hidden="true"></i>
                        </button>
                        <button type="button" :class="{btn: true, 'btn-default': true, active: mode === 2}"
                                @click="mode = 2">
                            <i class="fa fa-eye" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div class="row form-group" style="margin-top: 10px">
                        <div class="col-md-12">
                            <markdown-editor v-model="content" :previewMode="mode"></markdown-editor>
                            <span v-show="errors.has('error')" class="alert-danger">{{ errors.first('error') }}</span>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-md-12 text-center">
                            <button class="btn btn-primary">Gửi bài</button>
                            <a style="margin-left: 5px" class="btn btn-default" @click="cancel">Hủy</a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
    import editor from '../../components/editor.vue'
    import tagsInput from '../../components/tags/input.vue'
    import axios from 'axios'

    export default {
        middleware: 'auth',
        components: {
            editor,
            tagsInput
        },
        data() {
            return {
                error: null,
                title: null,
                content: null,
                tags: [],
                mode: 0
            }
        },
        methods: {
            submit() {
                this.errors.clear();
                this.$validator.validateAll();
                if (!this.errors.any()) {
                    if (!this.content) {
                        this.errors.add('error', 'The content field is required.');
                    } else {
                        axios.post('/api/post', {
                            title: this.title,
                            content: this.content,
                            tags: this.tags,
                            userId: this.$store.state.authUser._id
                        }).then(() => {
                            this.$router.push('/')
                        })
                    }
                }
            },
            cancel() {
                this.$router.push('/')
            },
            handleChange(index, text) {
                if (text) {
                    this.tags.push(text);
                } else {
                    this.tags.splice(index, 1)
                }
            }
        }
    }
</script>
<style>
</style>
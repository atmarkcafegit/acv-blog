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
                            <button class="btn btn-primary">Cập nhật bài</button>
                            <a style="margin-left: 5px" class="btn btn-danger" @click.stop="deletePost">Xóa bài</a>
                            <a style="margin-left: 5px" class="btn btn-default" @click.stop="cancel">Bỏ qua</a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
    import editor from '../../../components/editor.vue'
    import tagsInput from '../../../components/tags/input.vue'
    import axios from 'axios'

    export default {
        middleware: 'auth',
        components: {
            editor,
            tagsInput
        },
        fetch({store, route}) {
            return Promise.all([
                store.dispatch('GET_POST', route.params.slug)
            ]).catch(e => {
            })
        },
        data() {
            return {
                error: null,
                title: this.$store.state.post.title,
                content: this.$store.state.post.content,
                tags: this.$store.state.post.tags.slice(),
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
                    } else if (this.content.length < 200) {
                        this.errors.add('error', 'The content field is too short.');
                    }
                    else {
                        this.$store.dispatch('UPDATE_POST', {
                            slug: this.$route.params.slug,
                            title: this.title,
                            content: this.content,
                            tags: this.tags
                        }).then(() => {
                            this.$router.push('/')
                        })
                    }
                }
            },
            cancel() {
                this.$router.push('/')
            },
            deletePost() {
                let ret = confirm('Bạn có chắc chắn muốn xóa bài viết?');
                if (ret) {
                    this.$store.dispatch('DELETE_POST', this.$route.params.slug).then(() => {
                        this.$router.push('/')
                    })
                }
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
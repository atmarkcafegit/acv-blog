<template>
    <div class="container sitecontainer single-wrapper bgw">
        <nuxt-link v-if="isLogged" class="btn btn-default btn-primary" to="/post/new" style="margin-top: 20px">
            <i class="fa fa-edit"></i>Viết bài
        </nuxt-link>
        <div class="clearfix"></div>
        <div class="row">
            <div class="col-md-9 col-sm-9 col-xs-12 m22 single-post">
                <div class="widget">
                    <div class="large-widget m30">
                        <div class="post clearfix">
                            <div class="title-area">
                                <div class="bread">
                                    <ol class="breadcrumb">
                                        <li>
                                            <nuxt-link to="/" class="">Home</nuxt-link>
                                        </li>
                                        <li class="">Blog</li>
                                        <li class="active">Single Blog</li>
                                    </ol>
                                </div><!-- end bread -->
                                <div class="colorfulcats">
                                    <a href="#"><span class="label label-primary">Interview</span></a>
                                    <a href="#"><span class="label label-warning">Web Design</span></a>
                                </div>
                                <h3>{{ post.title }}</h3>

                                <div class="large-post-meta">
                                    <span class="avatar"><a href="#"><img src="" alt=""
                                                                          class="img-circle"> {{post.user.username}}</a></span>
                                    <small>&#124;</small>
                                    <span><a href="#"><i class="fa fa-clock-o"></i> {{ post.createdAt | dateFormat
                                        }}</a></span>
                                    <small class="hidden-xs">&#124;</small>
                                    <span class="hidden-xs"><a href="#comments"><i
                                            class="fa fa-comments-o"></i> {{ post.user.comments }} </a></span>
                                    <small class="hidden-xs">&#124;</small>
                                    <span class="hidden-xs"><a href="#"><i class="fa fa-eye"></i> {{ post.user.views }}</a></span>
                                </div><!-- end meta -->

                                <div class="post-sharing">
                                    <ul class="list-inline">
                                        <li><a href="#" class="fb-button btn btn-primary"><i class="fa fa-facebook"></i>
                                            <span class="hidden-xs">Share on Facebook</span></a></li>
                                        <li><a href="#" class="tw-button btn btn-primary"><i class="fa fa-twitter"></i>
                                            <span class="hidden-xs">Tweet on Twitter</span></a></li>
                                        <li><a href="#" class="gp-button btn btn-primary"><i
                                                class="fa fa-google-plus"></i></a></li>
                                    </ul>
                                </div><!-- end post-sharing -->
                            </div><!-- /.pull-right -->
                        </div><!-- end post -->
                        <div class="post-desc">
                            <vue-markdown>{{post.content}}</vue-markdown>
                        </div><!-- end post-desc -->

                        <div class="post-bottom">
                            <div class="row">
                                <div class="col-md-8">
                                    <div class="tags">
                                        <h4>Tags</h4>
                                        <a href="#">cinema</a>
                                        <a href="#">club</a>
                                        <a href="#">html5</a>
                                        <a href="#">css3</a>
                                        <a href="#">web design</a>
                                    </div><!-- end tags -->
                                </div><!-- end col -->

                                <div class="col-md-4 hidden-xs">
                                    <div class="post-share">
                                        <div class="customshare">
                                                 <span class="list">
                                                    <strong><i class="fa fa-share-alt"></i> 980
                                                    <a href="#" class="tw"><i class="fa fa-twitter"></i></a>
                                                    <a href="#" class="fb"><i class="fa fa-facebook"></i></a>
                                                    <a href="#" class="gp"><i class="fa fa-google-plus"></i></a>
                                                    </strong>
                                                </span>
                                        </div>
                                    </div><!-- end share -->
                                </div><!-- end col -->
                            </div><!-- end row -->
                        </div><!-- end bottom -->

                        <div id="comments" class="row">
                            <div class="col-md-12">
                                <div class="widget">
                                    <div class="widget-title">
                                        <h4>Comments</h4>
                                        <hr>
                                    </div><!-- end widget-title -->

                                    <div class="comments">
                                        <div class="well">
                                            <div class="media" v-for="comment in comments">
                                                <div class="media-body" :key="comment._id">
                                                    <h4 class="media-heading">
                                                        {{comment.user.username }}</h4>
                                                    <div class="time-comment clearfix">
                                                        <small class="pull-left">{{ comment.createdAt | dateFormat }}
                                                        </small>
                                                        <a class="pull-right btn btn-primary btn-xs"
                                                           v-if="isAuthUser(comment.user._id)"
                                                           @click.prevent.stop="deleteComment(comment._id)">Delete</a>
                                                    </div><!-- end time-comment -->
                                                    <p>{{ comment.content }}</p>
                                                </div>
                                                <hr>
                                            </div><!-- end media -->
                                        </div><!-- end well -->
                                    </div><!-- end collapse -->
                                </div><!-- end widget -->
                            </div><!-- end col -->
                        </div><!-- end comments -->

                        <div class="row">
                            <div class="col-md-12">
                                <div class="widget">
                                    <div class="widget-title">
                                        <h4>Leave a Comment</h4>
                                        <hr>
                                    </div><!-- end widget-title -->

                                    <div class="commentform">
                                        <form class="row">
                                            <div class="col-md-12 col-sm-12">
                                                <label>Comment <span class="required">*</span></label>
                                                <textarea v-model="content" class="form-control"
                                                          placeholder="Comment..."></textarea>
                                            </div>

                                            <div class="col-md-12 col-sm-12">
                                                <button :disabled="!isLogged" class="btn btn-default"
                                                        style="margin-top: 10px" @click.prevent.stop="addComment">
                                                    Add Comment
                                                </button>
                                            </div>
                                        </form>
                                    </div><!-- end newsletter -->
                                </div><!-- end widget -->
                            </div><!-- end col -->
                        </div><!-- end row -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
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
            },
            comments() {
                return this.$store.state.comments;
            },
            isLogged: function () {
                return !!this.$store.state.authUser;
            }
        },
        methods: {
            isAuthUser: function (userId) {
                return this.isLogged && (this.$store.state.authUser._id === userId)
            },
            addComment() {
                this.$store.dispatch('ADD_COMMENT', {
                    content: this.content,
                    userId: this.$store.state.authUser._id,
                    postId: this.$store.state.post._id
                }).then(() => {
                    this.content = '';
                })
            },
            deleteComment(id) {
                this.$store.dispatch('DELETE_COMMENT', id);
            }
        }
    }
</script>
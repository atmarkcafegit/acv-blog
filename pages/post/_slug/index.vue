<template>
    <div class="container sitecontainer single-wrapper bgw">
        <nuxt-link v-if="isLogged" class="btn btn-default btn-primary" to="/post/new" style="margin-top: 20px">
            <i class="fa fa-edit fa-fw"></i>Viết bài
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
                                            <nuxt-link to="/" class="">Trang chủ</nuxt-link>
                                        </li>
                                        <li>
                                            <nuxt-link to="/posts" class="">Bài viết</nuxt-link>
                                        </li>
                                        <li class="active">{{post.title }}</li>
                                    </ol>
                                </div><!-- end bread -->
                                <div class="colorfulcats">

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
                                    <span class="hidden-xs">
                                        <a href="#"><i class="fa fa-eye"></i>{{ post.views}}</a>
                                    </span>
                                    <small class="hidden-xs">&#124;</small>
                                    <span class="hidden-xs">
                                        <a href="#"><i
                                                class="fa fa-thumbs-o-up"></i> {{ post.votes ? post.votes.length : 0}}</a>
                                    </span>
                                    <small v-if="isAuth" class="hidden-xs">&#124;</small>
                                    <span v-if="isAuth" class="hidden-xs">
                                        <nuxt-link :to="'/post/' + $route.params.slug + '/edit'" style="color: #0288d1">Sửa</nuxt-link>
                                    </span>
                                    <small v-if="isLogged && !isAuth" class="hidden-xs">&#124;</small>
                                    <span v-if="isLogged && !isAuth" class="hidden-xs">
                                        <a v-if="!isLiked" href="#" style="color: #0288d1" @click.stop="like">Thích</a>
                                        <a v-else="" href="#" style="color: #0288d1" @click.stop="unlike">Bỏ thích</a>
                                    </span>
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
                            <markdown-editor :value="post.content" :previewMode="3"></markdown-editor>
                        </div><!-- end post-desc -->

                        <div class="post-bottom">
                            <div class="row">
                                <div class="col-md-8">
                                    <div class="tags">
                                        <h4>Thẻ tag</h4>
                                        <nuxt-link v-for="tag, i in post.tags" :to="'/tags/' + tag"
                                                   style="margin-left: 3px; margin-top: 2px" :key="i">
                                            {{tag}}
                                        </nuxt-link>
                                    </div><!-- end tags -->
                                </div><!-- end col -->

                                <div class="col-md-4 hidden-xs">
                                    <div class="post-share">
                                        <div class="customshare">

                                        </div>
                                    </div><!-- end share -->
                                </div><!-- end col -->
                            </div><!-- end row -->
                        </div><!-- end bottom -->

                        <div id="comments" class="row">
                            <div class="col-md-12">
                                <div class="widget">
                                    <div class="widget-title">
                                        <h4 id>Bình luận</h4>
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
                                        <h4>Bình luận của bạn</h4>
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
            <div class="col-md-3 col-sm-3 col-xs-12 m22 single-post" style="background-color: #ddd">
                <div class="avatar">
                    <div class="row">
                        <div class="col-md-12">
                            <img src="~/static/avatar_128x128.png" width="128"/>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <span class="name"><h4>{{post.user.username}}</h4></span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <span class="score"><h4>Bài viết<br>{{post.user.posts ? post.user.posts.length : 0}}</h4></span>
                        </div>
                        <div class="col-md-6">
                            <span class="score"><h4>Điểm số<br>{{score}}</h4></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import editor from '../../../components/editor.vue'
    import * as _ from 'lodash'
    import * as moment from 'moment'


    const calcScore = (user, month) => {
        let postViews = 0;

        _.each(user.posts, post => {
            postViews += post.views;
        });

        let viewScore = Math.floor(postViews / 100);

        if (user.score.length === 0)
            return viewScore;

        let score = _.find(user.score, score => {
            return score.month === month;
        });

        if (score) {
            return score.value + viewScore;
        }

        return viewScore;
    };

    export default {
        components: {
            editor
        },
        data() {
            return {
                content: null
            }
        },
        fetch({store, route}) {
            return Promise.all([
                store.dispatch('GET_POST', route.params.slug)
            ]).catch(e => {
            })
        },
        computed: {
            post() {
                return this.$store.state.post;
            },
            comments() {
                return this.$store.state.comments;
            },
            isLogged() {
                return !!this.$store.state.authUser;
            },
            isAuth() {
                return !!this.$store.state.authUser &&
                    this.$store.state.authUser.username === this.$store.state.post.user.username;
            },
            isLiked() {
                return this.$store.state.liked;
            },
            score() {
                return calcScore(this.$store.state.post.user, moment(new Date()).format('YYYY-MM'))
            }
        },
        mounted() {
            let comp = new RegExp(location.host);
            let links = document.querySelectorAll('.markdown-editor a');
            _.each(links, link => {
                let href = link.getAttribute('href');
                if (!comp.test(href) && (href.substr(0, 1) !== '#')) {
                    link.setAttribute('target', '_blank');
                }
            });
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
            },
            like() {
                this.$store.dispatch('LIKE', {
                    userId: this.$store.state.authUser._id,
                    postId: this.post._id
                });
            },
            unlike() {
                this.$store.dispatch('UNLIKE', {
                    userId: this.$store.state.authUser._id,
                    postId: this.post._id
                });
            }
        }
    }
</script>
<style scoped>
    .avatar {
        margin-top: 30px;
        text-align: center;
        padding: 10px;
    }

    .name h4 {
        font-weight: 700 !important;
    }

    .score h4 {
        font-weight: 300;
    }
</style>
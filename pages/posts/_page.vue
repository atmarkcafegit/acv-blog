<template>
    <div class="container sitecontainer bgw">
        <nuxt-link v-if="isLogged" class="btn btn-default btn-primary" to="/post/new" style="margin-top: 20px">
            <i class="fa fa-edit fa-fw"></i>Viết bài
        </nuxt-link>
        <div class="clearfix"></div>
        <hr v-if="isLogged">
        <div class="row homepage-version">
            <div class="col-md-9 col-sm-12 col-xs-12 m22">
                <div class="widget searchwidget">
                    <div v-for="post, index in posts" class="large-widget m30">
                        <div class="post row clearfix">
                            <div class="col-md-2">
                                <div class="post-media">
                                    <router-link :to="{path: '/post/' + post.slug}">
                                        <div class="post-category post-html">
                                            <span>{{ post.title.toUpperCase() | shortDescription(1) }}</span>
                                        </div>
                                    </router-link>
                                </div>
                            </div>

                            <div class="col-md-10">
                                <div class="title-area">
                                    <div class="colorfulcats">

                                    </div>
                                    <router-link :to="{path: '/post/' + post.slug}">
                                        <h3> {{post.title}}</h3>
                                    </router-link>
                                    <div> {{ post.content | shortDescription(150, 1) }} </div>

                                    <div class="large-post-meta">
                                        <span class="avatar"><a href="#"><img src="" alt=""
                                                                              class="img-circle"> {{ post.user.username
                                            }}</a></span>
                                        <small>&#124;</small>
                                        <span><a href="#"><i
                                                class="fa fa-clock-o"></i> {{ post.createdAt | dateFormat
                                            }}</a></span>
                                        <small class="hidden-xs">&#124;</small>
                                        <span class="hidden-xs"><router-link
                                                :to="{path: '/post/' + post.slug + '#comments'}"><i
                                                class="fa fa-comments-o"></i> {{ post.comments | countData
                                            }} </router-link></span>
                                        <small class="hidden-xs">&#124;</small>
                                        <span class="hidden-xs"><a href="#"><i
                                                class="fa fa-eye"></i> {{ post.views}}</a></span>
                                        <small class="hidden-xs">&#124;</small>
                                        <span class="hidden-xs">
                                            <a href="#"><i
                                                    class="fa fa-thumbs-o-up"></i> {{ post.votes ? post.votes.length : 0}}</a>
                                        </span>
                                    </div>
                                    <!-- end meta -->
                                </div>
                                <!-- /.pull-right -->
                            </div>
                        </div>
                        <!-- end post -->
                        <hr>
                    </div>
                    <!-- end large-widget -->
                </div>
            </div>
            <div class="col-md-3 col-sm-12 col-xs-12 ">
                <div class="widget">
                    <div class="widget-title">
                        <h4>Xếp hạng tháng {{currentMonth}}</h4>
                        <hr>
                    </div>
                    <!-- end widget-title -->

                    <div class="social-media-widget m30">
                        <div class="ui selection list ranking-users">
                            <!-- Item -->
                            <div v-for="author, index in authors" class="item" style="margin-bottom: 10px">
                                <div class="block">
                                    <div class="inner avatar">{{ author.username | shortDescription(1) }}</div>
                                    <div class="inner">
                                        <nuxt-link :to="'/user/' + author.username">{{ author.username }}</nuxt-link>
                                        <br>
                                        <div>
                                            <span style="font-weight: bold; font-size: 10px; color: #676767">
                                                Bài viết: {{author.posts ? author.posts.length : 0}}
                                            </span>
                                        </div>
                                        <div>
                                            <span style="font-weight: bold; font-size: 10px; color: #676767">
                                                Điểm số: {{getScore(author)}}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- end hot author -->

                    <div class="widget-title">
                        <h4>Xem nhiều nhất</h4>
                        <hr>
                    </div>

                    <div class="mini-widget carrier-widget m30">
                        <div class="post clearfix" v-for="post, index in hotPosts">
                            <div class="mini-widget-thumb">
                                {{ post.title | shortDescription(1) }}
                            </div>
                            <div class="mini-widget-title">
                                <router-link :to="{path: '/post/' + post.slug}">
                                    {{ post.title}}
                                </router-link>
                                <small>{{ post.createdAt | dateFormat }}</small>
                                <div class="mini-widget-hr"></div>
                            </div>
                        </div>
                    </div>

                    <div class="widget-title">
                        <h4>Hot Tags</h4>
                        <hr>
                    </div>
                    <div class="mini-widget carrier-widget m30 tags">
                        <nuxt-link v-for="tag, i in hotTags" :to="'/tags/' + tag._id"
                                   style="margin-left: 3px; margin-top: 2px" :key="i">
                            {{tag._id}}
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" v-if="!!posts && posts.length > 0">
            <div class="col-md-8 text-center">
                <ul class="pagination">
                    <li>
                        <router-link :to="{path: '/posts/' + (postsInfo.page > 1? parseInt(postsInfo.page) - 1: 1)}">
                            <i class="fa fa-angle-left"></i>
                        </router-link>
                    </li>
                    <li v-if="postsInfo.page !== 1">
                        <router-link :to="{path: '/posts/1'}">1</router-link>
                    </li>
                    <li v-if="postsInfo.page - 2 > 1">
                        <a>...</a>
                    </li>
                    <li v-for="p in getRange(postsInfo.page - 2, postsInfo.page - 1)" v-if="p > 1">
                        <router-link :to="{path: '/posts/' + p }">{{p}}</router-link>
                    </li>
                    <li class="active">
                        <a>{{postsInfo.page}}</a>
                    </li>
                    <li v-for="p in getRange(postsInfo.page + 1, postsInfo.page + 2)" v-if="p < postsInfo.pages">
                        <router-link :to="{path: '/posts/' + p }">{{p}}</router-link>
                    </li>
                    <li v-if="postsInfo.pages - 2 > postsInfo.page">
                        <a>...</a>
                    </li>
                    <li v-if="postsInfo.page !== postsInfo.pages">
                        <router-link :to="{path: '/posts/' + postsInfo.pages}">{{postsInfo.pages}}</router-link>
                    </li>
                    <li>
                        <router-link
                                :to="{path: '/posts/' + (postsInfo.page < postsInfo.pages ? parseInt(postsInfo.page) + 1: postsInfo.pages) }">
                            <i class="fa fa-angle-right"></i>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import * as moment from 'moment'
    import * as _ from 'lodash'

    import {calcScore} from '../../server/commons/utils'

    export default {
        serverCacheKey() {
            return Math.floor(Date.now() / 10000)
        },
        async fetch({store, route}) {
            await Promise.all([
                store.dispatch('GET_POSTS', route.params.page ? parseInt(route.params.page) : null),
                store.dispatch('GET_HOT_AUTHORS'),
                store.dispatch('GET_HOT_POSTS'),
                store.dispatch('GET_HOT_TAGS')
            ]).catch(e => {
            })
        },
        computed: {
            posts() {
                return this.$store.state.posts.docs;
            },
            postsInfo() {
                return this.$store.state.posts;
            },
            isLogged: function () {
                return !!this.$store.state.authUser;
            },
            authors() {
                return this.$store.state.authors;
            },
            hotPosts() {
                return this.$store.state.hotPosts;
            },
            hotTags() {
                return this.$store.state.hotTags;
            },
            currentMonth() {
                return moment(new Date()).month() + 1;
            }
        },
        methods: {
            getRange(start, end) {
                let array = [],
                    j = 0;

                for (let i = start; i <= end; i++) {
                    array[j] = i;
                    j++;
                }

                return array;
            },
            getScore(user) {
                return calcScore(user, moment(new Date()).format('YYYY-MM'))
            }
        }
    }
</script>
<style>
    .post-category {
        font-size: xx-large;
    }
</style>
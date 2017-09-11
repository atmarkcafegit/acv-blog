<template>
    <div class="container sitecontainer bgw">
        <div class="row homepage-version">
            <div class="col-md-12 col-sm-12 col-xs-12 m22">
                <div class="bread">
                    <ol class="breadcrumb">
                        <li>
                            <nuxt-link to="/">Trang chủ</nuxt-link>
                        </li>
                        <li class="">
                            <nuxt-link to="/tags">Thẻ tags</nuxt-link>
                        </li>
                        <li class="active">
                            {{$route.params.tag}}
                        </li>
                    </ol>
                </div><!-- end bread -->
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
                                        <span class="hidden-xs"><a href="#"><i class="fa fa-eye"></i> {{ post.views
                                            }}</a></span>
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
        </div>
        <div class="row" v-if="!!posts && posts.length > 0">
            <div class="col-md-8 text-center">
                <ul class="pagination">
                    <li>
                        <router-link
                                :to="{path: `/tags/${$route.params.tag}/` + (postsInfo.page > 1? parseInt(postsInfo.page) - 1: 1)}">
                            <i class="fa fa-angle-left"></i>
                        </router-link>
                    </li>
                    <li v-if="postsInfo.page !== 1">
                        <router-link :to="{path: `/tags/1`}">1</router-link>
                    </li>
                    <li v-if="postsInfo.page - 2 > 1">
                        <a>...</a>
                    </li>
                    <li v-for="p in getRange(postsInfo.page - 2, postsInfo.page - 1)" v-if="p > 1">
                        <router-link :to="{path: `/tags/${$route.params.tag}/` + p }">{{p}}</router-link>
                    </li>
                    <li class="active">
                        <a>{{postsInfo.page}}</a>
                    </li>
                    <li v-for="p in getRange(postsInfo.page + 1, postsInfo.page + 2)" v-if="p < postsInfo.pages">
                        <router-link :to="{path: `/tags/${$route.params.tag}/` + p }">{{p}}</router-link>
                    </li>
                    <li v-if="postsInfo.pages - 2 > postsInfo.page">
                        <a>...</a>
                    </li>
                    <li v-if="postsInfo.page !== postsInfo.pages">
                        <router-link :to="{path: `/tags/${$route.params.tag}/` + postsInfo.pages}">{{postsInfo.pages}}
                        </router-link>
                    </li>
                    <li>
                        <router-link
                                :to="{path: `/tags/${$route.params.tag}/` + (postsInfo.page < postsInfo.pages ? parseInt(postsInfo.page) + 1: postsInfo.pages) }">
                            <i class="fa fa-angle-right"></i>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        async fetch({store, route}) {
            await store.dispatch('GET_TAG_POSTS', route.params.tag);
        },
        computed: {
            posts() {
                return this.$store.state.tagPosts.docs;
            },
            postsInfo() {
                return this.$store.state.tagPosts;
            },
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
            }
        }
    }
</script>
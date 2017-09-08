<template>
    <div id="wrapper">
        <div class="left-menu hidden-sm hidden-md hidden-xs" style="display: none">
            <ul class="dm-social">
                <li class="facebookbg"><a href="#" class="fa fa-facebook" data-toggle="tooltip" data-placement="right"
                                          title="Facebook">Facebook</a></li>
                <li class="googlebg"><a href="#" class="fa fa-google-plus" data-toggle="tooltip" data-placement="right"
                                        title="Google+">Google+</a></li>
                <li class="twitterbg"><a href="#" class="fa fa-twitter" data-toggle="tooltip" data-placement="right"
                                         title="Twitter">Twitter</a></li>
                <li class="pinterestbg"><a href="#" class="fa fa-pinterest" data-toggle="tooltip" data-placement="right"
                                           title="Pinterest">Pinterest</a></li>
                <li class="linkedinbg"><a href="#" class="fa fa-linkedin" data-toggle="tooltip" data-placement="right"
                                          title="Linkedin">Linkedin</a></li>
                <li class="rssbg"><a href="#" class="fa fa-rss" data-toggle="tooltip" data-placement="right"
                                     title="RSS">RSS</a></li>
                <li class="share">
                    <a href="#" class="fa fa-share-alt" data-toggle="tooltip" data-placement="right"
                       title="91k Share"></a>
                </li>
            </ul>
        </div>

        <div class="logo-wrapper">
            <div class="container">
                <div class="row">
                    <div class="col-md-3 col-sm-12">
                        <nuxt-link class="navbar-brand" to="/"><img src="~/static/logo.png"></nuxt-link>
                    </div>
                </div>
                <!-- end row -->
            </div>
            <!-- end container -->
        </div>
        <!-- end logo-wrapper -->

        <header class="header">
            <div class="container">
                <nav class="navbar navbar-default yamm">
                    <div class="container-full">
                        <div class="navbar-header">
                            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                                    data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                                <span class="sr-only">Toggle navigation</span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                            </button>
                        </div>

                        <div id="navbar" class="navbar-collapse collapse">
                            <ul class="nav navbar-nav">
                                <nuxt-link v-for="t in tabs" :key="t.id" tag="li" :to="{path: t.path}"
                                           :class="{active: isActive(t.path)}">
                                    <a>{{t.text}}</a>
                                </nuxt-link>
                            </ul>
                            <ul class="nav navbar-nav navbar-right searchandbag">
                                <li class="dropdown searchdropdown hasmenu">
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"
                                       aria-haspopup="true" aria-expanded="false"><i class="fa fa-search"></i></a>
                                    <ul class="dropdown-menu show-right">
                                        <li>
                                            <div id="custom-search-input">
                                                <div class="input-group col-md-12">
                                                    <input type="text" class="form-control input-lg"
                                                           placeholder="Search here..."/>
                                                    <span class="input-group-btn">
                                                        <button class="btn btn-primary btn-lg" type="button">
                                                            <i class="fa fa-search"></i>
                                                        </button>
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                            <ul class="nav navbar-nav navbar-right ">
                                <li v-if="!isLoginPath && !isLogged">
                                    <a href="" @click.prevent.stop="login" class="">LOGIN</a>
                                </li>
                                <li v-if="isLogged">
                                    <a href="" @click.prevent.stop="logout">LOGOUT</a>
                                </li>
                            </ul>
                        </div>
                        <!--/.nav-collapse -->
                    </div>
                    <!--/.container-fluid -->
                </nav>
            </div>
            <!-- end container -->
        </header>
        <!-- end header -->

        <nuxt></nuxt>
    </div>

</template>
<script>
    export default {
        data() {
            return {
                tabs: [
                    {id: 0, text: 'POST', path: '/posts'},
                    {id: 1, text: 'TAGS', path: '/tags'}
                ]
            }
        },
        beforeCreate: function () {
            if (typeof document !== 'undefined')
                document.body.className = '';
        },
        computed: {
            isLoginPath: function () {
                return this.$route.fullPath === '/login'
            },
            isLogged: function () {
                return !!this.$store.state.authUser;
            }
        },
        methods: {
            isActive(path) {
                return this.$route.fullPath === path;
            },
            login() {
                this.$store.commit('SET_LAST_ROUTE', this.$route.fullPath);
                this.$router.push('/login')
            },
            logout() {
                this.$store.dispatch('LOGOUT')
                    .then(() => {
                        this.$router.push(this.$route.fullPath);
                    });
            }
        }
    }
</script>
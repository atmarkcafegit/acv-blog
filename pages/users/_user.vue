<template>
    <div class="container sitecontainer bgw">
        <div class="row">
            <div class="avatar">
                <div class="col-md-3">
                    <img src="~/static/avatar_128x128.png" width="128"/>
                </div>
            </div>
            <div class="col-md-9">
                <h3>Tác giả: {{user.username}}</h3>
                <h4>Bài viết: {{user.posts ? user.posts.length : 0}}</h4>
                <h4>Điểm số: {{score}}</h4>
            </div>
        </div>
    </div>
</template>
<script>
    import * as moment from 'moment'
    import {calcScore} from '../../server/commons/utils'

    export default {
        fetch({store, route}) {
            return Promise.all([
                store.dispatch('GET_USER', route.params.user)
            ]).catch(e => {
            })
        },
        computed: {
            user() {
                return this.$store.state.user;
            },
            score() {
                return calcScore(this.$store.state.user, moment(new Date()).format('YYYY-MM'))
            }
        }
    }
</script>
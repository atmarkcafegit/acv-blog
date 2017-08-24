<template>
    <div>
        <h1>POSTS</h1>
        <ul>
            <li v-for="(post, index) in $store.state.posts">
                <span>{{ post.title }}</span>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        fetch({store}) {
            return store.dispatch('SET_POST_LIST');
        }
    }
</script>
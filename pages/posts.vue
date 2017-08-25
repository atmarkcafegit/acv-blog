<template>
</template>
<script>
    export default {
        fetch({store}) {
            return store.dispatch('GET_POSTS');
        }
    }
</script>
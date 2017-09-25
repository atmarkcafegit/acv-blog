<template>

</template>
<script>
    export default {
        fetch({store, route}) {
            return Promise.all([
                store.dispatch('GET_USER', route.params.user)
            ]).catch(e => {
            })
        }
    }
</script>
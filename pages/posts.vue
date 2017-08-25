<template>
    <div>

    </div>
</template>
<script>
    export default {
        fetch({store}) {
            return store.dispatch('SET_POST_LIST');
        }
    }
</script>
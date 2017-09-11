<template>
    <div class="container sitecontainer bgw">
        <div class="tags">
            <nuxt-link v-for="tag, i in tags" :to="'/tags/' + tag._id"
                       style="margin-left: 3px" :key="i">
                {{tag._id}}
            </nuxt-link>
        </div>
    </div>
</template>
<script>
    export default {
        async fetch({store}) {
            await store.dispatch('GET_TAGS');
        },
        computed: {
            tags() {
                return this.$store.state.tags;
            }
        }
    }
</script>
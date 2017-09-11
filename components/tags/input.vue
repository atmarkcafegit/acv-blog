<template>
    <div :class="klass.container">
        <template v-for="(item, index) in normalizeTagItems">
            <typing :index="index" :typing="index === typingIndex" :handle-insert="insertTag" :handle-remove="removeTag"
                    :active-other="activeOther" @click="focus(index)" @blur="blur(index)">
                <span v-show="index === length && showPlaceholder" :class="klass.placeholder">{{placeholder}}</span>
            </typing>
            <tag v-if="index !== length"
                 :text="item.text" :remove="getRemoveHandle(item, index)" :invalid="item.invalid">
            </tag>
        </template>
    </div>
</template>
<style scoped>
    .tags-input {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        box-shadow: 0 0 0.15rem rgba(0, 0, 0, 0.3);
        padding: 0 7px 0 7px;
    }

    .placeholder {
        display: inline-block;
        color: #A9A9A9;
        line-height: 2em;
        white-space: nowrap;
    }
</style>
<script>
    import Vue from 'vue'
    import {arr, obj} from 'vuept'

    import typing from './typing.vue'
    import tag from './tag.vue'

    const klass = {
        container: 'tags-input',
        input: 'input',
        gap: 'gap',
        tag: 'tag',
        placeholder: 'placeholder'
    };

    export default Vue.component('tags-input', {
        components: {tag, typing},
        props: {
            tags: arr.required,
            placeholder: String,
            klass: obj.default(() => klass),
        },
        data() {
            return {
                typingIndex: -1
            }
        },
        computed: {
            normalizeTagItems() {
                return this.tags.map(item => typeof item === 'string' ? {text: item} : item).concat(null)
            },
            showPlaceholder() {
                return this.placeholder && this.typingIndex < 0
            },
            length() {
                return this.tags.length
            }
        },
        methods: {
            focus(index) {
                if (this.typingIndex === -1) {
                    this.$emit('focus', index)
                }
                this.typingIndex = index
            },
            blur(index) {
                if (index === this.typingIndex) {
                    this.$emit('blur', index);
                    this.typingIndex = -1
                }
            },
            removeTag(index) {
                if (index >= 0 && !this.tags[index].readOnly) {
                    this.$emit('tags-change', index, undefined)
                }
            },
            insertTag(index, text) {
                this.$emit('tags-change', index, text)
            },
            activeOther(index) {
                if (index >= 0 && index <= this.length) {
                    this.typingIndex = index
                }
            },
            getRemoveHandle(item, index) {
                return item.readOnly ? null : () => this.removeTag(index)
            }
        }
    })
</script>
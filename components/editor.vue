<template>
    <div class="markdown-editor">
        <div class="row">
            <div class="col-md-6">
                <textarea class="form-control contentEditor" ref="editor" title="" placeholder="Nội dung..."
                          v-model="source" @scroll="scroll"></textarea>
            </div>
            <div class="col-md-6 contentPreview" ref="content" style="height: 600px; overflow-y: auto">
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import * as marked from 'marked'
    import {Renderer} from 'marked'

    import highlightjs from 'highlight.js';

    export default Vue.component('markdown-editor', {
        props: {
            value: String
        },
        data() {
            return {
                source: this.value
            }
        },
        watch: {
            source(val) {
                this.$emit('input', val);
                this.$refs.content.innerHTML = this.marked(val);
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.$refs.content]);
            }
        },
        mounted() {
            MathJax.Hub.Config({
                tex2jax: {
                    inlineMath: [["$", "$"], ["\\(", "\\)"]]
                }
            });

            const renderer = new Renderer();
            renderer.code = (code, language) => {
                language = language ? language : 'js';
                const validLang = !!(language && highlightjs.getLanguage(language));
                const highlighted = validLang ? highlightjs.highlight(language, code).value : code;
                return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
            };

            renderer.table = (header, body) => {
                return `<table class="table table-bordered">${header}${body}</table>`
            };

            this.marked = marked.setOptions({
                renderer: renderer
            });

            this.$refs.content.innerHTML = this.marked(this.source ? this.source : '');

            MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.$refs.content]);
        },
        methods: {
            scroll(e) {
                let target = e.target;
                let percent = target.scrollTop / (target.scrollHeight - target.offsetHeight);
                this.$refs.content.scrollTop = (this.$refs.content.scrollHeight - this.$refs.content.offsetHeight) * percent
            }
        }
    })
</script>
<style>
    .markdown-editor {
        border: solid 1px #9f9f9f;
        border-radius: 4px;
        padding: 5px 15px 5px 5px;
        opacity: 0.7;
    }

    .contentEditor {
        height: 600px !important;
        border: none;
        outline: none !important;
        box-shadow: none !important;
        resize: none;
    }

    .contentPreview .table {
        width: auto !important;
    }

    .contentPreview th {
        background-color: rgba(90, 212, 218, 0.24);
    }
</style>
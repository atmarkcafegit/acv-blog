<template>
    <div :class="{'markdown-editor': true, border: previewMode !== 3}">
        <div class="row">
            <div :class="editorClass" ref="editor">
                <textarea class="form-control contentEditor" ref="editor" title=""
                          placeholder="Nội dung..." v-model="source" @scroll="scroll"></textarea>
            </div>
            <div :class="previewClass" ref="content"></div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import marked, {Renderer} from 'marked'

    import highlightjs from 'highlight.js';

    export default Vue.component('markdown-editor', {
        props: {
            value: String,
            previewMode: Number
        },
        data() {
            return {
                source: this.value,
                editorClass: 'col-md-6',
                previewClass: 'col-md-6 contentPreview'
            }
        },
        watch: {
            source(val) {
                this.$emit('input', val);
                this.$refs.content.innerHTML = this.marked(val);
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.$refs.content]);
            },
            previewMode(val) {
                this.render(val)
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

            this.render(this.previewMode)
        },
        methods: {
            scroll(e) {
                let target = e.target;
                let percent = target.scrollTop / (target.scrollHeight - target.offsetHeight);
                this.$refs.content.scrollTop = (this.$refs.content.scrollHeight - this.$refs.content.offsetHeight) * percent
            },
            render(val) {
                if (val === 1) {
                    this.editorClass = 'col-md-12';
                    this.previewClass = 'hidden'
                } else if (val === 2) {
                    this.editorClass = 'hidden';
                    this.previewClass = 'col-md-12 contentPreview'
                } else if (val === 3) {
                    this.editorClass = 'hidden';
                    this.previewClass = 'col-md-12 contentPreview preview';
                } else {
                    this.editorClass = 'col-md-6';
                    this.previewClass = 'col-md-6 contentPreview';
                }
            }
        }
    })
</script>
<style>
    .markdown-editor {
        border-radius: 4px;
        padding: 5px;
        opacity: 0.7;
    }

    .border {
        border: solid 1px #9f9f9f;
    }

    .contentEditor {
        height: 590px !important;
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
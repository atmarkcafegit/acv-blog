<template>
    <div class="markdown-editor">
        <textarea></textarea>
    </div>
</template>
<script>
    import Vue from 'vue'

    export default Vue.component('markdown-editor', {
        props: {
            value: String
        },
        ready() {
            this.initialize();
        },
        mounted() {
            this.initialize();
        },
        watch: {
            value(val) {
                if (val === this.simplemde.value())
                    return;

                this.simplemde.value(val);
            },
        },
        methods: {
            initialize() {
                let configs = {
                    element: this.$el.firstElementChild,
                    renderingConfig: {
                        codeSyntaxHighlighting: true
                    }
                };

                this.simplemde = new SimpleMDE(configs);

                this.simplemde.codemirror.on('change', () => {
                    this.$emit('input', this.simplemde.value());
                });
            }
        }
    })
</script>
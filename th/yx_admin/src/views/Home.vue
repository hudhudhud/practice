<template>
    <div class="home">
            home
        <!--<Tinymce ref="editor" :height="200" v-model="editorContext" />-->
    </div>
</template>

<script>
    import Tinymce from '@/components/Tinymce'
    // @ is an alias to /src
    export default {
        name: 'home',
        components:{
            Tinymce,
        },
        data: function () {
            return {
                list: [],
                editorContext:`<h5 >
                       hello world
                    </h5>`
            }
        },
        mounted: function () {
           // this.getList();
        },
        methods: {
        }
    }
</script>
<style lang="scss" scoped>
    .home{
        height: rem(100);
        color: $color;
    }
</style>

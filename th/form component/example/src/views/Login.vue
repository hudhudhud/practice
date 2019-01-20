<template>
  <div class="about">
    <h1>This is an login page</h1>
  </div>
</template>
<script>
    export default {
        name: 'login',
        components: {},
        data: function () {
            return {

            }
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        mounted: function () {
            // this.getList();
        },
        methods: {

        }
    }
</script>

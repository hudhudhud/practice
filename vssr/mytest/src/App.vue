<template>
<div id="app">
        <router-link class="link" to="/view/one">one</router-link>
        <router-link class="link" to="/view/two">two</router-link>
 
        <router-view class="view"></router-view>

</div>
</template>
<script >
export default  {
    data:{
        msg:"hello world"
    }
}
</script>
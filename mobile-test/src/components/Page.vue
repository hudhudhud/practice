<template>
    <section class="page">
        <Header/>
        <div class="content">
            <slot></slot>
        </div>
        <Footer/>
    </section>
</template>
<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
export default {
    components: {
        Header,
        Footer
    }
}
</script>
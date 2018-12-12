export default {
  props: ['show'],
  data () {
    return {
      isShow: this.show
    }
  },
  watch: {
    show (val) {
      this.isShow = val
    }
  },
  methods: {
    toggleShow () {
      this.isShow = !this.isShow
      this.$emit('update:show', this.isShow)
      console.log('toggle')
    }
  }
}

<template>
  <div  class="picker">
    <mt-popup
      style="width: 100%;"
      v-model="popupVisible"
      position="bottom">
      <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
    </mt-popup>
    <div @click="popupVisible=true">
      <slot ></slot>

    </div>
  </div>
</template>

<script>
  export default {
    name: "picker",
    props: {
      range: null
    },
    data: function() {
      return {
        popupVisible: false,
        slots: [
          {
            flex: 1,
            values: this.range,
            className: 'slot1',
            textAlign: 'center'
          }
        ],
        index: 0
      };
    },
    watch: {
      popupVisible: function(n) {
        if(!n){
          this.$emit('change', {target: {value: this.index}})
        }
      }
    },
    methods:{
      onValuesChange: function(e,v) {
        this.index = this.range.findIndex( i => {
          return i === v[0];
        });
      }
    }
  };
</script>

<style scoped lang="scss">

  .picker{
    width: 100%;
  }
</style>

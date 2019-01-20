<!--<addressSelect :option="addressInfo" @addSelect="addressSelected" @fullClose="addressShow=false" v-if="addressShow"></addressSelect>-->
<!--addressSelected (value, status) {
  this.addressInfo = value
  this.addressInfo.finished = !status
  this.addressShow = status
  console.log(this.addressInfo.finished)
},-->
<template>
  <div>
    <div class="address_box" @click.stop="stopNext">
      <div class="box_header">
        <div @click="checkTab(1)" :class="{selected: (stepIndex==1)}">省份</div>
        <div @click="checkTab(2)" :class="{selected: (stepIndex==2)}">城市</div>
        <div @click="checkTab(3)" :class="{selected: (stepIndex==3)}">县区</div>
      </div>
      <div class="address_content">
        <ul class='a'>
          <li v-for="item in list" :class="{li_select: item.item_code == addressList[stepIndex-1]}"
              @click.stop="selectValue(item.item_name, item.item_code)"
              :style="{width: (item.item_name.length > 4 ? 135:'')+'px'}"
              v-if="list.length > 0">
            <span>{{item.item_name}}</span>
          </li>
          <span style="font-size: 12px;color: #999;" v-if="list.length == 0">正在加载中。。。</span>
        </ul>
      </div>
    </div>
    <div class="address_back" @click.stop="fullBackClose">

    </div>
  </div>
</template>
<script type="text/babel">
  import servicesClient from '../services'
  export default {
    components: {},
    computed: {},
    props: ['option'],
    data () {
      return {
        stepIndex: 1,
        addressInfo: [],
        addressList: [],
        list: [],
        options: {
          province: [],
          citys: [],
          county: []
        }
      }
    },
    watch: {
    },
    methods: {
      stopNext (e) {
        // console.log(e)
      },
      checkTab (step) {
        this.stepIndex = step
        this.stepIndexCheck()
      },
      selectValue (value, code) {
        switch (this.stepIndex) {
          case 1:
            if (this.addressList[0] === code) {
              break
            }
            this.addressInfo = [value]
            this.addressList = [code]
            break
          case 2:
            if (this.addressList[1] === code) {
              break
            }
            this.addressInfo = [this.addressInfo[0]]
            this.addressInfo.push(value)
            this.addressList = [this.addressList[0]]
            this.addressList.push(code)
            break
          case 3:
            this.addressInfo[2] = value
            this.addressList[2] = code
            break
        }
        console.log(this.addressList)
        this.$emit('addSelect', {value: this.addressInfo, code: this.addressList}, (this.stepIndex !== 3))
        this.stepIndex += 1
        this.stepIndexCheck()
      },
      stepIndexCheck () {
        switch (this.stepIndex) {
          case 1:
            this.list = this.options.province
            break
          case 2:
            this.list = []
            servicesClient.zone_listCities({provinceId: this.addressList[0]}).then((data) => {
              data = data.data
              if (data && data.status === 0) {
                this.list = data.data.map((item) => {
                  let some = {
                    item_name: item.cityName,
                    item_code: item.cityId
                  }
                  return some
                })
              } else {
                this.list = []
              }
            })
            break
          case 3:
            this.list = []
            servicesClient.zone_listCounties({cityId: this.addressList[1]}).then((data) => {
              data = data.data
              if (data && data.status === 0 && data.data.length > 0) {
                this.list = data.data.map((item) => {
                  let some = {
                    item_name: item.countyName,
                    item_code: item.countyId
                  }
                  return some
                })
              } else {
                this.list = []
                this.$emit('addSelect', {value: this.addressInfo, code: this.addressList}, false)
              }
            })
            break
        }
      },
      fullBackClose () {
        this.$emit('fullClose')
        if (!this.option.finished) {
          this.$emit('addSelect', {value: [], code: []}, false);
        }
      }
    },
    beforeDestroy () {
    },
    mounted () {
      servicesClient.zone_listProvince().then((data) => {
        data = data.data
        if (data && data.status === 0) {
          this.list = this.options.province = data.data.map((item) => {
            let some = {
              item_name: item.provinceName,
              item_code: item.provinceId
            }
            return some
          })
        } else {
          this.list = []
        }
        this.stepIndexCheck()
      })
      this.addressList = this.option.code
      this.addressInfo = this.option.value
      this.stepIndex = this.option.value.length || 1
    }
  }
</script>
<style scoped lang="less" rel="stylesheet/less">
  .address_box{
    width: 250px;
    height: 250px;
    border: 1px solid #d8d8d8;
    background: #fff;
    box-shadow: 0 5px 5px 2px #eee;
    position: absolute;
    margin-top: -2px;
    z-index: 11;
    .box_header{
      column-count: 3;
      column-gap: 0px;
      div{
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: #eeeeee;
        border: 1px solid #d8d8d8;
        border-top: none;
      }
      .selected{
        background: #fff;
        color: #3e8af4;
        border: none;
      }
    }
    .address_content{
      box-sizing: border-box;
      width: 100%;
      height: 215px;
      overflow: auto;
      padding: 20px 0 0 16px;
      ul{
        text-align: left;
        z-index:10;
        li{
          min-width: 60px;
          margin-right: 15px;
          float: left;
          margin-top: 10px;
          cursor: pointer;
          background: #ffffff;
        }
        .li_select span{
          color: #3e8af4;
          background: #d8e8fd;
          border-radius: 2px;
          padding: 0 3px;
        }
      }
    }
  }
  .address_back{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
</style>

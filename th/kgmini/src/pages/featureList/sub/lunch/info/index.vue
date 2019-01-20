<template>
  <div>
    <div class="card">
      <div class="title">
        <span class="tag"></span>
        <span>介绍</span>
      </div>
      <div class="content">
        <p class="text">{{info.desc}}</p>
      </div>
    </div>
    <div class="card">
      <div class="title">
        <span class="tag" style="background-color: #756EFD;"></span>
        <span>资质</span>
      </div>
      <div class="content">
        <img class="zz-img" :src="info.businessLicenseUrl" alt="" @click="showBigPhoto(info.businessLicenseUrl)">
        <img class="zz-img" :src="info.healthLicenseUrl" alt="" @click="showBigPhoto(info.healthLicenseUrl)">
      </div>
    </div>

    <div class="card">
      <div class="title">
        <span class="tag" style="background-color: #F73C49;"></span>
        <span>菜谱</span>
      </div>
     <table>
       <thead>
       <tr>
         <td>年级</td>
         <td v-for="item in info.lunchs" :key="item.classId">{{item.gradeName}}</td>
       </tr>
       </thead>
       <tbody>
       <tr>
         <td>午餐内容</td>
         <td v-for="item in info.lunchs" :key="item.classId">{{item.lunchContent}}</td>
       </tr>
       </tbody>
     </table>
    </div>
    <div class="evaluateList" v-if="id">
      <EvaluateList tabs :id="id"  type="2" />
    </div>
  </div>
</template>

<script>
  import EvaluateList from '@/components/global/evaluateList'
  import { querySupplier } from "../../../../../service/featureList/lunch";
    export default {

    name: "index",
    components: {
      EvaluateList
    },
    data: function(){
      return {
        id: '',
        info: {}
      }
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.id = this.route().query.id;
      this.getInfo();
    },
    methods: {
      showBigPhoto: function(img){
        wx.previewImage({
          current: img, // 当前显示图片的http链接
          urls: [img] // 需要预览的图片http链接列表
        });
      },
      getInfo:async function() {
        this.info = await querySupplier({id: this.id});
        // this.info.lunchs.forEach(i => {
        //   i.gradeName = i.gradeName[0];
        // });
      }
    }
  };
</script>

<style scoped lang="scss">


  .text {
    font-size: rpx(28);
    color: #5B5B5B;
  }

  .content {
    box-sizing: border-box;
    padding: rpx(30) rpx(40);
  }
  .zz-img{
    margin-right: rpx(30);
    width: rpx(190);
    height: rpx(190);
  }
  table{
    font-size: rpx(24);
    color: #313131;
    text-align: center;
    width: 100%;
    thead{
      td{
        white-space: nowrap;
      }
    }
    tbody{
      td{
        border-top: 1px solid $border;
      }
    }
    td{
      padding: rpx(10);
      border-left: 1px solid $border;
    }
    td:first-of-type{
      border-left: none;
    }
  }
</style>

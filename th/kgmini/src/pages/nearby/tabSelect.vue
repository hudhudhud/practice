<template>
  <div class="fixed-content" @click.stop="" :class="{open: selectStatus}">
    <template v-if="tabActive===2">
      <div class="roles">
        <div class="role" v-for="(item, index) in roles" :key="item.value" @click="roleChange(item.value)"
             :class="{select: roleSelect[item.value]}">{{item.name}}
        </div>
      </div>
    </template>
    <template v-if="tabActive===3">
      <div class="box">
        <div class="selects">
          <div class="select" :class="{active: select===0}" @click="selectCheck(0)">适用年龄</div>
          <div class="select" :class="{active: select===1}" @click="selectCheck(1)">内容</div>
        </div>
        <div class="options" v-if="select===0">
          <div class="option" :class="{active: optionSelect[item.value]}" @click="optionChange(item.value)"
               v-for="(item, index) in options" :key="item.value">{{item.label}}
          </div>
        </div>
        <div v-else class="catalog">
          <scroll-view scroll-y="true" class="catalog1s">
            <div class="catalog1"
                 v-for="(item, index) in catalogs" :key="item.id" @click="catalogChange(index)" :class="{active: catalogSelect === index}">{{item.termName}}
            </div>
          </scroll-view>
          <scroll-view scroll-y="true" class="catalog2s">
            <div class="catalog2" :class="{active: catalog2Select[item.id]}" @click="catalog2Change(item.id)"
                 v-for="(item, index) in catalog2s" :key="item.id">{{item.termName}}
            </div>
          </scroll-view>
        </div>
      </div>
    </template>
    <div class="btns" v-if="tabActive===3||tabActive===2">
      <div class="cancel" @click="handleClick('cancel')">取消</div>
      <div class="ok" @click="handleClick('ok')">确认选择</div>
    </div>
  </div>


</template>

<script>
  import { listFirst, listGrades, listSecond } from "../../service/tabs/nearby";

  export default {

    name: "tab-select",
    props: ["tabActive", "selectStatus"],
    data: function() {
      return {
        roles: [{name: '培训学校',value: 1}, {name: '培训机构',value: 2}, {name: '俱乐部',value:3}, {name:'个体工作室',value:4}, {name: '未认证', value:0}],
        roleSelect: {},
        select: 0,
        options: [],
        optionSelect: {},
        catalogs: [],
        catalogSelect: null,
        catalog2s: [],
        catalog2Select: {}
      };
    },
    created: function() {
      this.getOptionsData();
      this.listFirst();
    },
    onUnload:function(){
      this.roleSelect = {};
      this.optionSelect = {};
      this.catalogSelect = null;
      this.catalog2Select = {};
      this.handleClick('ok')
    },
    methods: {
      // 属性
      roleChange: function(n) {
        this.$set(this.roleSelect, n, !this.roleSelect[n]);
      },
      //筛选
      selectCheck: function(n) {
        this.select = n;
      },
      optionChange: function(n) {
        this.$set(this.optionSelect, n, !this.optionSelect[n]);
      },
      catalogChange: function(n) {
        this.catalog2s = [];
        this.catalog2Select = {};
        if(this.catalogSelect !== n){
          this.catalogSelect = n;
          this.listSecond(this.catalogs[this.catalogSelect].id);
        }else{
          this.catalogSelect = 'noSelect';
        }

      },
      catalog2Change: function(n) {
        this.$set(this.catalog2Select, n, !this.catalog2Select[n]);
      },
      handleClick: function(n) {
        let search = {};
        if (n === "ok") {
          switch (this.tabActive) {
            case 2:// 属性选择
              let natures = Object.keys(this.roleSelect);
              natures = natures.filter(i => {
                return this.roleSelect[i];
              }).join(",")
              search = {
                natures: natures
              };
              if(!search.natures)
                delete search.natures;
              break;

            case 3: // 筛选
              // 准备 适用年级数据
              search.grades = Object.keys(this.optionSelect).filter(i => {
                return this.optionSelect[i];
              }).join(',');
              if (!search.grades) {
                delete search.grades;
              }
              // 准备目录 条件
              if(typeof this.catalogSelect === 'number'){
                let data = Object.keys(this.catalog2Select);
                data = data.filter(i =>{
                  return this.catalog2Select[i];
                })
                if(data.length){
                  // 二级
                  search.termTaxonomyIds = data.join(",");
                }else{
                  // 一级
                  search.termTaxonomyIds = this.catalogs[this.catalogSelect].id
                }
              }
              break;
          }
        }
        this.$emit("handleClick", { type: n, search: search });
      },
      /**
       * 获得适用年级列表
       */
      getOptionsData: async function() {
        this.options = await listGrades();
      },
      /**
       * 获得一级目录
       */
      listFirst: async function() {
        const data = await listFirst();
        this.catalogs = data.list;
       // this.listSecond(this.catalogs[0].id);
      },
      /**
       * 获得二级目录
       */
      listSecond: async function(id) {
        const data = await listSecond({parentId: id});
        this.catalog2s = data.list;
      }
    }
  };
</script>

<style scoped lang="scss">


  .box {
    height: rpx(688);
    @extend %flex;
  }

  .selects {
    height: 100%;
    width: rpx(224);
    font-size: rpx(28);
    color: #5B5B5B;
    text-align: center;
    .select {
      line-height: rpx(88);
    }
    .select.active {
      color: #313131;
      font-size: rpx(30);
      background-color: #ededed;
      font-weight: bold;
    }
  }

  .catalog {
    flex: 1;
    height: 100%;
    background-color: #ededed;
    @extend %flex;
    .active {
      background-color: $them !important;
      color: #000 !important;
      border-color: $them !important;
    }
    .catalog1s {
      text-align: center;
      width: rpx(196);
      .catalog1 {
        display: inline-block;
        border-radius: rpx(4);
        margin: rpx(30) auto 0;
        min-width: rpx(136);
        height: rpx(50);
        line-height: rpx(50);
        font-size: rpx(26);
        color: #5B5B5B;
        border: 1px solid #5B5B5B;
      }
    }
    .catalog2s {
      flex: 1;
      background-color: #CBCBCB;
      padding-top: rpx(10);
      .catalog2 {
        border-radius: rpx(4);
        margin: rpx(20) 0 0 rpx(18);
        border: 1px solid #5B5B5B;
        display: inline-block;
        height: rpx(50);
        padding: 0 rpx(17);
        line-height: rpx(50);
        color: #5B5B5B;
        font-size: rpx(26);
      }
    }
  }

  .options {
    flex: 1;
    height: 100%;
    background-color: #ededed;
    .option {
      border-radius: rpx(4);
      margin: rpx(30) 0 0 rpx(30);
      border: 1px solid #5B5B5B;
      display: inline-block;
      height: rpx(50);
      padding: 0 rpx(30);
      line-height: rpx(50);
      color: #5B5B5B;
      font-size: rpx(26);
    }
    .option.active {
      border-color: $them;
      background-color: $them;
      color: #000;
    }
  }

  .fixed-content {
    @include transition(transform .3s ease-out);
    position: absolute;
    top: rpx(188);
    left: 0;
    width: 100%;
    z-index: 9;
    @include translate(0, -100%);
    padding-bottom: rpx(88);
    background-color: #fff;
    .roles {
      padding-top: rpx(10);
      padding-left: rpx(10);
      padding-bottom: rpx(60);
      .role {
        border-radius: rpx(8);
        padding: 0 rpx(23);
        margin-bottom: rpx(30);
        display: inline-block;
        margin-left: rpx(20);
        vertical-align: middle;
        height: rpx(48);
        line-height: rpx(48);
        color: #5B5B5B;
        font-size: rpx(26);
        background-color: #EDEDED;
      }
      .select.role {
        background-color: $them;
        color: #000;
      }
    }
    .btns {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: rpx(88);
      line-height: rpx(88);
      font-size: rpx(32);
      color: #000;
      text-align: center;
      @extend %flex;
      div {
        flex: 1;
        background-color: $them;
      }
      .cancel {
        background-color: #EDEDED;
        color: #5B5B5B;
      }
    }
  }

  .fixed-content.open {
    @include translate(0, 0)
  }
</style>

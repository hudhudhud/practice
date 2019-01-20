<template>
    <div :class="{'search-page': searchShow}" >
        <div class="search">
            <div class="gray">
                <img src="../../assets/img/home/search_icon.png" alt="">
                <input type="search" placeholder="请输入商品关键字" v-model="search" @focus="handleFocus" @keyup.enter="change">
            </div>
            <span v-show="searchShow" class="clear" @click="handleClear">取消</span>
        </div>
        <div class="result" v-show="searchShow">
            <Shop v-if="result.length" :classify="result"/>
            <div v-else class="history">
                
                <div class="group" v-if="history.length">
                    <div class="title">
                        <span>搜索历史</span>
                        <i class="iconfont icon-shanchu" @click="clearSearchHistory"></i>
                    </div>
                    <div class="content">
                        <div class="his-item" v-for="item in history" :key="item" @click="handleSearch(item)">{{item}}</div>
                    </div>
                </div>
                <div class="group">
                    <div class="title">
                        <span>热搜榜</span>
                    </div>
                    <div class="content">
                        <div class="his-item" v-for="item in hotSearch" :key="item" @click="handleSearch(item)">{{item}}</div>
                        <div class="his-item" v-if="!hotSearch.length">暂无</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import lodash from 'lodash';
    import {findHotSearch, findProductList} from "../../service/home.service";
    import Shop from '@/components/home/shop'
    export default {
        name: "search",
        components: {
            Shop
        },
        data: function () {
            return {
                search: '',
                searchShow: false,
                result: [],
                history: [],
                hotSearch: []
            }
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        watch: {
            search: function (n) {
                if(!n){
                    this.clearInput();
                }
            }
        },
        methods: {
            handleFocus: function(){
                this.searchShow = true;
                this.getHistory();
                if(!this.hotSearch.length){
                    this.getHotSearch();
                }
                $('body').css('overflow-y','hidden');
            },
            handleClear: function(){
                this.search = '';
                this.result = [];
                this.searchShow = false;
                $('body').css('overflow-y','auto');
            },
            clearInput: function(){
                this.result = [];
            },
            //备用
            handleChangeAfter: lodash.debounce(function () {
                this.change();
            }, 500),
            change: async function () {
             //   this.$emit('change', this.search);
                if(!this.search){
                    return;
                }
                const res = await findProductList({pageNo: 1,pageSize: 10, title: this.search,types: '0,1,2,3,4'});
                if(res.status === '0'){
                    this.result = res.data.list;
                    this.saveSearchHistory(this.search);
                    if(!this.result.length){
                        this.$toast('没有结果');
                    }
                }
            },

            handleSearch: function(search){
                this.search = search;
                this.change();
            },
            clearSearchHistory:async function(){
                await this.confirm('确定清除历史搜索记录吗?', '确认');
                localStorage.removeItem('searchHistory');
                this.getHistory();
            },
            saveSearchHistory: function (his) {
                let history = JSON.parse(localStorage.getItem('searchHistory'))||[];
                history.push(his);
                localStorage.setItem('searchHistory', JSON.stringify([...new Set(history)]));
                this.getHistory();
            },
            getHistory: function () {
                this.history = JSON.parse(localStorage.getItem('searchHistory'))||[];
            },
            getHotSearch: async function () {
              const res =await  findHotSearch({pageNo: 1,pageSize:20});
              if(res.status === '0'){
                this.hotSearch = res.data.sort((a,b) => {
                    return b.sort-a.sort;
                }).map(i => {
                    return i.content
                });
              }
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";
    .search-page{
        z-index: 50;
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        @extend %flex;
        @extend %flex-column;
      //  background-color: #ffffff;
    }
    @keyframes show {
        0%{
            transform: translateY(7%);
        }
        100%{
            transform: translateY(0);
        }
    }
    .result{
        overflow-y: auto;
        animation: show .2s ease-out;
        background-color: #ffffff;
        flex:1;
    }
    .search {
        overflow: hidden;
        height: rem(50);
        background-color: #ffffff;
        @extend %flex;
        @extend %flex-align-center;
        .clear{
            display: inline-block;
            width: rem(50);
            text-align: center;
        }
    }
    .gray{
        box-sizing: border-box;
        padding-right: rem(20);
        border-radius: rem(15);
        margin-left: rem(15);
        width: rem(345);
        height: rem(29);
        background-color: darken(#F7F7F7, 5%);
        @extend %flex;
        @extend %flex-align-center;
        img{
            margin: 0 rem(9) 0 rem(17);
            width: rem(13);
            height: rem(13);
        }
        input{
            height: rem(20);
            flex: 1;
            background-color: transparent;
            font-size: rem(12);
        }
    }

    .history{
        padding-top: rem(10);
        .group{
            margin-top: rem(15);
        }
        .title{
            padding: 0 rem(15);
            @extend %flex;
            @extend %justify-content-space-between;
            font-size: rem(13);
            color: #333333;
        }
        .content{
            padding: rem(10) rem(7) 0;
        }
        .his-item{
            margin-left: rem(10);
            margin-bottom: rem(10);
            padding: 0 rem(19);
            display: inline-block;
            height: rem(26);
            line-height: rem(26);
            font-size: rem(13);
            color: #666666;
            background-color: #F1F4F3;
            border-radius: rem(13);
        }
    }
</style>
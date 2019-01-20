<template>
    <div >
       <div class="fixed" style="z-index: 50">
           <Search/>
       </div>
        <div class="classification">
            <div class="select"></div>
            <div class="selects fixed">
                <div class="select" v-for="(item, index) in list" @click="activeChange(index)"
                     :class="{active: active===index}">{{item.name}}
                </div>
            </div>

            <div class="options">
                <div class="group" v-for="two in childList[active]" :key="two.id">
                    <div class="title">{{two.name}}</div>
                    <div class="items">
                        <div class="item" v-for="item in two.list" :key="item.id" @click="toDetail(item.id)">
                            <img :src="item.image||require('../../assets/images/logo.jpg')"  alt="">
                            <p>{{item.name}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Search from '@/components/global/search'
    import {findThirdProductTypeList, findTypeList} from "../../service/home.service";

    export default {
        name: "classification",
        components: {
            Search
        },
        data: function () {
            return {
                active: 0,
                list: [],
                childList: []
            }
        },
        computed: {},
        created: function () {
            this.getData();
        },
        methods: {
            activeChange: function (n) {
                this.active = n;
              //  this.getChildList(this.list[this.active].id);
            },
            getData: async function () {
                const res = await findTypeList();
                if (res.status === '0') {
                    this.list = res.data.filter( i => {
                        return i.name !== '套餐';
                    });
                    for(let i =0;i<this.list.length;i++){
                        findThirdProductTypeList({id: this.list[i].id}).then(
                            res => {
                                if(res.status === '0'){
                                    this.$set(this.childList, i, res.data.list)
                                }
                            }
                        );
                    }
                  //  this.getChildList(this.list[0].id);
                }
            },
           toDetail: function (id) {
               this.$router.push('/home/classifyList?' + 'id=' + id+'&resource=class');
           }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";
    .fixed {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
    }
    .selects.fixed{
        width: auto;
        position: fixed;
        left: 0;
        top: rem(50);
    }
    .classification {
        margin-top: rem(50);
        @extend %flex;
        .selects {
            width: rem(90);
        }
        .select {
            box-sizing: border-box;
            width: rem(90);
            height: rem(50);
            line-height: rem(50);
            font-size: rem(15);
            color: #666666;
            text-align: center;
        }
        .select.active {
            background-color: #ffffff;
            border-left: 5px solid $them;
        }

        .options {
            flex: 1;
            .group {
                margin-bottom: rem(10);
                background-color: #ffffff;
                .title {
                    text-indent: rem(15);
                    height: rem(48);
                    line-height: rem(48);
                    font-size: rem(13);
                    color: #333333;
                }
                .items {
                    @extend %flex;
                    @extend %flex-align-center;
                    @extend %flex-wrap;
                }
                .item {
                    margin-bottom: rem(15);
                    width: 33.33%;
                    text-align: center;
                    img {
                        width: rem(70);
                        height: rem(70);
                        display: block;
                        margin: 0 auto;
                    }
                    p {
                        margin-top: rem(6);
                        font-size: rem(12);
                        color: #999999;
                    }
                }

            }
        }
    }
</style>
<template>
<section class="index">
    <!-- <mt-search
        v-model="searchVal"
        cancel-text="取消"
        placeholder="大家正在搜索：连衣裙"
        :result.sync="result">
    </mt-search> -->
    <div class="top">
        <div class="top-img">
            <img src="https://h2.appsimg.com/b.appsimg.com/upload/mst/2019/06/13/198/41996e8b47cac32728f496c100eb18e2.gif!75.webp" alt="">
        </div>
        <div class="time-cal clearfix">
            <span class="left">距离抢购结束还剩</span>
            <span class="count" v-if='msecond!=="00"'>{{hour}} : {{minute}} : {{second}} : {{msecond}}</span>
            <span class="count none" v-else>{{day}} 天 {{hour}} 时 {{minute}} 分 {{second}} 秒 {{msecond}}</span>
        </div>
    </div>
    <div class="mst-purchase">
        <p class="title"></p>
        <div class="six" @click='go'>
            <div class="one"></div>
            <div class="two"></div>
            <div class="three"></div>
            <div class="four"></div>
            <div class="five"></div>
            <div class="six"></div>
        </div>
    </div>
    <div class="scroll-list" >
        <div :class="{'menu':true,fixed}">
            <div class="item current-select" :style="`transform:translateY(${currentIndex*7.5}rem)`"><p class="current"></p></div>
            <p v-for="(item,i) in list" :key="i" class="item"  @click="currentIndex=i">
               <span class="name"> {{item.key}} </span>
            </p>
        </div>
        <div :class="{'pro-list':true,fixed}">
            <div :class="{'item':true,['item_'+i]:true}" v-for='(pro,i) in current.proList' :key='i'>
                {{pro}}
            </div>
        </div>
    </div>
 
</section>
</template>

<script>
import { throttle } from 'lodash'
export default {
  data(){
      return {
          day:'',
          hour:'',
          minute:'',
          second:'',
          msecond:'',
          endDay:(new Date(2019,5,21,12)),
          timeId:'',
          searchVal:'',
          result:[1,2,3,4],
          list:[
              {key:'精选专场',proList:[1,2,3,4,56,7,8,9,9,9,9,9,9,9]},
              {key:'logo-T',proList:[]},
              {key:'男t',proList:[]},
              {key:'男k',proList:[]},
              {key:'女t',proList:[]},
              {key:'女k',proList:[]},
              {key:'女裙',proList:[]},
              {key:'童装t',proList:[]},
              {key:'连体衣',proList:[]},
          ],
          current:{},
          currentIndex:0,
          fixed:false,
      }
  },
  mounted(){
        this.getTime()
        this.current=this.list[0]
        document.addEventListener('scroll',throttle(
            (()=>{
                    let y_pro=document.getElementsByClassName('pro-list')[0].getBoundingClientRect().y
                    if(y_pro<0){
                         this.fixed=true
                    }
                    else{
                        this.fixed=false
                    }

                    Array.from(document.querySelectorAll('.pro-list .item')).find((item,i)=>
                                    { 
                                        if(item.getBoundingClientRect().y>0){
                                            this.currentIndex= i
                                            return item
                                        }
                                    }
                                )
                }
            ),200)
        )
  },
  methods:{
      getTime(){
        clearTimeout(this.timeId)
        let now=Date.now()//需要去服务器拿时间，保证时间一致，否则客户端如果时间不一致会造成误差，初始化的时候拿一次就好了
        let end=this.endDay.getTime()
        let lefttime=parseInt((end-now)/1000)
        if(lefttime<=0){
             this.day=this.formatStr(0,1)
             this.hour=this.formatStr(0)
             this.minute=this.formatStr(0)
             this.second=this.formatStr(0)
             this.msecond=this.formatStr(0)
             return
        }

        let ms=parseInt((end-now)%1000/100)//毫秒缩小100倍，即以1代表100，那10就是1000就是1秒，所以计时器需要100毫秒处理一次
        let s=parseInt(lefttime%60)
        let m=parseInt(lefttime/60%60)
        let h=parseInt(lefttime/(60*60)%24)
        let d=parseInt(lefttime/(60*60*24))

        this.day=this.formatStr(d)
        this.hour=this.formatStr(h)
        this.minute=this.formatStr(m)
        this.second=this.formatStr(s)
        this.msecond=ms

        this.timeId=setTimeout(this.getTime,100)
      },
      formatStr(str,len=2,s='0'){
          let res=str
          let strLen=0
          if(typeof str === 'string'){
              strLen=str.length
          }
          else{
              strLen=String(str).length
          }
          if(len>strLen){
              res=(new Array(len-strLen+1)).join(s)+(str+'')
          }
          return res
      },
      go(e){
          if(e.target.classList.length>0){
            console.log(e.target.classList[0])
          }
      }
  }

}
</script>
<style lang="less" scoped>
.top{
    position:relative;
     width:100%;
    .top-img{
        width:100%;
        img{
            width:100%;
        }
    }
    .time-cal{
        position:absolute;
        box-sizing: border-box;
        bottom:0;
        left:0;
        width:100%;
        padding:0 2rem;
        background-color:#fd7e05;
        height:5.3rem;
        color:#fff;
        line-height:5.3rem;
        // display:flex;
        // align-items: center;
        // justify-content:space-between;
        .left{
            font-size:1.4rem;
            float:left;
        }
        .count{
            font-size:2.7rem;
            float:right;
            &.none{
                font-size:1.5rem;
            }
        }
    }

}
.mst-purchase{
    background-image:url(https://h2.appsimg.com/b.appsimg.com/upload/mst/2019/06/13/96/77bffacf0e89abafa9b835abc990e06e.jpg!75.webp);
    background-repeat: no-repeat;   
    background-size:cover; 
    width:100%;
    .title{
        width:100%;
        height: 6rem;
    }
    .six{
        width:100%;
        display:flex;
        box-sizing: border-box;
        justify-content:flex-start;
        flex-wrap: wrap;
        div{
          width: 50%;
          height:11rem;     
        }
    }
}

.scroll-list{    
    display: flex;
    flex-direction: row;
    .menu{
        max-height:100vh;
        overflow-y:scroll;
        display:inline-block;
        width:15%;
        position:relative; 
        .item{
            background-color:#ff7300;
            width:100%;
            height:7.5rem;
            padding:0 1rem;
            text-align: center;
            color:#fff;
            font-size:1.2rem;
            justify-content: center;
            box-sizing: border-box;
            word-break:break-word;
            display:flex;
            align-items: center;
            .name{
                position: relative;;
                z-index:3;
            }
            &.current-select{
                width:100%;
                background-color:#fff;
                position:absolute;
                padding:0;
                z-index:2;
                top:0;
                left:0;
                .current{
                    width:95%;
                    height:100%;
                    background-color:#ffab00;
                    margin-left:5%;
                    padding:0 1rem;
                    box-sizing: border-box;
                }
                transition: transform .2s linear;
            }             
        }
        &.fixed{
            position: fixed;
            top:0;
            left:0;
        }
    }
    .pro-list{
        &.fixed{
            margin-left:15%;
        }
        width:85%;
        .item{
            width:100%;
            height:10rem;
            border:1px solid;
            box-sizing: border-box;
        }
    }
}
</style>
<style  lang="less">
.index{
    width:100%;
    .mint-search{
        height:10rem;
    }
    .mint-searchbar-inner{
        border-radius:20px;
        border:1px solid #d9d9d9;
    }
    .mint-searchbar{
        background-color:#fff;
    }
}

</style>

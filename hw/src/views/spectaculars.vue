<template>
    <div :class="{spectaculars_page:!is_1366,spectaculars_page_is1366:is_1366}">
        <div class="spectaculars_header">
            <div class="s_h_title">
                <img src="/img/leqeelogo.png" alt="">
                <span>乐其双十一看板</span>
                <p>实时更新时间:{{time}}</p>
            </div>
        </div>
        <div class="spectaculars_content">
            <div class="c_left">
                <div class="c_l_top">
                    <p>类目销售额占比</p>
                </div>
                <div class="c_l_middle"></div>
                <div class="c_l_bottom"></div>
            </div>
            <div class="c_middle">
                <div class="c_m_top"></div>
                <div class="c_m_bottom"></div>
            </div>
            <div class="c_right">
                <div class="c_r_top"></div>
                <div class="c_r_middle"></div>
                <div class="c_r_bottom"></div>
            </div>
        </div>
        <div class="spectaculars_foot"></div>
    </div>
</template>

<script>
    import moment from "moment";

    export default {
        name: "spectaculars",
        data: function () {
            return {
                time: '',
                is_1366: false,
                screenWidth: document.body.clientWidth

            }
        },
        mounted() {
            setInterval(() => {
                this.time = moment().format('YYYY年MM月DD日 HH:mm:ss ')
            }, 1000)
            this.is1366()
            window.onresize = () => {
                this.is1366()
            }
        },
        methods: {
            is1366() {
                if (document.documentElement.clientWidth <= 1366) {
                    this.is_1366 = true
                } else {
                    this.is_1366 = false
                }
            }
            // timeFormate(timeStamp) {
            //     let year = new Date(timeStamp).getFullYear();
            //     let month = new Date(timeStamp).getMonth() + 1 < 10 ? "0" + (new Date(timeStamp).getMonth() + 1) : new Date(timeStamp).getMonth() + 1;
            //     let date = new Date(timeStamp).getDate() < 10 ? "0" + new Date(timeStamp).getDate() : new Date(timeStamp).getDate();
            //     let hh = new Date(timeStamp).getHours() < 10 ? "0" + new Date(timeStamp).getHours() : new Date(timeStamp).getHours();
            //     let mm = new Date(timeStamp).getMinutes() < 10 ? "0" + new Date(timeStamp).getMinutes() : new Date(timeStamp).getMinutes();
            //     let ss = new Date(timeStamp).getSeconds() < 10 ? "0" + new Date(timeStamp).getSeconds() : new Date(timeStamp).getSeconds();
            //     // return year + "年" + month + "月" + date +"日"+" "+hh+":"+mm ;
            //     this.time = year + "年" + month + "月" + date + "日" + " " + hh + ":" + mm + ":" + ss;
            //     // console.log(this.nowTime);
            // },
            // nowTimes() {
            //     this.time = moment().format()
            //     setInterval(this.nowTimes, 1000);
            // },
        }
    }
</script>

<style scoped lang="less">
    /*midea*/
    .spectaculars_page {
        min-width: 1366px;
        width: 100%;
        height: 100%;
        background-image: url("/img/1111background.png");

        .spectaculars_header {
            min-height: 138px;
            width: 100%;
            height: 15%;
            background-image: url('/img/u1111.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            /*border: black 1px solid;*/
            text-align: center;
            .s_h_title {
                font-size: 2vw;
                max-height: 159px;
                color: rgba(255, 255, 255, 0.92);
                img {
                    width: auto;
                    height: auto;
                    max-width: 159px;
                    margin-top: -24px;
                }
                span {
                    vertical-align: 67px;
                }
                p {
                    font-size: 1vw;
                    min-font-size: 0.75vw;
                    margin-top: -52px;
                    color: rgba(255, 255, 255, 0.78);
                }
            }
        }
        .spectaculars_content {
            width: 100%;
            height: 80%;
            /*border: black 1px solid;*/
            .c_left {
                width: 25%;
                height: 100%;
                margin-left: 2%;
                .c_l_top {
                    background: rgba(0, 0, 0, 0.6);
                    width: 100%;
                    height: 7%;
                    p {
                        color: rgba(255, 255, 255, 0.78);
                        font-size: 1vh;
                        padding: 1%;
                    }
                }
            }
        }
        .spectaculars_foot {
            width: 100%;
            height: 5%;
            /*border: black 1px solid;*/
        }
    }
    .spectaculars_page_is1366 {
        min-width: 1366px;
        width: 100%;
        height: 100%;
        background-image: url("/img/1111background.png");
        .spectaculars_header{
            min-height: 138px;
            width: 100%;
            height: 15%;
            background-image: url('/img/u1111.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            border: black 1px solid;
            text-align: center;
            .s_h_title {
                font-size: 28px;
                max-height: 159px;
                color: rgba(255, 255, 255, 0.92);
                img {
                    width: auto;
                    height: auto;
                    max-width: 159px;
                    margin-top: -24px;
                }
                span {
                    vertical-align: 67px;
                }
                p {
                    font-size: 14px;
                    min-font-size: 0.75vw;
                    margin-top: -48px;
                    color: rgba(255, 255, 255, 0.78);
                }
            }
        }
        .spectaculars_content {
            width: 100%;
            height: 80%;
            border: black 1px solid;
            .c_left {
                width: 25%;
                height: 100%;
                margin-left: 2%;
                .c_l_top {
                    background: rgba(0, 0, 0, 0.6);
                    width: 100%;
                    height: 7%;
                    p {
                        color: rgba(255, 255, 255, 0.78);
                        font-size: 28px;
                        padding: 1%;
                    }
                }
            }
        }
        .spectaculars_foot {
            width: 100%;
            height: 5%;
            border: black 1px solid;
        }
    }
</style>
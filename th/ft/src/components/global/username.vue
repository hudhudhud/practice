<template>
    <div id="username">
        <div class="username">
            <i class="iconfont icon-Mobile-phone-no"></i>
            <slot name="user"></slot>
        </div>
        <div class="password">
            <i class="iconfont icon-Verification-code"></i>
           <slot name="pass"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "username"
    }
</script>

<style lang="scss">
    @import "../../assets/public";
    #username{
        .username{
            box-sizing: border-box;
            overflow: hidden;
            position: relative;
            border-radius: rem(25);
            margin: 0 auto;
            border: 1px solid #E1E1E1;
            width: rem(325);
            height: rem(48);
            line-height: rem(48);
            .iconfont {
                font-size: rem(22);
                color: #666666;
                position: absolute;
                left: rem(18);
            }
            input{
                text-indent: rem(44);
                // margin: 0 rem(20) 0 0;
                height: 100%;
                width: 100%;
            }
        }
        .password{
            margin-top: rem(20);
            @extend .username;
            button{
                position: absolute;
                right: rem(20);
                top: 50%;
                @include translate(0, -50%);
                //    background-image: linear-gradient(-135deg, #FF4C76 0%, #FF3B56 100%);
                background-color: #ffffff;
                font-size: rem(15);
                color: #666666;
            }
        }
        input:focus {
            outline: none;
        }

        :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
            color: #999;
            opacity: 1;
        }

        ::-moz-placeholder { /* Mozilla Firefox 19+ */
            color: #999;
            opacity: 1;
        }

        input:-ms-input-placeholder {
            color: #999;
            opacity: 1;
        }

        input::-webkit-input-placeholder {
            color: #999;
            opacity: 1;
        }
    }




</style>
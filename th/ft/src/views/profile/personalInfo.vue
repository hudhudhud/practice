<template>
    <div id='minePersonalInfo' class="mine">
        <div class="mine-content">
            <mt-cell title="头像:" is-link>
                <img :src="avatar" alt="" class="head">
                <input type="file" class="upload" @change="handleUpdateAvatar">
            </mt-cell>
            <mt-cell title="昵称:" :value="nickname" is-link @click.native="updateNickname"></mt-cell>
            <mt-cell title="个人码:" v-if="userInfo.rank!== '0'" is-link
                     @click.native=" $store.commit('handleShowCode', 1);">
                <i class="iconfont icon-Qr-code"></i>
            </mt-cell>

            <mt-cell title="会员号:" :value="customerNumber"></mt-cell>
            <!--<mt-cell title="性别:" :value="genderName" is-link @click.native="genderModel=true"></mt-cell>-->
            <!--<mt-cell title="生日:" :value="birthday" is-link @click.native="openPicker"></mt-cell>-->
            <mt-cell title="爱好:" :value="hobby" @click.native="$refs.AlertShow.show=true" is-link></mt-cell>
            <mt-cell title="工作:" :value="job" is-link @click.native="$refs.AlertJobShow.show=true"></mt-cell>
            <!--<mt-cell title="常住地:" :value="addressText" is-link
                     @click.native="getAddress"></mt-cell>-->
            <mt-cell title="个性签名:" :value="identify" is-link @click.native="updateIdentify"></mt-cell>
            <p class="tip">邀请人</p>
            <mt-cell title="邀请人姓名:" :value="info.inviteName"></mt-cell>
            <mt-cell title="邀请人手机号:" :value="info.invitePhone"></mt-cell>
            <mt-cell title="邀请人编号:" :value="info.inviteNumber"></mt-cell>

        </div>


        <mt-datetime-picker
                ref="picker"
                type="date"
                v-model="pickerValue"
                year-format="{value} 年"
                month-format="{value} 月"
                date-format="{value} 日"
                @confirm="handleDateConfirm"
                :startDate="new Date('1900-01-01')"
                :endDate="new Date('2018-12-12')"
        >
        </mt-datetime-picker>

        <mt-actionsheet
                :actions="genderActions"
                v-model="genderModel">
        </mt-actionsheet>
        <!--自定义弹窗 爱好-->
        <Alert ref="AlertShow" @ok="updateHobby">
            <mt-checklist
                    align="right"
                    title=""
                    v-model="hobbyValue"
                    :options="hobbyList">
            </mt-checklist>
        </Alert>
        <!--自定义弹窗 工作-->
        <Alert ref="AlertJobShow" @ok="updateJob">
            <mt-radio
                    align="right"
                    title=""
                    v-model="jobValue"
                    :options="workList">
            </mt-radio>
        </Alert>
        <AreaAlert ref="personAddress"/>

    </div>

</template>

<script>
    import {  MessageBox, Toast, Indicator } from 'mint-ui';
    import { formatDate, uploadImg } from '../../service/util';
    import {
        updateGender, updateNickname,
        updateBirthday, updateHobby, getJobList,
        getHobbyList, getCustomer, updateJob,
        updateIdentify, updateHomeAddress,
        updateUserAvatar
    } from '../../service/profile.service'
    import Alert from '@/components/alert';
    import AreaAlert from '@/components/areaAlert'

    export default {
        name: "personal-info",
        components: {
            Alert,
            AreaAlert
        },
        data: function () {
            return {
                genderModel: false,
                genderActions: [
                    {
                        name: '男生',
                        method: () => this.changeGender(0)
                    },
                    {
                        name: '女生',
                        method: () => this.changeGender(1)
                    }
                ],
                pickerValue: new Date(),
                mineInfo: [],//我的信息
                customerNumber: '',//编号
                phone: '',//电话
                nickname: '',//昵称
                customerType: '',//用户类型
                avatar: '',//头像
                customerRank: '',//等级
                gender: '',//性别编号
                birthday: '',//生日
                homeProvinceId: null,//省份id
                homeCityId: null,//城市id
                homeDistrictId: null,//地区id
                homeProvinceName: '',//省份名字
                homeCityName: '',//城市名字
                homeDistrictName: '',//地区名字
                homeAddress: '',//详细地址
                hobby: '',//爱好
                hobbyValue: [],
                jobValue: null,
                identify: '',//签名
                job: '',//工作
                jobId: null,//工作id
                genderName: '',//性别
                updatename: '',
                setnum: null,
                updateImg: '',
                QRCode: '',//二维码
                updateBirthday: '',
                updatehobby: [],
                hobbyList: [],
                workList: [],
                provinceName: '',
                provinceId: null,
                cityName: '',
                cityId: null,
                districtName: '',
                districtId: null,
                updateAddress: '',
                updateSig: '',
                info: {}
            }
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        computed: {
            userInfo() {
                return this.$store.state.userInfo;
            },
            addressText() {
                return [...new Set([this.homeProvinceName, this.homeCityName, this.homeDistrictName, this.homeAddress])].join('/');
            }
        },

        activated: function () {
            this.getJobListAction();
            Promise.all([this.onRead(), this.GetHobbyFu()]).then(() => {
                // 当获取 信息 和 爱好列表的时候   获得 hobbyValue
                const hobbys = this.hobby.split('/');
                this.hobbyValue = hobbys.map(item => {
                    return (
                        this.hobbyList.find((obj) => {
                            return obj.label === item;
                        }) || {}
                    ).value || '';
                });

            });

        },
        methods: {

            onRead: function (num) {
                const that = this
                return getCustomer({}).then(
                    res => {
                        if (res.status == 0) {
                            this.info = res;
                            that.customerNumber = res.customerNumber;
                            that.phone = res.phone;
                            that.nickname = res.nickname;
                            that.customerType = res.customerType;
                            that.avatar = res.avatar;
                            that.customerRank = res.customerRank;
                            that.gender = res.gender;
                            that.birthday = res.birthday;
                            that.homeProvinceId = res.homeProvinceId;
                            that.homeCityId = res.homeCityId;
                            that.homeDistrictId = res.homeDistrictId;
                            that.homeProvinceName = res.homeProvinceName;
                            that.homeCityName = res.homeCityName;
                            that.homeDistrictName = res.homeDistrictName;
                            that.homeAddress = res.homeAddress;
                            that.hobby = res.hobby;
                            that.identify = res.identify;
                            that.job = res.job;
                            that.jobId = res.jobId;
                            that.jobValue = that.jobId + '';
                            that.updatename = that.nickname;
                            that.updateBirthday = that.birthday;
                            that.updateSig = that.identify;

                            if (res.gender == '0') {
                                that.genderName = '男';
                            } else if (res.gender == '1') {
                                that.genderName = '女';
                            } else {
                                that.genderName = '未选择';
                            }
                        }
                    }
                );
            },

            //获取爱好与工作列表
            GetHobbyFu: function () {
                const that = this;
                return getHobbyList({}).then(
                    res => {
                        if (res.status == 0) {
                            for (let i = 0; i < res.data.length; i++) {
                                that.hobbyList.push({
                                    value: res.data[i].id,
                                    label: res.data[i].name,
                                    choose: false,
                                });
                            }

                        }
                    }
                );

            },
            getJobListAction: function () {
                return getJobList({}).then(
                    res => {
                        if (res.status == 0) {
                            this.workList = res.data.map((item) => {
                                return {label: item.name, value: item.id + ''}
                            });
                        }
                    }
                );
            },
            openPicker() {
                this.$refs.picker.open();
            },
            handleDateConfirm: async function () {

                await updateBirthday({
                    birthday: formatDate(this.pickerValue, 'yyyy-MM-dd'),
                    load: true,
                    successMsg: '修改成功'
                });
                this.onRead();
            },
            /**
             * 修改头像
             * */
            handleUpdateAvatar: async function (e) {
                const file = e.target.files[0];
                const type = file.type.split('/')[0];//按照惯例，不应该由前端判断格式，因为这里是根据后缀名判断的，修改后缀名仍旧可以上传，理应由后端根据文件格式来判断。
                if (type !== 'image') {
                    Toast('请上传图片');
                    return;
                }
                const size = Math.round(file.size / 1024 / 1024);
                if (size > 3) {
                    Toast('图片大小不得超过3M');
                    return;
                }
                Indicator.open('正在上传');
                try {
                    const url = await uploadImg(file, '001');
                    await updateUserAvatar({avatar: url, successMsg: '修改成功'});
                    this.onRead();
                } catch (e) {
                    Indicator.close();
                }


            },
            /**
             * 改变性别
             */
            changeGender: async function (type) {
                await updateGender({gender: type, load: true, successMsg: '修改成功'});
                this.onRead();
            },
            /**
             * 修改昵称
             */
            updateNickname: async function () {
                const {value} = await this.prompt(' ', '请输入昵称', {inputValue: this.nickname, showInput: true});
                await updateNickname({nickname: value, load: true, successMsg: '修改成功'});
                this.onRead();
            },
            /**
             * 修改兴趣爱好
             */
            updateHobby: async function () {
                await updateHobby({hobby: this.hobbyValue.join(','), load: true, successMsg: '修改成功'});
                this.onRead();
            },
            /**
             * 修改工作
             */
            updateJob: async function () {
                await updateJob({job: this.jobValue, load: true, successMsg: '修改成功'});
                this.onRead();
            },
            /**
             * 修改个性签名
             */
            updateIdentify: async function () {
                const {value} = await this.prompt(' ', '请输入个性签名', {inputValue: this.identify});
                if(value.length > 40){
                    Toast('个性签名最多输入40个字');
                    return;
                }
                await updateIdentify({identify: value, load: true, successMsg: '修改成功'});
                this.onRead();
            },
            /**
             * 获得地址
             * */
            getAddress: async function () {
                [{id: this.homeProvinceId, name: this.homeProvinceName},
                    {id: this.homeCityId, name: this.homeCityName},
                    {name: this.homeDistrictName, id: this.homeDistrictId}
                ] = await this.$refs.personAddress.getArea([this.homeProvinceId, this.homeCityId, this.homeDistrictId]);
                ({value: this.updateAddress} = await this.prompt(' ', '请输入具体地址'));
                this.handleUpdateAddress();
            },
            /**
             * 修改地址
             */
            handleUpdateAddress: async function () {
                const province = this.homeProvinceId, city = this.homeCityId, district = this.homeDistrictId;
                if (!province || !city || !district || !this.updateAddress) {
                    Toast('请填写地址信息');
                    return;
                }
                await updateHomeAddress({
                    homeProvinceId: province,
                    homeCityId: city,
                    homeDistrictId: district,
                    homeAddress: this.updateAddress,
                    load: true,
                    successMsg: '修改成功'
                });
                this.onRead();

            }

        }
    }
</script>

<style scoped lang="scss">

    @import "../../assets/public";

    .newAddress-one-area {
        padding: rem(10) 0;
        text-align: center;

    }
    .tip{
        display: none;
        padding: rem(10);
        font-size: rem(12);
        color: #333333;
    }

    .list-item {
        text-align: center;
        select {
            margin: 5px 0;
            border: 1px solid lighten(gainsboro, 5%);
            min-width: rem(170);
            padding: rem(10);
        }
    }

    .head {
        width: rem(40);
        height: rem(40);
        border-radius: 50%;
    }

    .mint-cell {
        border-bottom: 1px solid lighten(gainsboro, 10%);
    }

    .mine {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: white;
    }

    .upload {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        width: 100%;
        opacity: 0;
    }


</style>
<style lang="scss">
    #minePersonalInfo{
        .mint-cell-title{
            color: #333333;
            white-space: nowrap;
        }
        .mint-cell-value{
            color: #666;
        }
    }

</style>
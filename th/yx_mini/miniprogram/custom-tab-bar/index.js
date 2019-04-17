import { checkWxInfo, saveWXInfo } from "../services/auth";

const app = getApp()
Component({
    data: {
        selected: 0,
        "color": "#ACACAC",
        "selectedColor": "#484747",
        "list": [
            {
                "pagePath": "/pages/index/index",
                "iconPath": "/images/tabIcon/home.png",
                "selectedIconPath": "/images/tabIcon/home_a.png",
                "text": "首页"
            },
            {
                "pagePath": "/pages/member/index",
                "iconPath": "/images/tabIcon/member.png",
                "selectedIconPath": "/images/tabIcon/member_a.png",
                "text": "优选会员"
            },
            {
                "pagePath": "/pages/profile/index",
                "iconPath": "/images/tabIcon/profile.png",
                "selectedIconPath": "/images/tabIcon/profile_a.png",
                "text": "我的"
            }
        ]
    },
    attached() {
    },
    methods: {
        switchTab(e) {
            const data = e.currentTarget.dataset;
            const url = data.path;
            if (url === '/pages/profile/index') {
                this.profileBefore(url);
            } else {
                wx.switchTab({url})
            }
        },
        profileBefore: function (url) {
            if (app.globalData.userInfo.avatarUrl) {
                wx.switchTab({url})
            } else {
                // 判断是否需要 调用微信的头像
                checkWxInfo().then(res => {
                    if (res.flag === '1') {
                        wx.getUserInfo({
                            success: (res) => {
                                saveWXInfo({
                                    avatarUrl: res.userInfo.avatarUrl,
                                    nickName: res.userInfo.nickName
                                }).then(() => {
                                    wx.switchTab({url})
                                },() => {
                                    wx.switchTab({url})
                                })
                            },fail: () => {
                                wx.showToast({
                                    title: '获取微信信息失败',
                                    icon: 'none',
                                    duration: 2000
                                })
                                setTimeout(() => {
                                    wx.switchTab({url})
                                },1000)
                            }
                        })
                    }else{
                        wx.switchTab({url});
                    }
                },() => {
                    wx.switchTab({url});
                });
            }
        }
    }
})

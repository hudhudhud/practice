<script>
  import store from "./pages/store/store";
  import { setItem } from "./utils/localStorage";

  export default {
    onLaunch: function(e) {
      setItem('re-address', e.query.address||'浙江省_杭州市_滨江区')
    },

    created() {
      //  console.log(store.state.loginData);

    },
    computed: {
      user: function() {
        return store.state.userInfo;
      },
      location: function() {
        return store.state.location;
      }
    },
    onShow: function() {
      if (this.user.id && !this.location.lat) {
        wx.getLocation({
          type: "gcj02",
          success: (res) => {
            store.commit("saveLocation", res);
          }
        });
      }
    }
  };
</script>

<style lang="scss">
  /* this rule will be remove */


  * {
    margin: 0;
    padding: 0;
    border: none;
    box-sizing: border-box;
  }

  page {
    background-color: #f2f2f2;
  }

  @import "./App.scss";
</style>

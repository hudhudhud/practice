<template>
  <div style="width: 100%;height: 100vh">
    <map id="map"
         :markers="markers"
         :scale="scale"
         :latitude="latitude"
         :longitude="longitude"
         :polyline="polyline"
         :includePoints="includePoints"
         show-location></map>
    <div class="bottom">
      <div class="institutionName">{{institutionName}}</div>
      <div class="address">{{address}}</div>
    </div>
  </div>
</template>

<script>
  import store from "../../store/store";
    export default {

    name: "index",
    data: function() {
      return {
        scale:16,
        latitude:'',
        longitude:'',
        markers: [{
          iconPath: '/static/img/component/location.png',
          id: 0,
          latitude: '',
          longitude: '',
          width: 20,
          height: 20
        }],
        institutionName:'',
        address:''
      };
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
    },
    onShow:function(){
      this.longitude = this.route().query.lng;
      this.latitude = this.route().query.lat;
      this.markers[0].latitude =  this.route().query.lat;
      this.markers[0].longitude = this.route().query.lng;
      this.institutionName = this.route().query.institutionName;
      this.address = this.route().query.address;
    },
    methods: {

    }
  };
</script>

<style scoped lang="scss">

  map {
    width: 100%;
    height: calc(100vh - 100px);  ;
  }
  .bottom {
    width:100%;
    height:100px;
    padding:rpx(40);
    box-sizing:border-box;
    overflow: hidden;
    background:#fff;
    div {
      box-sizing:border-box;
      display: -webkit-box;
      word-break: break-all;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .institutionName {
      font-size:rpx(40);
      -webkit-line-clamp: 1;
    }
    .address {
      font-size: rpx(28);
      -webkit-line-clamp: 2;
    }
  }

</style>

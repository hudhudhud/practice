<template>
      <Page>
          <h1>{{ msg }}</h1>
          <div id="echart-bar"></div>
          <div id="echart-pie"></div>
          <input type="button" name="" value="导出" @click="exportExcel">
          <table id="out-table">
            <tr>
              <th>Month</th>
              <th>Savings</th>
            </tr>
            <tr>
              <td>January</td>
              <td>$100</td>
            </tr>
          </table>
      </Page>
</template>
<script>
import Page from '@/components/Page.vue'
import echarts from 'echarts'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
    components: {
        Page
    },
    data: function() {
        return {
            msg: '品类行情',
            catgs:[{name:"衬衫",value:5},{name: "羊毛衫",value:20}, {name:"雪纺衫",value:15},{name: "裤子",value:10}, {name:"高跟鞋",value:8}, {name:"袜子",value:9}]
        }
    },
    mounted(){
        this.draw()
    },
    methods:{
      draw() {
          var self=this
          // 基于准备好的dom，初始化echarts实例
          let chartBar = echarts.init(document.getElementById('echart-bar'))
          // 绘制图表
          chartBar.setOption({
            title: { text: 'test' },
            tooltip: {},
            xAxis: {
              data: self.catgs.map((item,i)=>{return item.name})
            },
            yAxis: {},
            series: [{
              name: '销量',
              type: 'bar',
              data: self.catgs.map((item,i)=>{return item.value})
            }]
          });


          let chartPie = echarts.init(document.getElementById('echart-pie'))
          var selected={}
          self.catgs.forEach((item,i)=>{selected[item['name']]=i<3});

          chartPie.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    right: -20,
                    top: 20,
                    bottom: 20,
                    selected,
                    data:self.catgs.map((item,i)=>{return item.name})
                },
                series: [
                    {
                        name:'销量来源',
                        type:'pie',
                        radius : [50, 80],
                        center:['35%', '50%'],
                        avoidLabelOverlap: false,
                        selectedOffset:20,
                        data:self.catgs
                    }
                ]
            })
        },
        exportExcel() {
           /* generate workbook object from table */
           var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
           /* get binary string as output */
           var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
           try {
               FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'test.xlsx')
           } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
           return wbout
       },
    }
}
</script>
<style scoped lang="less">
#echart-bar,#echart-pie{
    width:400px;
    height: 300px;
}
</style>
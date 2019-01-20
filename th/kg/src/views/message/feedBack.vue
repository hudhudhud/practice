<template>
    <section>
        <div class="search form-search">
        </div>
        <base-table v-loading="loading" :columns="columns" :list="list" class="table-row-elli" >
            <template slot-scope="{scope}" slot='content'>
                <span :title="scope.row.content">{{scope.row.content}}</span>
            </template>
        </base-table>
        <!--分页-->
        <div class="pagination" v-if="list&&list.length">
            <el-pagination
                :current-page='pageNo'
                @current-change="show"
                class="pages"
                :page-size="pageSize"
                :layout="pageLayout"
                :total="pageTotal">
            </el-pagination>
        </div>
    </section>
</template>
<script>
import services from '../../services'
import pageMix from '../../mixins/pagerList'
export default {
    mixins:[pageMix],
    data(){
        return {
            columns:[
                { key: 'realname', title: '家长姓名' },
                { key:'createdAt',title: '反馈时间'},
                { key:'phone',title: '反馈号码'},
                { key:'content',title: '反馈内容',slot:'content'},
            ]
        }
    },
    methods:{
        show(pageNo){
            this.beforeShow(pageNo)
            let params={
                pageNO:this.pageNo,
                pageSize:this.pageSize
            }
            services.feedback_list(params)
            .then((res) => {
                this.listSuccessCb(res)
            })
            .catch((err) => {
                this.listExceptionCb(err)
            })
        },
    }
}
</script>

<style lang='less'>
</style>

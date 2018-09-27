<template>
    <div v-if="isShow">
        <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="pageSizes"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                prev-text="上一页"
                next-text="下一页">

        </el-pagination>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                pageSizes:this.config.page.sizes,
                pageSize:this.config.page.size,
                page:this.pageNum
            }
        },
        props:{
            total:Number,
            isShow:Boolean
        },
        methods:{
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.$emit('pageSizeChange',val);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.$emit('pageChange',val);
            }
        }
    }
</script>

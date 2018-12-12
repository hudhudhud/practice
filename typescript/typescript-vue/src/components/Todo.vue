<template>
    <section>
        <div><input type="text" @keypress.enter="add" v-model='value'/></div>
        <p>正在進行{{doingList.length}}</p>
        <ul>
            <li v-for='(item,i) in doingList' :key='i' >
                <TodoItem  :item='item'/>
            </li>
        </ul>
        <p>已完成</p>
        <ul>
            <li v-for='(item,i) in completeList' :key='i' >
                <TodoItem  :item='item'/>
            </li>
        </ul>
    </section>
</template>

<script lang='ts'>
import TodoItemModel from '../TodoItemModel'
import TodoItem from "./TodoItem.vue"
import { Vue, Component, Prop, Provide } from "vue-property-decorator";

@Component({
    components:{
        TodoItem,
    }
})
export default class Todo extends Vue {

    @Provide() value:string=''
    @Provide() list:Array<TodoItemModel>=[]
    add(){
        let item=new TodoItemModel(this.value)
        this.list.push(item)
        this.value=''
    }
    get doingList():Array<TodoItemModel>{
        return this.list.filter(item=>!item.checked&&!item.del)
    }
    get completeList():Array<TodoItemModel>{
        return this.list.filter(item=>item.checked&&!item.del)
    }
}
</script>

<style>

</style>

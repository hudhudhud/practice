<template>
    <div>
        <span>
            <input type="checkbox" v-model='item.checked'>
        </span>
        <span>
            {{item.name}} 
        </span>
        <span style='margin-left:100px' @click='del'>del</span>
    </div>
</template>

<script lang='ts'>
import TodoItemModel from '../TodoItemModel'
import {Vue,Component,Prop} from 'vue-property-decorator'

@Component
export default class TodoItem extends Vue {
    @Prop() 
        item!:TodoItemModel;
    @Prop({default:false}) 
        checked!:boolean;
    
    del(){
        this.item.del=true
    }
}

</script>

<style>

</style>

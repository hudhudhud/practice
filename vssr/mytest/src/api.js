export default {
    fetchItem(id){
        return new Promise((res,rej)=>{
            let data={id,item:{id,title:"apple"+id,num:10}}
            setTimeout(res(data),2000)
            if(!data)rej()
        })
    },
}
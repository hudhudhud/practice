const Vue=require('vue')
const server=require('express')()
const fs=require("fs")
const renderer=require('vue-server-renderer').createRenderer({
    template:fs.readFileSync('./index.template.html','utf-8')
})


server.get('*',(req,res)=>{
    const context={url:req.url,title:"hello",content:"<hello world!>",meta: `
    <meta ...>
    <meta ...>
  `}

    const app=new Vue({
        data:context,
        template:`<div>访问的URL是：{{url}}</div>`
    })

    renderer.renderToString(app,context,(err,html)=>{
        if(err){
            res.status(500).end('Internal Server Error')
            return
        }
        console.log(html)
        res.end(html)
    })
})
server.listen(8080,()=>{
    console.log("listing on 8080")
})

//node server.js





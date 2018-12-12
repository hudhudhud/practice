const Vue=require('vue')
const server=require('express')()
const renderer=require('vue-server-renderer').createRenderer()


server.get('*',(req,res)=>{
    const app=new Vue({
        data:{url:req.url},
        template:`<div>访问的URL是：{{url}}</div>`
    })

    renderer.renderToString(app,(err,html)=>{
        if(err){
            res.status(500).end('Internal Server Error')
            return
        }
        res.end(`
             <!DOCTYPE html>
             <html lang="en">
                <head>
                    <title>Hello</title>
                    <meta charset="UTF-8">
                </head>
                <body>${html}</body>
             </html>
            `)
    })
})
server.listen(8080,()=>{
    console.log("listing on 8080")
})

//node server.js





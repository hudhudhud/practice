// function sleep(duration){
//   var start=Date.now()
//   while((Date.now()-start)<duration){}
// }
// for(var i=0;i<50;i++){
//   sleep(1000)
//   console.log("out",i)
// }

addEventListener("message",function(e){
  e.data.a=8
  console.log(e.data**2,e)
  postMessage(e.data**2)
})
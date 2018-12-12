var count=0
var isInput=false
var checkedCount=0
document.all["mainInput"].focus()
var num=document.all["num"]
var currentState="all"
var editTarget
function createThing(){
  if(this.value){
    var div=document.createElement("div")
    div.id=count++
    num.innerText=count-checkedCount
    num.parentElement.classList.remove("hide")
    div.setAttribute("name","thing")
    div.setAttribute("state","active")
    div.classList.add("item")
    if(currentState=="completed")
      div.classList.add("hide")
    var cb=document.createElement("input")
    cb.type="checkbox"
    var cbCircle=document.createElement("span")
    cbCircle.classList.add("cbCircle")
    var cbLabel=document.createElement("label")
    cbLabel.appendChild(cb)
    cbLabel.appendChild(cbCircle)
    cb.addEventListener("click",function(){
      var parentElement=this.parentElement.parentElement.querySelector(".context")
      var div=parentElement.parentElement
      if(this.checked){
        checkedCount++
        num.innerText=count-checkedCount
        parentElement.classList.add("line-through")
        if(checkedCount==document.getElementsByName("thing").length){
           document.querySelector(".selectAll").classList.add("black")
        }
        div.setAttribute("state","completed")
        if(currentState=="active"){
          div.classList.add("hide")
         }
        else{
          div.classList.remove("hide")
        }
      }
      else{
        checkedCount--
        num.innerText=count-checkedCount
        if(checkedCount!=document.getElementsByName("thing").length){
          document.querySelector(".selectAll").classList.remove("black")
        }
        parentElement.classList.remove("line-through")
        div.setAttribute("state","active")
        if(currentState=="completed"){
          div.classList.add("hide")
        }
        else{
          div.classList.remove("hide")
        }
      }
    })
    var context=document.createElement("div")
    context.innerText=this.value
    context.setAttribute("name","context")
    context.classList.add("context")
    context.addEventListener("dblclick",function(e){
      editTarget=this.parentElement
      this.contentEditable=true
      this.nextSibling.classList.remove("show")
      e.preventDefault()
    })
    context.addEventListener("blur",function(){
       this.contentEditable=false
       editTarget=null
    })
    var close=document.createElement("span")
    close.innerText="X"
    close.setAttribute("name","close")
    close.classList.add("close")
    close.classList.add("hide")
    close.addEventListener("click",function(e){
      count--
      if(this.parentElement.children[0].checked)checkedCount--
      num.innerText=count-checkedCount
      this.parentElement.remove()
      e.preventDefault()
      changeFootStatus()
    })
    div.addEventListener("mouseenter",function(e){
      if(e.target!=editTarget)close.classList.add("show")
    })
    div.addEventListener("mouseleave",function(e){
      close.classList.remove("show")
    })
    div.appendChild(cbLabel)
    div.appendChild(context)
    div.appendChild(close)
    this.parentElement.appendChild(div)    
    changeFootStatus()
  }
  this.value=""
  document.querySelector(".selectAll").classList.remove("black")
}
function changeFootStatus(){
  if(count>0){
    document.querySelector("#foot").classList.remove("hide")
  }
  else{
    document.querySelector("#foot").classList.add("hide")
  }
}
document.all["mainInput"].addEventListener("keypress",function(e){
  if(e.key=="Enter"){
     createThing.call(this)
  }
})
document.all["mainInput"].addEventListener("blur",function(){
  createThing.call(this)
})

document.querySelector(".selectAll").addEventListener("click",function(){
  this.classList.toggle("black")
  var things=document.getElementsByName("thing")
  if(this.classList.contains("black")){
    checkedCount=things.length
    num.innerText=0
    for(var i=0;i<things.length;i++){
      things[i].children[0].querySelector("input[type=checkbox]").checked=true
      things[i].setAttribute("state","completed")
      if(currentState=="active"){
        things[i].classList.add("hide")
      }
      else if(currentState=="completed"){
         things[i].classList.remove("hide")
      }
    }
  }
  else{
    checkedCount=0
    num.innerText=count
    for(var i=0;i<things.length;i++){
      things[i].children[0].querySelector("input[type=checkbox]").checked=false
      things[i].setAttribute("state","active")
     if(currentState=="active"){
        things[i].classList.remove("hide")
      }
      else if(currentState=="completed"){
         things[i].classList.add("hide")
      }
    }
  }
})

document.all["all"].addEventListener("click",function(e){
  var things=document.getElementsByName("thing")
  currentState="all"
  for(var i=0;i<things.length;i++){
     things[i].classList.remove("hide")
  }
  document.all["all"].classList.add("current")
  document.all["active"].classList.remove("current")
  document.all["completed"].classList.remove("current")
})
document.all["active"].addEventListener("click",function(e){
  var things=document.getElementsByName("thing")
  currentState="active"
  for(var i=0;i<things.length;i++){
    if(things[i].getAttribute("state")=="active"){
       things[i].classList.remove("hide")
    }
    else {
       things[i].classList.add("hide")
    }
  }
  document.all["all"].classList.remove("current")
  document.all["active"].classList.add("current")
  document.all["completed"].classList.remove("current")
})
document.all["completed"].addEventListener("click",function(e){
  var 
  =document.getElementsByName("thing")
  currentState="completed"
  for(var i=0;i<things.length;i++){
    if(things[i].getAttribute("state")=="completed"){
       things[i].classList.remove("hide")
    }
    else{
       things[i].classList.add("hide")
    }
  }
  document.all["all"].classList.remove("current")
  document.all["active"].classList.remove("current")
  document.all["completed"].classList.add("current")
})
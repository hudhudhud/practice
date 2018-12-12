var count=0
var isInput=false
var checkedCount=0
$("#mainInput").focus()
var num=$("#num")
var currentState="all"
var editTarget
function createThing(){
  if($(this).val()){
    var div=$("<div name='thing' state='active'></div>")
    div.attr("id",count++)
    num.text(count-checkedCount)
    num.parent().removeClass("hide")
    div.attr("name","thing")
    div.attr("state","active")
    div.addClass("item")
    if(currentState=="completed")
      div.addClass("hide")
    var cb=$("<input type=checkbox >")
    cb.attr("id","cb_"+div.attr("id"))
    var cbCircle=$("<span>")
    cbCircle.addClass("cbCircle")
    var cbLabel=$("<label>")
    cbLabel.append(cb)
    cbLabel.append(cbCircle)
    cb.on("click",function(){
      var context=$(this).parent().next()
      var div=context.parent()
      if(this.checked){
        checkedCount++
        num.text(count-checkedCount)
        context.addClass("line-through")
        if(checkedCount==$("[name=thing]").length){
           $(".selectAll").addClass("black")
        }
        div.attr("state","completed")
        if(currentState=="active"){
          div.addClass("hide")
         }
        else{
          div.removeClass("hide")
        }
      }
      else{
        checkedCount--
        num.text(count-checkedCount)
        if(checkedCount!=$("[name=thing]").length){
          $(".selectAll").removeClass("black")
        }
        context.removeClass("line-through")
        div.attr("state","active")
        if(currentState=="completed"){
          div.removeClass("hide")
        }
        else{
          div.removeClass("hide")
        }
      }
    })
    var context=$("<div name=context></div>")
    context.text($(this).val())
    context.addClass("context")
    context.on("dblclick",function(e){
      editTarget=$(this).parent()
      $(this).attr("contentEditable",true)
      $(this).next().removeClass("show")
      e.preventDefault()
    })
    context.on("blur",function(){
       $(this).attr("contentEditable",false)
       editTarget=null
    })
    var close=$("<span name=close>X</span>")
    close.addClass("close")
    close.addClass("hide")
    close.on("click",function(e){
      count--
      if($("cb_"+$(this).parent().id).checked)
        checkedCount--
      num.text(count-checkedCount)
      $(this).parent().remove()
      e.preventDefault()
      changeFootStatus()
    })
    div.on("mouseenter",function(e){
      if(e.target!=editTarget)
        close.addClass("show")
    })
    div.on("mouseleave",function(e){
      close.removeClass("show")
    })
    div.append(cbLabel)
    div.append(context)
    div.append(close)
    $(this).parent().append(div)    
    changeFootStatus()
  }
  $(this).val("")
  $(".selectAll").removeClass("black")
}
function changeFootStatus(){
  if(count>0){
    $("#foot").removeClass("hide")
  }
  else{
    $("#foot").addClass("hide")
  }
}
$("#mainInput").on("keypress",function(e){
  if(e.key=="Enter"){
     createThing.call(this)
  }
})
$("#mainInput").on("blur",function(){
  createThing.call(this)
})

$(".selectAll").on("click",function(){
  $(this).toggleClass("black")
  var things=$("[name=thing]")
  if($(this).hasClass("black")){
    checkedCount=things.length
    num.text(0)
    things.each(function(){
      $("#cb_"+this.id).prop("checked",true)
      $($(this).children()[1]).addClass("line-through")
      $(this).attr("state","completed")
      if(currentState=="active"){
        $(this).addClass("hide")
      }
      else if(currentState=="completed"){
         $(this).removeClass("hide")
      }
    })
  }
  else{
    checkedCount=0
    num.text(count)
    things.each(function(){
      $("#cb_"+this.id).prop("checked",false)
      $($(this).children()[1]).removeClass("line-through")
      $(this).attr("state","active")
      if(currentState=="active"){
        $(this).removeClass("hide")
      }
      else if(currentState=="completed"){
         $(this).addClass("hide")
      }
    }
  )
}})

$("#filter").on("click",function(e){
  var filt=["all","active","completed"]
  var targetId=e.target.id
  if(filt.indexOf(targetId)>-1){
      currentState=targetId
      filt.forEach(function(item,i){
        if(item===targetId)
          $("#"+item).addClass("current")
        else
          $("#"+item).removeClass("current")
      })
  }
  $("[name=thing]").each(function(){
    if(targetId=="all"){
      $(this).removeClass("hide")
    }
    else if(targetId=="active"){
      if($(this).attr("state")=="active"){
        $(this).removeClass("hide")
      }
      else {
        $(this).addClass("hide")
      }
    }
    else if(targetId=="completed"){
      if($(this).attr("state")=="completed"){
        $(this).removeClass("hide")
      }
      else{
         $(this).addClass("hide")
      }
    }
  })
})

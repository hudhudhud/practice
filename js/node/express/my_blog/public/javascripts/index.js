jQuery(function($) {
  $("body").on("click", ".index-pager .link", function() {
    $(this).siblings().removeClass("current").addClass("link")
    $(this).removeClass("link").addClass("current")
    getAllBlog($(this).index() + 1)
  })

  $("body").on("click", ".user-pager .link", function() {
    $(this).siblings().removeClass("current").addClass("link")
    $(this).removeClass("link").addClass("current")
    getUserBlog($(this).index() + 1, $(this).attr("userId"))
  })

  window.onpopstate = function() {
    var [type, page] = history.state.split("-")
    if (type == "index") {
      getAllBlog(page - 0)
    } else if (type.indexOf("user") > -1) {
      getUserBlog(page - 0, type.split(".")[1])
    }
  }

  function getAllBlog(page) {
    $.get("/getList?page=" + page, function(data) {
      $("#allCount").html(data.allCount)
      var html = ""
      data.blogs.forEach(blog => {
        html += `
        <li>
        <a class="title" href='/blog/${blog.id}'>${blog.title}</a>
        <p class="blog-content">${blog.content.length>200?blog.content.substr(0,200)+"...... ":blog.content}</p>
        <p><a href='/user/${blog.userId}' >${blog.user.name}</a>
        发布于span ${blog.createdAt.toLocaleString()}</p>
        </li>`
      })
      $(".blog").html(html)
      history.pushState("index-" + page, null, "?page=" + page)
    })
  }

  function getUserBlog(page, uid) {
    $.get(uid + "/getUserBlog?page=" + page, function(data) {
      $("#allCount").html(data.allCount)
      var html = ""
      data.blogs.forEach(blog => {
        html += `
        <li>
        <a href='/blog/${blog.id}'>${blog.title}</a>
        <p>${blog.createdAt}</p>
        </li>`
      })
      $(".blog").html(html)
      history.pushState("user." + uid + "-" + page, null, "?page=" + page)
    })
  }

  $('#content').froalaEditor() //存的是转义之后的内容，编辑器默认处理xss攻击脚本

})
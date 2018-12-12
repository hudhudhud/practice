 function swapNode(node1, node2) {
   //判断两个节点是否为父子关系，是的话直接return
   for (let temp1 = node1; temp1 != null; temp1 = temp1.parentNode) {
     if (temp1 === node2) return
   }
   for (let temp2 = node2; temp2 != null; temp2 = temp2.parentNode) {
     if (temp2 === node1) return
   }
   //创建一个辅助节点即可
   var par1 = node1.parentNode
   var par2 = node2.parentNode
   var newNode = document.createElement("my")
   par1.insertBefore(newNode, node1)
   par1.insertBefore(node1, node2)
   par2.insertBefore(node2, newNode)
   newNode.remove()

   //由于克隆不管是js原生还是jq，都没办法完全把绑定在其元素身上的事件克隆完全，所以不能用克隆的办法
   // var newNode1 = node1.cloneNode(true)
   // var newNode2 = node2.cloneNode(true)
   //node1.before(newNode2)
   // node2.before(newNode1)
   // node1.remove()
   // node2.remove()

   // var newNode1 = $(node1).clone(true)
   // var newNode2 = $(node2).clone(true)
   // $(node1).before(newNode2)
   // $(node2).before(newNode1)
   // $(node1).remove()
   // $(node2).remove()
 }
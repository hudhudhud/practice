//--------------------------共有方法-------------------------
//canvas绘制圆角矩形
export function roundRect(ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  return ctx;
}
//canvas绘制居中加粗文本
function drawText(ctx, obj) {
  ctx.save();
  ctx.setFillStyle(obj.color);
  ctx.setFontSize(obj.size);
  ctx.setTextAlign(obj.align);
  ctx.setTextBaseline(obj.baseline);
  if (obj.bold) {
    ctx.fillText(obj.text, obj.x, obj.y - 0.3);
    ctx.fillText(obj.text, obj.x - 0.3, obj.y);
  }
  ctx.fillText(obj.text, obj.x, obj.y);
  if (obj.bold) {
    ctx.fillText(obj.text, obj.x, obj.y + 0.3);
    ctx.fillText(obj.text, obj.x + 0.3, obj.y);
  }
  ctx.restore();
}
//canvas多行文本，超出省略文本
export function textWrap(ctx, obj) {
  var td = Math.ceil(obj.width / (obj.size));
  var tr = Math.ceil(obj.text.length / td);
  for (var i = 0; i < tr; i++) {
    var txt = {
      x: obj.x,
      y: obj.y + (i * obj.height),
      color: obj.color,
      size: obj.size,
      align: obj.align,
      baseline: obj.baseline,
      text: obj.text.substring(i * td, (i + 1) * td),
      bold: obj.bold
    };
    if (i < obj.line) {
      if (i <= obj.line) {
        if (obj.line < tr){
          txt.text = txt.text.substring(0, txt.text.length - 1) + '...';
        }else{
          
        }
      }
      drawText(ctx, txt);
    }
  }
}
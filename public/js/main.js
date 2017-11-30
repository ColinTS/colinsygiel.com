(function(){

  var heightRefreshThreshold=120;
  var virtualWindowHeight=0;
  var win=window;
  var dpi=win.devicePixelRatio;
  var doc=document;
  var body=doc.body;
  var html=doc.documentElement;

  function getScroll(){
    return win.pageYOffset || html.scrollTop;
  }
  function documentHeight(){
    return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
  }
  function createCanvas(width,height,userDPI){
    if(typeof userDPI=="undefined") userDPI=dpi;
    var canvas=doc.createElement('canvas');
    setAttribute('width',width*userDPI,canvas);
    setAttribute('height',height*userDPI,canvas);
    return canvas;
  }
  function drawStar(x,y,size,scale,ctx){
    ctx.save();
    ctx.translate(x,y);
    ctx.scale(scale,scale);
    ctx.rotate(Math.PI/4);
    ctx.fillRect(-size/2,-size/2,size,size);
    ctx.restore();
  }
  function querySelector(selector){
    return doc.querySelector(selector);
  }
  function querySelectorAll(selector){
    var nodes=doc.querySelectorAll(selector);
    return [].slice.call(nodes);
  }
  function getContext(canvas){
    return canvas.getContext('2d',{ 
    });
  }
  function getBounds(element){
    return element.getBoundingClientRect();
  }
  function setAttribute(attr,value,element){
    element.setAttribute(attr,value);
  }
  function setFillStyle(fill,ctx){
    ctx.fillStyle=fill;
  }
  function random(max){
    return Math.random()*max;
  }
  function repeat(times,callback){
    for(var i=0;i<times;i++){
      callback(i);
    }
  }
  function forEach(array,callback){
    for(var i=0;i<array.length;i++){
      callback(array[i],i);
    }
  }
  let raf=requestAnimationFrame;
  function sizeToBounds(bounds,dpi,element){
    setAttribute('width',bounds.width*dpi,element);
    setAttribute('height',bounds.height*dpi,element);
  }

})()


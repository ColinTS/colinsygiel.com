(function(){
  //global variables
  let colors={
    whiteish : '#FFEDDB',
    yellow : '#F7F7B6',
    pink : '#E96F92',
    purple : '#75517D',
    blackish : '#1B2947',
    green : '#54fad4',
  }
  let win=window;
  let dpi=win.devicePixelRatio;
  let raf=requestAnimationFrame

 function getContext (canvas){
    return canvas.getContext('2d')
  }
  function setAttribute(attr,value,element){
    element.setAttribute(attr, value)
  }
  function setFillStyle(fill,ctx) {
    ctx.fillStyle=fill;
  }
  function getBounds(element){
    return element.getBoundingClientRect()
  }
  function forEach(array, callback){
    for(let i=0;i<array.length;i++){
      callback(array[i],i);
    }
  }
  function repeat(times, callback){
    for(var i=0;i<times;i++){
      callback(i);
    }
  }
  function querySelectorAll(selector){
    let nodes=document.querySelectorAll(selector);
    return [].slice.call(nodes);
  }
  function querySelector(selector){
    return document.querySelector(selector);
  }
  function createCanvas(width,height,userDPI) {
    if(typeof userDPI=="undefined") userDPI=dpi;
    let canvas=document.createElement('canvas');
    setAttribute('width',width*userDPI,canvas);
    setAttribute('height',height*userDPI,canvas);
    return canvas;
  }
  function sizeToBounds(bounds, dpi, element){
    setAttribute('width',bounds.width*dpi,element);
    setAttribute('height',bounds.height*dpi,element);
  }

  function mountains(){
    let canvases=querySelectorAll('.Scene-mountains')
    let texture=null
    forEach(canvases, function(canvas) {
      let bounds=getBounds(canvas)
      sizeToBounds(bounds,dpi,canvas)
      let middle ={
        x:bounds.width/2,
        y:bounds.height/2
      }
      if(texture==null){
        texture=createMountains();
      }
      let textureMountains=texture
      canvas.style.opacity=0.9999;

      function createMountains(){
        let textureCanvas=createCanvas(bounds.width, bounds.height)
        sizeToBounds(bounds, dpi, textureCanvas)
        let ctx=getContext(textureCanvas)
        let factor=20
        if(win.innerWidth<700) factor=15
        let cols=Math.round(bounds.width/factor)
        let gridSize=bounds.width/cols
        let mountains={
          left:[
            '......kkkkjjjkkjjkjkkjjkkkkkjjjjjj..kkjj',
            '....kkkjjj..kkkkjkkjjjj.......kkkkjjjjj',
            '...kkjj...kkkkjjj..kkkjkjjjj.....kkkkjjkjjj',
          ],
          right:[
            '......kkkkjjjkkjjjkkkjjkkkkkjjjjjkjj..kkkjjj',
            '....kkkjjjkkkkjjjkkjj.......kkkkjjjjj',
            '...kkjj.kkkkjjkkjjjjkkkkjkjjjj...kkkkjkjjjj',
          ]
        }
        function drawLayer(layer, directionX, directionY) {
          ctx.beginPath()
          let pos=0
          let started=false
          repeat(layer.length, (i) => {
            let dir=layer.charAt(i)
            pos+=dir=='.'?0:(dir=='j'?-1:1)
            if(pos!=0 && !started){
              started=true
              ctx.moveTo((middle.x+((i-1)*gridSize*directionX))*dpi,middle.y*dpi);
            }
            ctx.lineTo(
              (middle.x+(i*gridSize)*directionX)*dpi,
              (middle.y+(pos*gridSize)*directionY)*dpi
            )
          })
          ctx.closePath()
          ctx.fill()
        }
        function drawLayers(i,color1,color2){
          setFillStyle(color1,ctx)
          ctx.strokeStyle=color1;
          ctx.lineWidth=4
          ctx.lineJoin='round'
          drawLayer(mountains.left[i],-1,-1);
          drawLayer(mountains.right[i],1,-1);
          setFillStyle(color2,ctx);
          ctx.strokeStyle=color2;
          drawLayer(mountains.left[i],-1,1);
          drawLayer(mountains.right[i],1,1);
          ctx.strokeStyle='transparent';
        }
        drawLayers(2,colors.pink,colors.green);
        drawLayers(1,colors.purple,colors.pink);
        drawLayers(0,colors.blackish,colors.purple);
        return textureCanvas;
      }
      return {
        stop:function(){
          stopAnim=true;
        }
      }
    })
    
  }

  (function(){
    let animMountains=mountains()
    let lastResizeW=win.innerWidth;
    let lastResizeH=win.innerHeight;
    let resizeTimer=null;
    win.addEventListener('resize', ()=> {
      const resize = () => {
        let ww=win.innerWidth
        let wh=win.innerHeight
        if(ww!=lastResizeW){
          lastResizeW=ww;
          animMountains.stop();
          let canvases=querySelectorAll('.Scene-mountains');
          forEach(canvases,function(canvas){
            canvas.removeAttribute('width');
            canvas.removeAttribute('height');
          })
          raf(() => {
            animMountains=mountains();
          })
        }
      }
    })
  }())

  

}())
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

  const getContext = (canvas) => {
    return canvas.getContext('2d')
  }
  const setAttribute = (attr,value,element) => {
    element.setAttribute(attr, value)
  }
  const setFillStyle = (fill,ctx) => {
    ctx.fillStyle=fill;
  }
  const getBounds = (element) => {
    return element.getBoundingClientRect()
  }
  const forEach = (array, callback) => {
    for(let i=0;i<array.length;i++){
      callback(array[i],i);
    }
  }
  const repeat = (times, callback) => {
    for(var i=0;i<times;i++){
      callback(i);
    }
  }
  const querySelectorAll = (selector) => {
    let nodes=document.querySelectorAll(selector);
    return [].slice.call(nodes);
  }
  const querySelector = (selector) => {
    return document.querySelector(selector);
  }
  const createCanvas = (width,height,userDPI) => {
    if(typeof userDPI=="undefined") userDPI=dpi;
    let canvas=doc.createElement('canvas');
    setAttribute('width',width*userDPI,canvas);
    setAttribute('height',height*userDPI,canvas);
    return canvas;
  }
  const sizeToBounds = (bounds, dpi, element) => {
    setAttribute('width',bounds.width*dpi,element);
    setAttribute('height',bounds.height*dpi,element);
  }

  const mountains = () => {
    let canvases=querySelectorAll('.Scene-mountains')
    forEach(canvases, function(canvas) {
      let bounds=getBounds(canvas)
      sizeToBounds(bounds,dpi,canvas)
      let middle ={
        x:bounds.width/2,
        y:bounds.height/2
      }
    })
    const createMountains = () => {
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
      const drawLayer = (layer, directionX, directionY) => {
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
          cts.lineTo(
            (middle.x+(i*gridSize)*directionX)*dpi,
            (middle.y+(pos*gridSize)*directionY)*dpi
          )
        })
        ctx.closePath()
        ctx.fill()
      }
      const drawLayers = (i,color1,color2) => {
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
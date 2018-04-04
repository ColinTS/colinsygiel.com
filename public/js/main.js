(function(){

  let heightRefreshThreshold=120;
  let virtualWindowHeight=0;
  let win=window;
  let dpi=win.devicePixelRatio;
  let doc=document;
  let body=doc.body;
  let html=doc.documentElement;
  let raf=requestAnimationFrame
  let starsArray = []

  //center reference
  let centerQuery = querySelector('.Center')
  let center = getBounds(centerQuery)

  function getScroll(){
    return win.pageYOffset || html.scrollTop;
  }
  function documentHeight(){
    return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
  }
  function createCanvas(width,height,userDPI){
    if(typeof userDPI=="undefined") userDPI=dpi;
    let canvas=doc.createElement('canvas');
    setAttribute('width',width*userDPI,canvas);
    setAttribute('height',height*userDPI,canvas);
    return canvas;
  }
  function querySelector(selector){
    return doc.querySelector(selector);
  }
  function querySelectorAll(selector){
    let nodes=doc.querySelectorAll(selector);
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
    for(let i=0;i<times;i++){
      callback(i);
    }
  }
  function forEach(array,callback){
    for(var i=0;i<array.length;i++){
      callback(array[i],i);
    }
  }
  function sizeToBounds(bounds,dpi,element){
    setAttribute('width',bounds.width*dpi,element);
    setAttribute('height',bounds.height*dpi,element);
  }
  function smooth(x){
    return x*x*(3 - 2*x);
  }
  function stopAnimation(){
    stopAnim = true
    console.log(stopAnim)
  }

  //Initialize star animations
  function stars(){
    console.log('center', center)
    let canvas=querySelector('.Scene-stars')
    let stopAnim=false
    let ctx=getContext(canvas)
    let bounds=getBounds(canvas)
    sizeToBounds(bounds,dpi,canvas)
    function drawStar(x,y,size,scale,opacity,ctx){
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = size+scale*3;
      ctx.lineCap = "round";
      ctx.lineTo(x,y);  
      ctx.strokeStyle='rgb(255,237,219)'
      ctx.stroke();
      ctx.globalAlpha = opacity
      ctx.closePath();
      ctx.restore();
    }

    setTimeout(expandStars, 3000)
    function expandStars(){
      stopAnim=true
      let canvas=querySelector('.Scene-stars')
      let ctx=getContext(canvas)
      let bounds=getBounds(canvas)
      sizeToBounds(bounds,dpi,canvas)
      let newStarsArray = starsArray
      let distance = 1
      console.log('new',newStarsArray)
      function drawExpandStar(x,y,size,opacity,ctx){
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = size;
        ctx.lineCap = "round";
        ctx.lineTo(x,y);  
        ctx.strokeStyle='rgb(255,237,219)'
        ctx.stroke();
        ctx.globalAlpha = opacity
        ctx.closePath();
        ctx.restore();
      }
      (function draw(){
        ctx.clearRect(0,0,bounds.width*dpi,bounds.height*dpi);
        newStarsArray.forEach(function(star){
          distance+=0.01
          star.size
          star.opacity+=0.01
          let yDelta = center.y - star.y
          let xDelta = center.x - star.x
          star.angle = Math.atan(yDelta/xDelta)
          if (xDelta > 0){
            star.angle -= Math.PI
          }
          drawExpandStar(
            star.x*dpi + (Math.cos(star.angle)*distance),
            star.y*dpi + (Math.sin(star.angle)*distance),
            star.size,
            star.opacity,
            ctx
          )
        })
        if(distance<5)
          raf(draw);
      })()
    }
    
    //function to create stars
    function createStar(){
      return {
        x: random(bounds.width),
        y: random(bounds.height),
        s: 0,
        speed: 0.009+random(0.005),
        growing: true,
        size: 1+(Math.pow(random(1),4)*2),
        opacity: 0,
      }
    }
    (function draw(){
      let newStars = []
      ctx.clearRect(0,0,bounds.width*dpi,bounds.height*dpi);
      forEach(starsArray, function(star){
        star.s+=star.speed*(star.growing?1:-1)
        star.growing?star.opacity+=0.015:star.opacity+=-0.015
        if(star.s>1) star.growing=false
        if(star.s<0){
          return;
        } else {
          newStars.push(star)
        }
        drawStar(
          star.x*dpi,
          star.y*dpi,
          star.size,
          smooth(star.s)*star.size*dpi,
          star.opacity,
          ctx
        )
      })
      if(random(1)<0.0000005*(win.innerWidth*win.innerHeight)) newStars.push(createStar());
      starsArray=newStars
      if(!stopAnim)
        raf(draw);
    })()
    return {
      stop:function(){
        stopAnim=true;
      }
    }
    
    
  }


  //Stops stars animation, in preparation for commencement of hyperdrive!
 
  // setTimeout(animStars.stop, 5000)


  //On resize, restart animation
  (function() {
    let animStars=stars()
    let lastResizeW=win.innerWidth;
    let lastResizeH=win.innerHeight;
    let resizeTimer=null;
    win.addEventListener('resize',function(){
      function resize(){
        let ww=win.innerWidth;
        let wh=win.innerHeight;
        if(ww!=lastResizeW){
          lastResizeW=ww;
          animStars.stop();
          raf(function(){
            animStars=stars();
          });
        }
        if(Math.abs(wh-lastResizeH)>heightRefreshThreshold){
          lastResizeH=wh;
          animStars.stop();
          raf(function(){
            animStars=stars();
          });
        }
      }
      if(resizeTimer!=null){
        clearTimeout(resizeTimer);
        resizeTimer=null;
      }
      resizeTimer=setTimeout(resize,1000);
    });
  })()
})()


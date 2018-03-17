(function(){

  let heightRefreshThreshold=120;
  let virtualWindowHeight=0;
  let win=window;
  let dpi=win.devicePixelRatio;
  let doc=document;
  let body=doc.body;
  let html=doc.documentElement;
  let raf=requestAnimationFrame
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

  function stars(){
    let canvas=querySelector('.Scene-stars')
    let stopAnim=false
    let ctx=getContext(canvas)
    let bounds=getBounds(canvas)
    sizeToBounds(bounds,dpi,canvas)
    function drawStar(x,y,size,scale,ctx){
      ctx.save();
      ctx.beginPath();
      ctx.arc(x,y,size+scale,0,size+scale * Math.PI,false);
      ctx.closePath();
      setFillStyle('rgb(255,237,219)',ctx);
      ctx.fill()
      ctx.restore();
    }
    let stars = []
    //function to create stars
    function createStar(){
      return {
        x: random(bounds.width),
        y: random(bounds.height),
        s: 0,
        speed: 0.01+random(0.035),
        growing: true,
        size: 1+(Math.pow(random(1),4)*2),
      }
    }
    (function draw(){
      let newStars = []
      ctx.clearRect(0,0,bounds.width*dpi,bounds.height*dpi);
      forEach(stars, function(star){
        star.s+=star.speed*(star.growing?1:-1)
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
          ctx
        )
        console.log(star)
      })
      newStars.push(createStar());
      stars=newStars
      if(!stopAnim)
        raf(draw);
    })()
    
  }

  // ------ OLD --------
  //   let stars=[]
  //   function createStar(){
  //     return {
  //       x:random(bounds.width),
  //       y:random(bounds.height),
  //       s:0,
  //       speed:0.01+random(0.035),
  //       growing:true,
  //       maxSize:1+(Math.pow(random(1),4)*10),
  //     }
  //   }
  //   (function draw(){
  //     let newStars=[]
  //     ctx.clearRect(0,0,bounds.width*dpi,bounds.height*dpi);
  //     setFillStyle('#FFEDDB',ctx);
  //     forEach(stars, function(star){
  //       star.s+=star.speed*(star.growing?1:-1);
  //       if(star.s>1) star.growing=false
  //       if(star.s<0){
  //         return;
  //       }else{
  //         newStars.push(star)
  //       }
  //       drawStar(
  //         star.x*dpi,
  //         star.y*dpi,
  //         1,
  //         smooth(star.s)*star.maxSize*dpi,
  //         ctx
  //       )
  //     })
  //     newStars.push(createStar());
  //     stars=newStars
  //     ctx.globalAlpha=1;
  //     if(!stopAnim)
  //       raf(draw);
  //   })()
  //   return {
  //     stop:function(){
  //       stopAnim=true;
  //     }
  //   }
  // }

  (function() {
    let animStars=stars()
    let lastResizeW=win.innerWidth;
    let lastResizeH=win.innerHeight;
    let resizeTimer=null;
    win.addEventListener('resize',function(){
      function resize(){
        var ww=win.innerWidth;
        var wh=win.innerHeight;
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


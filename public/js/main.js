(function(){
  //global variables
  let win=window;
  let dpi=win.devicePixelRatio;

  const getContext = (canvas) => {
    return canvas.getContext('2d')
  }
  const setAttribute = (attr,value,element) => {
    element.setAttribute(attr, value)
  }
  const getBounds = (element) => {
    return element.getBoundingCLientRect()
  }
  const forEach = (array, callback) => {
    for(let i=0;i<array.length;i++){
      callback(array[i],i);
    }
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
  }
}())
export const SIZES=[16,32,64];
export function validateProject(value){
 if(value?.version!==1||!SIZES.includes(value.size)||!Array.isArray(value.pixels)||value.pixels.length!==value.size**2||value.pixels.some(c=>c!==null&&!/^#[0-9a-f]{6}$/i.test(c)))throw Error('Invalid Pixel Pad project. Use a saved .json project file.');
 return {size:value.size,pixels:[...value.pixels]};
}
export function fill(pixels,size,index,color){
 const target=pixels[index];if(target===color)return;
 const todo=[index];pixels[index]=color;
 while(todo.length){const i=todo.pop(),x=i%size,y=Math.floor(i/size);
 for(const n of [x>0?i-1:-1,x<size-1?i+1:-1,y>0?i-size:-1,y<size-1?i+size:-1])if(n>=0&&pixels[n]===target){pixels[n]=color;todo.push(n);}}
}
export function line(x0,y0,x1,y1,paint){
 let dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1,err=dx+dy;
 for(;;){paint(x0,y0);if(x0===x1&&y0===y1)break;const e=2*err;if(e>=dy){err+=dy;x0+=sx;}if(e<=dx){err+=dx;y0+=sy;}}
}
export function resizePixels(pixels,from,to){return Array.from({length:to**2},(_,i)=>pixels[Math.floor(Math.floor(i/to)*from/to)*from+Math.floor((i%to)*from/to)]);}

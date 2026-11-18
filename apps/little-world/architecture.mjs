// All surfaces are drawn on the same tile grid as the clickable desks.
export function roomShell(ctx,iso){
  const surface=(points,fill,stroke)=>{
    ctx.beginPath();
    points.forEach(([x,y,z],i)=>{const p=iso(x,y,z);if(i)ctx.lineTo(p.x,p.y);else ctx.moveTo(p.x,p.y);});
    ctx.closePath();ctx.fillStyle=fill;ctx.fill();
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}
  };
  const wall=(axis,start,end,low,high,fill)=>{
    const coords=(n,z)=>axis==='x'?[n,-.5,z]:[-.5,n,z];
    surface([coords(start,low),coords(end,low),coords(end,high),coords(start,high)],fill);
  };
  ctx.fillStyle='#cddfda';ctx.fillRect(0,0,1100,720);
  for(let x=-14;x<36;x++)for(let y=-14;y<36;y++){
    if((x+y)%3!==0)continue;
    surface([[x,y,0],[x+1,y,0],[x+1,y+1,0],[x,y+1,0]],'#c4d9d3');
  }
  surface([[-.5,10.5,0],[15.5,10.5,0],[15.5,10.5,-15],[-.5,10.5,-15]],'#826954');
  surface([[15.5,-.5,0],[15.5,10.5,0],[15.5,10.5,-15],[15.5,-.5,-15]],'#635449');
  for(let x=0;x<16;x++)for(let y=0;y<11;y++){
    const plank=['#d6b999','#ddc3a2','#e1c9ac','#d8bc9d'][(x*13+y*7)%4];
    surface([[x-.5,y-.5,0],[x+.5,y-.5,0],[x+.5,y+.5,0],[x-.5,y+.5,0]],plank,'#c9aa8c');
  }
  for(const [axis,end] of [['x',15.5],['y',10.5]]){
    wall(axis,-.5,end,0,128,axis==='x'?'#d0c9bd':'#f1e9d5');
    wall(axis,-.5,end,0,12,'#74635d');wall(axis,-.5,end,125,133,'#695660');
    for(let n=0;n<end;n+=.65)wall(axis,n,n+.035,16,43,'#aca397');
    wall(axis,-.5,end,43,47,'#a69b90');
  }
  for(const start of [.7,3.8,6.9]){
    wall('y',start,start+1.9,54,114,'#574b63');
    wall('y',start+.12,start+1.78,58,110,'#94bac0');
    wall('y',start+.2,start+.43,60,108,'#c2dfe1');
    wall('y',start+.89,start+1.01,58,110,'#594c64');
    wall('y',start,start+1.9,84,87,'#66576b');
  }
  wall('x',1,5.1,56,112,'#675961');wall('x',1.12,4.98,59,109,'#f5ead2');
  for(let i=0;i<7;i++){const n=1.4+i*.44;wall('x',n,n+.31,66,73+(i*11)%29,['#a17690','#689c8b','#c8965a'][i%3]);}
  // Book shelving and publishing stock on the rear wall.
  for(let row=0;row<2;row++){
    const z=24+row*36;wall('x',7.4,11.6,z,z+4,'#73584f');
    for(let i=0;i<13;i++){const n=7.55+i*.29;wall('x',n,n+.22,z+4,z+17+(i*7)%13,['#b16b70','#57798b','#f1dca1','#769d88'][i%4]);}
  }
  // Garment rail with three hanging pieces.
  wall('x',12,15.1,75,79,'#4b4552');
  for(let i=0;i<3;i++){
    const u=12.2+i*.91;const p=(d,z)=>[u+d,0,z];
    surface([p(.4,75),p(.8,66),p(1,53),p(.8,50),p(.71,55),p(.73,29),p(.13,29),p(.13,55),p(.02,50),p(-.13,55),p(.04,67)],['#885a69','#334253','#797e5a'][i],'#544a51');
  }
}

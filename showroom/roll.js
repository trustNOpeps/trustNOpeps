// Draw the printed paper in strips along the upper arc, then along its hanging tail.
window.createTicketRoll=function(canvas,volumes,onSelect){
  const ctx=canvas.getContext('2d'),sheets=[];
  const width=280,height=292;
  const marks=['open','echo','weather','shards','boundary','garden','lights','pears','cadence','letter'];
  function sheet(v){
    const paper=document.createElement('canvas');paper.width=width;paper.height=height;
    const g=paper.getContext('2d'),[ink,accent,bg]=v.colors;
    g.fillStyle=bg;g.fillRect(0,0,width,height);
    g.fillStyle=ink;g.font='bold 13px monospace';g.fillText('AFTER WANTING',17,24);g.fillText(String(v.id).padStart(2,'0')+' / 10',202,24);
    g.save();g.translate(140,131);g.strokeStyle=accent;g.fillStyle=ink;g.lineWidth=4;
    switch(marks[v.id-1]){
      case 'pears':
        for(const side of [-1,1]){g.save();g.scale(side,1);g.beginPath();g.moveTo(7,-52);g.bezierCurveTo(2,-23,17,-15,12,7);g.bezierCurveTo(2,54,76,65,75,24);g.bezierCurveTo(75,-4,29,-15,19,-46);g.closePath();g.fill();g.beginPath();g.moveTo(12,-42);g.lineTo(3,-64);g.stroke();g.restore();}break;
      case 'letter':g.fillRect(-84,-52,168,105);g.beginPath();g.moveTo(-84,-52);g.lineTo(0,10);g.lineTo(84,-52);g.moveTo(-82,53);g.lineTo(-23,-7);g.moveTo(82,53);g.lineTo(23,-7);g.stroke();break;
      case 'cadence':for(let i=0;i<11;i++)for(let j=0;j<5;j++){g.beginPath();g.arc(-92+i*18,-38+j*19+9*Math.sin(i*.9),2+i*.38,0,Math.PI*2);g.fill();}break;
      case 'open':for(let i=0;i<4;i++){g.strokeRect(-76+i*14,-53+i*10,116,76);}break;
      case 'echo':for(let i=0;i<6;i++){g.beginPath();g.ellipse(-35+i*14,0,43,56,.2,0,Math.PI*2);g.stroke();}break;
      case 'weather':for(let i=-3;i<4;i++){g.beginPath();g.moveTo(-100,i*14);g.bezierCurveTo(-55,i*14-55,20,i*14+58,100,i*14-8);g.stroke();}break;
      case 'shards':for(let i=0;i<7;i++){g.save();g.rotate(i*.9);g.beginPath();g.moveTo(8,6);g.lineTo(68,15);g.lineTo(22,39);g.closePath();g.fill();g.restore();}break;
      case 'boundary':for(let i=0;i<6;i++){g.strokeRect(-90+i*13,-49+i*4,110,80); }break;
      case 'garden':for(let i=0;i<8;i++){g.rotate(Math.PI/4);g.beginPath();g.ellipse(0,-29,16,29,0,0,Math.PI*2);g.stroke();}break;
      case 'lights':for(let i=0;i<7;i++){g.beginPath();g.moveTo(-94,48-i*5);g.bezierCurveTo(-60,13,91,15-i*4,68,-53-i*2);g.stroke();}break;
    }
    g.restore();g.strokeStyle=ink;g.setLineDash([3,4]);g.beginPath();g.moveTo(12,211);g.lineTo(268,211);g.stroke();
    g.font='29px Georgia';g.fillText(v.name,16,249,248);g.font='11px monospace';g.fillText('PACKAGING STUDY     /     AW-'+String(v.id).padStart(2,'0'),16,273);
    return paper;
  }
  volumes.forEach(v=>sheets.push(sheet(v)));
  let offset=0,selected=0,anim=0,start=null;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  function draw(){
    ctx.clearRect(0,0,520,490);
    ctx.save();ctx.fillStyle='rgba(42,35,32,.12)';ctx.beginPath();ctx.ellipse(283,420,135,17,0,0,Math.PI*2);ctx.fill();ctx.restore();
    ctx.save();ctx.transform(1,-.045,.045,1,96,84);
    const radius=51;
    const ellipse=(x,rx,fill)=>{ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(x,0,rx,radius,0,0,Math.PI*2);ctx.fill();};
    ellipse(width+2,21,'#cfc7b9');
    for(let i=1;i<8;i++){ctx.strokeStyle='#afa898';ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(width+2,0,21-i*1.8,radius-i*4.4,0,0,Math.PI*2);ctx.stroke();}
    ctx.fillStyle='#786851';ctx.beginPath();ctx.ellipse(width+3,0,6,14,0,0,Math.PI*2);ctx.fill();
    const feed=offset*height;
    function strip(t,y,h,shade){
      const pos=((Math.floor(t+feed)%(height*10))+height*10)%(height*10);
      ctx.drawImage(sheets[Math.floor(pos/height)],0,pos%height,width,1,0,y,width,h+.45);
      if(shade){ctx.fillStyle='rgba(65,51,38,'+shade+')';ctx.fillRect(0,y,width,h+.45);}
    }
    const arc=Math.PI*radius/2;
    for(let i=0;i<Math.ceil(arc);i++){const angle=i/radius,y=-radius*Math.cos(angle),next=-radius*Math.cos((i+1)/radius);strip(i-arc,y,next-y,.22*(1-i/arc));}
    for(let y=0;y<height;y++)strip(y,y,1,0);
    ctx.fillStyle=sheets[selected]===undefined?'#faf5ea':volumes[selected].colors[2];
    for(let x=0;x<width;x+=8){ctx.beginPath();ctx.moveTo(x,height-1);ctx.lineTo(x+4,height+4);ctx.lineTo(x+8,height-1);ctx.fill();}
    ctx.restore();
  }
  function select(id){
    selected=id-1;cancelAnimationFrame(anim);
    const from=offset;let delta=selected-((from%10+10)%10);
    if(delta>5)delta-=10;if(delta< -5)delta+=10;
    const target=from+delta,begin=performance.now();
    function step(now){const t=reduced.matches?1:Math.min(1,(now-begin)/Math.min(1150,540+Math.abs(delta)*110));offset=from+(target-from)*(1-(1-t)**3);draw();if(t<1)anim=requestAnimationFrame(step);}
    step(begin);canvas.setAttribute('aria-label','Paper roll: '+volumes[selected].name+'. Use arrow keys or drag to turn.');
  }
  const turn=d=>onSelect(((selected+d+10)%10)+1);
  canvas.onpointerdown=e=>{cancelAnimationFrame(anim);start={y:e.clientY,offset};canvas.setPointerCapture(e.pointerId);};
  canvas.onpointermove=e=>{if(start){offset=start.offset-(e.clientY-start.y)/Math.max(70,canvas.clientHeight*.45);draw();}};
  canvas.onpointerup=e=>{
    if(!start)return;
    const dy=e.clientY-start.y;
    start=null;
    if(Math.abs(dy)<=20){select(selected+1);return;}
    const nearest=(Math.round(offset)%10+10)%10;
    if(nearest===selected)turn(dy<0?1:-1);
    else onSelect(nearest+1);
  };
  canvas.onpointercancel=()=>{start=null;select(selected+1);};
  canvas.onkeydown=e=>{if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(e.key)){e.preventDefault();turn(['ArrowRight','ArrowDown'].includes(e.key)?1:-1);}};
  draw();return select;
};

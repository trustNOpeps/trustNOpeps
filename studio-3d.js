
/* Original procedural studio sculpture. Three.js is optional; semantic page and SVG fallback remain available. */
const chapter = document.querySelector('#studio-3d');
if (chapter) {
  const canvas = chapter.querySelector('#studio-canvas');
  const mount = chapter.querySelector('.studio-render');
  const chapterNumber = chapter.querySelector('#studio-chapter');
  const heading = chapter.querySelector('#studio-title');
  const description = chapter.querySelector('#studio-description');
  const visit = chapter.querySelector('#studio-visit');
  const progressFill = chapter.querySelector('#studio-progress');
  const figNumber = chapter.querySelector('#studio-figure');
  const copy = chapter.querySelector('.studio-copy');
  const scenes = [
    {name:'Engineering, in motion.', html:'Engineering,<br><em>in motion.</em>', text:'From tensile calculations to circuit simulations, the work starts with understanding how things behave.', label:'OPEN ENGINEERING LAB', href:'https://github.com/trustNOpeps/mechatronics-lab', figure:'01 / ENGINEERING STUDY'},
    {name:'A space to experiment.', html:'A space to<br><em>experiment.</em>', text:'Small interactive worlds and practical interfaces. Built to test an idea, learn from it, and keep improving.', label:'EXPLORE LITTLE WORLD', href:'./apps/little-world/', figure:'02 / DIGITAL PLAYGROUND'},
    {name:'Ideas beyond the screen.', html:'Ideas beyond<br><em>the screen.</em>', text:'An evolving collection of clothing concepts, writing and visual studies. Ideas are labeled as concepts until they become real.', label:'VISIT THE CREATIVE ARCHIVE', href:'./showroom/', figure:'03 / CREATIVE PRACTICE'}
  ];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let currentChapter = -1;
  let scrollProgress = 0;
  let framePending = false;
  let updateRender = null;

  function clamp(n, low, high) { return Math.max(low, Math.min(high, n)); }
  function updateScroll() {
    framePending = false;
    const distance = Math.max(1, chapter.offsetHeight - window.innerHeight);
    scrollProgress = clamp(-chapter.getBoundingClientRect().top / distance, 0, 1);
    const sceneIndex = Math.min(2, Math.floor(scrollProgress * 3));
    if (sceneIndex !== currentChapter) {
      currentChapter = sceneIndex;
      const selected = scenes[currentChapter];
      chapterNumber.textContent = '0' + (currentChapter + 1) + ' / 03';
      heading.innerHTML = selected.html;
      description.textContent = selected.text;
      visit.textContent = selected.label + ' ↗';
      visit.href = selected.href;
      figNumber.textContent = selected.figure;
      copy.removeAttribute('data-fade');
      if (!reduced) { void copy.offsetHeight; copy.setAttribute('data-fade','on'); }
    }
    progressFill.style.width = (scrollProgress * 100).toFixed(2) + '%';
    if (updateRender) updateRender(scrollProgress);
  }
  function scheduleUpdate() {
    if (!framePending) {framePending=true; requestAnimationFrame(updateScroll);}
  }
  window.addEventListener('scroll', scheduleUpdate, {passive:true});
  window.addEventListener('resize',scheduleUpdate,{passive:true});
  scheduleUpdate();

  const smallDevice = window.matchMedia('(max-width: 700px)').matches;
  const noWebGL = reduced || !window.WebGLRenderingContext;
  if (!noWebGL) import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js').then(THREE => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80);
    const renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:!smallDevice,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, smallDevice ? 1.4 : 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const rig = new THREE.Group(); scene.add(rig);
    const metal = new THREE.MeshStandardMaterial({color:0x313b3d,metalness:.45,roughness:.42});
    const dark = new THREE.MeshStandardMaterial({color:0x252a33,metalness:.16,roughness:.55});
    const line = new THREE.MeshStandardMaterial({color:0x7b8a84,metalness:.32,roughness:.45});
    const ivory = new THREE.MeshStandardMaterial({color:0xd8dfd4,roughness:.67});
    const lime = new THREE.MeshStandardMaterial({color:0xc4f06b,roughness:.55,metalness:.08});
    const lilac = new THREE.MeshStandardMaterial({color:0xb3a0e7,roughness:.54,metalness:.12});
    const lightScreen = new THREE.MeshStandardMaterial({color:0xcce0d2,emissive:0x476e56,emissiveIntensity:.12,roughness:.8});
    scene.add(new THREE.HemisphereLight(0xffffff,0x82928a,2.65));
    const key = new THREE.DirectionalLight(0xffffff,3.1);key.position.set(4,8,8);scene.add(key);
    const fill = new THREE.DirectionalLight(0xc7bafa,1.0);fill.position.set(-6,3,-5);scene.add(fill);

    function box(parent,w,h,d,x,y,z,material) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
      mesh.position.set(x,y,z);parent.add(mesh);return mesh;
    }
    function cylinder(parent,r,h,x,y,z,material,radial=28) {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,radial),material);
      mesh.position.set(x,y,z);parent.add(mesh);return mesh;
    }
    // Deliberately composed like a restrained technical product photograph, rather than an asset pack.
    box(rig,5.6,.16,3.35,0,-.86,0,metal);
    box(rig,5.48,.035,3.22,0,-.755,0,line);
    box(rig,2.4,1.52,.12,-1.02,.42,-.69,dark);
    box(rig,2.16,1.27,.018,-1.02,.45,-.618,lightScreen);
    box(rig,.12,.76,.13,-1.02,-.68,-.73,dark);
    box(rig,.88,.07,.65,-1.02,-.73,-.65,dark);
    // Interface drawn as physical strips in the display: no screenshot or borrowed brand assets.
    for (let i=0;i<5;i++) box(rig,1.62-(i%3)*.18,.032,.025,-1.13,.78-i*.18,-.59,i%3===0?lime:line);
    box(rig,1.65,.09,.67,-.94,-.65,1.04,dark);
    for (let r=0;r<3;r++)for (let c=0;c<10;c++) box(rig,.125,.012,.12,-1.64+c*.155,-.594,.86+r*.18,(r===0&&c<3)?lilac:ivory);
    // A pair of original extruded gears to reference the engineering foundation.
    const machine = new THREE.Group();machine.position.set(1.38,.05,.10);rig.add(machine);
    function gear(radius,teeth,material,x,y,z,thick) {
      const shape=new THREE.Shape(), count=teeth*4;
      for(let i=0;i<count;i++){const angle=(i/count)*Math.PI*2;const tooth=i%4===1||i%4===2;const rr=radius*(tooth?1.14:1);
        const px=Math.cos(angle)*rr,py=Math.sin(angle)*rr;
        if(i===0)shape.moveTo(px,py);else shape.lineTo(px,py);
      }shape.closePath();
      const hole=new THREE.Path();hole.absarc(0,0,radius*.28,0,Math.PI*2,true);shape.holes.push(hole);
      const geo=new THREE.ExtrudeGeometry(shape,{depth:thick,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:1,steps:1,curveSegments:18});
      const g=new THREE.Mesh(geo,material);g.position.set(x,y,z);machine.add(g);return g;
    }
    const largeGear=gear(.74,12,metal,.06,.12,.2,.17);
    const smallGear=gear(.42,10,lilac,1.09,-.28,.28,.13);
    const disk = cylinder(machine,.75,.10,.06,.12,-.01,line);disk.rotation.x=Math.PI/2;
    const peg = cylinder(machine,.20,.33,.06,.12,.43,ivory);peg.rotation.x=Math.PI/2;
    const wiring = new THREE.Group(); rig.add(wiring);
    const points = [new THREE.Vector3(1.55,-.68,1.24),new THREE.Vector3(2.5,-.38,.7),new THREE.Vector3(2.47,.28,-.15)];
    const wire = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),24,.025,6,false),lime);wiring.add(wire);
    const badge=box(rig,.47,.04,.5,2.01,-.68,1.07,lilac);badge.rotation.y=.24;
    // Technical frame, understated rather than a decorative galaxy of particles.
    const outline = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(5.85,2.5,3.65)),new THREE.LineBasicMaterial({color:0x9aa9a0,transparent:true,opacity:.24}));
    outline.position.y=.14;rig.add(outline);
    const pointer={x:0,y:0};
    mount.addEventListener('pointermove',e=>{
      if (smallDevice) return;
      const rect=mount.getBoundingClientRect();pointer.x=clamp((e.clientX-rect.left)/rect.width*2-1,-1,1);pointer.y=clamp((e.clientY-rect.top)/rect.height*2-1,-1,1);
    },{passive:true});
    mount.addEventListener('pointerleave',()=>{pointer.x=0;pointer.y=0},{passive:true});
    const clock=new THREE.Clock();
    let goal=scrollProgress;
    let actual=scrollProgress;
    let visible=true;
    const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true},{rootMargin:'120px'});
    observer.observe(chapter);
    function resize(){
      const w=Math.max(1,mount.clientWidth),h=Math.max(1,mount.clientHeight);
      camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);
    }
    new ResizeObserver(resize).observe(mount);resize();
    updateRender=p=>{goal=p};
    function loop(){
      requestAnimationFrame(loop);
      if(!visible || document.hidden) return;
      const delta=Math.min(.04,clock.getDelta());
      actual+=(goal-actual)*Math.min(1,delta*5.5);
      const stage=actual*3;
      rig.rotation.y=-.23+actual*.68+pointer.x*.075;
      rig.rotation.x=.05+pointer.y*.035;
      largeGear.rotation.z=-actual*2.9;
      smallGear.rotation.z=actual*4.4;
      machine.position.x=1.38+Math.max(0,Math.min(1,(stage-1)))*.45;
      machine.position.y=.05+Math.max(0,Math.min(1,(stage-1)))*.13;
      camera.position.set(7.4-actual*2.0,4.4-actual*.65,9.4-actual*.75);
      camera.lookAt(.0,.0,0);
      renderer.render(scene,camera);
    }
    mount.classList.add('is-3d');
    canvas.hidden=false;
    loop();
  }).catch(()=>{
    // A CDN / WebGL failure is not a broken portfolio: the hand-drawn SVG remains visible.
    canvas.hidden=true;
    mount.classList.remove('is-3d');
  });
  else canvas.hidden=true;
}

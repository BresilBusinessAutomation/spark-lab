'use strict';
/* Circuit board: parts with pins, wires drawn by dragging pin to pin, and a small nodal simulator. */
const RVALS=[10,33,100,470];
const RNAME={10:'tiny',33:'small',100:'medium',470:'big'};
const PD={
  bolt:{pins:[['p',0,-64],['n',0,60]],label:()=>['Bolt','battery'],draw:p=>`<g transform="scale(.7)">${CH.bolt({mood:p.hot?'ouch':(Math.abs(p.I)>0.005?'grin':'happy'),hot:p.hot,rev:p.rev})}</g>`,key:p=>`${p.hot}${p.rev}${Math.abs(p.I)>0.005}`,lab:[0,122],pinLab:p=>p.rev?['−','+']:['+','−']},
  glow:{pins:[['a',-32,32],['b',32,32]],label:()=>['Glow','bulb'],draw:p=>`<g transform="scale(.7)">${CH.glow({level:p.bright,mood:p.out?'sad':(p.bright>0.05?'grin':'happy'),out:p.out})}</g>`,key:p=>`${p.out}${(p.bright*20|0)}`,lab:[0,96],pinLab:()=>['−','+']},
  dot:{pins:[['a',-36,65],['k',36,65]],label:()=>['Dot','LED'],draw:p=>`<g transform="scale(${p.rev?-.9:.9} .9)">${CH.dot({color:p.color||C.red,lit:p.bright>0.03,level:.35+.65*p.bright,mood:p.bright>0.03?'grin':'happy',burnt:p.burnt})}<path d="M-13 62 L-40 72 M13 52 L40 72" stroke="#9AA3B5" stroke-width="6" stroke-linecap="round"/></g>`,key:p=>`${p.rev}${p.burnt}${(p.bright*20|0)}${p.color}`,lab:[0,140],pinLab:p=>p.rev?['−','+']:['+','−']},
  rez:{pins:[['a',-58,0],['b',58,0]],label:p=>['Rez',`${RNAME[p.R]||''} resistor`],draw:p=>`<g transform="scale(.55)">${CH.rez({R:p.R,warm:p.warm,mood:'sleepy'})}</g>`,key:p=>`${p.R}${p.warm}`,lab:[0,54],pinLab:()=>['+','−']},
  swish:{pins:[['a',-54,-20],['b',54,-20]],label:()=>['Swish','switch'],draw:p=>`<g transform="scale(.72)">${CH.swish({closed:p.closed,mood:p.closed?'grin':'happy'})}</g>`,key:p=>`${p.closed}`,lab:[0,50],pinLab:()=>['+','−']},
  cap:{pins:[['a',-26,54],['b',26,54]],label:()=>['Cap','capacitor'],draw:p=>`<g transform="scale(.6)">${CH.cap({fill:p.fill,mood:p.fill>.9?'wow':'happy'})}<path d="M-14 78 L-43 90 M14 78 L43 90" stroke="#9AA3B5" stroke-width="6" stroke-linecap="round"/></g>`,key:p=>`${(p.fill*20|0)}`,lab:[0,108],pinLab:()=>['+','−']},
  spinny:{pins:[['a',-48,4],['b',48,4]],label:()=>['Spinny','motor'],draw:p=>`<g transform="scale(.7)">${CH.spinny({angle:p.angle,mood:Math.abs(p.speed)>.6?'grin':(Math.abs(p.speed)>.05?'happy':'sleepy')})}</g>`,key:p=>Math.abs(p.speed)>0.01?Math.random():'still',lab:[0,58],pinLab:()=>['+','−']},
  buzz:{pins:[['a',-46,8],['b',46,8]],label:()=>['Buzz','buzzer'],draw:p=>`<g transform="scale(.7)">${CH.buzz({on:p.on})}</g>`,key:p=>p.on?Math.random():'off',lab:[0,62],pinLab:()=>['+','−']},
  boomer:{pins:[['a',-46,22],['b',46,22]],label:()=>['Boomer','speaker'],draw:p=>`<g transform="scale(.52)">${CH.boomer({pulse:p.on?(Math.sin(performance.now()/40)+1)/2:0})}</g>`,key:p=>p.on?Math.random():'off',lab:[0,76],pinLab:()=>['+','−']},
  tran:{pins:[['c',-30,64],['b',0,70],['e',30,64]],label:()=>['Tran','transistor'],draw:p=>`<g transform="scale(.8)">${CH.tran({open:p.open>.3})}</g><path d="M-12 50 L-30 64 M0 52 L0 70 M12 50 L30 64" stroke="#9AA3B5" stroke-width="5" stroke-linecap="round"/>${p.open>.02?`<rect x="-46" y="-70" width="92" height="12" rx="6" fill="#E3EAF6"/><rect x="-46" y="-70" width="${(92*p.open).toFixed(0)}" height="12" rx="6" fill="${C.yellow}"/>`:''}`,key:p=>`${(p.open*10|0)}`,lab:[0,-88],pinLab:()=>['+','button','−']},
  touch:{pins:[['a',-46,0],['b',46,0]],label:()=>['Touch pad',''],draw:p=>`<rect x="-30" y="-30" width="60" height="60" rx="14" fill="${p.held?'#FFE066':'#F2C230'}" stroke="${I}" stroke-width="4"/><path d="M-14 12 a14 14 0 0 1 28 0 M-20 14 a20 20 0 0 1 40 0 M-8 10 a8 8 0 0 1 16 0" stroke="#8A5A00" stroke-width="3" fill="none" stroke-linecap="round" transform="translate(0 -6)"/><path d="M-30 0 H-46 M30 0 H46" stroke="#9AA3B5" stroke-width="5"/>`,key:p=>`${p.held}`,lab:[0,54],pinLab:()=>['+','−']},
  rail:{pins:Array.from({length:6},(_,i)=>['r'+i,-160+i*64,0]),label:p=>[p.sign==='+'?'Plus rail':'Minus rail',''],draw:p=>`<rect x="-180" y="-12" width="360" height="24" rx="12" fill="${p.sign==='+'?'#FFD9D6':'#D9E4FF'}" stroke="${p.sign==='+'?C.red:C.blue}" stroke-width="4"/><text x="-196" y="9" text-anchor="middle" ${FONT} font-size="26" fill="${p.sign==='+'?C.red:C.blue}">${p.sign==='+'?'+':'−'}</text>`,key:()=>'r',lab:null},
  /* guitar parts: wiring only */
  pipG:{pins:[['h',-30,34],['g',30,34]],label:p=>[p.name||'Pip','pickup'],draw:p=>`<g transform="scale(.55)">${CH.pip({mood:p.awake?'cool':'happy'})}</g><path d="M-14 12 L-30 34 M14 12 L30 34" stroke="#9AA3B5" stroke-width="4"/>`,key:p=>`${p.awake}`,lab:[0,-46],pinLab:()=>['+','−']},
  sw5:{pins:[['n',-62,-40],['m',-62,0],['b',-62,40],['o',62,0]],label:()=>['Swish 5','pickup switch'],draw:p=>`<rect x="-46" y="-60" width="92" height="120" rx="20" fill="${C.purple}" stroke="${I}" stroke-width="4"/><circle cx="0" cy="-20" r="16" fill="#EADFFB"/>${face('happy',.62,0,-20)}<rect x="-8" y="6" width="16" height="44" rx="8" fill="${I}"/><rect x="-16" y="14" width="32" height="14" rx="7" fill="${C.yellow}" stroke="#fff" stroke-width="2"/><path d="M-46 -40 H-62 M-46 0 H-62 M-46 40 H-62 M46 0 H62" stroke="#9AA3B5" stroke-width="4"/>`,key:()=>'s',lab:[0,84],pinLab:()=>['neck','middle','bridge','+ out']},
  vol:{pins:[['i',-38,50],['o',0,58],['g',38,50]],label:()=>['Knobby','volume knob'],draw:p=>`<g transform="scale(.62)">${CH.knobby({})}</g><path d="M-20 22 L-38 50 M0 28 L0 58 M20 22 L38 50" stroke="#9AA3B5" stroke-width="4"/>`,key:()=>'v',lab:[0,-52],pinLab:()=>['+ in','+ out','−']},
  tone:{pins:[['i',-32,46],['g',32,46]],label:()=>['Tone knob','Rez + Cap'],draw:p=>`<g transform="scale(.5)">${CH.knobby({mood:'sleepy',turn:.3})}</g><path d="M-14 18 L-32 46 M14 18 L32 46" stroke="#9AA3B5" stroke-width="4"/>`,key:()=>'t',lab:[0,-44],pinLab:()=>['+','−']},
  jack:{pins:[['t',-34,44],['s',34,44]],label:()=>['Jack','output'],draw:p=>`<circle r="30" fill="#B8C5DB" stroke="${I}" stroke-width="4"/><circle r="13" fill="${I}"/><path d="M-14 24 L-34 44 M14 24 L34 44" stroke="#9AA3B5" stroke-width="4"/>`,key:()=>'j',lab:[0,-46],pinLab:()=>['+ tip','− sleeve']},
  gnd:{pins:[['g',0,-40]],label:()=>['Ground','the minus wire'],pinLab:()=>['−'],draw:p=>`<path d="M0 -40 V0 M-40 0 H40 M-26 14 H26 M-12 28 H12" stroke="#127A4A" stroke-width="7" stroke-linecap="round"/>`,key:()=>'g',lab:[0,62]}
};
/* Freehand wires. A drawn wire's points are stored in a frame built from its two pin
   positions - t along the pin-to-pin line, u across it, both as fractions of its length -
   so the wire keeps its drawn shape if a part is later dragged somewhere else. */
function normPts(q,A,B){const dx=B.x-A.x,dy=B.y-A.y,L2=dx*dx+dy*dy||1;return q.map(P=>[((P.x-A.x)*dx+(P.y-A.y)*dy)/L2,((P.y-A.y)*dx-(P.x-A.x)*dy)/L2]);}
function denormPts(n,A,B){const dx=B.x-A.x,dy=B.y-A.y;return n.map(([t,u])=>({x:A.x+t*dx-u*dy,y:A.y+t*dy+u*dx}));}
function smoothPath(q){if(!q||q.length<2)return '';let d=`M${q[0].x.toFixed(1)} ${q[0].y.toFixed(1)}`;if(q.length===2)return d+` L${q[1].x.toFixed(1)} ${q[1].y.toFixed(1)}`;
  for(let i=1;i<q.length-1;i++){const mx=(q[i].x+q[i+1].x)/2,my=(q[i].y+q[i+1].y)/2;d+=` Q${q[i].x.toFixed(1)} ${q[i].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;}
  const L=q[q.length-1];return d+` L${L.x.toFixed(1)} ${L.y.toFixed(1)}`;}
let WID=0;
class Board{
  constructor(opts={}){
    this.o=Object.assign({canWire:true,movable:false,deleteWires:true,dots:true},opts);
    this.root=el('g');this.ghostL=el('g',{'pointer-events':'none'},this.root);this.wireL=el('g',{},this.root);this.flowL=el('g',{'pointer-events':'none'},this.root);this.partL=el('g',{},this.root);this.hitL=el('g',{},this.root);this.pinL=el('g',{},this.root);this.dragL=el('g',{'pointer-events':'none'},this.root);
    this.parts=[];this.wires=[];this.ghosts=[];this.ls={};window.__board=this;this.dirty=true;this.drag=null;
    addTick(dt=>this.step(dt));
    this.root.addEventListener('pointerdown',e=>this.down(e));
    this._mv=e=>this.move(e);this._up=e=>this.up(e);window.addEventListener('pointermove',this._mv);window.addEventListener('pointerup',this._up);
    cleanups.push(()=>{window.removeEventListener('pointermove',this._mv);window.removeEventListener('pointerup',this._up);this.parts.forEach(p=>p.snd&&p.snd.stop());});
  }
  on(ev,fn){(this.ls[ev]=this.ls[ev]||[]).push(fn);}
  emit(ev,...a){(this.ls[ev]||[]).forEach(f=>{try{f(...a);}catch(e){console.error(e);}});}
  add(type,x,y,o={}){const d=PD[type];const p=Object.assign({type,x,y,o,id:++WID,I:0,bright:0,speed:0,angle:0,fill:0,vc:0,open:0,ib:0,on:false,lit:false,heat:0,hot:false,burnT:0,R:100,closed:false},o.init||{});
    p.g=el('g',{class:'part'+(this.mov(p)?' mov':''),'data-part':p.id},this.partL);p.body=el('g',{},p.g);
    if(d.lab){const[nm,rl]=d.label(p);p.labG=g(pill(0,0,nm,rl),d.lab[0],d.lab[1],1,p.g);}
    p.pinG=d.pins.map((pd,k)=>{const pg=el('g',{class:'pin','data-pid':p.id,'data-k':k},this.pinL);pg.innerHTML=`<circle r="20" fill="transparent"/><circle class="pd" r="9" fill="#fff" stroke="${I}" stroke-width="3"/>`;return pg;});
    p.pinTxt=d.pinLab?d.pins.map(()=>el('text',{'text-anchor':'middle','font-family':'Baloo 2, sans-serif','font-weight':800,'font-size':15,fill:C.grey},this.pinL)):null;
    this.parts.push(p);this.place(p);this.drawPart(p,true);this.dirty=true;return p;}
  mov(p){return this.o.movable&&!(p.o&&p.o.fixed);}
  remove(p){this.wires.filter(w=>w.a.p===p||w.b.p===p).forEach(w=>this.rmWire(w,true));p.g.remove();p.pinG.forEach(x=>x.remove());p.pinTxt&&p.pinTxt.forEach(x=>x.remove());p.snd&&p.snd.stop();this.parts=this.parts.filter(q=>q!==p);this.dirty=true;this.emit('change');}
  pin(p,name){return {p,k:PD[p.type].pins.findIndex(x=>x[0]===name)};}
  pinPos(r){const pd=PD[r.p.type].pins[r.k];return {x:r.p.x+pd[1],y:r.p.y+pd[2]};}
  place(p){place(p.g,p.x,p.y);PD[p.type].pins.forEach((pd,k)=>{place(p.pinG[k],p.x+pd[1],p.y+pd[2]);if(p.pinTxt){const lab=PD[p.type].pinLab(p)[k];const t=p.pinTxt[k];t.textContent=lab;t.setAttribute('x',p.x+pd[1]);t.setAttribute('y',p.y+pd[2]+(pd[2]<0?-16:30));}});this.dirty=true;}
  drawPart(p,force){const d=PD[p.type];const k=String(d.key(p));if(force||k!==p._k){p._k=k;p.body.innerHTML=d.draw(p);if(p.type==='dot')p.body.classList.toggle('pulse',!!p.burnt);if(p.pinTxt)this.place(p);if(d.lab&&p.labG){const[nm,rl]=d.label(p);const h=pill(0,0,nm,rl);if(h!==p._lab){p._lab=h;p.labG.innerHTML=h;}}}}
  same(a,b){return a.p===b.p&&a.k===b.k;}
  has(a,b){return this.wires.some(w=>(this.same(w.a,a)&&this.same(w.b,b))||(this.same(w.a,b)&&this.same(w.b,a)));}
  wire(a,b,o={}){if(this.same(a,b)||this.has(a,b))return null;const w={a,b,id:++WID,fixed:!!o.fixed,I:0,off:0,pts:o.pts||null};
    w.path=el('path',{fill:'none',stroke:o.color||C.orange,'stroke-width':9,'stroke-linecap':'round'},this.wireL);
    w.hit=el('path',{fill:'none',stroke:'transparent','stroke-width':26,class:'wirehit','data-wid':w.id},this.hitL);
    w.dotG=el('g',{},this.flowL);this.wires.push(w);this.shape(w);this.dirty=true;this.updGhosts();this.emit('change');return w;}
  rmWire(w,silent){w.path.remove();w.hit.remove();w.dotG.remove();this.wires=this.wires.filter(x=>x!==w);this.dirty=true;this.updGhosts();if(!silent)this.emit('change');}
  ghost(a,b){const gp=el('path',{fill:'none',stroke:C.orange,'stroke-width':7,'stroke-dasharray':'4 12','stroke-linecap':'round',opacity:.55},this.ghostL);const gh={a,b,el:gp};this.ghosts.push(gh);this.shapeGhost(gh);this.updGhosts();return gh;}
  clearGhosts(){this.ghosts.forEach(g=>g.el.remove());this.ghosts=[];}
  updGhosts(){this.ghosts.forEach(gh=>gh.el.style.display=this.has(gh.a,gh.b)?'none':'');}
  ghostsDone(){return this.ghosts.every(gh=>this.has(gh.a,gh.b));}
  curve(A,B,same){const mx=(A.x+B.x)/2,my=(A.y+B.y)/2;const dx=B.x-A.x,dy=B.y-A.y;const L=Math.hypot(dx,dy)||1;const s=same?110:Math.min(40,L*.12);return `M${A.x.toFixed(1)} ${A.y.toFixed(1)} Q${(mx-dy/L*s).toFixed(1)} ${(my+dx/L*s).toFixed(1)} ${B.x.toFixed(1)} ${B.y.toFixed(1)}`;}
  shape(w){const A=this.pinPos(w.a),B=this.pinPos(w.b);const d=w.pts?smoothPath(denormPts(w.pts,A,B)):this.curve(A,B,w.a.p===w.b.p);w.path.setAttribute('d',d);w.hit.setAttribute('d',d);w.len=w.path.getTotalLength()||1;}
  shapeGhost(gh){gh.el.setAttribute('d',this.curve(this.pinPos(gh.a),this.pinPos(gh.b),gh.a.p===gh.b.p));}
  /* ---- pointer ---- */
  down(e){const pin=e.target.closest('.pin'),part=e.target.closest('.part'),wh=e.target.closest('.wirehit');
    if(pin&&this.o.canWire){e.preventDefault();A();const p=this.parts.find(q=>q.id==pin.dataset.pid);this.drag={kind:'wire',from:{p,k:+pin.dataset.k},pts:[this.pinPos({p,k:+pin.dataset.k})]};this.tmp=el('path',{fill:'none',stroke:C.orange,'stroke-width':9,'stroke-linecap':'round',opacity:.8},this.dragL);sfx.pick();return;}
    if(part){e.preventDefault();A();const p=this.parts.find(q=>q.id==part.dataset.part);const pt=toSvg(e);this.drag={kind:'part',p,start:pt,off:{x:pt.x-p.x,y:pt.y-p.y},moved:false};if(p.type==='touch'){p.held=true;this.dirty=true;}return;}
    if(wh&&this.o.deleteWires){const w=this.wires.find(x=>x.id==wh.dataset.wid);if(w&&!w.fixed){sfx.cut();this.rmWire(w);this.emit('cut',w);}}}
  move(e){if(!this.drag)return;const pt=toSvg(e);
    if(this.drag.kind==='wire'){const q=this.drag.pts,l=q[q.length-1];if(Math.hypot(pt.x-l.x,pt.y-l.y)>10)q.push({x:pt.x,y:pt.y});this.tmp.setAttribute('d',smoothPath(q.concat([{x:pt.x,y:pt.y}])));return;}
    const d=this.drag;if(!d.moved&&Math.hypot(pt.x-d.start.x,pt.y-d.start.y)>8&&this.mov(d.p))d.moved=true;
    if(d.moved){d.p.x=clamp(pt.x-d.off.x,40,960);d.p.y=clamp(pt.y-d.off.y,40,560);this.place(d.p);this.wires.forEach(w=>{if(w.a.p===d.p||w.b.p===d.p)this.shape(w);});this.ghosts.forEach(gh=>this.shapeGhost(gh));if(this.o.onMove)this.o.onMove(d.p,pt);}}
  up(e){const d=this.drag;if(!d)return;this.drag=null;const pt=toSvg(e);
    if(d.kind==='wire'){this.tmp.remove();let best=null,bd=34;this.parts.forEach(p=>PD[p.type].pins.forEach((pd,k)=>{const P={x:p.x+pd[1],y:p.y+pd[2]};const dd=Math.hypot(P.x-pt.x,P.y-pt.y);if(dd<bd&&!(p===d.from.p&&k===d.from.k)){bd=dd;best={p,k};}}));
      if(best){if(this.o.allow&&!this.o.allow(d.from,best)){sfx.bonk();return;}const A=this.pinPos(d.from),B=this.pinPos(best);const q=d.pts.concat([{x:pt.x,y:pt.y}]);q[0]=A;q[q.length-1]=B;
      const w=this.wire(d.from,best,{pts:q.length>2?normPts(q,A,B):null});if(w){sfx.snap();this.emit('wire',w);}}return;}
    const p=d.p;if(p.type==='touch'){p.held=false;this.dirty=true;}
    if(d.moved){if(this.o.onDrop)this.o.onDrop(p,pt);this.emit('change');return;}
    this.tap(p);}
  tap(p){const o=p.o||{};let did=true;
    if(p.type==='bolt'&&o.flip){p.rev=!p.rev;sfx.click();}
    else if(p.type==='glow'&&o.unscrew){p.out=!p.out;p.out?sfx.pop():sfx.snap();}
    else if(p.type==='dot'&&p.burnt){p.burnt=false;p.burnT=0;sfx.ding();}
    else if(p.type==='dot'&&o.flip){p.rev=!p.rev;sfx.click();}
    else if(p.type==='rez'&&o.adjust){const vs=o.sizes||RVALS;p.R=vs[(vs.indexOf(p.R)+1)%vs.length];sfx.click();}
    else if(p.type==='swish'&&!o.lock){p.closed=!p.closed;p.closed?sfx.zap():sfx.whistle();}
    else did=false;
    if(did){this.place(p);this.drawPart(p,true);this.dirty=true;boing(p.body);}
    this.emit('tap',p);}
  /* ---- union-find connectivity (wires + internal links) ---- */
  connected(a,b){const key=r=>r.p.id+':'+r.k;const par={};const f=x=>{while(par[x]&&par[x]!==x)x=par[x];return x;};const u=(x,y)=>{par[x]=par[x]||x;par[y]=par[y]||y;par[f(x)]=f(y);};
    this.wires.forEach(w=>u(key(w.a),key(w.b)));this.parts.filter(p=>p.type==='rail').forEach(p=>{for(let k=1;k<6;k++)u(p.id+':0',p.id+':'+k);});return f(key(a))===f(key(b))&&(par[key(a)]!==undefined||key(a)===key(b));}
  /* ---- simulation ---- */
  step(dt){
    const P=this.parts;let N=0;P.forEach(p=>{p.n=PD[p.type].pins.map(()=>N++);});
    if(N===0)return;
    const sim=P.filter(p=>PD[p.type].pins.length&&['bolt','glow','dot','rez','swish','cap','spinny','buzz','boomer','tran','touch','rail'].includes(p.type));
    let V=new Float64Array(N);
    for(let it=0;it<16;it++){
      const G=new Float64Array(N*N),B=new Float64Array(N);
      const Gs=(a,b,g)=>{G[a*N+a]+=g;G[b*N+b]+=g;G[a*N+b]-=g;G[b*N+a]-=g;};const Is=(from,to,i)=>{B[to]+=i;B[from]-=i;};
      for(let i=0;i<N;i++)G[i*N+i]+=1e-7;
      this.wires.forEach(w=>Gs(w.a.p.n[w.a.k],w.b.p.n[w.b.k],200));
      sim.forEach(p=>{const n=p.n;switch(p.type){
        case 'bolt':{const[a,b]=p.rev?[n[1],n[0]]:[n[0],n[1]];Gs(a,b,2);Is(b,a,6);break;}
        case 'glow':if(!p.out)Gs(n[0],n[1],1/30);break;
        case 'dot':if(!p.burnt&&p.on){const[a,k]=p.rev?[n[1],n[0]]:[n[0],n[1]];Gs(a,k,.2);Is(k,a,.4);}break;
        case 'rez':Gs(n[0],n[1],1/p.R);break;
        case 'swish':if(p.closed)Gs(n[0],n[1],50);break;
        case 'cap':if(dt>0){const Gc=.02/dt;Gs(n[0],n[1],Gc);Is(n[1],n[0],Gc*p.vc);}break;
        case 'spinny':Gs(n[0],n[1],.1);break;
        case 'buzz':Gs(n[0],n[1],1/60);break;
        case 'boomer':Gs(n[0],n[1],1/8);break;
        case 'touch':if(p.held)Gs(n[0],n[1],1e-5);break;
        case 'rail':for(let k=1;k<6;k++)Gs(n[0],n[k],200);break;
        case 'tran':{const[c,b,e]=n;if(p.bon){Gs(b,e,1/1000);Is(e,b,.65/1000);}const gce=clamp(p.ib/20e-6)*1+1e-7;Gs(c,e,gce);break;}
      }});
      V=gauss(G,B,N);
      let changed=false;
      sim.forEach(p=>{const n=p.n;if(p.type==='dot'&&!p.burnt){const[a,k]=p.rev?[n[1],n[0]]:[n[0],n[1]];const vd=V[a]-V[k];if(p.on&&.2*(vd-2)<-1e-6){p.on=false;changed=true;}else if(!p.on&&vd>2.0005){p.on=true;changed=true;}}
        if(p.type==='tran'){const vbe=V[n[1]]-V[n[2]];const bon=vbe>0.65;const ib=bon?(vbe-.65)/1000:0;if(bon!==p.bon){p.bon=bon;changed=true;}if(Math.abs(ib-p.ib)>1e-7){p.ib=p.ib*.4+ib*.6;changed=true;}}});
      if(!changed)break;
    }
    /* results */
    let anyShort=false;
    P.forEach(p=>{const n=p.n,v=k=>V[n[k]];switch(p.type){
      case 'bolt':{const[a,b]=p.rev?[1,0]:[0,1];p.I=2*(3-(v(a)-v(b)));if(p.I>1.2)p.heat=Math.min(1,p.heat+dt*2);else p.heat=Math.max(0,p.heat-dt);const h=p.heat>0.35;if(h&&!p.hot){p.hot=true;sfx.sizzle();this.emit('short',p);}else if(!h&&p.hot&&p.heat<0.1){p.hot=false;this.emit('cool',p);}if(p.hot)anyShort=true;break;}
      case 'glow':{if(p.out){p.I=0;p.bright=0;break;}p.I=(v(0)-v(1))/30;p.bright=Math.sqrt(clamp(p.I*p.I*30/.28));break;}
      case 'dot':{if(p.burnt){p.I=0;p.bright=0;break;}const[a,k]=p.rev?[1,0]:[0,1];p.I=p.on?Math.max(0,.2*(v(a)-v(k)-2)):0;p.bright=clamp(p.I/.012);if(p.I>.08){p.burnT+=dt;if(p.burnT>.12){p.burnt=true;p.on=false;sfx.pop();this.emit('burn',p);}}else p.burnT=0;break;}
      case 'rez':p.I=(v(0)-v(1))/p.R;p.warm=Math.abs(p.I)>.15;break;
      case 'cap':p.vc=v(0)-v(1);p.fill=clamp(Math.abs(p.vc)/3);break;
      case 'spinny':p.I=(v(0)-v(1))*.1;p.speed=clamp(p.I/.25,-1,1);p.angle+=dt*p.speed*18;break;
      case 'buzz':p.I=(v(0)-v(1))/60;p.on=Math.abs(p.I)>.01;this.sound(p,p.on?.06:0,'square',380,1800);break;
      case 'boomer':p.I=(v(0)-v(1))/8;p.on=Math.abs(p.I)>.02;this.sound(p,p.on?.1:0,'triangle',330,3000);break;
      case 'tran':p.open=clamp(p.ib/20e-6);break;
    }});
    if(P.some(p=>p.type==='spinny')){const sp=P.filter(p=>p.type==='spinny').reduce((m,p)=>Math.max(m,Math.abs(p.speed)),0);if(sp>0.05||this._whir)this.whir(sp);}
    this.V=V;
    /* wire currents & electron dots */
    this.wires.forEach(w=>{w.I=(V[w.a.p.n[w.a.k]]-V[w.b.p.n[w.b.k]])*200;const mag=Math.abs(w.I);
      if(!this.o.dots||mag<1e-5){if(w.dotG.childNodes.length){w.dotG.innerHTML='';}w.path.setAttribute('stroke',w.fixedColor||C.orange);return;}
      const n=Math.max(2,Math.round(w.len/42));if(w.dotG.childNodes.length!==n){w.dotG.innerHTML='';for(let i=0;i<n;i++)el('circle',{r:6.5,fill:C.yellow,stroke:I,'stroke-width':2},w.dotG);}
      const sp=Math.min(260,25+mag*1600);w.off=(w.off+sp*dt*(w.I>0?-1:1)+w.len*1000)%w.len;/* electrons move opposite to conventional current */
      [...w.dotG.childNodes].forEach((c,i)=>{const q=w.path.getPointAtLength((w.off+i*w.len/n)%w.len);c.setAttribute('cx',q.x.toFixed(1));c.setAttribute('cy',q.y.toFixed(1));});
      w.path.setAttribute('stroke',anyShort?C.red:C.orange);});
    P.forEach(p=>this.drawPart(p));
    this.emit('tick',dt);
  }
  sound(p,vol,type,f,filt){if(!p.snd){if(vol<=0)return;p.snd=loopSound(type,f,filt);}p.snd.set(vol);}
  whir(sp){if(!this._whir)this._whir=loopSound('sawtooth',60,500);this._whir.set(sp*.04,50+sp*160);}
  get(type){return this.parts.filter(p=>p.type===type);}
}
function gauss(G,B,N){const M=G,b=B;for(let c=0;c<N;c++){let piv=c,mx=Math.abs(M[c*N+c]);for(let r=c+1;r<N;r++){const v=Math.abs(M[r*N+c]);if(v>mx){mx=v;piv=r;}}if(mx<1e-15)continue;if(piv!==c){for(let k=0;k<N;k++){const t=M[c*N+k];M[c*N+k]=M[piv*N+k];M[piv*N+k]=t;}const t=b[c];b[c]=b[piv];b[piv]=t;}
  const d=M[c*N+c];for(let r=c+1;r<N;r++){const f=M[r*N+c]/d;if(f===0)continue;for(let k=c;k<N;k++)M[r*N+k]-=f*M[c*N+k];b[r]-=f*b[c];}}
  const x=new Float64Array(N);for(let r=N-1;r>=0;r--){let s=b[r];for(let k=r+1;k<N;k++)s-=M[r*N+k]*x[k];const d=M[r*N+r];x[r]=Math.abs(d)<1e-15?0:s/d;}return x;}

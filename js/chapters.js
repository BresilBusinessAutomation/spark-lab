'use strict';
/* Story chapters. Each is an async function; it resolves after its wrap-up line. */

/* clear the stage but keep the chapter running */
function stage(){ticks=[];cleanups.forEach(f=>{try{f();}catch(e){}});cleanups=[];svg.innerHTML='';setProgress(0,0);bg();}
/* dots flowing along a path (for drawn scenes, not boards) */
function flow(d,{n=8,speed=180,parent=svg,r=9}={}){const p=el('path',{d,fill:'none',stroke:'none'},parent);const gg=el('g',{},parent);const len=p.getTotalLength()||1;const R={on:false,speed,off:0};const dots=[...Array(n)].map(()=>el('circle',{r,fill:C.yellow,stroke:I,'stroke-width':2.5},gg));
  addTick(dt=>{gg.style.display=R.on?'':'none';if(!R.on)return;R.off=(R.off+R.speed*dt)%len;dots.forEach((c,i)=>{const q=p.getPointAtLength((R.off+i*len/n)%len);c.setAttribute('cx',q.x.toFixed(1));c.setAttribute('cy',q.y.toFixed(1));});});return R;}
function holdBtn(x,y,label,r=62,fill=C.orange){const b=g(`<circle r="${r+14}" fill="transparent"/><g class="pulse"><circle r="${r}" fill="${fill}" stroke="${I}" stroke-width="5"/><text y="10" text-anchor="middle" ${FONT} font-size="${label.length>5?24:30}" fill="${I}">${esc(label)}</text></g>`,x,y);b.style.cursor='pointer';b.style.touchAction='none';const H={held:false,t:0};
  b.addEventListener('pointerdown',e=>{e.preventDefault();A();H.held=true;});const up=()=>{H.held=false;};b.addEventListener('pointerup',up);b.addEventListener('pointerleave',up);b.addEventListener('pointercancel',up);addTick(dt=>{if(H.held)H.t+=dt;});H.node=b;return H;}
function label(x,y,name,real,dark,parent){return g(pill(0,0,name,real,dark),x,y,1,parent||svg);}

/* ================= 1. Meet Zip ================= */
async function ch1(){
  stage();spot('zip',{mood:'grin'},500,250,2.2,'Zip','electron');
  await talk([
    ['zip',"Hi! I'm Zip! I'm an electron.","Hi! I'm Zip!"],
    ['zip',"I'm teeny tiny. Millions and millions of me could sit on the point of a pin!","I'm teeny tiny!"],
    ['zip',"There are electrons like me inside everything. Even inside you!","We're inside everything!"],
    ['zip',"When lots of us zoom along together, that's called electricity!","Lots of Zips zooming = electricity!"]]);
  /* push the zips along a wire */
  stage();
  el('path',{d:'M220 330 H760',stroke:'#E3EAF6','stroke-width':54,'stroke-linecap':'round',fill:'none'});
  el('path',{d:'M220 330 H760',stroke:C.orange,'stroke-width':44,'stroke-linecap':'round',fill:'none',opacity:.3});
  label(490,410,'Trax','wire');
  const dots=[...Array(15)].map(()=>el('circle',{r:11,fill:C.yellow,stroke:I,'stroke-width':2.5,cy:330}));
  const glowG=g('',860,300,1);label(860,380,'Glow','bulb');
  const push=holdBtn(120,330,'PUSH',64,C.yellow);
  let off=0,lv=0;
  addTick(dt=>{if(push.held)off=(off+dt*170)%540;lv=clamp(lv+(push.held?dt*2.5:-dt*2));dots.forEach((c,i)=>c.setAttribute('cx',(230+(i*36+off)%540).toFixed(1)));glowG.innerHTML=CH.glow({level:lv,mood:lv>.3?'grin':'sleepy'});});
  say('zip','Electricity carries energy. Press and hold the PUSH button, and watch the Zips zoom!','Hold PUSH!');
  await waitUntil(()=>push.t>1.8);
  await line('glow','Ta-daa! The zooming Zips brought me energy, so I can shine!','Zips bring energy!');
  /* electricity hunt */
  stage();
  const ON='#FFE066';
  const items=[
    {n:'lamp',e:1,d:o=>`${o?`<circle cx="0" cy="-26" r="44" fill="${C.yellow}" opacity=".35"/>`:''}<path d="M-26 -10 L-16 -44 H16 L26 -10 Z" fill="${o?ON:'#F4E6C8'}" stroke="${I}" stroke-width="4" stroke-linejoin="round"/><rect x="-3" y="-10" width="6" height="40" fill="${I}"/><rect x="-22" y="30" width="44" height="8" rx="4" fill="${I}"/>`,m:'A lamp uses electricity to make light!'},
    {n:'teddy',e:0,d:()=>`<circle cx="-19" cy="-36" r="11" fill="#C68B59" stroke="${I}" stroke-width="3"/><circle cx="19" cy="-36" r="11" fill="#C68B59" stroke="${I}" stroke-width="3"/><ellipse cx="0" cy="24" rx="28" ry="24" fill="#C68B59" stroke="${I}" stroke-width="3"/><circle cx="0" cy="-20" r="23" fill="#C68B59" stroke="${I}" stroke-width="3"/>${face('happy',.8,0,-20)}`,m:"A teddy doesn't need electricity. Just cuddles!"},
    {n:'fridge',e:1,d:o=>`<rect x="-28" y="-48" width="56" height="94" rx="8" fill="#E8EEF7" stroke="${I}" stroke-width="4"/><path d="M-28 -12 H28" stroke="${I}" stroke-width="4"/><rect x="16" y="-40" width="5" height="20" rx="2" fill="${I}"/><rect x="16" y="-2" width="5" height="26" rx="2" fill="${I}"/>${o?`<path d="M-8 4 v24 M-18 10 l20 12 M-18 22 l20 -12" stroke="${C.blue}" stroke-width="3" stroke-linecap="round"/>`:''}`,m:'A fridge uses electricity to keep food cold!'},
    {n:'book',e:0,d:()=>`<rect x="-34" y="-28" width="68" height="56" rx="4" fill="${C.red}" stroke="${I}" stroke-width="4"/><path d="M-24 -28 V28" stroke="${I}" stroke-width="3"/><path d="M-12 -10 h32 M-12 4 h26" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`,m:"A book doesn't need electricity."},
    {n:'TV',e:1,d:o=>`<rect x="-46" y="-36" width="92" height="62" rx="8" fill="${o?'#6FC3FF':C.grey}" stroke="${I}" stroke-width="4"/>${o?`<path d="M-30 10 q30 -40 60 0" stroke="${C.yellow}" stroke-width="6" fill="none"/><path d="M-30 18 q30 -40 60 0" stroke="${C.red}" stroke-width="6" fill="none"/>`:''}<path d="M-16 38 H16 M0 26 V38" stroke="${I}" stroke-width="5" stroke-linecap="round"/>`,m:'A TV uses electricity for pictures and sound!'},
    {n:'ball',e:0,d:()=>`<circle r="30" fill="${C.orange}" stroke="${I}" stroke-width="4"/><path d="M-30 0 q30 -20 60 0 M0 -30 q-14 30 0 60" stroke="${I}" stroke-width="3" fill="none"/>`,m:"A ball doesn't need electricity. Just a kick!"},
    {n:'toaster',e:1,d:o=>`<rect x="-40" y="-18" width="80" height="50" rx="14" fill="#C9D3E3" stroke="${I}" stroke-width="4"/><rect x="-24" y="-26" width="16" height="14" rx="3" fill="${o?C.orange:I}"/><rect x="8" y="-26" width="16" height="14" rx="3" fill="${o?C.orange:I}"/>${o?`<path d="M-16 -36 q4 -8 0 -14 M16 -36 q4 -8 0 -14" stroke="${C.orange}" stroke-width="4" fill="none" stroke-linecap="round"/>`:''}`,m:'A toaster uses electricity to make heat. Toast!'},
    {n:'apple',e:0,d:()=>`<circle cx="0" cy="6" r="28" fill="${C.red}" stroke="${I}" stroke-width="4"/><path d="M0 -20 V-32" stroke="${I}" stroke-width="4"/><path d="M2 -30 q14 -10 22 0 q-12 8 -22 0" fill="${C.green}" stroke="${I}" stroke-width="3"/>`,m:"An apple doesn't need electricity. Yum!"},
    {n:'fan',e:1,d:o=>`<rect x="-4" y="10" width="8" height="34" fill="${I}"/><rect x="-24" y="40" width="48" height="8" rx="4" fill="${I}"/><circle cy="-10" r="30" fill="#fff" stroke="${I}" stroke-width="4"/><g transform="translate(0 -10)"><g class="${o?'spin':''}"><path d="M0 0 C-6 -10 -2 -24 6 -24 C12 -20 8 -8 0 0 Z M0 0 C10 -6 24 -2 24 6 C20 12 8 8 0 0 Z M0 0 C6 10 2 24 -6 24 C-12 20 -8 8 0 0 Z M0 0 C-10 6 -24 2 -24 -6 C-20 -12 -8 -8 0 0 Z" fill="${C.blue}" stroke="${I}" stroke-width="2"/></g></g>`,m:'A fan uses electricity to spin and blow air!'},
    {n:'plant',e:0,d:()=>`<path d="M-22 10 H22 L16 44 H-16 Z" fill="#D9792B" stroke="${I}" stroke-width="4" stroke-linejoin="round"/><path d="M0 10 V-20 M0 -6 q-24 -6 -26 -30 q24 4 26 30 M0 -14 q20 -8 24 -30 q-22 2 -24 30" stroke="${I}" stroke-width="3" fill="${C.green}"/>`,m:'Plants need sunshine and water, not electricity.'},
    {n:'tablet',e:1,d:o=>`<rect x="-30" y="-44" width="60" height="88" rx="10" fill="${I}"/><rect x="-24" y="-36" width="48" height="68" rx="4" fill="${o?ON:C.grey}"/>${o?face('grin',.8,0,-4):''}`,m:'A tablet uses electricity. Its battery stores it!'},
    {n:'chair',e:0,d:()=>`<path d="M-20 -40 V40 M20 0 V40 M-20 0 H20 M-20 -40 H14" stroke="#A87A43" stroke-width="8" stroke-linecap="round"/>`,m:"A chair doesn't need electricity."}
  ];
  let found=0;
  /* The list alternates uses-electricity / doesn't and the grid below is 4 wide, so in
     list order every electrical item lands in column 1 or 3 and the answers read as
     vertical stripes. Shuffle, rejecting any layout with a uniform row or column. */
  const lanes=()=>{const L=[];for(let c=0;c<4;c++)L.push(items.filter((_,i)=>i%4===c));for(let r=0;r<3;r++)L.push(items.slice(r*4,r*4+4));return L;};
  const striped=()=>lanes().some(l=>l.every(it=>it.e)||l.every(it=>!it.e));
  let guard=0;do{for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]];}}while(striped()&&++guard<60);
  items.forEach((it,i)=>{const x=150+(i%4)*233,y=125+Math.floor(i/4)*175;const node=g('',x,y);const draw=on=>{node.innerHTML=`<circle r="72" fill="transparent"/><g>${it.d(on)}</g><text y="78" text-anchor="middle" ${FONT} font-size="22" fill="${I}">${it.n}</text>`;};draw(false);
    tapper(node,()=>{if(it.done)return;if(it.e){it.done=true;draw(true);sfx.ding();found++;setProgress(found,6);say('zip',it.m,'Uses electricity!');if(found===6)later(()=>node.dispatchEvent(new Event('alldone')),10);}else{sfx.bonk();const c=node.querySelector('g');c.classList.remove('wob');void c.getBoundingClientRect();c.classList.add('wob');say('zip',it.m,'No electricity!');}});});
  setProgress(0,6);
  say('zip','Let us find things that use electricity! Tap them.','Tap things that use electricity!');
  await waitUntil(()=>found>=6);await wait(2500);
  await talk([['zip','Brilliant! Electricity is lots of tiny Zips zooming together. It brings energy to make things work.','Zips zooming = energy!'],
    ['zip','Remember: never poke anything into a power point. That electricity is super strong!','Never touch power points!']]);
}

/* ================= 2. Where electricity comes from ================= */
async function ch2(){
  stage();
  /* windmill */
  el('path',{d:'M290 560 L310 560 L304 250 L296 250 Z',fill:'#C9D3E3',stroke:I,'stroke-width':4});
  const blades=g('',300,250);const drawBl=a=>{blades.innerHTML=`<g transform="rotate(${a.toFixed(1)})">${[0,120,240].map(r=>`<path d="M0 0 C10 -30 14 -100 0 -140 C-10 -100 -10 -30 0 0 Z" fill="#fff" stroke="${I}" stroke-width="4" transform="rotate(${r})"/>`).join('')}</g><circle r="16" fill="${I}"/>`;};drawBl(0);
  el('rect',{x:220,y:236,width:160,height:28,fill:'transparent'});
  label(300,585,'Windmill','');
  /* town */
  const houses=[640,770,900].map(x=>g('',x,480));
  const drawH=lv=>houses.forEach(h=>h.innerHTML=`<path d="M-50 0 V-60 L0 -100 L50 -60 V0 Z" fill="#FFF3E0" stroke="${I}" stroke-width="4" stroke-linejoin="round"/><rect x="-32" y="-48" width="24" height="22" fill="${mix('#4A5878','#FFE066',lv)}" stroke="${I}" stroke-width="3"/><rect x="8" y="-48" width="24" height="22" fill="${mix('#4A5878','#FFE066',lv)}" stroke="${I}" stroke-width="3"/>`);drawH(0);
  el('path',{d:'M310 540 C420 540 520 500 590 500 H900',stroke:'#9AA3B5','stroke-width':6,fill:'none'});
  const line1=flow('M310 540 C420 540 520 500 590 500 H900',{n:9,speed:160,r:7});
  /* generator inset */
  const gen=g('',600,190);
  const drawGen=(a,p)=>{gen.innerHTML=`<circle r="96" fill="#F4F6FA" stroke="${I}" stroke-width="4"/><path d="M-60 -50 v100 M-46 -56 v112 M-32 -60 v120 M32 -60 v120 M46 -56 v112 M60 -50 v100" stroke="${mix('#D9792B','#FFB070',p)}" stroke-width="9" stroke-linecap="round"/><g transform="rotate(${a.toFixed(1)})"><rect x="-26" y="-12" width="26" height="24" fill="${C.red}" stroke="${I}" stroke-width="3"/><rect x="0" y="-12" width="26" height="24" fill="${C.blue}" stroke="${I}" stroke-width="3"/><text x="-13" y="7" text-anchor="middle" ${FONT} font-size="15" fill="#fff">N</text><text x="13" y="7" text-anchor="middle" ${FONT} font-size="15" fill="#fff">S</text></g>${pill(0,118,'Inside the generator','magnet + coil')}`;};drawGen(0,0);
  /* spin input */
  let ang=0,vel=0,spun=0,lit=0,dragA=null;
  const hub={x:300,y:250};
  const down=e=>{const p=toSvg(e);if(Math.hypot(p.x-hub.x,p.y-hub.y)<230&&p.x<520){e.preventDefault();A();dragA=Math.atan2(p.y-hub.y,p.x-hub.x);}};
  const mv=e=>{if(dragA===null)return;const p=toSvg(e);const a=Math.atan2(p.y-hub.y,p.x-hub.x);let d=a-dragA;if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;dragA=a;vel+=d*9;};
  const up=()=>{dragA=null;};
  svg.addEventListener('pointerdown',down);window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);cleanups.push(()=>{svg.removeEventListener('pointerdown',down);window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);});
  const blow=holdBtn(110,120,'BLOW',48,'#DDF1FF');
  addTick(dt=>{if(blow.held)vel+=dt*14*Math.sign(vel||1);vel*=Math.pow(.55,dt);vel=clamp(vel,-14,14);ang+=vel*dt*57;spun+=Math.abs(vel*dt);const p=clamp(Math.abs(vel)/7);if(p>.6)lit+=dt;drawBl(ang);drawGen(ang*2,p);drawH(p);line1.on=p>.08;line1.speed=60+p*220;});
  say('zip','Where does electricity come from? Lots of it is made by big spinning machines. Spin the windmill! Drag round and round on it, or hold the BLOW button.','Spin the windmill!');
  await waitUntil(()=>spun>30&&lit>1.6);
  await talk([['zip','You lit up the town! Inside the windmill, a magnet spins next to coils of wire. That pushes us Zips along the wires!','Spinning magnet pushes Zips!'],
    ['zip','Big power stations do the same thing with wind, falling water, or steam. Solar panels make electricity from sunshine!','Wind, water, steam or sun!']]);
  /* meet Bolt */
  stage();
  spot('bolt',{mood:'grin'},360,290,1.6,'Bolt','battery');
  el('text',{x:360,y:170,'text-anchor':'middle','font-family':'Baloo 2','font-weight':800,'font-size':56,fill:C.red}).textContent='+';
  el('text',{x:360,y:440,'text-anchor':'middle','font-family':'Baloo 2','font-weight':800,'font-size':56,fill:C.blue}).textContent='−';
  const hl=g('',0,0);
  await line('bolt',"G'day! I'm Bolt, a battery! I don't spin. I keep energy stored inside me, made by special chemicals. Like a lunchbox full of energy!","I store energy!");
  hl.innerHTML=`<circle cx="360" cy="150" r="46" fill="none" stroke="${C.red}" stroke-width="6" class="pulse"/>`;
  await line('bolt','See my two ends? This end is called PLUS.','This is PLUS: +');
  hl.innerHTML=`<circle cx="360" cy="420" r="46" fill="none" stroke="${C.blue}" stroke-width="6" class="pulse"/>`;
  await line('bolt','And this end is called MINUS.','This is MINUS: −');
  hl.innerHTML='';
  const LP='M360 400 C560 470 720 420 720 290 C720 160 560 110 360 180';
  el('path',{d:LP,stroke:C.orange,'stroke-width':12,fill:'none','stroke-linecap':'round'});const gl=g(CH.glow({level:1,mood:'grin'}),720,262,.8);
  const f2=flow(LP,{n:9,speed:150});f2.on=true;
  await line('bolt','Zips get pushed out of my MINUS end, zoom all the way round, and come home into my PLUS end.','Out of minus, home to plus!');
  await line('bolt',"When my energy is used up, I'm flat. Some batteries can be charged up again!",'Flat? Charge me up!');
  /* torch game */
  async function device(n,kind){
    stage();
    const xs=n===2?[330,560]:[250,450,650];
    el('rect',{x:150,y:250,width:n===2?620:640,height:150,rx:40,fill:'#E8EEF7',stroke:I,'stroke-width':5});
    const dev=g('',n===2?850:880,325);
    const drawDev=on=>{dev.innerHTML=kind==='torch'?`${on?`<path d="M30 -40 L160 -120 L160 120 L30 40 Z" fill="${C.yellow}" opacity=".45"/>`:''}<path d="M-80 -60 L20 -90 L20 90 L-80 60 Z" fill="#C9D3E3" stroke="${I}" stroke-width="5" stroke-linejoin="round"/><circle cx="10" cy="0" r="40" fill="${on?'#FFE066':'#EEF2F8'}" stroke="${I}" stroke-width="4"/>`:`<g transform="scale(1.1)">${CH.spinny({angle:on?performance.now()/60:0,mood:on?'grin':'sleepy'})}</g>`;};drawDev(false);
    if(kind!=='torch')addTick(()=>{if(dev._on)drawDev(true);});
    let rev=xs.map((_,i)=>i===0||Math.random()<.5);if(rev.every(r=>!r))rev[0]=true;
    const bats=xs.map((x,i)=>{const b=g('',x,325);const draw=()=>{const r=rev[i];b.innerHTML=`<circle r="80" fill="transparent"/><g class="pulse"><rect x="-82" y="-40" width="164" height="80" rx="18" fill="${C.blue}" stroke="${I}" stroke-width="4"/><rect x="${r?-98:82}" y="-16" width="16" height="32" rx="4" fill="${I}"/><circle cx="0" cy="0" r="24" fill="#DCE8FF"/>${face(r?'sad':'grin',.9,0,0)}<text x="${r?-58:58}" y="14" text-anchor="middle" ${FONT} font-size="40" fill="#fff">+</text><text x="${r?58:-58}" y="14" text-anchor="middle" ${FONT} font-size="44" fill="#fff">−</text></g>`;};draw();
      tapper(b,()=>{rev[i]=!rev[i];sfx.click();draw();check();});return b;});
    const lab=label(n===2?850:880,460,kind==='torch'?'Torch light':'Spinny','');
    let ok=false;const check=()=>{const good=rev.every(r=>!r);if(good&&!ok){ok=true;sfx.zap();dev._on=true;drawDev(true);}else if(!good){ok=false;dev._on=false;drawDev(false);}};
    return ()=>ok;
  }
  let ok=await device(2,'torch');
  say('zip','This torch needs two Bolts. Tap a Bolt to turn it round. All the PLUS ends must point to the light!','Point PLUS at the light!');
  await waitUntil(ok);await wait(600);
  await line('bolt','Yes! Two of us in a row add our pushes together. Double push!','Double push!');
  ok=await device(3,'toy');
  say('spinny',"Spinny's toy car needs three Bolts! Point all the PLUS ends at me!",'PLUS ends at Spinny!');
  await waitUntil(ok);await wait(600);
  await line('spinny','Wheee! Three Bolts in a row. Triple push!','Triple push!');
  /* earth */
  stage();
  el('rect',{x:12,y:470,width:976,height:120,rx:0,fill:'#B98A5A'});
  el('path',{d:'M200 470 V180 L420 60 L640 180 V470 Z',fill:'#FFF3E0',stroke:I,'stroke-width':5,'stroke-linejoin':'round'});
  const toast=g(`<rect x="-50" y="-30" width="100" height="60" rx="16" fill="#C9D3E3" stroke="${I}" stroke-width="4"/><rect x="-30" y="-38" width="20" height="14" rx="3" fill="${I}"/><rect x="10" y="-38" width="20" height="14" rx="3" fill="${I}"/>`,420,380);
  el('rect',{x:540,y:330,width:46,height:60,rx:8,fill:'#fff',stroke:I,'stroke-width':4});el('circle',{cx:555,cy:352,r:5,fill:I});el('circle',{cx:571,cy:352,r:5,fill:I});el('rect',{x:559,y:368,width:6,height:12,fill:I});
  el('path',{d:'M470 380 H520 Q540 380 540 360',stroke:I,'stroke-width':5,fill:'none'});
  const EP='M563 390 V470 V540';el('path',{d:'M563 390 V545',stroke:C.green,'stroke-width':8,fill:'none'});el('path',{d:'M548 545 h30 M552 555 h22 M557 565 h12',stroke:C.green,'stroke-width':6,'stroke-linecap':'round'});
  label(700,520,'Earth wire','safety slide',true);label(563,300,'Power point','');
  await talk([['zip','Houses have a special safety wire called EARTH, or ground.','Safety wire: EARTH'],
    ['zip','If something breaks, earth gives electricity a safe slide into the ground, instead of through a person.','A safe slide into the ground']]);
  const br=sbtn(820,200,'Uh oh! Broken!',{w:230,fill:'#FFE3D6',size:24});
  const fe=flow('M470 380 H520 Q540 380 540 395 H563 V560',{n:6,speed:200});
  say('zip','Tap the button to see what earth does if the toaster breaks.','Tap the button!');
  await waitClick(br);br.remove();sfx.zap();fe.on=true;boing(toast);
  await line('zip','See? The electricity slides down the earth wire into the ground. Safe!','Down the earth wire. Safe!');
  fe.on=false;
  await talk([['zip','The electricity in walls is much stronger than Bolt. Never touch power points. Batteries only for us!','Batteries only!'],
    ['bolt','Generators spin to make electricity. I store it. My two ends are PLUS and MINUS!','PLUS and MINUS!']]);
}

/* ================= 3. Draw the loop ================= */
async function ch3(){
  stage();spot('trax',{mood:'grin'},360,270,2,'Trax','wire');
  await line('trax',"Sssss! I'm Trax, a wire!","I'm Trax, a wire!");
  g(`<circle r="90" fill="#6FA8FF" stroke="${I}" stroke-width="5"/><circle r="52" fill="#D9792B" stroke="${I}" stroke-width="4"/>${[...Array(7)].map((_,i)=>`<circle cx="${(Math.cos(i)*24).toFixed(1)}" cy="${(Math.sin(i*1.7)*24).toFixed(1)}" r="8" fill="${C.yellow}" stroke="${I}" stroke-width="2"/>`).join('')}${pill(0,-120,'Inside Trax','')}${pill(-110,120,'metal','lets Zips pass')}${pill(110,120,'plastic coat','keeps them in')}`,760,280);
  await line('trax','Inside I am metal, like a tunnel that Zips can zoom through. My plastic coat keeps them inside.','Metal inside, plastic outside');
  await line('trax','Zips need a whole loop: out of Bolt, through the light, and back home to Bolt.','Zips need a whole LOOP!');
  stage();
  let b=new Board();const bolt=b.add('bolt',260,300);const glow=b.add('glow',700,250);
  b.ghost(b.pin(bolt,'n'),b.pin(glow,'a'));b.ghost(b.pin(bolt,'p'),b.pin(glow,'b'));
  say('trax','Draw me! Press on a white dot, hold, and drag to the next dot. Follow the dotted lines.','Drag from dot to dot!');
  await waitUntil(()=>glow.bright>.5);await wait(400);
  await talk([['glow','Ta-daa! The loop is closed, so I shine!','The loop is closed!'],
    ['zip','See the yellow dots? That is us Zips, zooming out of Bolt\'s minus end and home into his plus end!','Out of minus, into plus!']]);
  say('trax','Now tap a wire to cut it. What happens?','Tap a wire to cut it!');
  await waitUntil(()=>b.wires.length<2);await wait(300);
  await line('glow','Hey! No loop, no light!','No loop, no light!');
  say('trax','Draw the wire back again.','Draw it back!');
  await waitUntil(()=>glow.bright>.5);await wait(300);
  b.ghost(b.pin(bolt,'p'),b.pin(bolt,'n'));
  say('trax','What if I go straight from plus to minus, with nobody in between? Draw the new dotted wire.','Draw plus straight to minus');
  await waitUntil(()=>bolt.hot);
  await line('bolt',"OUCH! I'm getting HOT! That's called a short circuit. The Zips race round with nothing to slow them down.",'Ouch! Short circuit!');
  b.clearGhosts();
  say('bolt','Quick! Tap that wire to cut it!','Tap the wire to cut it!');
  await waitUntil(()=>!b.has(b.pin(bolt,'p'),b.pin(bolt,'n')));await waitUntil(()=>!bolt.hot);
  await talk([['bolt','Phew. Never make a short circuit with real batteries. They can get really hot!','Never do that for real!'],
    ['trax','Wires make a path. Electricity needs a whole loop to work!','A whole loop!']]);
}

/* ================= 4. Pass or Stop ================= */
async function ch4(){
  stage();spot('zip',{mood:'grin'},300,260,1.8,'Zip','electron');
  g(`<rect x="-90" y="-60" width="180" height="120" rx="24" fill="#E6F6EE" stroke="#127A4A" stroke-width="5"/><text y="16" text-anchor="middle" ${FONT} font-size="44" fill="#0E5E39">PASS</text>`,700,200);
  await line('zip','Some things let electricity pass through them. We call them conductors. They are PASS things!','PASS things: conductors');
  g(`<rect x="-90" y="-60" width="180" height="120" rx="24" fill="#F1F4F9" stroke="${C.grey}" stroke-width="5"/><text y="16" text-anchor="middle" ${FONT} font-size="44" fill="${C.grey}">STOP</text>`,700,400);
  await line('zip','Other things stop electricity. We call them insulators. They are STOP things!','STOP things: insulators');
  await line('trax','My metal inside is a PASS thing. My plastic coat is a STOP thing.','Metal PASS, plastic STOP');
  stage();
  el('path',{d:'M140 300 V150 H520 V470 H398 M302 470 H140 V300',stroke:C.orange,'stroke-width':12,fill:'none','stroke-linejoin':'round','stroke-linecap':'round'});
  el('rect',{x:288,y:458,width:24,height:24,rx:6,fill:I});el('rect',{x:388,y:458,width:24,height:24,rx:6,fill:I});
  const zone={x:350,y:462};const zoneEl=g(`<g class="pulse"><rect x="-58" y="-46" width="116" height="92" rx="20" fill="none" stroke="${I}" stroke-width="3.5" stroke-dasharray="8 8"/></g>`,zone.x,zone.y);
  label(350,540,'Tester','');
  const run=flow('M140 300 V150 H520 V470 H140 Z',{n:8,speed:200});
  g(CH.bolt(),140,300,.75);
  const glowG=g('',340,120,.85);const setGlow=(lv,m)=>glowG.innerHTML=CH.glow({level:lv,mood:m});setGlow(0,'happy');
  const bask=(pass)=>`<rect x="-80" y="-62" width="160" height="124" rx="22" fill="${pass?'#E6F6EE':'#F1F4F9'}" stroke="${pass?'#127A4A':C.grey}" stroke-width="5"/><text x="0" y="54" text-anchor="middle" ${FONT} font-size="22" fill="${pass?'#0E5E39':C.grey}">${pass?'PASS':'STOP'}</text>`;
  const BP={x:690,y:110},BS={x:870,y:110};g(bask(true),BP.x,BP.y);g(bask(false),BS.x,BS.y);
  const M='#C9D3E3';
  const items=[
    {n:'spoon',pass:1,svg:`<ellipse cx="0" cy="-18" rx="14" ry="18" fill="${M}" stroke="${I}" stroke-width="3"/><rect x="-4" y="0" width="8" height="38" rx="4" fill="${M}" stroke="${I}" stroke-width="3"/>`,m:'spoons are metal'},
    {n:'key',pass:1,svg:`<rect x="-4" y="-5" width="38" height="10" fill="#E8C547" stroke="${I}" stroke-width="3"/><rect x="22" y="4" width="6" height="10" fill="#E8C547" stroke="${I}" stroke-width="2.5"/><circle cx="-16" cy="0" r="15" fill="#E8C547" stroke="${I}" stroke-width="3"/><circle cx="-16" cy="0" r="5" fill="#fff" stroke="${I}" stroke-width="2"/>`,m:'keys are metal'},
    {n:'coin',pass:1,svg:`<circle r="23" fill="#D9A441" stroke="${I}" stroke-width="3"/><circle r="14" fill="none" stroke="#9C6B1E" stroke-width="3"/>`,m:'coins are metal'},
    {n:'eraser',pass:0,svg:`<rect x="-26" y="-14" width="52" height="28" rx="6" fill="#FF9BB0" stroke="${I}" stroke-width="3"/><rect x="6" y="-14" width="20" height="28" fill="#5B8DEF" stroke="${I}" stroke-width="3"/>`,m:'rubber is a STOP thing'},
    {n:'foil',pass:1,svg:`<path d="M-22 -4 l8 -16 14 4 10 -6 10 14 -4 12 6 10 -14 10 -12 -4 -12 4 -8 -12 z" fill="#E6ECF5" stroke="${I}" stroke-width="3" stroke-linejoin="round"/>`,m:'foil is thin metal'},
    {n:'block',pass:0,svg:`<rect x="-26" y="-8" width="52" height="26" rx="4" fill="${C.red}" stroke="${I}" stroke-width="3"/><rect x="-20" y="-18" width="14" height="10" rx="3" fill="${C.red}" stroke="${I}" stroke-width="3"/><rect x="6" y="-18" width="14" height="10" rx="3" fill="${C.red}" stroke="${I}" stroke-width="3"/>`,m:'plastic is a STOP thing'},
    {n:'peg',pass:0,svg:`<rect x="-8" y="-30" width="16" height="60" rx="5" fill="#D9A86C" stroke="${I}" stroke-width="3"/><path d="M0 -26 V26" stroke="#A87A43" stroke-width="2.5"/>`,m:'wood is a STOP thing'},
    {n:'pencil',pass:.35,svg:`<rect x="-32" y="-8" width="48" height="16" fill="${C.yellow}" stroke="${I}" stroke-width="3"/><path d="M16 -8 L34 0 L16 8 Z" fill="#E8D3A8" stroke="${I}" stroke-width="3" stroke-linejoin="round"/><path d="M27 -3 L34 0 L27 3 Z" fill="${C.grey}"/>`,m:'the grey pencil tip lets a little bit through'}
  ];
  let inZone=null,sorted=0;const counts={1:0,0:0};
  items.forEach((it,i)=>{const node=g(`<circle r="40" fill="transparent"/>${it.svg}${`<text y="52" text-anchor="middle" ${FONT} font-size="17" fill="${C.grey}">${it.n}</text>`}`);const home={x:i%2?870:720,y:250+Math.floor(i/2)*84};it.home=home;
    const D=makeDrag(node,home,{onStart:()=>{sfx.pick();if(inZone===it){inZone=null;run.on=false;setGlow(0,'happy');zoneEl.style.display='';}},onDrop:pos=>{
      if(near(pos,zone,90)&&!inZone){inZone=it;D.home=zone;animateTo(node,pos,zone,1,140);zoneEl.style.display='none';sfx.snap();test(it);return true;}
      const pb=near(pos,BP,100),sb=near(pos,BS,100);
      if(pb||sb){const right=(it.pass>0)===pb;if(right){const k=pb?1:0;const n=counts[k]++;const bx=(pb?BP.x:BS.x)-44+(n%3)*44,by=BP.y-14+Math.floor(n/3)*30;D.lock();node.style.pointerEvents='none';animateTo(node,pos,{x:bx,y:by},.55,250);sfx.ding();sorted++;setProgress(sorted,8);say('glow',`Yes! ${it.n}: ${it.pass>0?'PASS':'STOP'}. ${cap1(it.m)}.`,`${cap1(it.n)}: ${it.pass>0?'PASS':'STOP'}!`);D.home=home;return true;}
        sfx.bonk();say('glow',`Hmm, not that basket. Try the ${it.n} in the tester!`,'Try the tester!');D.home=home;animateTo(node,pos,home,1);D.pos={x:home.x,y:home.y};return true;}
      D.home=home;return false;}});it.D=D;});
  function test(it){if(it.pass>0){setGlow(it.pass,it.pass<1?'wow':'grin');run.speed=it.pass<1?60:200;run.on=true;sfx.ding();say('glow',it.pass<1?'Ooh, a little glow! The grey pencil tip lets a little bit of electricity through. That counts as PASS!':`I light up! The ${it.n} lets electricity PASS!`,'I light up! PASS');}
    else{setGlow(0,'sad');run.on=false;sfx.bonk();say('glow',`I stay dark. The ${it.n} STOPS electricity!`,'I stay dark. STOP');}}
  setProgress(0,8);
  say('zip','Is it a PASS thing or a STOP thing? Not sure? Drag it into the tester first. Then drag it into the right basket.','Test it, then sort it!');
  await waitUntil(()=>sorted>=8);await wait(2000);
  await line('zip','Metal lets electricity PASS. Plastic, rubber and wood STOP it. That is why wires wear plastic coats!','Metal PASS. Plastic STOP.');
}
const cap1=s=>s.charAt(0).toUpperCase()+s.slice(1);

/* ================= 5. Swish ================= */
async function ch5(){
  stage();const sp=spot('swish',{closed:false},500,260,2.2,'Swish','switch');
  await line('swish',"Attention! I'm Swish, a switch. I'm the boss of the bridge!","I'm Swish, a switch!");
  sp.querySelector('.bob').innerHTML=CH.swish({closed:true,mood:'grin'});sfx.zap();
  await line('swish','When my bridge is DOWN, the loop is closed, so Zips can cross. GO!','Bridge down = GO');
  sp.querySelector('.bob').innerHTML=CH.swish({closed:false});sfx.whistle();
  await line('swish','When my bridge is UP, there is a gap. Everybody STOP!','Bridge up = STOP');
  await line('swish','Every light switch in your house is one of me!','Light switches are me!');
  stage();
  const b=new Board();const bolt=b.add('bolt',200,320);const sw=b.add('swish',500,200,{lock:true});const glow=b.add('glow',800,300);
  b.ghost(b.pin(bolt,'p'),b.pin(sw,'a'));b.ghost(b.pin(sw,'b'),b.pin(glow,'b'));b.ghost(b.pin(glow,'a'),b.pin(bolt,'n'));
  say('swish','Draw the dotted wires to put me in the loop.','Put me in the loop!');
  await waitUntil(()=>b.ghostsDone());sw.o.lock=false;
  say('swish','Now tap me to put my bridge down!','Tap me!');
  await waitUntil(()=>glow.bright>.5);
  await line('glow','Ta-daa! Swish closed the loop!','Swish closed the loop!');
  const cmds=[{want:false,t:'Bedtime! Lights OFF!',s:'Lights OFF!'},{want:true,t:'Good morning! Lights ON!',s:'Lights ON!'},{want:false,t:'Shhh, the baby is sleeping. Lights OFF!',s:'Lights OFF!'},{want:true,t:'Party time! Lights ON!',s:'Lights ON!'}];
  setProgress(0,4);
  for(let i=0;i<cmds.length;i++){const c=cmds[i];say('zip',c.t,c.s);await waitUntil(()=>sw.closed===c.want);sfx.ding();setProgress(i+1,4);await say('swish',sw.closed?'GO!':'STOP!',sw.closed?'GO!':'STOP!');}
  await line('swish','Great listening! A switch opens and closes the loop. That is how you turn things on and off!','Open and close the loop!');
}

/* ================= 6. Sleepy Rez ================= */
async function ch6(){
  stage();spot('rez',{mood:'sleepy'},500,250,2.2,'Rez','resistor');
  await talk([['rez',"Yaaawn. Hello... I'm Rez... a resistor.","I'm Rez, a resistor"],['rez','My job... is to slooow Zips down.','I slow Zips down'],['zip','But how do you do that, Rez?','How, Rez?'],['rez','Come and look inside me...','Look inside me!']]);
  stage();
  /* two tunnels */
  const T1={y:170,h:90},T2={y:420};let w2=54;
  el('rect',{x:150,y:T1.y-T1.h/2,width:700,height:T1.h,rx:40,fill:'#FBE3D4',stroke:I,'stroke-width':4});
  label(500,T1.y-70,'Inside Trax','wide and smooth');
  const t2=el('rect',{x:150,y:T2.y-w2/2,width:700,height:w2,rx:24,fill:'#F4E6C8',stroke:I,'stroke-width':4});
  const atoms=el('g');
  label(500,T2.y-90,'Inside Rez','narrow and bumpy');
  const heat=el('path',{d:'M420 330 q8 -10 0 -20 q-8 -10 0 -20 M500 330 q8 -10 0 -20 q-8 -10 0 -20 M580 330 q8 -10 0 -20 q-8 -10 0 -20',stroke:C.red,'stroke-width':4,fill:'none','stroke-linecap':'round',opacity:0});
  const c1=el('text',{x:900,y:T1.y+12,'text-anchor':'middle','font-family':'Baloo 2','font-weight':800,'font-size':34,fill:I});const c2=el('text',{x:900,y:T2.y+12,'text-anchor':'middle','font-family':'Baloo 2','font-weight':800,'font-size':34,fill:I});
  el('text',{x:900,y:T1.y-30,'text-anchor':'middle','font-family':'Baloo 2','font-weight':800,'font-size':15,fill:C.grey}).textContent='Zips per second';
  el('text',{x:900,y:T2.y-30,'text-anchor':'middle','font-family':'Baloo 2','font-weight':800,'font-size':15,fill:C.grey}).textContent='Zips per second';
  const z1=[...Array(12)].map(()=>el('circle',{r:11,fill:C.yellow,stroke:I,'stroke-width':2.5}));const z2=[...Array(8)].map(()=>el('circle',{r:9,fill:C.yellow,stroke:I,'stroke-width':2.5}));
  let o1=0,o2=0;
  const drawAtoms=()=>{atoms.innerHTML=[...Array(9)].map((_,i)=>`<circle cx="${200+i*76}" cy="${T2.y+(i%2?-1:1)*(w2/2-8)}" r="${10+(54-w2)/5}" fill="#B8C5DB" stroke="${I}" stroke-width="2.5"/>`).join('');t2.setAttribute('y',T2.y-w2/2);t2.setAttribute('height',w2);};drawAtoms();
  addTick(dt=>{const sp2=w2>40?110:w2>26?60:28;o1=(o1+dt*260)%700;o2=(o2+dt*sp2)%700;z1.forEach((c,i)=>{c.setAttribute('cx',(160+(o1+i*58)%690).toFixed(1));c.setAttribute('cy',(T1.y+Math.sin(i*2)*22).toFixed(1));});
    z2.forEach((c,i)=>{const x=160+(o2+i*86)%690;c.setAttribute('cx',x.toFixed(1));c.setAttribute('cy',(T2.y+Math.sin(x/9+i)*Math.max(0,w2/2-14)).toFixed(1));});
    c1.textContent='30';c2.textContent=w2>40?'12':w2>26?'6':'2';heat.setAttribute('opacity',w2>40?.2:w2>26?.6:1);});
  await talk([['rez','Inside Trax, the road is wide and smooth. Zips zoom!','Wide road: Zips zoom!'],
    ['rez','Inside me, the road is narrow and bumpy. Zips bump into my atoms, and squeeze through slowly.','Narrow and bumpy: slow!'],
    ['rez','So fewer Zips get through each second. And all that bumping makes me a little bit warm.','Fewer Zips. A bit warm.']]);
  const sq=sbtn(500,555,'Squeeze Rez!',{w:240,size:26});let squeezes=0;
  tapper(sq,()=>{w2=w2>40?34:w2>26?20:54;drawAtoms();sfx.click();squeezes++;});
  say('zip','Tap the Squeeze button to make Rez narrower. Watch the Zips!','Tap Squeeze!');
  await waitUntil(()=>squeezes>=2);await wait(1500);
  await line('zip','It is like squeezing a garden hose. Less water comes out!','Like squeezing a hose!');
  /* board */
  stage();
  const b=new Board();const bolt=b.add('bolt',220,320);const glow=b.add('glow',760,280);
  b.wire(b.pin(bolt,'p'),b.pin(glow,'b'),{fixed:true});
  b.ghost(b.pin(glow,'a'),b.pin(bolt,'n'));
  const ctr=g('',500,70);addTick(()=>{const n=Math.round(Math.abs(glow.I)*400);ctr.innerHTML=`<rect x="-120" y="-34" width="240" height="68" rx="20" fill="#FFF8E1" stroke="${I}" stroke-width="3"/><text y="-6" text-anchor="middle" ${FONT} font-size="15" fill="${C.grey}">Zips per second</text><text y="24" text-anchor="middle" ${FONT} font-size="30" fill="${I}">${n}</text>`;});
  say('zip','First, just Bolt and Glow. Draw the dotted wire, and watch how fast the Zips go.','Draw the wire!');
  await waitUntil(()=>glow.bright>.5);await wait(900);
  await line('glow','Look at me! Lovely and bright, and lots of Zips every second. That is normal speed.','Normal speed!');
  /* same loop, now with Rez in it, so the number to compare is still on screen */
  const direct=b.wires.find(w=>!w.fixed);if(direct)b.rmWire(direct,true);
  b.clearGhosts();
  const rez=b.add('rez',500,470,{init:{R:33},sizes:[33,100,470]});
  b.ghost(b.pin(glow,'a'),b.pin(rez,'b'));b.ghost(b.pin(rez,'a'),b.pin(bolt,'n'));
  say('rez','Now draw the dotted wires to put me in the loop too. Keep watching that number.','Put me in the loop!');
  await waitUntil(()=>b.ghostsDone()&&glow.bright>.05);await wait(500);
  await line('glow','Hmm, I am dimmer now, and the number went down. Fewer Zips are reaching me.','Dimmer: fewer Zips!');
  rez.o.adjust=true;
  say('rez','Tap me to make my road narrower. Make Glow sleepy for bedtime!','Tap Rez to squeeze!');
  await waitUntil(()=>rez.R>=100);await wait(800);
  await talk([['glow','Yaaawn. Nice and dim. Perfect for bedtime!','Nice and dim!'],
    ['rez','I make the road narrow and bumpy... so fewer Zips get through... and the light gets dimmer.','Narrow road = fewer Zips']]);
}

/* ================= 7. Lights on the road (Dot, series, parallel) ================= */
async function ch7(){
  stage();spot('dot',{lit:true,mood:'grin'},500,240,2,'Dot','LED light');
  await talk([['dot',"Hi! I'm Dot, an LED! I'm a light that uses only a teeny bit of energy.","I'm Dot, an LED!"],
    ['dot','One leg of mine is PLUS and the other is MINUS. My PLUS leg must go round to Bolt\'s PLUS side.','Plus leg to PLUS'],
    ['dot','Electricity can only go through me ONE way. Backwards, I stay dark! On a real LED, the PLUS leg is the longer one.','One way only!'],
    ['dot','And I am delicate. Rez is my bodyguard. Without Rez, too many Zips rush in and I go POP!','Rez is my bodyguard']]);
  /* A: one way */
  stage();
  let b=new Board();let bolt=b.add('bolt',200,320);let rez=b.add('rez',480,180);let dot=b.add('dot',780,290,{init:{rev:true}});
  b.ghost(b.pin(bolt,'p'),b.pin(rez,'a'));b.ghost(b.pin(rez,'b'),b.pin(dot,'a'));b.ghost(b.pin(dot,'k'),b.pin(bolt,'n'));
  b.on('burn',()=>say('dot','Ouch, I popped! Tap me and I will be as good as new.','Tap me for a new Dot!'));
  say('dot','Draw the dotted wires to make my loop.','Draw my loop!');
  await waitUntil(()=>b.ghostsDone());await wait(500);
  await line('dot','Uh oh, I am dark! I am facing the wrong way. My PLUS leg is on Bolt\'s MINUS side.','Wrong way round!');
  dot.o.flip=true;say('dot','Tap me to turn me round!','Tap me to turn round!');
  await waitUntil(()=>dot.bright>.3);await wait(400);
  await line('dot','Yay! My PLUS leg round to Bolt\'s PLUS, and I shine!','I shine!');
  /* B: bodyguard */
  stage();
  b=new Board();bolt=b.add('bolt',250,320);dot=b.add('dot',700,280);
  b.ghost(b.pin(bolt,'p'),b.pin(dot,'a'));b.ghost(b.pin(dot,'k'),b.pin(bolt,'n'));
  let burnt=false;b.on('burn',()=>burnt=true);
  say('dot','What if Rez is not here? Draw the wires and see...','No Rez? Draw and see...');
  await waitUntil(()=>burnt);await wait(600);
  await talk([['dot','Owww! Too many Zips rushed in! I popped!','Owww! I popped!'],['rez','Seeee? That is why I am her bodyguard. I slow the Zips down for her.','I am her bodyguard']]);
  stage();
  b=new Board();bolt=b.add('bolt',200,320);rez=b.add('rez',480,180);dot=b.add('dot',780,290);
  b.ghost(b.pin(bolt,'p'),b.pin(rez,'a'));b.ghost(b.pin(rez,'b'),b.pin(dot,'a'));b.ghost(b.pin(dot,'k'),b.pin(bolt,'n'));
  b.on('burn',()=>say('dot','Ouch, I popped again! Tap me and I will be as good as new.','Tap me for a new Dot!'));
  say('rez','Here is a new Dot. Put me in the loop to keep her safe.','Put Rez in the loop!');
  await waitUntil(()=>dot.bright>.3);await wait(400);
  await line('dot','Thanks, Rez! I am shining, and I did not pop!','Safe and shining!');
  await talk([['zip','Hang on, Rez. The Zips come out of Bolt\'s minus end, so we reach Dot FIRST and you second. How does that keep her safe?','Rez is after the light?'],
    ['rez','Good spotting. One loop is like one train... every Zip in it moves together. Slow the train anywhere, and the whole loop slows. So I can stand before Dot or after her... it works just the same.','One loop slows all together']]);
  /* C: series */
  stage();
  b=new Board();bolt=b.add('bolt',150,330);const gs=[380,580,780].map(x=>b.add('glow',x,240,{unscrew:false}));
  b.ghost(b.pin(bolt,'p'),b.pin(gs[0],'a'));b.ghost(b.pin(gs[0],'b'),b.pin(gs[1],'a'));b.ghost(b.pin(gs[1],'b'),b.pin(gs[2],'a'));b.ghost(b.pin(gs[2],'b'),b.pin(bolt,'n'));
  label(500,560,'SERIES: one road','',true);
  say('zip','Party lights! First, let us make ONE road. Draw the wires from Bolt, through every Glow, and back to Bolt.','One road through every Glow');
  await waitUntil(()=>gs.every(q=>q.bright>.05));await wait(500);
  await line('zip','This is called SERIES. One road. The Zips go through every Glow, so they share Bolt\'s push. Each Glow is dimmer.','Series: one road, dimmer');
  gs.forEach(q=>q.o.unscrew=true);
  say('zip','Now tap a Glow to unscrew it!','Unscrew a Glow!');
  await waitUntil(()=>gs.some(q=>q.out));await wait(500);
  await line('glow','Hey! One goes out, and we ALL go out! The road is broken.','One out, ALL out!');
  /* D: parallel */
  stage();
  b=new Board();bolt=b.add('bolt',130,320);const rp=b.add('rail',580,440,{init:{sign:'+'}});const rn=b.add('rail',580,530,{init:{sign:'-'}});
  b.wire(b.pin(bolt,'p'),b.pin(rp,'r0'),{fixed:true});b.wire(b.pin(bolt,'n'),b.pin(rn,'r0'),{fixed:true});
  const pg=[420,580,740].map(x=>b.add('glow',x,230,{unscrew:false}));
  b.ghost(b.pin(pg[0],'a'),b.pin(rp,'r0'));b.ghost(b.pin(pg[0],'b'),b.pin(rn,'r1'));
  b.ghost(b.pin(pg[1],'a'),b.pin(rp,'r2'));b.ghost(b.pin(pg[1],'b'),b.pin(rn,'r3'));
  b.ghost(b.pin(pg[2],'a'),b.pin(rp,'r4'));b.ghost(b.pin(pg[2],'b'),b.pin(rn,'r5'));
  label(820,100,'PARALLEL: many roads','',true);
  await line('zip','Now PARALLEL! Bolt is joined to two long rails: a plus rail and a minus rail.','Plus rail and minus rail');
  say('zip','Join each Glow to the plus rail AND the minus rail. Every Glow gets its very own road!','Every Glow gets its own road');
  await waitUntil(()=>pg.every(q=>q.bright>.75));await wait(500);
  await line('zip','See? Each Glow gets Bolt\'s full push, so they are all bright!','All bright!');
  pg.forEach(q=>q.o.unscrew=true);
  say('zip','Now tap a Glow to unscrew it.','Unscrew a Glow!');
  await waitUntil(()=>pg.some(q=>q.out)&&pg.some(q=>!q.out&&q.bright>.5));await wait(500);
  await talk([['glow','The party keeps going! The other Glows still have their own roads. The lights in your house are wired like this!','The party keeps going!'],
    ['zip','Series is one road: dimmer, and one out means all out. Parallel is many roads: bright, and the others stay on!','Series vs parallel']]);
}

/* ================= 8. Cap ================= */
async function ch8(){
  stage();spot('cap',{fill:.5,mood:'grin'},330,260,2,'Cap','capacitor');
  await line('cap',"Hi hi hi! I'm Cap, a capacitor!","I'm Cap, a capacitor!");
  await line('cap','I am like a hamster. I stuff electricity into my cheeks, and save it for later!','I store electricity!');
  const pl=g('',760,270);let pf=0;addTick(dt=>{pf=(pf+dt*.5)%1.2;const n=Math.floor(Math.min(1,pf)*10);pl.innerHTML=`<rect x="-50" y="-100" width="18" height="200" rx="6" fill="#C9D3E3" stroke="${I}" stroke-width="4"/><rect x="32" y="-100" width="18" height="200" rx="6" fill="#C9D3E3" stroke="${I}" stroke-width="4"/>${[...Array(n)].map((_,i)=>`<circle cx="-62" cy="${-85+i*19}" r="8" fill="${C.yellow}" stroke="${I}" stroke-width="2"/>`).join('')}<path d="M-50 0 H-120 M50 0 H120" stroke="#9AA3B5" stroke-width="7"/>${pill(0,140,'Inside Cap','two plates, not touching')}`;});
  await line('cap','Inside me are two metal plates, very close but not touching. Zips pile up on one plate. That is me filling up!','Two plates fill with Zips');
  await line('cap','Then I can let it ALL out at once, super fast, like a camera flash. Or slowly, to keep a light on for a bit!','Out fast, or out slow!');
  /* A: flash */
  stage();
  el('path',{d:'M180 300 H760',stroke:C.orange,'stroke-width':12,fill:'none'});
  const run=flow('M215 300 H420',{n:4,speed:280});const burst=flow('M530 300 H730',{n:5,speed:900});
  g(CH.bolt({mood:'grin'}),180,300,.8);label(180,400,'Bolt','battery');
  const capG=g('',470,280,1.1);label(470,400,'Cap','capacitor');
  const cam=g('',820,300);const drawCam=f=>cam.innerHTML=`${f?`<circle cx="38" cy="-23" r="60" fill="#FFF6C2" opacity="0.8"/>`:''}<rect x="-62" y="-38" width="124" height="86" rx="16" fill="${I}"/><rect x="-44" y="-54" width="36" height="20" rx="6" fill="${I}"/><circle cx="6" cy="6" r="27" fill="${C.grey}" stroke="#fff" stroke-width="4"/><circle cx="6" cy="6" r="12" fill="${C.blue}"/><rect x="26" y="-30" width="26" height="14" rx="4" fill="${f?'#FFF6C2':'#C9D3E3'}"/>${pill(0,100,'Camera flash','')}`;drawCam(false);
  const slots=[640,760,880].map(x=>g(`<rect x="-46" y="-52" width="92" height="104" rx="8" fill="none" stroke="#B8C5DB" stroke-width="3" stroke-dasharray="6 6"/>`,x,90));
  const RC=2*Math.PI*72;const btn=g(`<circle r="72" fill="none" stroke="#E3EAF6" stroke-width="12"/><circle id="capRing" r="72" fill="none" stroke="${C.yellow}" stroke-width="12" stroke-dasharray="${RC.toFixed(1)}" stroke-dashoffset="${RC.toFixed(1)}" transform="rotate(-90)"/><g class="pulse"><circle r="58" fill="${C.orange}" stroke="${I}" stroke-width="5"/><text y="10" text-anchor="middle" ${FONT} font-size="30" fill="${I}">HOLD</text></g>`,470,510);
  btn.style.cursor='pointer';btn.style.touchAction='none';const ring=btn.querySelector('#capRing');
  let fill=0,holding=false,photos=0,full=false,chompT=0,busy=false;
  addTick(dt=>{if(holding){fill=Math.min(1,fill+dt/1.8);chompT-=dt;if(chompT<=0){sfx.chomp(fill);chompT=.14;}if(fill>=1&&!full){full=true;say('cap',"I'm FULL! Let go!",'FULL! Let go!');}}run.on=holding&&fill<1;capG.innerHTML=CH.cap({fill,mood:fill>=1?'wow':(holding?'grin':'happy')});ring.setAttribute('stroke-dashoffset',(RC*(1-fill)).toFixed(1));});
  btn.addEventListener('pointerdown',e=>{e.preventDefault();if(busy)return;A();holding=true;full=false;});
  const rel=()=>{if(!holding)return;holding=false;
    if(fill>=.8){busy=true;flashScreen();sfx.flash();burst.on=true;drawCam(true);later(()=>{burst.on=false;drawCam(false);},650);
      const s=slots[photos];s.innerHTML=`<rect x="-46" y="-52" width="92" height="104" rx="6" fill="#fff" stroke="${I}" stroke-width="3"/><rect x="-38" y="-44" width="76" height="70" fill="#DCE8FF"/><g transform="translate(0 -6) scale(.6)">${CH.zip({mood:['wow','grin','cool'][photos]})}</g>`;photos++;fill=0;setProgress(photos,3);
      say('cap','Cheese! All my electricity came out at once!','Cheese!').then(()=>{busy=false;});}
    else if(fill>.05){fill=0;sfx.bonk();say('cap','Not enough! Fill my cheeks right up!','More! Fill me up!');}};
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>btn.addEventListener(ev,rel));
  setProgress(0,3);
  say('cap','Hold the big button to fill my cheeks. Then let go to flash the camera! Take three photos of Zip.','Hold, then let go!');
  await waitUntil(()=>photos>=3&&!busy);
  await line('zip','Three photos! Cap let it all out super fast. Flash!','Flash!');
  /* B: fade */
  stage();
  const b=new Board({canWire:false});const bolt=b.add('bolt',160,330);const sw=b.add('swish',360,170);const cap=b.add('cap',560,330);const rz=b.add('rez',740,170);const dot=b.add('dot',860,330);
  [[b.pin(bolt,'p'),b.pin(sw,'a')],[b.pin(sw,'b'),b.pin(cap,'a')],[b.pin(sw,'b'),b.pin(rz,'a')],[b.pin(rz,'b'),b.pin(dot,'a')],[b.pin(dot,'k'),b.pin(bolt,'n')],[b.pin(cap,'b'),b.pin(bolt,'n')]].forEach(([x,y])=>b.wire(x,y,{fixed:true}));
  const pbar=g('',500,70);
  addTick(()=>{const f=clamp(cap.fill),W=300,H=46,n=Math.round(f*9);
    pbar.innerHTML=`<rect x="${-W/2}" y="${-H/2}" width="${W}" height="${H}" rx="16" fill="#EEF2F8" stroke="${I}" stroke-width="4"/>`
      +[...Array(n)].map((_,i)=>`<circle cx="${(-W/2+22+i*31).toFixed(1)}" cy="0" r="9" fill="${C.yellow}" stroke="${I}" stroke-width="2.5"/>`).join('')
      +`<text y="${H/2+20}" text-anchor="middle" ${FONT} font-size="17" fill="${C.grey}">Cap power: fills and empties</text>`;});
  say('cap','Tap Swish to fill my cheeks up! Watch my power bar.','Tap Swish!');
  await waitUntil(()=>sw.closed&&cap.fill>.95);await wait(700);
  await line('cap','Mmm, I am full. And Dot is shining!','I am full!');
  say('cap','Now tap Swish again to cut Bolt off. Watch Dot!','Tap Swish. Watch Dot!');
  await waitUntil(()=>!sw.closed);await waitUntil(()=>dot.bright<.15||sw.closed);
  if(sw.closed){await waitUntil(()=>!sw.closed);await waitUntil(()=>dot.bright<.15);}
  await wait(600);
  await talk([['cap','See? Dot kept shining for a little bit, using the electricity saved in my cheeks!','Dot used my saved energy!'],
    ['cap','I fill up, then let it out. Fast for a flash, or slow to keep a light on!','Fill up, let it out!']]);
}

/* ================= 9. Magnet magic ================= */
async function ch9(){
  stage();spot('zip',{mood:'wow'},280,260,1.8,'Zip','electron');
  const em=g('',700,280);const drawEm=on=>{em.innerHTML=`${on?`<ellipse cx="0" cy="0" rx="190" ry="90" fill="none" stroke="${C.red}" stroke-width="3" stroke-dasharray="8 8" opacity=".6"/><ellipse cx="0" cy="0" rx="150" ry="60" fill="none" stroke="${C.red}" stroke-width="3" stroke-dasharray="8 8" opacity=".6"/>`:''}<rect x="-130" y="-14" width="260" height="28" rx="6" fill="#B8C5DB" stroke="${I}" stroke-width="4"/>${[...Array(9)].map((_,i)=>`<ellipse cx="${-80+i*20}" cy="0" rx="8" ry="30" fill="none" stroke="${on?'#FF9A4D':'#D9792B'}" stroke-width="6"/>`).join('')}${pill(0,110,'Electromagnet','wire coiled round a nail')}`;};drawEm(false);
  await line('zip','Here is a magic trick! When Zips flow through a coil of wire, the coil turns into a MAGNET!','Coil + Zips = magnet!');
  drawEm(true);sfx.zap();
  await line('zip','Switch it off, and it stops being a magnet. It is called an electromagnet.','An electromagnet!');
  /* crane */
  stage();
  el('rect',{x:110,y:70,width:790,height:22,rx:8,fill:'#C9D3E3',stroke:I,'stroke-width':4});
  const box=g(`<path d="M-90 -50 V40 H90 V-50" fill="#F4E6C8" stroke="${I}" stroke-width="5" stroke-linejoin="round"/>${pill(0,70,'Box','')}`,760,470);
  let cx=500,on=false,att=false,inBox=false,pileX=230;
  const crane=g('',cx,0);const clips=g('',0,0);
  const drawClip=(x,y,r)=>`<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-14 -6 h26 a6 6 0 0 1 0 12 h-22 a4 4 0 0 1 0 -8 h18" stroke="#8C96A8" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>`;
  const offs=[[-26,0,10],[0,4,-20],[24,-2,30],[-12,14,-40],[14,16,5]];
  const cpos=offs.map(o=>({x:pileX+o[0],y:520+o[1]}));
  addTick(dt=>{crane.setAttribute('transform',`translate(${cx} 0)`);crane.innerHTML=`<rect x="-34" y="66" width="68" height="30" rx="8" fill="${I}"/><path d="M0 96 V250" stroke="${I}" stroke-width="4"/>${on?`<ellipse cx="0" cy="300" rx="80" ry="40" fill="none" stroke="${C.red}" stroke-width="3" stroke-dasharray="7 7" opacity=".7"/>`:''}<rect x="-14" y="250" width="28" height="76" rx="5" fill="#B8C5DB" stroke="${I}" stroke-width="3"/>${[0,1,2,3].map(i=>`<ellipse cx="0" cy="${262+i*16}" rx="22" ry="6" fill="none" stroke="${on?'#FF9A4D':'#D9792B'}" stroke-width="5"/>`).join('')}<circle cx="0" cy="81" r="44" fill="transparent"/>`;
    const tgt=offs.map(o=>att?{x:cx+o[0]*.6,y:340+o[1]*.5}:(inBox?{x:760+o[0],y:480+o[1]}:{x:pileX+o[0],y:520+o[1]}));
    const k=Math.min(1,dt*13);cpos.forEach((q,i)=>{q.x+=(tgt[i].x-q.x)*k;q.y+=(tgt[i].y-q.y)*k;});
    clips.innerHTML=cpos.map((q,i)=>drawClip(q.x,q.y,offs[i][2])).join('');
    if(on&&!att&&!inBox&&Math.abs(cx-pileX)<70){att=true;sfx.snap();}
    if(!on&&att){att=false;if(Math.abs(cx-760)<95){inBox=true;sfx.ding();}else{pileX=clamp(cx,150,640);sfx.bonk();}}});
  let dragC=false;const dn=e=>{const p=toSvg(e);if(Math.abs(p.x-cx)<60&&p.y<360&&p.y>50){e.preventDefault();dragC=true;}};const mv=e=>{if(dragC)cx=clamp(toSvg(e).x,150,860);};const up=()=>dragC=false;
  svg.addEventListener('pointerdown',dn);window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);cleanups.push(()=>{svg.removeEventListener('pointerdown',dn);window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);});
  const sw=g('',470,520,.8);const drawSw=()=>sw.innerHTML=`<circle r="80" fill="transparent"/>${CH.swish({closed:on,mood:on?'grin':'happy'})}${pill(0,80,on?'Magnet ON':'Magnet OFF','')}`;drawSw();
  tapper(sw,()=>{on=!on;on?sfx.zap():sfx.whistle();drawSw();});
  label(230,575,'Paperclips','');
  say('zip','Tap Swish to switch the magnet on. Drag the crane over the paperclips, pick them up, and drop them in the box!','Pick up the clips!');
  await waitUntil(()=>inBox);await wait(500);
  await line('zip','You did it! Magnet on: pick up. Magnet off: drop!','On: pick up. Off: drop!');
  /* meet spinny */
  stage();spot('spinny',{mood:'grin'},300,270,1.9,'Spinny','motor');
  const cut=g('',720,270);let ca=0;addTick(dt=>{ca+=dt*4;cut.innerHTML=`<circle r="120" fill="#F4F6FA" stroke="${I}" stroke-width="4"/><path d="M-110 -50 A120 120 0 0 1 -110 50 L-84 40 A90 90 0 0 0 -84 -40 Z" fill="${C.red}" stroke="${I}" stroke-width="3"/><path d="M110 -50 A120 120 0 0 0 110 50 L84 40 A90 90 0 0 1 84 -40 Z" fill="${C.blue}" stroke="${I}" stroke-width="3"/><g transform="rotate(${(ca*57).toFixed(1)})"><rect x="-64" y="-14" width="128" height="28" rx="8" fill="#B8C5DB" stroke="${I}" stroke-width="3"/>${[...Array(5)].map((_,i)=>`<ellipse cx="${-40+i*20}" cy="0" rx="7" ry="20" fill="none" stroke="#D9792B" stroke-width="5"/>`).join('')}</g>${pill(0,150,'Inside Spinny','coil + magnets')}`;});
  await talk([['spinny',"Wheee! I'm Spinny, a motor!","I'm Spinny, a motor!"],
    ['spinny','Inside me is a coil that turns into an electromagnet, with normal magnets all around it.','Coil + magnets inside'],
    ['spinny','They push and pull, push and pull, so I spin round and round! Wheee!','Push, pull, SPIN!']]);
  stage();
  const b=new Board();const bolt=b.add('bolt',260,320);const sp=b.add('spinny',700,290);
  b.ghost(b.pin(bolt,'p'),b.pin(sp,'a'));b.ghost(b.pin(bolt,'n'),b.pin(sp,'b'));
  say('spinny','Draw the wires to make me spin!','Wire me up!');
  await waitUntil(()=>Math.abs(sp.speed)>.5);const dir=Math.sign(sp.speed);await wait(800);
  bolt.o.flip=true;
  say('spinny','Wheee! Now tap Bolt to turn him round. What happens?','Tap Bolt to flip him!');
  await waitUntil(()=>Math.sign(sp.speed)===-dir&&Math.abs(sp.speed)>.5);await wait(800);
  await line('spinny','I spin the other way! Swap plus and minus, and I go backwards!','Backwards spin!');
  stage();const bz=spot('buzz',{on:true},500,260,2,'Buzz','buzzer');addTick(()=>{bz.querySelector('.bob').innerHTML=CH.buzz({on:true});});const bs=loopSound('square',380,1800);bs.set(.05);
  await line('buzz',"Bzzzz! I'm Buzz, a buzzer! I have a tiny electromagnet that shakes a little disc super fast. Bzzzz!","I'm Buzz! Bzzzz!");
  bs.set(0);
  await line('zip','Electricity in a coil makes a magnet. Magnets push and pull, and that makes things move!','Coil + Zips = magnet!');
}

/* ================= 10. Boomer & Mic ================= */
async function ch10(){
  stage();spot('boomer',{},320,260,1.6,'Boomer','speaker');spot('mic',{},690,260,1.6,'Mic','microphone');
  await talk([['boomer',"YO! I'm Boomer, a speaker!","I'm Boomer, a speaker!"],['mic',"Psst. And I'm Mic, a microphone. We are twins who do opposite jobs.","I'm Mic! We're twins!"]]);
  /* what is sound */
  stage();
  const drum=g(`<circle r="80" fill="transparent"/><ellipse cx="0" cy="-30" rx="70" ry="22" fill="#F4F6FA" stroke="${I}" stroke-width="4"/><path d="M-70 -30 V40 A70 22 0 0 0 70 40 V-30" fill="${C.red}" stroke="${I}" stroke-width="4"/>${pill(0,110,'Drum','tap me')}`,170,320);
  const ear=g('',870,320);const air=el('g');const waves=[];let earW=0;
  addTick((dt,t)=>{const now=performance.now()/1000;let h='';for(let x=300;x<=760;x+=34)for(let y=200;y<=440;y+=40){let d=0;waves.forEach(w0=>{const front=300+(now-w0)*260;d+=Math.exp(-Math.pow((x-front)/36,2))*14*Math.sin((x-front)/8);});h+=`<circle cx="${(x+d).toFixed(1)}" cy="${y}" r="7" fill="#9EC5FF"/>`;}air.innerHTML=h;
    earW=0;waves.forEach(w0=>{const front=300+(now-w0)*260;earW+=Math.exp(-Math.pow((800-front)/50,2));});ear.innerHTML=`<g transform="translate(${(earW*8*Math.sin(now*60)).toFixed(1)} 0)"><path d="M-30 -60 c50 -14 86 26 74 76 c-8 32 -36 36 -40 62 c-4 26 -36 34 -50 12" stroke="${I}" stroke-width="5" fill="#FFE3D6" stroke-linecap="round"/><path d="M-10 -20 c16 -6 30 6 24 24" stroke="${I}" stroke-width="4" fill="none" stroke-linecap="round"/></g>${pill(0,120,'Your ear','')}`;});
  label(530,150,'Air','');
  let taps=0;tapper(drum,()=>{sfx.drum();waves.push(performance.now()/1000);if(waves.length>4)waves.shift();taps++;boing(drum);});
  say('boomer','First, what is sound? Tap the drum!','Tap the drum!');
  await waitUntil(()=>taps>=2);await wait(1800);
  await line('boomer','Sound is the air wiggling! The wiggles travel through the air to your ear.','Sound = air wiggling!');
  /* magnet + coil */
  stage();
  el('rect',{x:380,y:300,width:240,height:40,rx:10,fill:'#F4F6FA',stroke:I,'stroke-width':3});
  const coilG=g(`${[...Array(10)].map((_,i)=>`<ellipse cx="${400+i*22}" cy="320" rx="9" ry="44" fill="none" stroke="#D9792B" stroke-width="6"/>`).join('')}`);
  label(500,410,'Coil of wire','');
  el('path',{d:'M400 276 V150 H470 M600 276 V150 H530',stroke:C.orange,'stroke-width':8,fill:'none'});
  const zf1=flow('M400 276 V150 H470',{n:4,speed:160}),zf2=flow('M530 150 H600 V276',{n:4,speed:160});
  const meter=g('',500,140);
  let mx=180,lastX=180,energy=0,lvl=0,dragM=false;const mag=g('',mx,320);
  const drawMag=()=>{mag.setAttribute('transform',`translate(${mx.toFixed(1)} 320)`);mag.innerHTML=`<rect x="-70" y="-24" width="70" height="48" rx="6" fill="${C.red}" stroke="${I}" stroke-width="4"/><rect x="0" y="-24" width="70" height="48" rx="6" fill="${C.blue}" stroke="${I}" stroke-width="4"/><text x="-35" y="10" text-anchor="middle" ${FONT} font-size="26" fill="#fff">N</text><text x="35" y="10" text-anchor="middle" ${FONT} font-size="26" fill="#fff">S</text>${pill(0,70,'Magnet','drag me')}`;};drawMag();
  mag.style.cursor='grab';mag.addEventListener('pointerdown',e=>{e.preventDefault();A();dragM=true;});const mv=e=>{if(dragM)mx=clamp(toSvg(e).x,120,880);};const up=()=>dragM=false;window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);cleanups.push(()=>{window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);});
  addTick(dt=>{const v=(mx-lastX)/Math.max(dt,.001);lastX=mx;const inCoil=Math.max(0,1-Math.abs(mx-500)/220);const sig=clamp(v*inCoil/600,-1,1);lvl=lvl*.8+sig*.2;energy+=Math.abs(lvl)*dt;drawMag();const sp=Math.abs(lvl);zf1.on=zf2.on=sp>.05;zf1.speed=zf2.speed=90+sp*700;meter.innerHTML=`<circle cx="0" cy="-40" r="40" fill="${C.yellow}" opacity="${(Math.abs(lvl)*.6).toFixed(2)}"/><circle cx="0" cy="-40" r="22" fill="${mix('#EEF2F8','#FFE066',Math.abs(lvl)*1.5)}" stroke="${I}" stroke-width="4"/>${pill(0,-90,'Light','')}`;});
  say('mic','Here is my secret. Drag the magnet in and out of the coil, quickly! Watch the Zips being pushed along the wire.','Drag the magnet in and out!');
  await waitUntil(()=>energy>0.8);await wait(500);
  await line('mic','See the light flicker? When a magnet moves near a coil, it pushes Zips along. Just like the windmill!','Moving magnet pushes Zips!');
  /* inside mic */
  stage();
  const micG=g('',150,300,1.1);const dia=el('g');const outW=el('path',{fill:'none',stroke:C.orange,'stroke-width':6,'stroke-linecap':'round'});
  el('rect',{x:470,y:250,width:80,height:100,rx:8,fill:C.red,stroke:I,'stroke-width':4});label(510,390,'Magnet','');label(380,470,'Thin skin + coil','');
  label(780,470,'Wiggly electricity','');
  let level=0,heard=0,anal=null,data=null,stream=null;
  addTick(dt=>{let wave=[];if(anal){anal.getByteTimeDomainData(data);let s=0;for(let i=0;i<data.length;i++){const v=(data[i]-128)/128;s+=v*v;}level=Math.sqrt(s/data.length)*4;for(let i=0;i<60;i++)wave.push((data[Math.floor(i*data.length/60)]-128)/128);}else{level*=.9;for(let i=0;i<60;i++)wave.push(0);}
    if(level>.15)heard+=dt;const off=clamp(level,0,1)*14*Math.sin(performance.now()/30);
    dia.innerHTML=`<g transform="translate(${off.toFixed(1)} 0)"><rect x="370" y="200" width="10" height="200" rx="5" fill="#F4E6C8" stroke="${I}" stroke-width="3"/>${[0,1,2,3,4].map(i=>`<ellipse cx="${400+i*14}" cy="300" rx="7" ry="34" fill="none" stroke="#D9792B" stroke-width="5"/>`).join('')}</g>`;
    let d=`M560 300`;wave.forEach((v,i)=>{d+=` L${560+i*6.5} ${(300+v*90*Math.min(3,1+level)).toFixed(1)}`;});outW.setAttribute('d',d);
    micG.innerHTML=CH.mic({ear:clamp(level),mood:level>.2?'wow':'happy'});});
  const singB=holdBtn(150,520,'SING',48,C.yellow);let synth=null;
  async function tryMic(){try{const a=A();stream=await navigator.mediaDevices.getUserMedia({audio:true});const src=a.createMediaStreamSource(stream);anal=a.createAnalyser();anal.fftSize=1024;data=new Uint8Array(anal.fftSize);src.connect(anal);cleanups.push(()=>{stream.getTracks().forEach(t=>t.stop());});return true;}catch(e){return false;}}
  function fakeVoice(){const a=A();if(!a)return;anal=a.createAnalyser();anal.fftSize=1024;data=new Uint8Array(anal.fftSize);const o=a.createOscillator(),lfo=a.createOscillator(),lg=a.createGain(),gn=a.createGain();o.type='triangle';o.frequency.value=330;lfo.frequency.value=5;lg.gain.value=18;lfo.connect(lg).connect(o.frequency);gn.gain.value=0;o.connect(gn);gn.connect(anal);gn.connect(a.destination);o.start();lfo.start();synth=gn;cleanups.push(()=>{try{o.stop();lfo.stop();}catch(e){}});addTick(()=>{if(synth)synth.gain.setTargetAtTime(singB.held&&sfxOn?.15:0,a.currentTime,.03);});}
  await line('mic','Inside me, a thin skin has a coil stuck to it, next to a magnet. Your voice wiggles the skin, the coil wiggles, and out comes wiggly electricity!','Voice → wiggly electricity');
  say('mic','Let me hear you! Sing or talk to the computer. If I cannot hear you, hold the SING button.','Sing to me!');
  const got=await tryMic();if(!got)fakeVoice();else{singB.node.addEventListener('pointerdown',()=>{if(!synth){anal=null;fakeVoice();}});}
  await waitUntil(()=>heard>2.2);
  if(stream)stream.getTracks().forEach(t=>t.stop());anal=null;
  await line('mic','I heard you! Your voice became wiggly electricity, just like that wiggly line.','You became electricity!');
  /* inside boomer */
  stage();
  const bo=g('',0,0);let bp=0,playing=0;
  addTick(dt=>{if(playing>0){playing-=dt;bp=Math.sin(performance.now()/25)*.5+.5;}else bp*=.85;
    let d='M120 300';for(let x=130;x<=430;x+=10)d+=` L${x} ${(300+(playing>0?Math.sin(x/10+performance.now()/40)*30:0)).toFixed(1)}`;
    bo.innerHTML=`<path d="${d}" stroke="${C.orange}" stroke-width="6" fill="none"/><rect x="430" y="260" width="70" height="80" rx="6" fill="${C.red}" stroke="${I}" stroke-width="4"/><g transform="translate(${(bp*16).toFixed(1)} 0)">${[0,1,2,3].map(i=>`<ellipse cx="${520+i*14}" cy="300" rx="7" ry="40" fill="none" stroke="#D9792B" stroke-width="5"/>`).join('')}<path d="M570 270 L700 160 V440 L570 330 Z" fill="#F4E6C8" stroke="${I}" stroke-width="4" stroke-linejoin="round"/></g>${playing>0?[0,1,2].map(k=>`<path d="M${750+k*40} ${200-k*20} q${30+k*10} ${100+k*20} 0 ${200+k*40}" stroke="${C.blue}" stroke-width="6" fill="none" stroke-linecap="round"/>`).join(''):''}${pill(270,380,'Wiggly electricity in','')}${pill(530,440,'Coil + magnet','')}${pill(650,480,'Cone','')}`;});
  const pb=sbtn(820,520,'Play!',{w:170});let played=0;
  tapper(pb,()=>{playing=1.6;[523,659,784,1047].forEach((f,i)=>later(()=>sfx.note(f),i*300));played++;});
  await line('boomer','I do it backwards! Wiggly electricity goes into my coil. It becomes a wiggly magnet that pushes my cone in and out.','Coil pushes my cone');
  say('boomer','The cone wiggles the air, and you hear it! Tap Play!','Tap Play!');
  await waitUntil(()=>played>=1);await wait(1800);
  /* record and play it back - Mic and Boomer together on one screen */
  stage();
  const mR=g('',250,240,1.25),bR=g('',760,240,1.25);
  label(250,370,'Mic','records you');label(760,370,'Boomer','plays it back');
  const wv2=el('path',{fill:'none',stroke:C.orange,'stroke-width':6,'stroke-linecap':'round'});
  let recOn=false,recLvl=0,playLvl=0,haveRec=false,plays=0;
  let mrec=null,mchunks=[],mUrl=null,mAnal=null,mData=null,mStream=null;
  addTick(dt=>{
    if(mAnal&&recOn){mAnal.getByteTimeDomainData(mData);let s2=0;for(let i=0;i<mData.length;i++){const v=(mData[i]-128)/128;s2+=v*v;}recLvl=Math.sqrt(s2/mData.length)*4;}else recLvl*=.88;
    playLvl=Math.max(0,playLvl-dt*1.6);
    mR.innerHTML=CH.mic({ear:clamp(recLvl),mood:recOn?'wow':'happy'});
    bR.innerHTML=CH.boomer({pulse:playLvl});
    const amp2=clamp(recLvl)*34+playLvl*34,tt=performance.now()/38;
    let d2='M340 240';for(let x=350;x<=670;x+=10)d2+=` L${x} ${(240+Math.sin(x/11+tt)*amp2).toFixed(1)}`;
    wv2.setAttribute('d',d2);});
  const recB=holdBtn(250,480,'RECORD',58,C.red);
  const playB=sbtn(760,480,'Play it back',{w:250,size:26});
  async function recStart(){if(recOn)return;
    try{
      mStream=await navigator.mediaDevices.getUserMedia({audio:true});
      const a=A();const src=a.createMediaStreamSource(mStream);mAnal=a.createAnalyser();mAnal.fftSize=1024;mData=new Uint8Array(mAnal.fftSize);src.connect(mAnal);
      mrec=new MediaRecorder(mStream);mchunks=[];
      mrec.ondataavailable=e=>{if(e.data&&e.data.size)mchunks.push(e.data);};
      mrec.onstop=()=>{try{const bl=new Blob(mchunks,{type:mrec.mimeType||'audio/webm'});if(mUrl)URL.revokeObjectURL(mUrl);mUrl=URL.createObjectURL(bl);haveRec=true;}catch(e){}
        if(mStream){mStream.getTracks().forEach(t=>t.stop());mStream=null;}mAnal=null;};
      mrec.start();recOn=true;
    }catch(e){recOn=false;mAnal=null;say('mic','I cannot hear your microphone, but tap Play it back and Boomer will still sing!','No mic? Tap Play!');}}
  function recStop(){if(!recOn)return;recOn=false;try{if(mrec&&mrec.state!=='inactive')mrec.stop();}catch(e){}}
  recB.node.addEventListener('pointerdown',()=>{recStart();});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>recB.node.addEventListener(ev,()=>recStop()));
  cleanups.push(()=>{try{recStop();}catch(e){}if(mStream)mStream.getTracks().forEach(t=>t.stop());if(mUrl)URL.revokeObjectURL(mUrl);});
  tapper(playB,()=>{plays++;
    if(haveRec&&mUrl){const au=new Audio(mUrl);au.play().catch(()=>{});playLvl=1;
      const iv=setInterval(()=>{playLvl=1;},120);au.onended=()=>{clearInterval(iv);playLvl=.6;};later(()=>clearInterval(iv),6000);}
    else{[523,659,784,659,523].forEach((f,i)=>later(()=>{sfx.note(f);playLvl=1;},i*240));}});
  await line('mic','Now the best bit! Hold RECORD and say something. I will turn your voice into wiggly electricity and keep it.','Hold RECORD and talk!');
  say('boomer','Then tap Play it back, and I will turn it into sound again!','Then tap Play!');
  await waitUntil(()=>plays>=1&&playLvl<=0);await wait(400);
  await talk([['mic','That was your voice, turned into wiggly electricity.','Voice to electricity'],
    ['boomer','And I turned those same wiggles straight back into sound!','Electricity to sound']]);
  /* echo game */
  stage();
  el('path',{d:'M220 360 V390 H780 V360',stroke:'#C9D3E3','stroke-width':10,fill:'none'});
  const micB=g('',220,230,1.1),boomB=g('',780,230,1.1);label(220,340,'Mic','listens');label(780,340,'Boomer','plays');
  const wv=el('path',{fill:'none',stroke:C.orange,'stroke-width':6,'stroke-linecap':'round'});
  const notes=[523.25,587.33,659.25,783.99,880],cols=[C.red,C.orange,C.yellow,'#2BB673',C.blue];
  const pads=notes.map((f,i)=>{const p=g(`<circle r="54" fill="transparent"/><circle r="46" fill="${cols[i]}" stroke="${I}" stroke-width="5"/><path d="M-4 14 V-18 l18 6" stroke="${I}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="-11" cy="14" r="8" fill="${I}"/>`,260+i*120,505);p.style.cursor='pointer';p.addEventListener('pointerdown',e=>{e.preventDefault();A();press(i);});return p;});
  let pulse=0,earv=0,amp=0,hi=[0,0,0,0,0];
  addTick(dt=>{pulse=Math.max(0,pulse-dt*3);earv=Math.max(0,earv-dt*2);amp=Math.max(0,amp-dt*28);hi=hi.map(v=>Math.max(0,v-dt*3));boomB.innerHTML=CH.boomer({pulse});micB.innerHTML=CH.mic({ear:earv,mood:earv>.2?'wow':'happy'});
    let d='M300 390';const t=performance.now()/55;for(let x=310;x<=700;x+=10)d+=` L${x} ${(390+Math.sin(x/12+t)*amp).toFixed(1)}`;wv.setAttribute('d',d);wv.style.display=amp>.5?'':'none';pads.forEach((p,i)=>place(p,260+i*120,505,1+hi[i]*.2));});
  const play=(i,fromMic)=>{sfx.note(notes[i]);pulse=1;amp=14;hi[i]=1;if(fromMic)earv=1;};
  const rnd=()=>Math.floor(Math.random()*notes.length);
  const seq=[rnd(),rnd()];let round=0,input=[],locked=true,win=false;
  const roundT=el('text',{x:500,y:120,'text-anchor':'middle','font-family':'Baloo 2','font-weight':800,'font-size':24,fill:C.grey});
  const showRound=()=>roundT.textContent=`Round ${round+1} - ${seq.length} notes`;
  const nextB=sbtn(880,110,'Next',{w:140,size:24});
  tapper(nextB,()=>{if(round>0)win=true;else{sfx.bonk();say('mic','Have a go at one round first!','One round first!');}});
  function press(i){if(locked)return;play(i,false);input.push(i);
    if(i!==seq[input.length-1]){locked=true;sfx.bonk();say('mic','Almost! Listen again.','Listen again!').then(playSeq);return;}
    if(input.length===seq.length){locked=true;sfx.ding();round++;seq.push(rnd());
      say('mic','Perfect! Here is the same tune, with one more note on the end.','One more note!').then(playSeq);}}
  async function playSeq(){locked=true;input=[];showRound();for(const n of seq){play(n,true);await wait(650);}locked=false;say('zip','Your turn! Play it on Boomer.','Your turn!');}
  setProgress(0,0);
  await line('mic','Now a game! I play a tune, you play it back on Boomer\'s buttons. Each round I keep the same tune and add one more note. Tap Next when you have had enough.','Listen, then copy!');
  showRound();
  playSeq();
  await waitUntil(()=>win);await wait(500);
  await talk([['boomer','YEAH! Music superstar!','Superstar!'],['mic','I turn sound into electricity.','Sound → electricity'],['boomer','And I turn electricity back into sound!','Electricity → sound']]);
}

/* ================= 11. Tran ================= */
async function ch11(){
  stage();const sp=spot('tran',{},500,185,1.7,'Tran','transistor');
  /* Tran's gate opens and shuts on a slow loop, with Zips running the pipe below,
     so the explanation has something moving alongside it */
  el('path',{d:'M200 530 H800',stroke:'#F8D2C2','stroke-width':14,fill:'none'});
  const introFlow=flow('M200 530 H800',{n:8,speed:200});
  label(150,530,'+','');label(850,530,'−','');
  let io=0,lastO=null;addTick(dt=>{io+=dt*.8;const op=Math.sin(io)*.5+.5>.5;
    if(op!==lastO){lastO=op;sp.querySelector('.bob').innerHTML=CH.tran({open:op});}
    introFlow.on=op;introFlow.speed=op?380:110;});
  await talk([['tran',"Hey. I'm Tran. A transistor.","I'm Tran, a transistor"],
    ['tran','I am a switch with no buttons. Swish needs a finger to flip him. I get flipped by a teeny bit of electricity.','A switch flipped by electricity']]);
  g(`${pill(-180,0,'+ leg','')}${pill(0,0,'BUTTON leg','')}${pill(180,0,'− leg','')}`,500,450);
  await talk([['tran','I have three legs. The middle one is my BUTTON leg. The other two are my PLUS leg and my MINUS leg, same as everybody else.','Button leg, plus leg, minus leg'],
    ['tran','A tiny trickle into my button leg opens my gate, so LOTS of electricity can flow from my PLUS leg to my MINUS leg.','Tiny trickle opens a big gate'],
    ['zip','Why is that useful, Tran?','Why is that useful?'],
    ['tran','A tiny signal, like a finger touch or a microphone, can control something big, like a motor or a speaker.','Tiny controls BIG'],
    ['tran','And computers and tablets have billions of tiny Trans inside, switching on and off super fast to think!','Billions in a tablet!']]);
  /* gate */
  stage();
  el('path',{d:'M300 340 H700',stroke:'#F8D2C2','stroke-width':14,fill:'none'});
  const run=flow('M300 340 H690',{n:6,speed:200});
  el('rect',{x:372,y:200,width:16,height:240,fill:I});el('rect',{x:452,y:200,width:16,height:240,fill:I});el('rect',{x:360,y:188,width:120,height:18,rx:6,fill:I});
  const bars=g(`${[0,1,2,3].map(k=>`<rect x="${-30+k*20}" y="-72" width="10" height="144" rx="4" fill="${C.red}" stroke="${I}" stroke-width="2.5"/>`).join('')}<rect x="-38" y="-14" width="76" height="12" rx="4" fill="${C.red}" stroke="${I}" stroke-width="2.5"/>`,420,330);
  label(420,160,"Tran's gate",'');
  const crowd=[[150,260],[220,250],[290,270],[170,330],[250,330],[150,400],[230,405]].map(([x,y])=>({x,y,n:g(CH.zip({mood:'grin'}),x,y,.55)}));label(220,470,'Lots of Zips','from IN');
  el('circle',{cx:785,cy:320,r:100,fill:'none',stroke:'#E3EAF6','stroke-width':14});const RC=2*Math.PI*100;const ring=el('circle',{cx:785,cy:320,r:100,fill:'none',stroke:C.yellow,'stroke-width':14,'stroke-dasharray':RC.toFixed(1),'stroke-dashoffset':RC.toFixed(1),transform:'rotate(-90 785 320)','stroke-linecap':'round'});
  const spin=g('',785,330,1.15);label(785,460,'Spinny','motor, at OUT');
  g(CH.tran({}),400,488,.9);
  const trick=el('path',{d:'M486 488 H430',stroke:C.orange,'stroke-width':4,'stroke-linecap':'round',opacity:0});
  const btn=holdBtn(530,488,'tap',32,C.yellow);label(530,555,'Button leg','tiny trickle');
  let open=0,spun=0,ang=0,said=false,done=false;const wh=loopSound('sawtooth',60,500);
  addTick(dt=>{open=clamp(open+(btn.held&&!done?dt*2.5:-dt*2));place(bars,420,330-open*165);trick.setAttribute('opacity',btn.held?1:0);run.on=open>.35;run.speed=120+420*open;ang+=dt*open*24;spin.innerHTML=CH.spinny({angle:ang,mood:open>.6?(spun>4?'dizzy':'grin'):'sleepy'});
    if(open>.6&&!done){spun+=dt;ring.setAttribute('stroke-dashoffset',(RC*(1-Math.min(1,spun/5))).toFixed(1));if(spun>=5)done=true;}
    if(btn.held&&!said){said=true;say('spinny','Wheee! I am spinning!','Wheee!');}
    const t=performance.now()/160;crowd.forEach((z,i)=>place(z.n,z.x+(open>.35?Math.sin(t+i)*6:0),z.y-Math.abs(Math.sin(t*1.4+i))*(6+open*10),.55));wh.set(open*.04,55+open*200);});
  say('tran','Press and HOLD my little button. A tiny trickle goes in, and I open the big gate for Spinny!','Press and hold!');
  await waitUntil(()=>done);await wait(300);
  await line('spinny','Wheeee! I am SO dizzy! A tiny press made me spin!','Tiny press, big spin!');
  /* touch light */
  stage();
  const b=new Board();const bolt=b.add('bolt',150,330);const rz=b.add('rez',380,160);const dot=b.add('dot',620,140);const tr=b.add('tran',760,320);const tp=b.add('touch',420,430);
  [[b.pin(bolt,'p'),b.pin(rz,'a')],[b.pin(rz,'b'),b.pin(dot,'a')],[b.pin(tr,'e'),b.pin(bolt,'n')],[b.pin(bolt,'p'),b.pin(tp,'a')]].forEach(([x,y])=>b.wire(x,y,{fixed:true}));
  b.ghost(b.pin(dot,'k'),b.pin(tr,'c'));b.ghost(b.pin(tp,'b'),b.pin(tr,'b'));
  say('tran','Let us build a touch light! Draw the last two dotted wires.','Draw the last two wires');
  await waitUntil(()=>b.ghostsDone());
  await talk([['zip','Tran, how is that gold touch pad wired up?','How is it wired?'],
    ['tran','One side of the pad goes to Bolt\'s PLUS. The other side goes straight to my BUTTON leg. So the pad sits in between them.','Plus, then pad, then button leg'],
    ['tran','There is a gap in the middle of the pad, so on its own nothing gets across. Your finger is a bit squishy and a bit salty, so it bridges the gap and lets a teeny trickle creep over.','Your finger bridges the gap'],
    ['tran','That trickle is far too small to light Dot by itself. It only has to tickle my button leg, and then I open the big gate for her.','Too small for Dot, big enough for me']]);
  say('tran','Now press and hold the gold touch pad with your mouse.','Hold the touch pad!');
  await waitUntil(()=>tp.held&&dot.bright>.4);await wait(800);
  await talk([['tran','Your touch let a tiny trickle into my button leg. I opened the gate for Dot!','Tiny trickle, Dot shines!'],
    ['tran','Tiny electricity controls big electricity. That is my job.','Tiny controls big']]);
}

/* ================= 12. Pip & the guitar ================= */
const STR=[82.41,110,146.83,196,246.94,329.63];
function chord(cut,vol){STR.forEach((f,i)=>setTimeout(()=>pluck(f,cut,vol),i*28));}
async function ch12(){
  stage();spot('pip',{mood:'cool'},500,240,2.2,'Pip','guitar pickup');
  await talk([['pip',"Yeah! I'm Pip, a guitar pickup!","I'm Pip, a pickup!"],
    ['pip','I am made of magnets, wrapped in thousands of turns of super thin wire.','Magnets + thin wire'],
    ['pip','Guitar strings are made of steel. When a string wiggles over my magnets, it makes wiggly electricity in my coil. Just like Mic, but for strings!','String wiggles → electricity']]);
  stage();
  const str=el('path',{fill:'none',stroke:'#C9D3E3','stroke-width':6,'stroke-linecap':'round'});g(CH.pip({mood:'cool'}),420,330,1);label(420,400,'Pip','');
  const sig=el('path',{fill:'none',stroke:C.orange,'stroke-width':6});g(CH.boomer({}),860,330,.8);label(860,440,'Amp','Boomer');
  el('rect',{x:150,y:230,width:20,height:40,fill:I});el('rect',{x:690,y:230,width:20,height:40,fill:I});
  let a=0,pl=0;const hit=el('rect',{x:160,y:215,width:540,height:70,fill:'transparent'});hit.style.cursor='pointer';
  hit.addEventListener('pointerdown',()=>{A();a=18;pl++;pluck(110,2500,.6);});
  addTick(dt=>{a=Math.max(0,a-dt*9);const t=performance.now();str.setAttribute('d',`M160 250 Q430 ${(250+Math.sin(t/14)*a).toFixed(1)} 700 250`);let d='M480 330';for(let x=490;x<=790;x+=10)d+=` L${x} ${(330+Math.sin(x/9-t/40)*a*1.4).toFixed(1)}`;sig.setAttribute('d',d);});
  label(430,190,'Steel string','tap me');
  say('pip','Tap the string. Watch the wiggly electricity go to the amp!','Tap the string!');
  await waitUntil(()=>pl>=3);await wait(1200);
  /* wiring */
  stage();
  const b=new Board({dots:false});
  const pN=b.add('pipG',190,130,{init:{name:'Neck Pip'}}),pM=b.add('pipG',190,290,{init:{name:'Middle Pip'}}),pB=b.add('pipG',190,450,{init:{name:'Bridge Pip'}});
  const s5=b.add('sw5',430,290),vol=b.add('vol',640,190),tone=b.add('tone',640,420),jack=b.add('jack',830,190),gd=b.add('gnd',850,470);
  g(`<path d="M864 190 C900 190 900 120 930 110" stroke="${I}" stroke-width="7" fill="none"/>`);g(CH.boomer({}),935,80,.4);
  const P=(p,n)=>b.pin(p,n);
  const ready=()=>[[P(pN,'h'),P(s5,'n')],[P(pM,'h'),P(s5,'m')],[P(pB,'h'),P(s5,'b')]].some(([x,y])=>b.has(x,y))&&b.has(P(s5,'o'),P(vol,'i'))&&b.has(P(vol,'o'),P(jack,'t'));
  const grounded=()=>[pN,pM,pB].every(p=>b.has(P(p,'g'),P(gd,'g')))&&b.has(P(jack,'s'),P(gd,'g'))&&b.has(P(vol,'g'),P(gd,'g'));
  const toned=()=>b.has(P(tone,'i'),P(s5,'o'))&&b.has(P(tone,'g'),P(gd,'g'));
  let strums=0;const hum=loopSound('sawtooth',100,400);
  const strumG=g('',430,487);strumG.style.cursor='pointer';strumG.style.touchAction='none';
  let gamp=0;
  addTick((dt,t)=>{gamp=Math.max(0,gamp-dt*6);
    strumG.innerHTML=`<rect x="-160" y="-60" width="320" height="120" rx="14" fill="transparent"/>`
      +`<rect x="-10" y="-17" width="150" height="34" rx="6" fill="#D9A86C" stroke="${I}" stroke-width="3"/>`
      +`<ellipse cx="-72" cy="0" rx="80" ry="54" fill="${C.red}" stroke="${I}" stroke-width="4"/>`
      +`<circle cx="-62" cy="0" r="19" fill="${I}"/>`
      +[0,1,2,3,4,5].map(i=>{const y=-20+i*8;return `<path d="M-140 ${y} Q0 ${(y+Math.sin(t/13+i*1.1)*gamp).toFixed(1)} 138 ${y}" stroke="#E8C547" stroke-width="${(2.9-i*.2).toFixed(1)}" fill="none" stroke-linecap="round"/>`;}).join('')
      +pill(0,64,'Strum me','tap the strings');});
  strumG.addEventListener('pointerdown',e=>{e.preventDefault();A();
    if(!ready()){sfx.bonk();say('pip','Nothing yet! The electricity cannot reach the amp.','Not connected yet!');return;}
    strums++;gamp=9;const gOK=grounded();chord(toned()?1400:3200,gOK?.55:.3);
    if(!gOK){hum.set(.22);later(()=>hum.set(0),1800);}});
  b.ghost(P(pN,'h'),P(s5,'n'));b.ghost(P(pM,'h'),P(s5,'m'));b.ghost(P(pB,'h'),P(s5,'b'));
  say('pip','Let us wire a guitar! First, join each Pip\'s PLUS wire to Swish 5, the pickup switch.','Pips to the switch!');
  await waitUntil(()=>b.ghostsDone());b.clearGhosts();
  b.ghost(P(s5,'o'),P(vol,'i'));b.ghost(P(vol,'o'),P(jack,'t'));
  await line('knobby',"Hi! I'm Knobby, the volume knob. I'm a Rez you can turn! Turn me down and I squeeze the signal.","I'm Knobby, a Rez you turn!");
  say('pip','Now join the switch to Knobby, and Knobby to the jack. The jack plugs into the amp.','Switch → Knobby → jack');
  await waitUntil(()=>b.ghostsDone());b.clearGhosts();
  say('pip','Tap Strum!','Tap Strum!');const s0=strums;await waitUntil(()=>strums>s0);await wait(1700);
  await talk([['pip','Eww! What is that BUZZING?','Eww! Buzzing!'],
    ['zip','We forgot the MINUS wires! On a guitar, the minus side has its own name: GROUND.','Minus is called GROUND'],
    ['pip','Every loop needs a way home. My PLUS wire carries the song to the amp, and ground is the road the Zips come back along.','Ground is the way home'],
    ['pip','Ground has a second job too. All the metal bits get joined to it: my cover, the strings, the knob cases, the jack. They wrap the song in a metal shield.','All the metal joins ground'],
    ['zip','Without that shield the wires act like a radio aerial and pick up the hum from the house wiring. That is the buzzing you heard!','The wires became an aerial'],
    ['pip','It is the same trick as the earth wire in your house. And when you hold the strings on a real guitar, you join yourself to ground too, and the buzz goes quiet!','Touch the strings and it quietens']]);
  [pN,pM,pB].forEach(p=>b.ghost(P(p,'g'),P(gd,'g')));b.ghost(P(jack,'s'),P(gd,'g'));b.ghost(P(vol,'g'),P(gd,'g'));
  say('pip','Join every MINUS pin to the green ground sign.','Minus wires to ground!');
  await waitUntil(()=>b.ghostsDone());b.clearGhosts();
  say('pip','Strum again!','Strum again!');const s1=strums;await waitUntil(()=>strums>s1);await wait(1500);
  await line('pip','Ahh, no more buzz! Clean and loud!','No more buzz!');
  b.ghost(P(tone,'i'),P(s5,'o'));b.ghost(P(tone,'g'),P(gd,'g'));
  say('pip','Last one! The tone knob has a Rez and a Cap inside. It soaks up the fizzy sounds. Join it to the switch and to ground.','Add the tone knob');
  await waitUntil(()=>b.ghostsDone());
  say('pip','Strum now. Hear how it is softer?','Strum! Softer?');const s2=strums;await waitUntil(()=>strums>s2);await wait(1500);
  /* play */
  await rock();
  await talk([['pip','Pips turn string wiggles into electricity. Swish 5 picks the Pip. Knobby is a Rez you turn. The tone knob has Cap inside. And Boomer the amp makes it LOUD!','Everything works together!'],
    ['zip','You know all the Parts Pals now. Try building anything you like in the Workshop!','Try the Workshop!']]);
}
async function rock(){
  stage();
  el('path',{d:'M250 205 C320 165 380 225 440 215 C500 205 560 155 620 195 C660 225 640 275 615 295 C640 320 660 370 620 410 C560 460 500 400 440 400 C380 400 320 470 250 440 C190 410 180 360 200 330 C215 310 215 290 200 270 C185 240 200 222 250 205 Z',fill:C.red,stroke:I,'stroke-width':5});
  el('rect',{x:600,y:252,width:385,height:112,rx:10,fill:'#D9A86C',stroke:I,'stroke-width':4});for(let x=660;x<980;x+=52)el('rect',{x,y:254,width:4,height:108,fill:'#B8C5DB'});
  el('rect',{x:238,y:250,width:26,height:114,rx:6,fill:'#B8C5DB',stroke:I,'stroke-width':3});
  const pk=[{k:'b',x:330},{k:'m',x:405},{k:'n',x:480}].map(p=>Object.assign(p,{e:el('rect',{x:p.x-13,y:250,width:26,height:114,rx:12,fill:'#fff',stroke:I,'stroke-width':3})}));
  const SY=i=>268+i*17,amp=[0,0,0,0,0,0];const strs=STR.map((f,i)=>el('path',{fill:'none',stroke:i<3?'#E8C547':'#C9D3E3','stroke-width':(4.6-i*.5).toFixed(1),'stroke-linecap':'round'}));
  const pips=[{k:'b',x:300,n:'bridge'},{k:'m',x:450,n:'middle'},{k:'n',x:600,n:'neck'}].map(p=>Object.assign(p,{g:g('',p.x,520,.55)}));
  const POS={5:['n'],4:['n','m'],3:['m'],2:['m','b'],1:['b']},CUT={5:1100,4:1700,3:2400,2:3400,1:5200},VOL=[.2,.45,.8];
  let pos=5,vol=1,tone=1,count=0,stage2=1,c2=0,won=false,pulseSw=false;
  const swG=g('',95,320);
  function drawSw(){const ys={5:-100,4:-50,3:0,2:50,1:100};swG.innerHTML=`${pill(0,-160,'Swish 5','')}<g class="${pulseSw?'pulse':''}"><rect x="-26" y="-130" width="52" height="260" rx="26" fill="${I}"/>${[5,4,3,2,1].map(p=>`<circle cx="0" cy="${ys[p]}" r="9" fill="${C.grey}"/>`).join('')}<rect x="-38" y="${ys[pos]-16}" width="76" height="32" rx="16" fill="${C.yellow}" stroke="#fff" stroke-width="3"/></g>${[5,4,3,2,1].map(p=>`<rect data-p="${p}" x="-50" y="${ys[p]-25}" width="100" height="50" fill="transparent"/>`).join('')}`;
    pk.forEach(p=>p.e.setAttribute('fill',POS[pos].includes(p.k)?C.yellow:'#fff'));pips.forEach(p=>{const on=POS[pos].includes(p.k);p.g.innerHTML=CH.pip({mood:on?'cool':'sleepy',lit:on})+pill(0,80,p.n,'');});}
  swG.style.cursor='pointer';swG.addEventListener('click',e=>{const p=+(e.target.getAttribute('data-p')||0);if(!p||p===pos)return;A();pos=p;sfx.click();drawSw();if(stage2===2){stage2=3;pulseSw=false;drawSw();say('pip','Hear that? Every Pip sounds different! Keep playing!','Sounds different!');}});
  const knob=g('',820,500);const drawK=()=>knob.innerHTML=`<circle r="60" fill="transparent"/><g transform="scale(.7)">${CH.knobby({turn:vol/2,mood:vol===2?'grin':vol===1?'happy':'sleepy'})}</g>${pill(0,62,'Knobby','volume')}`;drawK();
  tapper(knob,()=>{vol=(vol+1)%3;sfx.click();drawK();say('knobby',['Turned down. Quiet.','Medium.','Turned up! LOUD!'][vol],['Quiet','Medium','LOUD!'][vol]);});
  const tk=g('',940,500);const drawT=()=>tk.innerHTML=`<circle r="50" fill="transparent"/><g transform="scale(.5)">${CH.knobby({turn:tone?.9:.2,mood:tone?'happy':'sleepy'})}</g>${pill(0,50,'Tone',tone?'bright':'soft')}`;drawT();
  tapper(tk,()=>{tone=1-tone;sfx.click();drawT();});
  drawSw();
  addTick((dt,t)=>strs.forEach((s,i)=>{amp[i]=Math.max(0,amp[i]-dt*7);const y=SY(i);s.setAttribute('d',`M251 ${y} Q615 ${(y+Math.sin(t/(18+i*4))*amp[i]).toFixed(1)} 985 ${y}`);}));
  const ov=el('rect',{x:240,y:255,width:750,height:104,fill:'transparent'});ov.style.cursor='pointer';ov.style.touchAction='none';
  let dn=false,last=-1;const strAt=e=>{const p=toSvg(e);if(p.x<230||p.x>995)return -1;const i=Math.round((p.y-268)/17);return i>=0&&i<6?i:-1;};
  function hit(i){pluck(STR[i],tone?CUT[pos]:CUT[pos]*.4,VOL[vol]);amp[i]=7;if(won)return;count++;
    if(stage2===1&&count>=8){stage2=2;pulseSw=true;drawSw();say('pip','Awesome! Now flip Swish 5 to wake up a different Pip!','Flip the switch!');}
    else if(stage2===3){c2++;if(c2>=8)won=true;}}
  ov.addEventListener('pointerdown',e=>{e.preventDefault();A();dn=true;const i=strAt(e);if(i>=0){hit(i);last=i;}});
  const mv=e=>{if(!dn)return;const i=strAt(e);if(i>=0&&i!==last){hit(i);last=i;}};const upw=()=>{dn=false;last=-1;};window.addEventListener('pointermove',mv);window.addEventListener('pointerup',upw);cleanups.push(()=>{window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',upw);});
  say('pip','Your guitar is ready! Drag the mouse across the strings to strum. Let us ROCK!','Swipe the strings!');
  await waitUntil(()=>won);await wait(1500);
  await line('pip','You are a ROCK STAR!','ROCK STAR!');
}

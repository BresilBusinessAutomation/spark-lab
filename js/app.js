'use strict';
/* Menus, story map, workshop, pals, grown-up corner, progress */
const CHAPS=[
  {name:'Meet Zip',topic:'What electricity is',char:'zip',run:ch1,pals:['zip'],parts:[],build:'Hunt round the house together for things that use electricity, and things that don\'t.'},
  {name:'Making electricity',topic:'Generators, batteries, + and −',char:'bolt',opts:{mood:'grin'},run:ch2,pals:['bolt'],parts:['bolt'],build:'Look at the + and − on real AA batteries and put them in a torch the right way round. Then make a lemon or potato battery: push a copper coin and a galvanised (zinc) nail into each one, clip a wire from the nail of one to the coin of the next, and three or four in a row will just light a red LED.'},
  {name:'Draw the loop',topic:'Wires and circuits',char:'trax',run:ch3,pals:['trax','glow'],parts:['glow'],build:'AA battery holder, a small bulb or LED with resistor, and 2 clip wires: make the loop on the table.'},
  {name:'Pass or Stop',topic:'Conductors and insulators',char:'glow',opts:{level:1,mood:'grin'},run:ch4,pals:[],parts:[],build:'Battery + LED tester with two loose wire ends. Test spoons, foil, erasers and pencils around the house.'},
  {name:'Swish the switch',topic:'Switches',char:'swish',run:ch5,pals:['swish'],parts:['swish'],build:'Toilet-roll torch with a paper-clip switch (2 AA batteries, foil, tape, an LED).'},
  {name:'Sleepy Rez',topic:'Resistors',char:'rez',run:ch6,pals:['rez'],parts:['rez'],build:'Play-dough circuits: salty dough conducts, sugary dough insulates. Long thin dough snakes act like a bigger resistor.'},
  {name:'Lights on the road',topic:'LEDs, series and parallel',char:'dot',opts:{lit:true,mood:'grin'},run:ch7,pals:['dot'],parts:['dot','rail'],build:'LEDs on a breadboard with 2 AA batteries: find the long leg, then try 3 LEDs in parallel, each with its own 100 ohm resistor.'},
  {name:"Cap's cheeks",topic:'Capacitors',char:'cap',opts:{fill:.6,mood:'grin'},run:ch8,pals:['cap'],parts:['cap'],build:'Capacitor + LED fade on a breadboard: charge it, unplug the battery, watch the LED fade. Grown-up wires it.'},
  {name:'Magnet magic',topic:'Electromagnets and motors',char:'spinny',opts:{mood:'grin'},run:ch9,pals:['spinny','buzz'],parts:['spinny','buzz'],build:'Nail electromagnet: big iron nail, enamelled copper wire, a D battery, paper clips. Short bursts only, the wire gets warm.'},
  {name:'Boomer & Mic',topic:'Speakers and microphones',char:'boomer',run:ch10,pals:['boomer','mic'],parts:['boomer'],build:'Paper-cup speaker: a coil of enamelled wire, a strong magnet (grown-up holds it) and an old headphone cable.'},
  {name:"Tran's gate",topic:'Transistors',char:'tran',run:ch11,pals:['tran'],parts:['tran','touch'],build:'Touch-light kit: 2 small transistors, an LED, resistors and a 9V battery.'},
  {name:'Pip & the guitar',topic:'Pickups, wiring, ground',char:'pip',opts:{mood:'cool'},run:ch12,pals:['pip','knobby'],parts:[],build:'Squier Strat wiring and soldering. A grown-up does all the iron work.'}
];
const PALS=[
  ['zip','electron',"I'm Zip, an electron! When lots of us zoom together, that's electricity!"],
  ['bolt','battery',"I'm Bolt the battery! I store energy and PUSH Zips out of my minus end, round the loop, and home to my plus end."],
  ['trax','wire',"I'm Trax the wire. Metal inside so Zips can zoom through, and a plastic coat to keep them in."],
  ['glow','bulb',"I'm Glow the bulb! When Zips zoom through me, I light up. Ta-daaa!"],
  ['swish','switch',"I'm Swish the switch, boss of the bridge! Down means GO. Up means STOP!"],
  ['rez','resistor',"I'm Rez the resistor... My road is narrow and bumpy... so I slooow Zips dowwwn."],
  ['dot','LED',"I'm Dot the LED! I only let Zips go ONE way. Long leg to plus! And Rez is my bodyguard."],
  ['cap','capacitor',"I'm Cap the capacitor! I stuff electricity in my cheeks, then let it ALL out at once!"],
  ['spinny','motor',"I'm Spinny the motor! A coil and magnets push and pull, so I spin! Wheee!"],
  ['buzz','buzzer',"Bzzz! I'm Buzz the buzzer! A tiny electromagnet shakes my disc super fast."],
  ['boomer','speaker',"YO! I'm Boomer the speaker! I turn wiggly electricity into BIG sound!"],
  ['mic','microphone',"Psst. I'm Mic the microphone. I turn the wiggles of sound into wiggly electricity."],
  ['tran','transistor',"I'm Tran the transistor. A tiny trickle on my button leg opens my big gate."],
  ['pip','pickup',"I'm Pip the pickup! Magnets and thin wire. I turn string wiggles into electricity. Let's rock!"],
  ['knobby','volume knob',"I'm Knobby, the volume knob. I'm a Rez you can turn!"]
];
let prog={done:{},ws:null};try{prog=Object.assign(prog,JSON.parse(localStorage.getItem('sparklab-v2')||'{}'));prog.done=prog.done||{};}catch(e){}
function save(){try{localStorage.setItem('sparklab-v2',JSON.stringify(prog));}catch(e){}$('#starN').textContent=Object.keys(prog.done).length;}
const isDone=i=>!!prog.done[i];const isOpen=i=>i===0||isDone(i-1);
function palUnlocked(k){return CHAPS.some((c,i)=>isDone(i)&&c.pals.includes(k));}
function partUnlocked(t){return CHAPS.some((c,i)=>isDone(i)&&c.parts.includes(t));}
function setTitle(t){$('#title').textContent=t;}
let screen='home',curCh=-1;

/* ---------- home ---------- */
function showHome(){clearScene();screen='home';setTitle('Spark Lab');$('#win').classList.add('hidden');
  g(`<g class="bob">${CH.zip({mood:'grin'})}</g>`,500,120,1.4);
  el('text',{x:500,y:235,'text-anchor':'middle','font-family':'Baloo 2','font-weight':800,'font-size':64,fill:I}).textContent='Spark Lab';
  const big=(x,label,sub,icon,fn)=>{const b=g(`<rect x="-170" y="-110" width="340" height="220" rx="36" fill="#fff" stroke="${I}" stroke-width="5"/><rect x="-170" y="-110" width="340" height="220" rx="36" fill="none" stroke="${I}" stroke-width="5" transform="translate(0 8)" opacity=".9"/>${icon}<text y="62" text-anchor="middle" ${FONT} font-size="40" fill="${I}">${label}</text><text y="92" text-anchor="middle" ${FONT} font-size="18" fill="${C.grey}">${sub}</text>`,x,410);tapper(b,()=>{sfx.click();fn();});return b;};
  big(300,'Story','learn with the Pals',`<g transform="translate(0 -30) scale(.75)">${CH.bolt({mood:'grin',flex:true})}</g>`,showMap);
  big(700,'Workshop','build anything',`<g transform="translate(-40 -30) scale(.55)">${CH.dot({lit:true,mood:'grin'})}</g><g transform="translate(46 -30) scale(.5)">${CH.swish({closed:true})}</g>`,showWorkshop);
  say('zip',firstHome?"Hi! I'm Zip! Tap Story to learn about electricity with my friends, or tap Workshop to build things.":'Story or Workshop?','Story or Workshop?');firstHome=false;}
let firstHome=true;

/* ---------- story map ---------- */
function showMap(){clearScene();screen='map';setTitle('Story');$('#win').classList.add('hidden');bg();
  const XS=[150,383,617,850],YS=[115,300,485];const pos=i=>{const r=Math.floor(i/4),c=i%4;return [r%2?XS[3-c]:XS[c],YS[r]];};
  let d='';for(let i=0;i<12;i++){const[x,y]=pos(i);d+=(i?' L':'M')+x+' '+y;}el('path',{d,fill:'none',stroke:'#C9D8F0','stroke-width':14,'stroke-linecap':'round','stroke-linejoin':'round','stroke-dasharray':'2 24'});
  const next=CHAPS.findIndex((c,i)=>!isDone(i));
  CHAPS.forEach((c,i)=>{const[x,y]=pos(i);const done=isDone(i),open=isOpen(i);const gg=g('',x,y);
    gg.innerHTML=`<g class="${i===next?'pulse':''}"><circle r="66" fill="transparent"/><circle r="54" fill="${done?'#E6F6EE':open?'#fff':'#E9EEF6'}" stroke="${done?'#127A4A':i===next?I:'#B8C5DB'}" stroke-width="${i===next?6:4}"/><g transform="translate(0 6) scale(${c.char==='zip'||c.char==='tran'?.75:.42})" opacity="${open?1:.45}">${CH[c.char](c.opts||{})}</g><circle cx="-42" cy="-42" r="16" fill="${I}"/><text x="-42" y="-35" text-anchor="middle" ${FONT} font-size="19" fill="#fff">${i+1}</text>${done?starAt(42,-42,1.3):''}${!open?`<g transform="translate(40 -40)"><circle r="16" fill="#fff" stroke="#B8C5DB" stroke-width="3"/><path d="M-6 0 v-4 a6 6 0 0 1 12 0 v4" stroke="${C.grey}" stroke-width="3" fill="none"/><rect x="-8" y="-1" width="16" height="11" rx="2" fill="${C.grey}"/></g>`:''}</g><text y="80" text-anchor="middle" ${FONT} font-size="20" fill="${open?I:C.grey}">${esc(c.name)}</text>`;
    tapper(gg,()=>{if(!open){sfx.bonk();say('zip',`Finish chapter ${i} first!`,`Finish chapter ${i} first!`);return;}sfx.click();runChapter(i);});});
  say('zip',next<0?'You finished every chapter! Play any one again, or go to the Workshop.':`Tap chapter ${next+1} to keep going!`,next<0?'All done! Superstar!':`Tap chapter ${next+1}!`);}

async function runChapter(i){clearScene();screen='chapter';curCh=i;const c=CHAPS[i];setTitle(`${i+1} · ${c.name}`);$('#win').classList.add('hidden');const my=tok;
  await c.run();if(my!==tok)return;finishChapter(i);}
function finishChapter(i){const c=CHAPS[i];const was=isDone(i);prog.done[i]=true;save();sfx.win();confetti();
  $('#winTitle').textContent=`Chapter ${i+1} done!`;
  const pals=c.pals.length?c.pals:[c.char];$('#winPals').innerHTML=pals.map(k=>`<svg viewBox="-110 -110 220 275" aria-hidden="true"><g class="dance">${CH[k](Object.assign({},AVATAR[k]||{},{mood:'grin'}))}</g>${pill(0,120,NAMES[k],(PALS.find(p=>p[0]===k)||[])[1]||'')}</svg>`).join('');
  const parts=c.parts.map(t=>WS_LABEL[t]).filter(Boolean);$('#winUnlock').textContent=(c.pals.length?`New Parts Pal${c.pals.length>1?'s':''}! `:'')+(parts.length?`New in the Workshop: ${parts.join(', ')}`:'');
  $('#winBuild').innerHTML=c.build?`<b>Build it for real:</b> ${esc(c.build)}`:'';
  $('#winNext').style.display=i<CHAPS.length-1?'':'none';$('#win').classList.remove('hidden');}
function confetti(){const box=$('#confetti');box.innerHTML='';const cols=[C.yellow,C.orange,C.blue,C.green,C.purple,C.red];for(let k=0;k<44;k++){const s=document.createElement('span');s.style.left=Math.random()*100+'vw';s.style.background=cols[k%cols.length];s.style.animationDelay=(Math.random()*.8)+'s';s.style.animationDuration=(1.8+Math.random()*1.4)+'s';box.appendChild(s);}setTimeout(()=>box.innerHTML='',3600);}
$('#winMap').onclick=()=>{sfx.click();showMap();};
$('#winAgain').onclick=()=>{sfx.click();runChapter(curCh);};
$('#winNext').onclick=()=>{sfx.click();if(curCh<CHAPS.length-1)runChapter(curCh+1);else showMap();};

/* ---------- pals ---------- */
function showPals(){clearScene();screen='pals';setTitle('Parts Pals');$('#win').classList.add('hidden');
  PALS.forEach(([k,real,line],i)=>{const x=110+(i%5)*195,y=110+Math.floor(i/5)*190;const on=palUnlocked(k);const gg=g('',x,y);
    gg.innerHTML=`<g><rect x="-88" y="-86" width="176" height="176" rx="26" fill="${on?'#fff':'#E9EEF6'}" stroke="${on?I:'#B8C5DB'}" stroke-width="4"/><g transform="translate(0 -10) scale(.52)" opacity="${on?1:.25}">${CH[k](AVATAR[k]||{})}</g><text y="56" text-anchor="middle" ${FONT} font-size="23" fill="${on?I:C.grey}">${on?NAMES[k]:'???'}</text><text y="76" text-anchor="middle" ${FONT} font-size="15" fill="${C.grey}">${on?real:'locked'}</text></g>`;
    tapper(gg,()=>{boing(gg);if(on)say(k,line,`${NAMES[k]} · ${real}`);else{sfx.bonk();say('zip','Keep playing Story to meet this Pal!','Keep playing to meet them!');}});});
  say('zip','Meet the Parts Pals! Tap a Pal to hear what they do.','Tap a Pal!');}

/* ---------- workshop ---------- */
const WS_PARTS=[['bolt','Bolt'],['glow','Glow'],['swish','Swish'],['rez','Rez'],['dot','Dot'],['rail','Rails'],['cap','Cap'],['spinny','Spinny'],['buzz','Buzz'],['boomer','Boomer'],['tran','Tran'],['touch','Touch pad']];
const WS_LABEL={bolt:'Bolt',glow:'Glow',swish:'Swish',rez:'Rez',dot:'Dot',rail:'Rails',cap:'Cap',spinny:'Spinny',buzz:'Buzz',boomer:'Boomer',tran:'Tran',touch:'Touch pad'};
const WS_CH={};CHAPS.forEach((c,i)=>c.parts.forEach(t=>WS_CH[t]=i+1));
const DOTC=[C.red,'#2BB673',C.blue,C.yellow,C.purple];let dotIdx=0;
const ICON={bolt:()=>`<g transform="scale(.32)">${CH.bolt({})}</g>`,glow:()=>`<g transform="translate(0 4) scale(.36)">${CH.glow({level:.6})}</g>`,swish:()=>`<g transform="translate(0 4) scale(.34)">${CH.swish({})}</g>`,rez:()=>`<g transform="scale(.26)">${CH.rez({})}</g>`,dot:()=>`<g transform="translate(0 -2) scale(.36)">${CH.dot({lit:true})}</g>`,rail:()=>`<rect x="-26" y="-14" width="52" height="10" rx="5" fill="#FFD9D6" stroke="${C.red}" stroke-width="2.5"/><rect x="-26" y="4" width="52" height="10" rx="5" fill="#D9E4FF" stroke="${C.blue}" stroke-width="2.5"/>`,cap:()=>`<g transform="scale(.3)">${CH.cap({fill:.5})}</g>`,spinny:()=>`<g transform="translate(0 4) scale(.34)">${CH.spinny({})}</g>`,buzz:()=>`<g transform="translate(0 4) scale(.36)">${CH.buzz({})}</g>`,boomer:()=>`<g transform="scale(.24)">${CH.boomer({})}</g>`,tran:()=>`<g transform="translate(0 -4) scale(.38)">${CH.tran({})}</g>`,touch:()=>`<rect x="-16" y="-16" width="32" height="32" rx="8" fill="#F2C230" stroke="${I}" stroke-width="3"/>`};
const CHALL=[
  {id:'glow',t:'Light up Glow',need:'glow',ok:b=>b.get('glow').some(p=>p.bright>.5)},
  {id:'swish',t:'Glow + Swish',need:'swish',ok:b=>b.get('swish').length&&b.get('glow').some(p=>p.bright>.5)&&b._swDid},
  {id:'dot',t:'Dot with Rez',need:'dot',ok:b=>b.get('dot').some(p=>p.bright>.3&&!p.burnt)},
  {id:'par',t:'3 bright Glows',need:'glow',ok:b=>b.get('glow').filter(p=>p.bright>.8).length>=3},
  {id:'spin',t:'Spin Spinny',need:'spinny',ok:b=>b.get('spinny').some(p=>Math.abs(p.speed)>.5)},
  {id:'cap',t:'Fill up Cap',need:'cap',ok:b=>b.get('cap').some(p=>p.fill>.9)},
  {id:'buzz',t:'Make Buzz buzz',need:'buzz',ok:b=>b.get('buzz').some(p=>p.on)},
  {id:'touch',t:'Touch light',need:'touch',ok:b=>b.get('tran').some(p=>p.open>.5)&&b.get('dot').some(p=>p.bright>.3)&&b.get('touch').some(p=>p.held)}
];
function showWorkshop(){clearScene();screen='workshop';setTitle('Workshop');$('#win').classList.add('hidden');bg();
  el('rect',{x:20,y:18,width:190,height:564,rx:28,fill:'#F4F6FA',stroke:C.soft,'stroke-width':3});
  const trash=g(`<circle r="40" fill="#FFE3D6" stroke="${C.red}" stroke-width="4"/><path d="M-16 -12 h32 M-10 -12 v-6 h20 v6 M-13 -12 l3 30 h20 l3 -30" stroke="${C.red}" stroke-width="4" fill="none" stroke-linejoin="round"/>`,930,540);
  const b=new Board({movable:true,onDrop:(p,pt)=>{if(near(pt,{x:930,y:540},60)){b.remove(p);sfx.pop();}saveWs(b);},onMove:()=>{}});
  b.on('change',()=>saveWs(b));b.on('tap',p=>{if(p.type==='swish')b._swTap=performance.now();saveWs(b);});
  b.on('short',()=>say('bolt','OUCH! Short circuit! Cut a wire, quick!','Ouch! Short circuit!'));
  b.on('burn',()=>say('dot','POP! Too many Zips! I need Rez. Tap me for a new Dot.','POP! I need Rez!'));
  /* tray */
  const any=WS_PARTS.some(([t])=>partUnlocked(t));
  WS_PARTS.forEach(([t,nm],i)=>{const x=i%2?160:72,y=62+Math.floor(i/2)*86;const on=partUnlocked(t);const gg=g(`<rect x="-40" y="-36" width="80" height="78" rx="16" fill="${on?'#fff':'#E9EEF6'}" stroke="${on?I:'#C9D3E3'}" stroke-width="3"/><g opacity="${on?1:.3}">${ICON[t]()}</g><text y="34" text-anchor="middle" ${FONT} font-size="13" fill="${on?I:C.grey}">${on?nm:'Ch '+WS_CH[t]}</text>`,x,y);
    gg.style.cursor=on?'grab':'not-allowed';
    gg.addEventListener('pointerdown',e=>{if(!on){sfx.bonk();say('zip',`Finish chapter ${WS_CH[t]} in Story to unlock ${nm}!`,`Unlocks in chapter ${WS_CH[t]}`);return;}e.preventDefault();A();const pt=toSvg(e);
      const o={flip:true,unscrew:true,adjust:true};if(t==='dot')o.init={color:DOTC[(dotIdx++)%DOTC.length]};if(t==='rail')o.init={sign:'+'};
      if(t==='rail'){const p1=b.add('rail',540,450,{init:{sign:'+'}});const p2=b.add('rail',540,520,{init:{sign:'-'}});sfx.snap();saveWs(b);return;}
      const p=b.add(t,pt.x,pt.y,o);b.drag={kind:'part',p,start:{x:pt.x-99,y:pt.y},off:{x:0,y:0},moved:true};sfx.pick();});});
  /* challenges */
  const ch=g('',600,40);let doneC=new Set(prog.wsChall||[]);
  const drawCh=()=>{const list=CHALL.filter(c=>partUnlocked(c.need));ch.innerHTML=list.map((c,i)=>{const d=doneC.has(c.id);const x=(i-(list.length-1)/2)*86;return `<g transform="translate(${x} 0)"><rect x="-40" y="-22" width="80" height="44" rx="14" fill="${d?C.yellow:'#fff'}" stroke="${I}" stroke-width="2.5"/><text y="-1" text-anchor="middle" ${FONT} font-size="12" fill="${I}">${esc(c.t.split(' ').slice(0,2).join(' '))}</text><text y="14" text-anchor="middle" ${FONT} font-size="12" fill="${I}">${esc(c.t.split(' ').slice(2).join(' '))}${d?' ✓':''}</text></g>`;}).join('');};drawCh();
  b.on('tick',()=>{const sw=b.get('swish');if(b._swTap&&performance.now()-b._swTap<600&&b.get('glow').some(p=>p.bright>.5))b._swDid=true;
    CHALL.forEach(c=>{if(!doneC.has(c.id)&&partUnlocked(c.need)&&c.ok(b)){doneC.add(c.id);prog.wsChall=[...doneC];save();sfx.win();drawCh();say('zip',`Challenge done: ${c.t}!`,`${c.t} ✓`);}});});
  const clr=sbtn(905,100,'Clear',{w:110,h:46,size:20,fill:'#fff'});clr.firstElementChild.classList.remove('pulse');tapper(clr,()=>{b.parts.slice().forEach(p=>b.remove(p));saveWs(b);sfx.pop();});
  loadWs(b);
  if(!any)say('zip','The Workshop parts unlock as you play Story. Finish chapter 2 to get Bolt the battery!','Play Story to unlock parts!');
  else say('zip','Drag Pals from the box onto the table. Drag from dot to dot to draw wires. Tap a wire to cut it. Drop things in the bin to throw them away.','Build anything!');}
function saveWs(b){const parts=b.parts.map(p=>({t:p.type,x:Math.round(p.x),y:Math.round(p.y),R:p.R,rev:!!p.rev,closed:!!p.closed,color:p.color,sign:p.sign,out:!!p.out}));const wires=b.wires.map(w=>[b.parts.indexOf(w.a.p),w.a.k,b.parts.indexOf(w.b.p),w.b.k]);prog.ws={parts,wires};save();}
function loadWs(b){const s=prog.ws;if(!s||!s.parts)return;const made=s.parts.map(q=>partUnlocked(q.t)?b.add(q.t,q.x,q.y,{flip:true,unscrew:true,adjust:true,init:{R:q.R||100,rev:q.rev,closed:q.closed,color:q.color,sign:q.sign,out:q.out}}):null);
  (s.wires||[]).forEach(([a,ak,c,ck])=>{if(made[a]&&made[c])b.wire({p:made[a],k:ak},{p:made[c],k:ck});});}

/* ---------- header buttons, start, grown-ups ---------- */
$('#homeBtn').onclick=()=>{A();sfx.click();showHome();};
$('#palsBtn').onclick=()=>{A();sfx.click();showPals();};
const replay=()=>{if(lastLine){A();setBubble(lastLine[0],lastLine[2]||lastLine[1],lastLine[1]);speak(lastLine[0],lastLine[1]);}};
$('#sayBtn').onclick=replay;$('#avatar').onclick=replay;
$('#startBtn').onclick=()=>{A();sfx.win();$('#start').classList.add('hidden');pickVoice();showHome();};
$('#startZip').innerHTML=CH.zip({mood:'grin'});
(function(){const b=$('#grownBtn');let t=null;const start=e=>{e.preventDefault();b.classList.add('holding');t=setTimeout(()=>{b.classList.remove('holding');openGrown();},1400);};const stop=()=>{b.classList.remove('holding');clearTimeout(t);};
  b.addEventListener('pointerdown',start);b.addEventListener('pointerup',stop);b.addEventListener('pointerleave',stop);b.addEventListener('pointercancel',stop);
  b.addEventListener('click',()=>{if(!$('#grown').classList.contains('hidden'))return;setBubble('zip','Grown-ups: press and hold the lock');});})();
function openGrown(){const ol=$('#builds');ol.innerHTML='';CHAPS.forEach((c,i)=>{const li=document.createElement('li');const bb=document.createElement('b');bb.textContent=`${i+1}. ${c.name} (${c.topic}): `;li.appendChild(bb);li.appendChild(document.createTextNode(c.build));ol.appendChild(li);});$('#grown').classList.remove('hidden');}
$('#grownClose').onclick=()=>$('#grown').classList.add('hidden');
$('#tVoice').onclick=e=>{voiceOn=!voiceOn;e.target.classList.toggle('on',voiceOn);e.target.textContent=voiceOn?'Voice on':'Voice off';if(!voiceOn){try{speechSynthesis.cancel();}catch(err){}}};
$('#tSfx').onclick=e=>{sfxOn=!sfxOn;e.target.classList.toggle('on',sfxOn);e.target.textContent=sfxOn?'Sounds on':'Sounds off';};
const SPEEDS=[[.78,'slow'],[.65,'slower'],[1,'normal']];const drawSpeed=()=>{const s=SPEEDS.find(x=>x[0]===speedMul)||SPEEDS[0];$('#tSpeed').textContent='Voice speed: '+s[1];};drawSpeed();
$('#tSpeed').onclick=()=>{const i=SPEEDS.findIndex(x=>x[0]===speedMul);speedMul=SPEEDS[(i+1)%SPEEDS.length][0];saveVoice();drawSpeed();speak('zip','This is how fast I talk now.');};
const drawSubs=()=>{$('#tSubs').classList.toggle('on',subsOn);$('#tSubs').textContent=subsOn?'Subtitles on':'Subtitles off';};drawSubs();
$('#tSubs').onclick=()=>{subsOn=!subsOn;saveVoice();drawSubs();};
$('#tReset').onclick=()=>{if($('#tReset').dataset.sure!=='1'){$('#tReset').dataset.sure='1';$('#tReset').textContent='Tap again to reset everything';return;}prog={done:{},ws:null};save();$('#tReset').dataset.sure='';$('#tReset').textContent='Reset all progress';$('#grown').classList.add('hidden');showHome();};
save();setBubble('zip','Hi!');

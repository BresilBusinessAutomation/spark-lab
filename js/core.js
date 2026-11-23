'use strict';
/* Spark Lab core: colours, characters, audio, speech, dialogue, scene engine */
const C={ink:'#14213D',yellow:'#FFC93C',blue:'#2F6BFF',orange:'#FF7A45',green:'#2BB673',red:'#FF5A4E',purple:'#8E5BD9',soft:'#D6E2F5',grey:'#4A5878'};
const I=C.ink, NS='http://www.w3.org/2000/svg';
const $=s=>document.querySelector(s);
const svg=$('#scene');
const FONT='font-family="Baloo 2, sans-serif" font-weight="800"';
function mix(a,b,t){const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const x=p(a),y=p(b);t=Math.max(0,Math.min(1,t));return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('');}
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- faces & characters ---------- */
function face(m,s=1,x=0,y=0){
  let e='',mo='';
  const dots=`<circle cx="-9" cy="-4" r="4.4" fill="${I}"/><circle cx="9" cy="-4" r="4.4" fill="${I}"/><circle cx="-7.5" cy="-5.6" r="1.5" fill="#fff"/><circle cx="10.5" cy="-5.6" r="1.5" fill="#fff"/>`;
  const sm=d=>`<path d="${d}" stroke="${I}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  switch(m){
    case 'sleepy': e=sm('M-14 -4 q5 4 10 0 M4 -4 q5 4 10 0'); mo=`<ellipse cx="0" cy="9" rx="3.5" ry="2.6" fill="${I}"/>`; break;
    case 'sad': e=dots; mo=sm('M-8 13 q8 -7 16 0'); break;
    case 'wow': e=`<circle cx="-9" cy="-5" r="5.8" fill="${I}"/><circle cx="9" cy="-5" r="5.8" fill="${I}"/><circle cx="-7" cy="-7" r="2" fill="#fff"/><circle cx="11" cy="-7" r="2" fill="#fff"/>`; mo=`<ellipse cx="0" cy="11" rx="5.5" ry="6.5" fill="${I}"/>`; break;
    case 'dizzy': e=`<path d="M-14 -9 l9 9 M-5 -9 l-9 9 M5 -9 l9 9 M14 -9 l-9 9" stroke="${I}" stroke-width="3" stroke-linecap="round"/>`; mo=sm('M-9 10 q3 -4 6 0 t6 0 t6 0'); break;
    case 'cool': e=`<rect x="-20" y="-11" width="17" height="11" rx="4" fill="${I}"/><rect x="3" y="-11" width="17" height="11" rx="4" fill="${I}"/><path d="M-3 -7 h6" stroke="${I}" stroke-width="3"/>`; mo=sm('M-7 8 q9 7 15 -2'); break;
    case 'grin': e=dots; mo=`<path d="M-10 5 h20 q-2 11 -10 11 q-8 0 -10 -11 z" fill="${I}"/>`; break;
    case 'ouch': e=sm('M-14 -8 l8 4 -8 4 M14 -8 l-8 4 8 4'); mo=sm('M-9 12 q9 -8 18 0'); break;
    default: e=dots; mo=sm('M-9 6 q9 9 18 0');
  }
  return `<g transform="translate(${x} ${y}) scale(${s})">${e}${mo}</g>`;
}
const BANDS={10:['#7A4A1E','#14213D','#14213D'],33:['#F07A1E','#F07A1E','#14213D'],100:['#7A4A1E','#14213D','#7A4A1E'],470:['#E8B020','#8E5BD9','#7A4A1E']};
const CH={
  zip:(o={})=>`<path d="M5 -50 L-6 -35 L4 -35 L-4 -22" stroke="${I}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="0" cy="4" r="27" fill="${C.yellow}" stroke="${I}" stroke-width="4"/>${face(o.mood,1,0,6)}`,
  bolt:(o={})=>{const up=o.flex;const body=o.hot?'#FF8A65':C.blue;const arm=sx=>{const d=`M${34*sx} -4 q${30*sx} ${up?-4:10} ${26*sx} ${up?-34:30}`;return `<path d="${d}" stroke="${I}" stroke-width="15" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${body}" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="${60*sx}" cy="${up?-40:28}" r="11" fill="${body}" stroke="${I}" stroke-width="3.5"/>`;};
    const top=o.rev?'−':'+',bot=o.rev?'+':'−';
    return `${arm(-1)}${arm(1)}<rect x="-13" y="${o.rev?51:-67}" width="26" height="16" rx="4" fill="${I}"/><rect x="-36" y="-54" width="72" height="108" rx="18" fill="${body}" stroke="${I}" stroke-width="4"/><rect x="-34" y="-40" width="68" height="12" fill="${C.red}"/><circle cx="0" cy="4" r="23" fill="#DCE8FF"/>${face(o.mood,.95,0,4)}<text x="-22" y="-44" text-anchor="middle" ${FONT} font-size="20" fill="#fff">${top}</text><text x="-22" y="48" text-anchor="middle" ${FONT} font-size="22" fill="#fff">${bot}</text>${o.hot?`<path d="M44 -40 q6 10 0 14 q-6 -4 0 -14z M-48 -30 q6 10 0 14 q-6 -4 0 -14z" fill="#6FC3FF" stroke="${I}" stroke-width="2"/><path d="M-20 -86 q6 -8 0 -16 M0 -88 q6 -8 0 -16 M20 -86 q6 -8 0 -16" stroke="${C.red}" stroke-width="4" fill="none" stroke-linecap="round"/>`:''}`;},
  glow:(o={})=>{const lv=clamp(o.level??0);const fill=mix('#EEF2F8','#FFE066',lv);let rays='';
    if(lv>0.05){for(let i=0;i<8;i++){const a=i*Math.PI/4;rays+=`<path d="M${(Math.cos(a)*52).toFixed(1)} ${(-14+Math.sin(a)*52).toFixed(1)} L${(Math.cos(a)*68).toFixed(1)} ${(-14+Math.sin(a)*68).toFixed(1)}" stroke="${C.yellow}" stroke-width="7" stroke-linecap="round" opacity="${lv.toFixed(2)}"/>`;}}
    if(o.out)return `<rect x="-18" y="22" width="36" height="22" rx="3" fill="#B8C5DB" stroke="${I}" stroke-width="3"/><g transform="translate(0 -40)" opacity="0.5"><circle cx="0" cy="-14" r="40" fill="#EEF2F8" stroke="${I}" stroke-width="4" stroke-dasharray="7 6"/>${face('sad',1,0,-12)}</g>`;
    return `<circle cx="0" cy="-14" r="76" fill="${C.yellow}" opacity="${(lv*0.3).toFixed(2)}"/>${rays}<circle cx="0" cy="-14" r="40" fill="${fill}" stroke="${I}" stroke-width="4"/><rect x="-18" y="22" width="36" height="11" rx="2" fill="#B8C5DB" stroke="${I}" stroke-width="3"/><rect x="-16" y="32" width="32" height="10" rx="2" fill="#B8C5DB" stroke="${I}" stroke-width="3"/><rect x="-9" y="42" width="18" height="8" rx="4" fill="${I}"/>${face(o.mood,1,0,-12)}`;},
  trax:(o={})=>`<path d="M-80 34 C-50 -26 -10 54 30 -6" stroke="${I}" stroke-width="28" fill="none" stroke-linecap="round"/><path d="M-80 34 C-50 -26 -10 54 30 -6" stroke="${C.orange}" stroke-width="19" fill="none" stroke-linecap="round"/><path d="M-80 34 C-50 -26 -10 54 30 -6" stroke="#E0602B" stroke-width="19" fill="none" stroke-dasharray="5 15"/><circle cx="42" cy="-20" r="24" fill="${C.orange}" stroke="${I}" stroke-width="4"/>${face(o.mood,.8,44,-20)}<path d="M64 -12 l14 2 l-6 3 l6 4 l-14 -2" stroke="${C.red}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  swish:(o={})=>`<rect x="-64" y="-8" width="128" height="50" rx="18" fill="${C.purple}" stroke="${I}" stroke-width="4"/><circle cx="0" cy="18" r="18" fill="#EADFFB"/>${face(o.mood||'happy',.78,0,18)}<path d="M-24 -8 l6 -12 h36 l6 12 z" fill="${I}"/><rect x="-6" y="-17" width="12" height="7" rx="2" fill="${C.yellow}"/><circle cx="-50" cy="-30" r="9" fill="${I}"/><circle cx="50" cy="-30" r="9" fill="${I}"/><g transform="rotate(${o.closed?0:-42} -50 -30)"><rect x="-54" y="-37" width="108" height="14" rx="7" fill="${C.yellow}" stroke="${I}" stroke-width="3.5"/></g>`,
  rez:(o={})=>{const b=BANDS[o.R||100]||BANDS[100];return `<path d="M-100 0 H-66 M66 0 H100" stroke="#9AA3B5" stroke-width="7" stroke-linecap="round"/><path d="M-6 -26 L20 -64 L36 -22 Z" fill="${C.blue}" stroke="${I}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="20" cy="-66" r="7" fill="#fff" stroke="${I}" stroke-width="2.5"/><rect x="-70" y="-28" width="140" height="56" rx="28" fill="${o.warm?'#F2B48A':'#E8D3A8'}" stroke="${I}" stroke-width="4"/><rect x="-46" y="-27" width="9" height="54" fill="${b[0]}"/><rect x="-33" y="-27" width="9" height="54" fill="${b[1]}"/><rect x="34" y="-27" width="9" height="54" fill="${b[2]}"/>${face(o.mood||'sleepy',.9,4,2)}`;},
  dot:(o={})=>{const c=o.color||C.red;const body=o.burnt?'#8C96A8':(o.lit?mix(mix(c,'#ffffff',0.6),c,o.level??1):mix(c,'#ffffff',0.6));const lv=o.lit?(o.level??1):0;
    return `${lv>0.02?`<circle cx="0" cy="-16" r="74" fill="${c}" opacity="${(0.32*lv).toFixed(2)}"/>`:''}<path d="M-13 30 V70 M13 30 V56" stroke="#9AA3B5" stroke-width="6" stroke-linecap="round"/><path d="M-30 30 V-14 a30 30 0 0 1 60 0 V30 Z" fill="${body}" stroke="${I}" stroke-width="4"/><rect x="-37" y="26" width="74" height="11" rx="4" fill="${body}" stroke="${I}" stroke-width="3.5"/>${face(o.burnt?'dizzy':o.mood,.95,0,-4)}${o.burnt?`<path d="M-10 -52 q-10 -12 0 -22 q10 -10 0 -22 M12 -50 q-8 -10 0 -18" stroke="#8C96A8" stroke-width="5" fill="none" stroke-linecap="round"/>`:''}`;},
  cap:(o={})=>{const f=clamp(o.fill||0);const r=(9+24*f).toFixed(1);return `<path d="M-14 44 V78 M14 44 V78" stroke="#9AA3B5" stroke-width="6" stroke-linecap="round"/><circle cx="-24" cy="-46" r="13" fill="#6FA8FF" stroke="${I}" stroke-width="3.5"/><circle cx="24" cy="-46" r="13" fill="#6FA8FF" stroke="${I}" stroke-width="3.5"/><circle cx="-24" cy="-46" r="6" fill="#FFB3C1"/><circle cx="24" cy="-46" r="6" fill="#FFB3C1"/><rect x="-38" y="-48" width="76" height="94" rx="28" fill="#6FA8FF" stroke="${I}" stroke-width="4"/><circle cx="${(-26-f*10).toFixed(1)}" cy="10" r="${r}" fill="#FFB3C1" stroke="${I}" stroke-width="3"/><circle cx="${(26+f*10).toFixed(1)}" cy="10" r="${r}" fill="#FFB3C1" stroke="${I}" stroke-width="3"/>${face(o.mood,.9,0,-14)}<rect x="-6" y="1" width="5" height="7" fill="#fff" stroke="${I}" stroke-width="1.5"/><rect x="1" y="1" width="5" height="7" fill="#fff" stroke="${I}" stroke-width="1.5"/>`;},
  spinny:(o={})=>{const a=o.angle||0;const rx=(6+44*Math.abs(Math.cos(a))).toFixed(1);return `<rect x="-4" y="-58" width="8" height="26" fill="${I}"/><ellipse cx="0" cy="-60" rx="${rx}" ry="9" fill="${C.orange}" stroke="${I}" stroke-width="3.5"/><circle cx="0" cy="-60" r="5" fill="${I}"/><rect x="-44" y="-34" width="88" height="76" rx="20" fill="#B8C5DB" stroke="${I}" stroke-width="4"/><rect x="-51" y="-6" width="8" height="22" rx="3" fill="${I}"/><rect x="43" y="-6" width="8" height="22" rx="3" fill="${I}"/>${face(o.mood,1,0,4)}`;},
  boomer:(o={})=>{const p=o.pulse||0;return `<rect x="-58" y="-74" width="116" height="148" rx="18" fill="${I}"/><rect x="-42" y="-62" width="34" height="18" rx="6" fill="${C.yellow}"/><rect x="8" y="-62" width="34" height="18" rx="6" fill="${C.yellow}"/><path d="M-8 -54 h16" stroke="${C.yellow}" stroke-width="4"/><path d="M-14 -32 q14 10 28 0" stroke="${C.yellow}" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="0" cy="22" r="${(38+p*9).toFixed(1)}" fill="#B8C5DB" stroke="${C.yellow}" stroke-width="4"/><circle cx="0" cy="22" r="${(14+p*3).toFixed(1)}" fill="${I}" stroke="${C.yellow}" stroke-width="3"/>`;},
  mic:(o={})=>{const e=o.ear||0;const lx=(-42-e*6).toFixed(1),rx=(42+e*6).toFixed(1);return `<ellipse cx="${lx}" cy="-22" rx="17" ry="28" fill="#FFB3C1" stroke="${I}" stroke-width="3.5" transform="rotate(${(-10-e*14).toFixed(1)} ${lx} -22)"/><ellipse cx="${rx}" cy="-22" rx="17" ry="28" fill="#FFB3C1" stroke="${I}" stroke-width="3.5" transform="rotate(${(10+e*14).toFixed(1)} ${rx} -22)"/><rect x="-12" y="10" width="24" height="70" rx="9" fill="${I}"/><circle cx="0" cy="-22" r="34" fill="#DDE5F2" stroke="${I}" stroke-width="4"/><path d="M-26 -38 h52 M-32 -24 h64 M-26 -10 h52" stroke="#C3CEDF" stroke-width="3"/>${face(o.mood,.95,0,-20)}`;},
  tran:(o={})=>`<path d="M-15 22 V60 M0 22 V64 M15 22 V60" stroke="#9AA3B5" stroke-width="6" stroke-linecap="round"/><path d="M-32 24 V-6 a32 28 0 0 1 64 0 V24 Z" fill="${I}"/><rect x="-24" y="-14" width="20" height="12" rx="4" fill="${C.blue}" stroke="#fff" stroke-width="2"/><rect x="4" y="-14" width="20" height="12" rx="4" fill="${C.blue}" stroke="#fff" stroke-width="2"/><path d="M-4 -9 h8" stroke="#fff" stroke-width="2"/><path d="M-8 8 q8 4 16 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M-3 26 l-14 -8 v16 z M3 26 l14 -8 v16 z" fill="${C.red}" stroke="${I}" stroke-width="2"/><circle cx="0" cy="26" r="4" fill="${C.red}" stroke="${I}" stroke-width="2"/>${o.open?`<circle cx="0" cy="-40" r="8" fill="${C.yellow}" stroke="${I}" stroke-width="2"/>`:''}`,
  pip:(o={})=>`<path d="M-50 -16 l8 -30 10 22 10 -34 10 30 10 -32 10 32 10 -34 10 30 10 -26 8 28 Z" fill="${C.purple}" stroke="${I}" stroke-width="3.5" stroke-linejoin="round"/><rect x="-64" y="-22" width="128" height="46" rx="23" fill="${o.lit===false?'#E3E8F0':'#FAFAF6'}" stroke="${I}" stroke-width="4"/><circle cx="-46" cy="1" r="5" fill="#9AA3B5"/><circle cx="-32" cy="1" r="5" fill="#9AA3B5"/><circle cx="32" cy="1" r="5" fill="#9AA3B5"/><circle cx="46" cy="1" r="5" fill="#9AA3B5"/>${face(o.mood||'happy',.8,0,0)}`,
  buzz:(o={})=>{const w=o.on?Math.sin(performance.now()/20)*6:0;return `<ellipse cx="-30" cy="${(-40+w).toFixed(1)}" rx="22" ry="14" fill="#DDF1FF" stroke="${I}" stroke-width="3" transform="rotate(-25 -30 -40)"/><ellipse cx="30" cy="${(-40-w).toFixed(1)}" rx="22" ry="14" fill="#DDF1FF" stroke="${I}" stroke-width="3" transform="rotate(25 30 -40)"/><circle r="40" fill="${I}"/><circle r="30" fill="${C.yellow}"/><path d="M-30 -10 h60 M-30 12 h60" stroke="${I}" stroke-width="5" opacity=".25"/>${face(o.mood||'grin',.85,0,2)}${o.on?`<path d="M48 -10 q8 10 0 20 M58 -18 q14 18 0 36" stroke="${C.orange}" stroke-width="4" fill="none" stroke-linecap="round"/>`:''}`;},
  knobby:(o={})=>{const a=(o.turn??.5)*270-135;return `<circle r="46" fill="#2F3B5C" stroke="${I}" stroke-width="4"/>${Array.from({length:16},(_,i)=>{const t=i*Math.PI/8;return `<path d="M${(Math.cos(t)*40).toFixed(1)} ${(Math.sin(t)*40).toFixed(1)} L${(Math.cos(t)*46).toFixed(1)} ${(Math.sin(t)*46).toFixed(1)}" stroke="#5E6C8F" stroke-width="4"/>`;}).join('')}<circle r="32" fill="#F4F6FA" stroke="${I}" stroke-width="3"/><g transform="rotate(${a.toFixed(1)})"><rect x="-3" y="-31" width="6" height="12" rx="3" fill="${C.red}"/></g>${face(o.mood||'happy',.75,0,4)}`;}
};
const AVATAR={glow:{level:1,mood:'grin'},dot:{lit:true},cap:{fill:.4},pip:{mood:'cool'},bolt:{mood:'grin'},buzz:{on:false}};
const NAMES={zip:'Zip',bolt:'Bolt',glow:'Glow',trax:'Trax',swish:'Swish',rez:'Rez',dot:'Dot',cap:'Cap',spinny:'Spinny',boomer:'Boomer',mic:'Mic',tran:'Tran',pip:'Pip',buzz:'Buzz',knobby:'Knobby'};
const STAR='M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21.1l1.4-7L2 9.3l7-.8z';
function starAt(x,y,s){return `<g transform="translate(${x-12*s} ${y-12*s}) scale(${s})"><path d="${STAR}" fill="${C.yellow}" stroke="${I}" stroke-width="1.6" stroke-linejoin="round"/></g>`;}
function pill(x,y,name,real,dark){const w=Math.max(name.length,(real||'').length*0.78)*12+30;return `<g transform="translate(${x} ${y})"><rect x="${-w/2}" y="-15" width="${w}" height="${real?44:30}" rx="14" fill="${dark?I:'#fff'}" stroke="${I}" stroke-width="2.5"/><text y="6" text-anchor="middle" ${FONT} font-size="19" fill="${dark?'#fff':I}">${esc(name)}</text>${real?`<text y="24" text-anchor="middle" ${FONT} font-size="14" fill="${dark?'#C9D8F0':C.grey}">${esc(real)}</text>`:''}</g>`;}

/* ---------- audio ---------- */
let actx=null,sfxOn=true,voiceOn=true;
let speedMul=0.78,subsOn=true;try{const s=JSON.parse(localStorage.getItem('sparklab-voice')||'{}');if(s.speed)speedMul=s.speed;if(s.subs===false)subsOn=false;}catch(e){}
function saveVoice(){try{localStorage.setItem('sparklab-voice',JSON.stringify({speed:speedMul,subs:subsOn}));}catch(e){}}
function A(){try{if(!actx)actx=new(window.AudioContext||window.webkitAudioContext)();if(actx.state==='suspended')actx.resume();}catch(e){actx=null;}return actx;}
function beep(f,d=0.15,type='sine',v=0.18,delay=0,f2=null){const a=A();if(!a||!sfxOn)return;const t=a.currentTime+delay;const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v,t+0.012);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g).connect(a.destination);o.start(t);o.stop(t+d+0.05);}
function noise(d=0.3,v=0.2,freq=1200){const a=A();if(!a||!sfxOn)return;const len=Math.floor(a.sampleRate*d);const b=a.createBuffer(1,len,a.sampleRate);const ch=b.getChannelData(0);for(let i=0;i<len;i++)ch[i]=(Math.random()*2-1)*(1-i/len);const s=a.createBufferSource();s.buffer=b;const f=a.createBiquadFilter();f.type='bandpass';f.frequency.value=freq;const g=a.createGain();g.gain.value=v;s.connect(f).connect(g).connect(a.destination);s.start();}
const sfx={
  ding(){beep(880,.18,'triangle',.2);beep(1320,.28,'triangle',.15,.08);},
  bonk(){beep(200,.22,'square',.1,0,90);},
  zap(){beep(300,.3,'sawtooth',.06,0,1400);},
  pop(){noise(.3,.45,700);beep(700,.15,'square',.1,0,70);},
  whistle(){beep(1900,.12,'sine',.14);beep(2300,.2,'sine',.14,.13);},
  pick(){beep(500,.09,'sine',.12,0,760);},
  snap(){beep(700,.06,'square',.08);beep(1050,.09,'square',.07,.05);},
  click(){beep(900,.05,'square',.06);},
  cut(){beep(1200,.06,'square',.07,0,300);},
  win(){[523,659,784,1047].forEach((f,i)=>beep(f,.28,'triangle',.18,i*.12));beep(1568,.5,'triangle',.12,.5);},
  flash(){noise(.4,.35,3200);beep(2400,.35,'sine',.08,0,300);},
  chomp(p){beep(260+p*520,.06,'square',.05);},
  sizzle(){noise(.5,.25,4000);},
  note(f){beep(f,.55,'triangle',.25);beep(f*2,.4,'sine',.05);},
  drum(){beep(140,.25,'sine',.35,0,50);noise(.12,.2,900);}
};
/* continuous sound (buzzer, speaker, motor whir, hum) */
function loopSound(type='square',freq=220,filter=2000){const a=A();if(!a)return {set(){},stop(){}};let o,g,f;try{o=a.createOscillator();g=a.createGain();f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=filter;o.type=type;o.frequency.value=freq;g.gain.value=0;o.connect(f).connect(g).connect(a.destination);o.start();}catch(e){return {set(){},stop(){}};}
  const S={set(vol,fr){try{g.gain.setTargetAtTime(sfxOn?vol:0,a.currentTime,.03);if(fr)o.frequency.setTargetAtTime(fr,a.currentTime,.03);}catch(e){}},stop(){try{o.stop();}catch(e){}}};cleanups.push(()=>S.stop());return S;}
function pluck(freq,cutoff,vol){const a=A();if(!a||!sfxOn)return;const sr=a.sampleRate;const len=Math.floor(sr*1.8);const buf=a.createBuffer(1,len,sr);const d=buf.getChannelData(0);const N=Math.max(2,Math.floor(sr/freq));const ring=new Float32Array(N);for(let i=0;i<N;i++)ring[i]=Math.random()*2-1;let idx=0;for(let i=0;i<len;i++){const nx=(idx+1)%N;const v=ring[idx];d[i]=v;ring[idx]=0.4985*(v+ring[nx]);idx=nx;}const s=a.createBufferSource();s.buffer=buf;const f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=cutoff;const g=a.createGain();g.gain.value=vol;s.connect(f).connect(g).connect(a.destination);s.start();}

/* ---------- speech ---------- */
let voices=[];function loadVoices(){try{voices=speechSynthesis.getVoices()||[];}catch(e){voices=[];}}
if('speechSynthesis' in window){loadVoices();try{speechSynthesis.onvoiceschanged=loadVoices;}catch(e){}}
let chosenVoice=null;
function pickVoice(){if(chosenVoice&&voices.includes(chosenVoice))return chosenVoice;const en=voices.filter(v=>/^en/i.test(v.lang||''));
  const score=v=>{let s=0;const l=(v.lang||'').replace('_','-');if(/en-AU/i.test(l))s+=30;else if(/en-GB/i.test(l))s+=20;else if(/en-US/i.test(l))s+=10;if(/natural|online/i.test(v.name))s+=50;if(/google/i.test(v.name))s+=25;if(/female|zira|samantha|karen|catherine|natasha|libby|sonia/i.test(v.name))s+=5;return s;};
  en.sort((a,b)=>score(b)-score(a));chosenVoice=en[0]||null;return chosenVoice;}
const VOICE={zip:{pitch:1.45,rate:1.02},bolt:{pitch:.8,rate:1.05},glow:{pitch:1.7,rate:1},trax:{pitch:1.1,rate:.92},swish:{pitch:1.15,rate:1.05},rez:{pitch:.55,rate:.7},dot:{pitch:1.55,rate:1.05},cap:{pitch:1.3,rate:.95},spinny:{pitch:1.4,rate:1.15},boomer:{pitch:.85,rate:1},mic:{pitch:1.2,rate:.85},tran:{pitch:.5,rate:.88},pip:{pitch:1.05,rate:1.08},buzz:{pitch:1.6,rate:1.15},knobby:{pitch:.9,rate:1}};
let talkT=null,curUtter=null,lastLine=null;
function setBubble(who,text,full){const av=$('#avatar svg');av.innerHTML=CH[who](AVATAR[who]||{});$('#bubbleWho').textContent=NAMES[who]||'';$('#bubbleText').textContent=text;const sb=$('#bubbleSub');sb.innerHTML='';if(subsOn&&full&&full!==text){let pos=0;full.split(/(\s+)/).forEach(part=>{if(/^\s+$/.test(part)||!part){sb.appendChild(document.createTextNode(part));}else{const s=document.createElement('span');s.className='w';s.dataset.s=pos;s.dataset.e=pos+part.length;s.textContent=part;sb.appendChild(s);}pos+=part.length;});}const b=$('#bubble');b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');}
function talkAnim(on){$('#avatar').classList.toggle('talk',on);}
function speak(who,text){
  return new Promise(res=>{const vc=VOICE[who]||{pitch:1,rate:1};const est=Math.max(900,text.length*72/(vc.rate*speedMul));let done=false;
    const fin=()=>{if(done)return;done=true;talkAnim(false);document.querySelectorAll('#bubbleSub .w.on').forEach(s=>s.classList.remove('on'));res();};
    talkAnim(true);
    if(!voiceOn||!('speechSynthesis' in window)){setTimeout(fin,Math.min(2600,Math.max(900,text.length*28)));return;}
    try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);const v=pickVoice();if(v){u.voice=v;u.lang=v.lang;}u.pitch=vc.pitch;u.rate=clamp(vc.rate*speedMul,.5,1.4);u.onboundary=ev=>{const i=ev.charIndex;document.querySelectorAll('#bubbleSub .w').forEach(s=>s.classList.toggle('on',i>=+s.dataset.s&&i<+s.dataset.e));};u.onend=fin;u.onerror=fin;curUtter=u;
      setTimeout(()=>{try{speechSynthesis.speak(u);}catch(e){fin();}},60);setTimeout(fin,est*1.7+2500);}catch(e){setTimeout(fin,est);}
  });}
function say(who,text,sub){lastLine=[who,text,sub];setBubble(who,sub||text,text);return speak(who,text);}

/* ---------- scene engine ---------- */
let ticks=[],timers=[],cleanups=[],tok=0,nextRes=null;
function addTick(fn){ticks.push(fn);return fn;}
let lastT=0;function loop(t){const dt=Math.min(.05,(t-(lastT||t))/1000);lastT=t;ticks=ticks.filter(f=>!f.dead);for(const f of ticks.slice()){try{f(dt,t);}catch(e){console.error(e);}}requestAnimationFrame(loop);}requestAnimationFrame(loop);
function later(fn,ms){const my=tok;const id=setTimeout(()=>{if(my===tok)fn();},ms);timers.push(id);return id;}
const hang=()=>new Promise(()=>{});
function wait(ms){return new Promise(res=>later(res,ms));}
function waitUntil(fn){return new Promise(res=>{const t=addTick(()=>{if(fn()){t.dead=true;res();}});});}
function waitClick(node){return new Promise(res=>{const my=tok;node.style.cursor='pointer';node.addEventListener('click',function h(){if(my!==tok)return;node.removeEventListener('click',h);A();res();});});}
function clearScene(){ticks=[];timers.forEach(clearTimeout);timers=[];cleanups.forEach(f=>{try{f();}catch(e){}});cleanups=[];svg.innerHTML='';tok++;nextRes=null;setNext(false);try{speechSynthesis.cancel();}catch(e){}setProgress(0,0);talkAnim(false);}
function setNext(on){$('#nextBtn').classList.toggle('show',!!on);}
$('#nextBtn').addEventListener('click',()=>{A();sfx.click();if(nextRes){const r=nextRes;nextRes=null;r();}});
/* one line of dialogue: waits for the voice to finish, then for Next (or 7 s) */
async function line(who,text,sub){const my=tok;lastLine=[who,text,sub];setBubble(who,sub||text,text);setNext(false);await speak(who,text);if(my!==tok)return hang();setNext(true);await new Promise(res=>{nextRes=res;later(()=>{if(nextRes===res){nextRes=null;res();}},7000);});setNext(false);}
async function talk(lines){for(const l of lines)await line(...l);}
function el(tag,attrs={},parent=svg){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);parent.appendChild(e);return e;}
function place(e,x,y,s=1,r=0){e.setAttribute('transform',`translate(${(+x).toFixed(1)} ${(+y).toFixed(1)}) scale(${s})${r?` rotate(${r})`:''}`);}
function g(html,x=0,y=0,s=1,parent=svg){const e=el('g',{},parent);place(e,x,y,s);e.innerHTML=html;return e;}
function bg(){el('rect',{x:12,y:10,width:976,height:580,rx:40,fill:'#fff',stroke:C.soft,'stroke-width':4});}
function tapper(node,fn){node.style.cursor='pointer';node.addEventListener('click',e=>{A();fn(e);});return node;}
function setProgress(n,total){const p=$('#pips');p.innerHTML='';for(let i=0;i<total;i++){const s=document.createElement('span');if(i<n)s.className='on';p.appendChild(s);}}
/* spotlight a character with a name label */
function spot(key,opts,x,y,s,name,real,parent=svg){const gg=g(`<g class="bob">${CH[key](opts||{})}</g>${pill(0,118,name||NAMES[key],real)}`,x,y,s,parent);return gg;}
/* svg button */
function sbtn(x,y,label,{w=200,h=70,fill=C.yellow,size=28,parent=svg}={}){const b=g(`<g class="pulse"><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="${h/2}" fill="${fill}" stroke="${I}" stroke-width="4"/><text y="${size*0.35}" text-anchor="middle" ${FONT} font-size="${size}" fill="${I}">${esc(label)}</text></g>`,x,y,1,parent);b.style.cursor='pointer';return b;}
function toSvg(e){const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;return pt.matrixTransform(svg.getScreenCTM().inverse());}
function near(a,b,r=80){return Math.hypot(a.x-b.x,a.y-b.y)<r;}
function animateTo(node,from,to,s=1,ms=260,done){const t0=performance.now();const f=()=>{const k=Math.min(1,(performance.now()-t0)/ms);const e=1-Math.pow(1-k,3);place(node,from.x+(to.x-from.x)*e,from.y+(to.y-from.y)*e,s);if(k<1)requestAnimationFrame(f);else if(done)done();};requestAnimationFrame(f);}
function makeDrag(node,home,{onDrop,onStart,scale=1}={}){
  let drag=false,off={x:0,y:0},pos={x:home.x,y:home.y};const D={locked:false,home,get pos(){return pos;},set pos(v){pos=v;}};
  node.style.cursor='grab';node.style.touchAction='none';place(node,home.x,home.y,scale);
  const move=e=>{if(!drag)return;const p=toSvg(e);pos={x:p.x-off.x,y:p.y-off.y};place(node,pos.x,pos.y,scale*1.1);};
  const up=()=>{if(!drag)return;drag=false;window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);const ok=onDrop?onDrop(pos):false;if(!ok){animateTo(node,pos,D.home,scale);pos={x:D.home.x,y:D.home.y};}};
  node.addEventListener('pointerdown',e=>{if(D.locked)return;e.preventDefault();A();drag=true;const p=toSvg(e);off={x:p.x-pos.x,y:p.y-pos.y};node.parentNode.appendChild(node);place(node,pos.x,pos.y,scale*1.1);if(onStart)onStart();window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);});
  cleanups.push(()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);});
  D.lock=()=>{D.locked=true;node.style.cursor='default';};return D;
}
function flashScreen(){const f=$('#flash');f.classList.remove('go');void f.offsetWidth;f.classList.add('go');}
function boing(node){const c=node.firstElementChild||node;c.classList.remove('boing');void c.getBoundingClientRect();c.classList.add('boing');}

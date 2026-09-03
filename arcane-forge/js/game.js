'use strict';

/* ============ GAME DATA ============ */
const ELEMENTS={
  fire:{name:'Fire',icon:'🔥',color:'#ff6b35',rarity:'Uncommon',mult:1.2},
  water:{name:'Water',icon:'🌊',color:'#3a9bdc',rarity:'Common',mult:1.0},
  earth:{name:'Earth',icon:'⛰️',color:'#8b6b3a',rarity:'Common',mult:1.0},
  wind:{name:'Wind',icon:'🌪',color:'#5fd35f',rarity:'Uncommon',mult:1.1},
  ice:{name:'Ice',icon:'🥶',color:'#5de0ff',rarity:'Rare',mult:1.4},
  lightning:{name:'Lightning',icon:'⚡',color:'#c8a8ff',rarity:'Epic',mult:1.6},
  time:{name:'Time',icon:'⏳',color:'#ffd24a',rarity:'Legendary',mult:2.0},
  void:{name:'Void',icon:'🕳',color:'#9b6dff',rarity:'Mythic',mult:2.5}
};
const ELEMENT_POOL=['water','earth','wind','fire','ice','lightning'];
const CIRCLES=[
  {stars:1,mana:100,slots:2,req:0},
  {stars:2,mana:200,slots:3,req:500},
  {stars:3,mana:350,slots:4,req:1500},
  {stars:4,mana:550,slots:5,req:4000},
  {stars:5,mana:800,slots:6,req:10000},
  {stars:6,mana:1200,slots:7,req:25000},
  {stars:7,mana:1800,slots:8,req:60000},
  {stars:8,mana:2500,slots:9,req:150000},
  {stars:9,mana:4000,slots:10,req:400000}
];
const SHOP_ITEMS=[
  {id:'crystal',name:'Mana Crystal',price:100,desc:'+50 mana instantly',icon:'💫'},
  {id:'rune',name:'Rune Shard',price:200,desc:'Required for spell fusion',icon:'🪢'},
  {id:'slot',name:'Spell Slot +1',price:500,desc:'+1 permanent spell slot',icon:'🖼️'},
  {id:'elixir',name:'Circle Elixir',price:1000,desc:'-20% mana for next circle',icon:'🏠'},
  {id:'tome',name:'Attunement Tome',price:800,desc:'Needed for 2nd element',icon:'📚'}
];

/* ============ GAME STATE ============ */
let G={
  player:null,
  spells:[],
  equipped:[],
  market:[],
  recentOpponents:[],
  dailyClaimed:false,
  loginDay:1,
  caveSession:{stones:0,crystals:0,runes:0,mining:false}
};

function defaultPlayer(name,face,hair,hairColor,robeColor,element){
  return{
    name:name,face:face,hair:hair,hairColor:hairColor,robeColor:robeColor,
    element:element,elements:[element],
    circle:0,mana:100,manaMax:100,gold:100,
    totalManaEarned:0,isMage:false,
    spellsCreated:0,battlesWon:0,fame:0,
    bonusSlots:0,elixirUsed:false
  };
}

/* ============ UTILITIES ============ */
function $(id){return document.getElementById(id);}
function rand(min,max){return Math.random()*(max-min)+min;}
function randInt(min,max){return Math.floor(rand(min,max+1));}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function uid(){return Math.random().toString(36).slice(2,10);}
function saveGame(){try{localStorage.setItem('arcane_forge_save',JSON.stringify(G));}catch(e){}}
function loadGame(){try{const s=localStorage.getItem('arcane_forge_save');if(s){G=JSON.parse(s);return true;}}catch(e){}return false;}

/* ============ AVATAR DRAWING ============ */
const FACE_EMOJI=['🙂','😎','😏','🤔','😌','😈'];
const HAIR_EMOJI=['','🧑','👨','💇','🦱','🧔'];
const HAIR_COLORS=['#1a1a1a','#4a2c0a','#8b4513','#c0c0c0','#ffd24a','#9b6dff','#5de0ff','#ff6b6b'];
const ROBE_COLORS=['#2a1d5e','#1a3a2a','#3a2a1a','#1a2a3a','#3a1a2a','#2a3a1a','#3a3a1a','#1a1a3a'];

function drawAvatar(canvas,opts){
  const ctx=canvas.getContext('2d');
  const w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);
  const cx=w/2,cy=h/2;
  // robe
  ctx.fillStyle=opts.robeColor||'#2a1d5e';
  ctx.beginPath();
  ctx.moveTo(cx-22,cy+38);
  ctx.lineTo(cx+22,cy+38);
  ctx.lineTo(cx+14,cy+8);
  ctx.lineTo(cx-14,cy+8);
  ctx.closePath();ctx.fill();
  // head
  ctx.fillStyle='#f0d9b5';
  ctx.beginPath();ctx.arc(cx,cy-12,16,0,Math.PI*2);ctx.fill();
  // hair
  ctx.fillStyle=opts.hairColor||'#1a1a1a';
  ctx.beginPath();ctx.arc(cx,cy-16,17,Math.PI,0);ctx.fill();
  // face emoji
  ctx.font='16px serif';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(FACE_EMOJI[opts.face||0]||'🙂',cx,cy-12);
  // element glow
  if(opts.element){
    const el=ELEMENTS[opts.element];
    ctx.shadowColor=el.color;ctx.shadowBlur=12;
    ctx.strokeStyle=el.color;ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(cx,cy,28,0,Math.PI*2);ctx.stroke();
    ctx.shadowBlur=0;
  }
}

/* ============ SCREEN NAVIGATION ============ */
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const el=$('screen-'+id);
  if(el)el.classList.add('active');
  if(id==='hub')refreshHub();
  if(id==='grimoire')renderGrimoire();
  if(id==='marketplace')renderMarket();
  if(id==='arena')renderArena();
  if(id==='shop')renderShop();
  if(id==='profile')renderProfile();
  if(id==='meditation')renderMeditation();
  if(id==='cave')resetCave();
  if(id==='spell-canvas')initSpellCanvas();
  saveGame();
}
function showHowToPlay(){showScreen('howto');}
function openLocation(loc){showScreen(loc);}

/* ============ CHARACTER CREATION ============ */
let createState={face:0,hair:0,hairColor:0,robeColor:0};
function initCreateOptions(){
  const faces=$('face-options');faces.innerHTML='';
  FACE_EMOJI.forEach((e,i)=>{
    const d=document.createElement('div');d.className='option-item'+(i===0?' active':'');d.textContent=e;
    d.onclick=()=>{createState.face=i;[...faces.children].forEach(c=>c.classList.remove('active'));d.classList.add('active');updateAvatarPreview();};
    faces.appendChild(d);
  });
  const hairs=$('hair-options');hairs.innerHTML='';
  HAIR_EMOJI.forEach((e,i)=>{
    const d=document.createElement('div');d.className='option-item'+(i===0?' active':'');d.textContent=e||'∅';
    d.onclick=()=>{createState.hair=i;[...hairs.children].forEach(c=>c.classList.remove('active'));d.classList.add('active');updateAvatarPreview();};
    hairs.appendChild(d);
  });
  const hc=$('hair-color-options');hc.innerHTML='';
  HAIR_COLORS.forEach((c,i)=>{
    const d=document.createElement('div');d.className='color-item'+(i===0?' active':'');d.style.background=c;
    d.onclick=()=>{createState.hairColor=i;[...hc.children].forEach(x=>x.classList.remove('active'));d.classList.add('active');updateAvatarPreview();};
    hc.appendChild(d);
  });
  const rc=$('robe-color-options');rc.innerHTML='';
  ROBE_COLORS.forEach((c,i)=>{
    const d=document.createElement('div');d.className='color-item'+(i===0?' active':'');d.style.background=c;
    d.onclick=()=>{createState.robeColor=i;[...rc.children].forEach(x=>x.classList.remove('active'));d.classList.add('active');updateAvatarPreview();};
    rc.appendChild(d);
  });
  updateAvatarPreview();
}
function updateAvatarPreview(){
  drawAvatar($('avatar-canvas'),{face:createState.face,hair:createState.hair,hairColor:HAIR_COLORS[createState.hairColor],robeColor:ROBE_COLORS[createState.robeColor]});
}
function goCreateStep(n){
  if(n===2){
    const nm=$('player-name-input').value.trim();
    if(!nm){alert('Enter a name first');return;}
  }
  document.querySelectorAll('.create-step').forEach(s=>s.classList.remove('active'));
  $('create-step-'+n).classList.add('active');
  document.querySelectorAll('.progress-dot').forEach(d=>d.classList.remove('active'));
  for(let i=1;i<=n;i++)document.querySelector('.progress-dot[data-step="'+i+'"]').classList.add('active');
  if(n===3)revealElement();
}
function revealElement(){
  const el=ELEMENT_POOL[randInt(0,ELEMENT_POOL.length-1)];
  const e=ELEMENTS[el];
  const orb=$('elementOrb');orb.style.background='radial-gradient(circle,'+e.color+',transparent)';orb.style.boxShadow='0 0 30px '+e.color;
  $('elementName').textContent=e.name+' ('+e.rarity+')';
  $('elementName').style.color=e.color;
  $('elementDesc').textContent='Your affinity with '+e.name+' magic has awakened.';
  createState.element=el;
}
function finishCharacterCreate(){
  const name=$('player-name-input').value.trim();
  G.player=defaultPlayer(name,createState.face,createState.hair,HAIR_COLORS[createState.hairColor],ROBE_COLORS[createState.robeColor],createState.element);
  // starter spell
  G.spells.push(makeSpell('Mana Bolt','⚡',1,10,5,'Beam',[],'#c8a8ff'));
  saveGame();
  showScreen('hub');
}

/* ============ HUB ============ */
function refreshHub(){
  const p=G.player;if(!p)return;
  drawAvatar($('hub-avatar'),{face:p.face,hair:p.hair,hairColor:p.hairColor,robeColor:p.robeColor,element:p.element});
  $('hub-player-name').textContent=p.name;
  $('hub-player-circle').textContent=CIRCLES[p.circle].stars+'-Star Circle'+(p.isMage?'':' (Non-Mage)');
  $('hub-mana').textContent=Math.floor(p.mana);
  $('hub-mana-max').textContent=p.manaMax;
  $('hub-gold').textContent=p.gold;
  $('online-count').textContent=1;
}

/* ============ MEDITATION ============ */
function renderMeditation(){
  const p=G.player;const c=CIRCLES[p.circle];
  $('current-circle').textContent=c.stars+'-Star Circle';
  $('circle-mana-pool').textContent=p.manaMax+' MP';
  const next=CIRCLES[p.circle+1];
  if(next){
    const need=next.req*(p.elixirUsed?0.8:1);
    const pct=clamp(p.totalManaEarned/need*100,0,100);
    $('circle-progress-fill').style.width=pct+'%';
    $('circle-progress-text').textContent=Math.floor(p.totalManaEarned)+' / '+Math.floor(need)+' mana earned';
  }else{
    $('circle-progress-fill').style.width='100%';
    $('circle-progress-text').textContent='Max Circle Reached';
  }
  drawCircleCanvas();
  $('login-day').textContent=G.loginDay;
  $('claim-login-btn').disabled=G.dailyClaimed;
  if(p.isMage)$('med-mage-status').textContent='✓ Mage';
}
function drawCircleCanvas(){
  const cv=$('circle-canvas');const ctx=cv.getContext('2d');const w=cv.width,h=cv.height;
  ctx.clearRect(0,0,w,h);const cx=w/2,cy=h/2;
  const stars=CIRCLES[G.player.circle].stars;
  ctx.strokeStyle=ELEMENTS[G.player.element].color;ctx.lineWidth=2;
  for(let i=0;i<stars;i++){
    const r=20+i*14;
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();
  }
  ctx.fillStyle=ELEMENTS[G.player.element].color;
  ctx.font='20px serif';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(ELEMENTS[G.player.element].icon,cx,cy);
}
function meditate(type){
  const p=G.player;
  if(type==='become_mage'){
    if(p.isMage){alert('Already a mage');return;}
    if(p.totalManaEarned<300){alert('Need 300 total mana earned');return;}
    p.isMage=true;p.circle=0;p.manaMax=100;
    alert('You are now a Mage! You can forge spells.');
  }else if(type==='expand_pool'){
    if(p.totalManaEarned<500){alert('Need 500 total mana earned');return;}
    p.manaMax+=50;
    alert('Mana pool expanded to '+p.manaMax);
  }else if(type==='attune'){
    if(p.totalManaEarned<1000){alert('Need 1000 total mana earned');return;}
    if(p.elements.length>=2){alert('Already have 2 elements');return;}
    const avail=ELEMENT_POOL.filter(e=>!p.elements.includes(e));
    if(!avail.length){alert('No more elements');return;}
    const e=avail[randInt(0,avail.length-1)];
    p.elements.push(e);
    alert('Attuned to '+ELEMENTS[e].name+'!');
  }
  saveGame();renderMeditation();
}
function claimDailyLogin(){
  if(G.dailyClaimed)return;
  G.dailyClaimed=true;
  const rewards=[{g:20},{g:30,s:50},{g:50},{g:50,r:1},{g:100},{g:100,c:1},{g:300,s:200,r:2}];
  const r=rewards[Math.min(G.loginDay-1,6)];
  G.player.gold+=r.g||0;
  if(r.s)G.caveSession.stones+=r.s;
  if(r.c)G.caveSession.crystals+=r.c;
  if(r.r)G.caveSession.runes+=r.r;
  G.loginDay=G.loginDay>=7?1:G.loginDay+1;
  alert('Claimed: +'+(r.g||0)+' Gold'+(r.s?' +'+r.s+' Stones':'')+(r.c?' +'+r.c+' Crystal':'')+(r.r?' +'+r.r+' Rune':''));
  saveGame();renderMeditation();
}

/* ============ CAVE / MINING ============ */
let rockHP=[100,100,100];
function resetCave(){
  rockHP=[100,100,100];
  for(let i=1;i<=3;i++){
    $('rock'+i+'-hp-fill').style.width='100%';
    $('rock-'+i).style.opacity='1';
    $('rock-'+i).style.pointerEvents='auto';
  }
  $('submit-mining-btn').style.display=G.caveSession.stones>0?'block':'none';
  updateCaveUI();
}
function mineRock(n){
  if(rockHP[n-1]<=0)return;
  const dmg=randInt(10,20);
  rockHP[n-1]=Math.max(0,rockHP[n-1]-dmg);
  $('rock'+n+'-hp-fill').style.width=rockHP[n-1]+'%';
  const ps=$('rock'+n+'-particles');
  ps.textContent='💥';
  setTimeout(()=>ps.textContent='',200);
  if(rockHP[n-1]<=0){
    G.caveSession.stones+=randInt(1,3);
    const roll=Math.random();
    if(roll<0.05)G.caveSession.crystals++;
    else if(roll<0.07)G.caveSession.runes++;
    $('rock-'+n).style.opacity='0.3';
    $('rock-'+n).style.pointerEvents='none';
    showNPC('Rock shattered! +'+(G.caveSession.stones>0?'stones':''));
  }
  updateCaveUI();
}
function updateCaveUI(){
  $('inv-stone-count').textContent=G.caveSession.stones;
  $('inv-crystal-count').textContent=G.caveSession.crystals;
  $('inv-rune-count').textContent=G.caveSession.runes;
  $('cave-stones').textContent=G.caveSession.stones;
}
function showNPC(msg){
  const d=$('npcDialogue');d.textContent=msg;d.classList.add('show');
  setTimeout(()=>d.classList.remove('show'),1500);
}
function submitMining(){
  const s=G.caveSession.stones;
  if(s<=0)return;
  const perf=s*10;
  const mult=1+(G.player.circle*0.5);
  const earned=Math.floor(perf*mult);
  G.player.totalManaEarned+=earned;
  G.player.mana=Math.min(G.player.manaMax*2,G.player.mana+earned);
  G.caveSession.stones=0;
  showNPC('Earned '+earned+' mana! Total: '+G.player.totalManaEarned);
  $('submit-mining-btn').style.display='none';
  updateCaveUI();
  saveGame();
  checkCircleUp();
}
function checkCircleUp(){
  const p=G.player;
  while(p.circle<CIRCLES.length-1){
    const need=CIRCLES[p.circle+1].req*(p.elixirUsed?0.8:1);
    if(p.totalManaEarned>=need){
      p.circle++;
      p.manaMax=CIRCLES[p.circle].mana;
      if(p.elixirUsed)p.elixirUsed=false;
      alert('Circle Up! Now '+CIRCLES[p.circle].stars+'-Star Mage. Mana pool: '+p.manaMax);
    }else break;
  }
  saveGame();
}

/* ============ SPELL CANVAS / PATTERN RECOGNITION ============ */
let scCanvas,scCtx,scDrawing=false,scTool='pen',scBrush=6,scStrokes=[],scCurStroke=[];
function initSpellCanvas(){
  scCanvas=$('spell-canvas');scCtx=scCanvas.getContext('2d');
  scCtx.fillStyle='#fff';scCtx.fillRect(0,0,scCanvas.width,scCanvas.height);
  scStrokes=[];scCurStroke=[];
  $('canvasOverlay').classList.remove('hidden');
  const el=ELEMENTS[G.player.element];
  $('canvas-element-icon').textContent=el.icon;
  $('canvas-element-name').textContent=el.name+' Magic';
  $('spell-name').value='';
  resetPreview();
  bindCanvasEvents(scCanvas,onStrokeEnd);
}
function resetPreview(){
  ['preview-tier','preview-damage','preview-mana','preview-type','preview-efficiency'].forEach(id=>$(id).textContent='—');
}
function bindCanvasEvents(cv,onEnd){
  cv.onpointerdown=(e)=>{e.preventDefault();scDrawing=true;scCurStroke=[];addPoint(cv,e);};
  cv.onpointermove=(e)=>{if(scDrawing)addPoint(cv,e);};
  cv.onpointerup=(e)=>{if(scDrawing){scDrawing=false;if(scCurStroke.length>1)scStrokes.push(scCurStroke);onEnd&&onEnd();}};
  cv.onpointerleave=(e)=>{if(scDrawing){scDrawing=false;if(scCurStroke.length>1)scStrokes.push(scCurStroke);onEnd&&onEnd();}};
}
function addPoint(cv,e){
  const r=cv.getBoundingClientRect();
  const x=(e.clientX-r.left)*(cv.width/r.width);
  const y=(e.clientY-r.top)*(cv.height/r.height);
  scCurStroke.push({x:x,y:y,t:Date.now()});
  scCtx.strokeStyle=scTool==='eraser'?'#fff':'#1a1530';
  scCtx.lineWidth=scTool==='eraser'?scBrush*2:scBrush;
  scCtx.lineCap='round';scCtx.lineJoin='round';
  if(scCurStroke.length>1){
    const p=scCurStroke[scCurStroke.length-2];
    scCtx.beginPath();scCtx.moveTo(p.x,p.y);scCtx.lineTo(x,y);scCtx.stroke();
  }
  $('canvasOverlay').classList.add('hidden');
}
function setTool(t){scTool=t;$('tool-pen').classList.toggle('active',t==='pen');$('tool-eraser').classList.toggle('active',t==='eraser');}
function setBrushSize(s){scBrush=s;document.querySelectorAll('.size-btn').forEach(b=>b.classList.remove('active'));event.target.classList.add('active');}
function clearCanvas(){scStrokes=[];scCurStroke=[];scCtx.fillStyle='#fff';scCtx.fillRect(0,0,scCanvas.width,scCanvas.height);$('canvasOverlay').classList.remove('hidden');resetPreview();}
function undoStroke(){if(scStrokes.length){scStrokes.pop();redrawCanvas();}}
function redrawCanvas(){scCtx.fillStyle='#fff';scCtx.fillRect(0,0,scCanvas.width,scCanvas.height);scCtx.strokeStyle='#1a1530';scCtx.lineWidth=scBrush;scCtx.lineCap='round';scCtx.lineJoin='round';scStrokes.forEach(st=>{if(st.length<2)return;scCtx.beginPath();scCtx.moveTo(st[0].x,st[0].y);for(let i=1;i<st.length;i++)scCtx.lineTo(st[i].x,st[i].y);scCtx.stroke();});}

/* ---- PATTERN ANALYSIS ---- */
function analyzeDrawing(){
  if(!scStrokes.length)return null;
  let pts=[];scStrokes.forEach(s=>pts=pts.concat(s));
  if(pts.length<4)return null;
  const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y);
  const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
  const w=maxX-minX,h=maxY-minY;
  const cx=(minX+maxX)/2,cy=(minY+maxY)/2;
  const aspect=w/Math.max(1,h);
  // closed shape?
  const start=pts[0],end=pts[pts.length-1];
  const closeDist=Math.hypot(start.x-end.x,start.y-end.y);
  const diag=Math.hypot(w,h);
  const closed=closeDist<diag*0.25;
  // stroke count
  const strokeCount=scStrokes.length;
  // bounding box fill ratio
  const area=w*h;
  let inside=0;pts.forEach(p=>{if(p.x>=minX&&p.x<=maxX&&p.y>=minY&&p.y<=maxY)inside++;});
  const fillRatio=inside/pts.length;
  // straightness (end-to-end vs path length)
  const pathLen=pts.reduce((a,p,i)=>i===0?0:a+Math.hypot(p.x-pts[i-1].x,p.y-pts[i-1].y),0);
  const straight=Math.hypot(start.x-end.x,start.y-end.y)/Math.max(1,pathLen);
  // determine type
  let type,desc;
  if(closed&&w>40&&h>40){type='AoE';desc='Area Burst';}
  else if(strokeCount>=2&&straight>0.7){type='Beam';desc='Projectile';}
  else if(pts.some((p,i)=>i>0&&Math.abs(p.x-pts[i-1].x)>15&&Math.abs(p.y-pts[i-1].y)>15)){type='Chain';desc='Lightning';}
  else if(aspect>2||aspect<0.5){type='Beam';desc='Projectile';}
  else if(strokeCount>=2){type='Shield';desc='Barrier';}
  else{type='Nova';desc='Burst';}
  // complexity
  const complexity=clamp(pts.length/60+strokeCount*0.5+fillRatio,0.3,3);
  const el=ELEMENTS[G.player.element];
  const tier=clamp(Math.round(complexity),1,5);
  const baseDmg=Math.round((15+tier*12)*el.mult*complexity);
  const mana=Math.max(3,Math.round(baseDmg*0.4+tier*2));
  const efficiency=Math.round(baseDmg/mana*10)/10;
  return{type:type,desc:desc,tier:tier,damage:baseDmg,mana:mana,efficiency:efficiency,complexity:complexity,element:G.player.element};
}
function updatePreview(){
  const a=analyzeDrawing();
  if(!a){resetPreview();return;}
  $('preview-tier').textContent='T'+a.tier;
  $('preview-damage').textContent=a.damage;
  $('preview-mana').textContent=a.mana;
  $('preview-type').textContent=a.desc;
  $('preview-efficiency').textContent=a.efficiency+'x';
}
function onStrokeEnd(){updatePreview();}

/* ============ SPELL CREATION / SAVE ============ */
function makeSpell(name,icon,tier,damage,mana,type,strokes,color){
  return{id:uid(),name:name,icon:icon,tier:tier,damage:damage,mana:mana,type:type,strokes:strokes||[],color:color||'#9b6dff',mastery:1,owner:G.player?G.player.name:null,equipped:false,price:0,listed:false};
}
function saveSpell(){
  const a=analyzeDrawing();
  if(!a){alert('Draw a spell first!');return;}
  const name=$('spell-name').value.trim()||'Unnamed Spell';
  const el=ELEMENTS[a.element];
  const sp=makeSpell(name,el.icon,a.tier,a.damage,a.mana,a.type,JSON.parse(JSON.stringify(scStrokes)),el.color);
  G.spells.push(sp);
  G.player.spellsCreated++;
  saveGame();
  alert('Spell forged: '+name+' ('+a.desc+', T'+a.tier+', '+a.damage+' dmg)');
  showScreen('grimoire');
}
function testSpell(){
  const a=analyzeDrawing();
  if(!a){alert('Draw a spell first!');return;}
  const name=$('spell-name').value.trim()||'Test Spell';
  const el=ELEMENTS[a.element];
  const sp=makeSpell(name,el.icon,a.tier,a.damage,a.mana,a.type,JSON.parse(JSON.stringify(scStrokes)),el.color);
  startTestBattle(sp);
}

/* ============ GRIMOIRE ============ */
let grimoireTab='owned';
function switchGrimoireTab(t){grimoireTab=t;document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));event.target.classList.add('active');renderGrimoire();}
function renderGrimoire(){
  const p=G.player;
  const maxSlots=CIRCLES[p.circle].slots+p.bonusSlots;
  $('grimoire-slots').textContent=G.equipped.length;
  $('grimoire-max-slots').textContent=maxSlots;
  const grid=$('spells-grid');grid.innerHTML='';
  const list=grimoireTab==='owned'?G.spells:G.spells.filter(s=>s.equipped);
  if(!list.length){grid.innerHTML='<p style="grid-column:span 2;text-align:center;color:#a99fd0;padding:20px">No spells yet. Forge one!</p>';return;}
  list.forEach(sp=>{
    const card=document.createElement('div');
    card.className='spell-card'+(sp.equipped?' equipped':'');
    const cv=document.createElement('canvas');cv.className='spell-card-canvas';cv.width=120;cv.height=70;
    drawSpellOn(cv,sp);
    const el=ELEMENTS[sp.element||G.player.element];
    card.innerHTML='<div class="spell-card-element">'+el.icon+'</div>'+'<div class="spell-card-name">'+sp.name+'</div>'+'<div class="spell-card-meta"><span>T'+sp.tier+'</span><span>'+sp.damage+' dmg</span></div>'+'<div class="spell-card-meta"><span>Lv.'+sp.mastery+'</span><span>'+sp.mana+' mp</span></div>';
    card.insertBefore(cv,card.firstChild);
    card.onclick=()=>openSpellModal(sp.id);
    grid.appendChild(card);
  });
}
function drawSpellOn(cv,sp){
  const ctx=cv.getContext('2d');ctx.clearRect(0,0,cv.width,cv.height);
  ctx.fillStyle='#0d0b1a';ctx.fillRect(0,0,cv.width,cv.height);
  if(!sp.strokes||!sp.strokes.length)return;
  ctx.strokeStyle=sp.color||'#9b6dff';ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';
  const all=[];sp.strokes.forEach(s=>all.push(...s));
  const xs=all.map(p=>p.x),ys=all.map(p=>p.y);
  const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
  const sw=maxX-minX||1,sh=maxY-minY||1;
  const scale=Math.min(cv.width/sw,cv.height/sh)*0.8;
  const ox=(cv.width-sw*scale)/2-minX*scale,oy=(cv.height-sh*scale)/2-minY*scale;
  sp.strokes.forEach(st=>{if(st.length<2)return;ctx.beginPath();ctx.moveTo(st[0].x*scale+ox,st[0].y*scale+oy);for(let i=1;i<st.length;i++)ctx.lineTo(st[i].x*scale+ox,st[i].y*scale+oy);ctx.stroke();});
}

/* ============ SPELL MODAL ============ */
let modalSpellId=null;
function openSpellModal(id){
  const sp=G.spells.find(s=>s.id===id);if(!sp)return;
  modalSpellId=id;
  const el=ELEMENTS[sp.element||G.player.element];
  $('modal-spell-name').textContent=sp.name;
  $('modal-spell-tier').textContent='Tier '+sp.tier;
  $('modal-spell-element').textContent=el.name;
  drawSpellOn($('modal-spell-preview'),sp);
  $('mstat-damage').textContent=sp.damage;
  $('mstat-mana').textContent=sp.mana;
  $('mstat-mastery').textContent='Lv.'+sp.mastery;
  $('mstat-type').textContent=sp.type;
  $('modal-equip-btn').textContent=sp.equipped?'⚔️ Unequip':'⚔️ Equip';
  $('modal-sell-btn').style.display=sp.listed?'none':'block';
  $('spell-modal').style.display='flex';
}
function closeSpellModal(){$('spell-modal').style.display='none';modalSpellId=null;}
function equipSpellFromModal(){
  const sp=G.spells.find(s=>s.id===modalSpellId);if(!sp)return;
  const maxSlots=CIRCLES[G.player.circle].slots+G.player.bonusSlots;
  if(!sp.equipped){
    if(G.equipped.length>=maxSlots){alert('Spell slots full ('+maxSlots+')');return;}
    sp.equipped=true;G.equipped.push(sp.id);
  }else{sp.equipped=false;G.equipped=G.equipped.filter(i=>i!==sp.id);}
  saveGame();closeSpellModal();renderGrimoire();
}
function listSpellForSale(){
  const sp=G.spells.find(s=>s.id===modalSpellId);if(!sp)return;
  const price=prompt('Set price in Gold:',Math.max(10,sp.damage*2));
  if(price===null)return;
  const p=parseInt(price);
  if(isNaN(p)||p<1){alert('Invalid price');return;}
  sp.listed=true;sp.price=p;
  G.market.push({spellId:sp.id,owner:G.player.name,price:p,element:sp.element,tier:sp.tier,damage:sp.damage,mana:sp.mana,type:sp.type,name:sp.name,icon:sp.icon,color:sp.color,strokes:sp.strokes});
  saveGame();closeSpellModal();alert('Listed for '+p+' Gold');
}

/* ============ MARKETPLACE ============ */
function renderMarket(){
  $('market-gold').textContent=G.player.gold;
  const list=$('market-listings');list.innerHTML='';
  let items=G.market.filter(m=>m.owner!==G.player.name);
  const fe=$('market-filter-element').value;
  if(fe!=='all')items=items.filter(m=>m.element===fe);
  const sort=$('market-sort').value;
  if(sort==='cheapest')items.sort((a,b)=>a.price-b.price);
  else if(sort==='powerful')items.sort((a,b)=>b.damage-a.damage);
  if(!items.length){list.innerHTML='<p style="text-align:center;color:#a99fd0;padding:20px">No spells for sale.</p>';return;}
  items.forEach(m=>{
    const item=document.createElement('div');item.className='market-item';
    const cv=document.createElement('canvas');cv.width=50;cv.height=50;
    const sp={strokes:m.strokes,color:m.color};
    drawSpellOn(cv,sp);
    const info=document.createElement('div');info.className='market-item-info';
    info.innerHTML='<h4>'+m.name+' '+ELEMENTS[m.element].icon+'</h4><p>T'+m.tier+' • '+m.damage+' dmg • '+m.mana+' mp • '+m.type+'</p><p style="color:#ffd24a">'+m.price+' Gold</p>';
    const btn=document.createElement('button');btn.className='market-buy';btn.textContent='Buy';
    btn.disabled=G.player.gold<m.price;
    btn.onclick=()=>buyFromMarket(m.spellId);
    item.appendChild(cv);item.appendChild(info);item.appendChild(btn);
    list.appendChild(item);
  });
}
function buyFromMarket(id){
  const m=G.market.find(x=>x.spellId===id);if(!m)return;
  if(G.player.gold<m.price){alert('Not enough gold');return;}
  G.player.gold-=m.price;
  const sp=G.spells.find(s=>s.id===id);
  if(sp){sp.owner=G.player.name;sp.listed=false;sp.price=0;}
  else{G.spells.push(makeSpell(m.name,m.icon,m.tier,m.damage,m.mana,m.type,m.strokes,m.color));}
  G.market=G.market.filter(x=>x.spellId!==id);
  saveGame();
  alert('Bought '+m.name+'!');
  renderMarket();
}

/* ============ SHOP ============ */
function renderShop(){
  $('shop-gold').textContent=G.player.gold;
  const list=$('shop-items');list.innerHTML='';
  SHOP_ITEMS.forEach(it=>{
    const d=document.createElement('div');d.className='market-item';
    d.innerHTML='<div style="font-size:32px">'+it.icon+'</div><div class="market-item-info"><h4>'+it.name+'</h4><p>'+it.desc+'</p><p style="color:#ffd24a">'+it.price+' Gold</p></div>';
    const btn=document.createElement('button');btn.className='market-buy';btn.textContent='Buy';
    btn.disabled=G.player.gold<it.price;
    btn.onclick=()=>buyShopItem(it.id);
    d.appendChild(btn);list.appendChild(d);
  });
}
function buyShopItem(id){
  const it=SHOP_ITEMS.find(x=>x.id===id);if(!it)return;
  if(G.player.gold<it.price){alert('Not enough gold');return;}
  G.player.gold-=it.price;
  if(id==='crystal')G.player.mana=Math.min(G.player.manaMax*2,G.player.mana+50);
  else if(id==='rune')G.caveSession.runes++;
  else if(id==='slot')G.player.bonusSlots++;
  else if(id==='elixir')G.player.elixirUsed=true;
  else if(id==='tome')G.player.hasTome=true;
  saveGame();alert('Purchased '+it.name);renderShop();
}

/* ============ PROFILE ============ */
function renderProfile(){
  const p=G.player;
  drawAvatar($('profile-avatar'),{face:p.face,hair:p.hair,hairColor:p.hairColor,robeColor:p.robeColor,element:p.element});
  $('profile-name').textContent=p.name;
  $('profile-circle').textContent=CIRCLES[p.circle].stars+'-Star Circle';
  $('profile-element').textContent=ELEMENTS[p.element].name+(p.elements.length>1?' + '+ELEMENTS[p.elements[1]].name:'');
  $('stat-mana-earned').textContent=Math.floor(p.totalManaEarned);
  $('stat-battles-won').textContent=p.battlesWon;
  $('stat-spells-created').textContent=p.spellsCreated;
  $('stat-fame').textContent=p.fame;
}

/* ============ ARENA / LOADOUT ============ */
function renderArena(){
  $('arena-online').textContent=1;
  const slots=$('loadout-slots');slots.innerHTML='';
  const maxSlots=CIRCLES[G.player.circle].slots+G.player.bonusSlots;
  for(let i=0;i<maxSlots;i++){
    const d=document.createElement('div');d.className='spell-slot';
    const sid=G.equipped[i];
    if(sid){
      const sp=G.spells.find(s=>s.id===sid);
      if(sp){
        const cv=document.createElement('canvas');cv.width=34;cv.height=34;drawSpellOn(cv,sp);
        d.appendChild(cv);
        const mn=document.createElement('div');mn.className='ss-mana';mn.textContent=sp.mana+'mp';
        d.appendChild(mn);
        d.onclick=()=>{sp.equipped=false;G.equipped=G.equipped.filter(x=>x!==sid);saveGame();renderArena();};
      }
    }else{
      d.textContent='+';
      d.onclick=()=>showLoadoutPicker(i);
    }
    slots.appendChild(d);
  }
  $('loadout-hint').textContent=G.equipped.length>0?'Tap a slot to remove, or + to add':'Equip at least 1 spell to battle';
}
function showLoadoutPicker(idx){
  const avail=G.spells.filter(s=>!s.equipped);
  if(!avail.length){alert('No unequipped spells. Forge or buy one!');return;}
  let msg='Pick spell #'+(idx+1)+':\n';
  avail.forEach((s,i)=>msg+=(i+1)+'. '+s.name+' (T'+s.tier+', '+s.damage+'dmg)\n');
  const pick=prompt(msg);
  if(!pick)return;
  const n=parseInt(pick)-1;
  if(n<0||n>=avail.length)return;
  const sp=avail[n];sp.equipped=true;G.equipped.push(sp.id);
  saveGame();renderArena();
}
function findMatch(){
  if(G.equipped.length===0){alert('Equip at least 1 spell first!');return;}
  $('searching-display').style.display='flex';
  $('find-match-btn').style.display='none';
  setTimeout(()=>{startBattle();},1500);
}

/* ============ BATTLE ENGINE ============ */
let battle=null,battleLoop=null;
function getEquippedSpells(){return G.equipped.map(id=>G.spells.find(s=>s.id===id)).filter(Boolean);}
function startBattle(){
  $('searching-display').style.display='none';
  $('find-match-btn').style.display='block';
  const spells=getEquippedSpells();
  if(!spells.length){alert('Equip spells first');showScreen('arena');return;}
  battle={
    p1:{x:80,y:200,hp:100,maxhp:100,mana:G.player.manaMax,maxmana:G.player.manaMax,spells:spells,dir:0,name:G.player.name,face:G.player.face,hair:G.player.hair,hairColor:G.player.hairColor,robeColor:G.player.robeColor,element:G.player.element,casting:null,castT:0,cd:0},
    p2:{x:280,y:200,hp:100,maxhp:100,mana:100,maxmana:100,spells:genAISpells(),dir:Math.PI,casting:null,castT:0,cd:0,ai:true},
    projectiles:[],particles:[],time:60,over:false
  };
  showScreen('battle');
  drawAvatar($('battle-avatar-p1'),{face:G.player.face,hair:G.player.hair,hairColor:G.player.hairColor,robeColor:G.player.robeColor,element:G.player.element});
  $('battle-p1-name').textContent=G.player.name;
  drawAvatar($('battle-avatar-p2'),{face:1,hair:2,hairColor:'#c0c0c0',robeColor:'#3a1a2a',element:'void'});
  $('battle-p2-name').textContent='Shadow Mage';
  setupBattleControls();
  renderBattleSpellBar();
  updateBattleHUD();
  battleLoop=setInterval(battleTick,33);
}
function genAISpells(){
  const el=ELEMENT_POOL[randInt(0,5)];
  return[makeSpell('AI Bolt',ELEMENTS[el].icon,2,25,10,'Beam',[],ELEMENTS[el].color),makeSpell('AI Burst',ELEMENTS[el].icon,2,20,12,'Nova',[],ELEMENTS[el].color)];
}
function setupBattleControls(){
  const base=$('joystick-area');
  base.onpointerdown=(e)=>{e.preventDefault();battle.joyActive=true;updateJoy(e);};
  base.onpointermove=(e)=>{if(battle.joyActive)updateJoy(e);};
  base.onpointerup=()=>{battle.joyActive=false;battle.joy={x:0,y:0};resetJoyStick();};
  base.onpointerleave=()=>{battle.joyActive=false;battle.joy={x:0,y:0};resetJoyStick();};
  battle.joy={x:0,y:0};battle.joyActive=false;
}
function updateJoy(e){
  const r=e.currentTarget.getBoundingClientRect();
  const cx=r.left+r.width/2,cy=r.top+r.height/2;
  let dx=e.clientX-cx,dy=e.clientY-cy;
  const dist=Math.hypot(dx,dy),max=35;
  if(dist>max){dx=dx/dist*max;dy=dy/dist*max;}
  battle.joy={x:dx/max,y:dy/max};
  const stick=$('joystick-stick');
  stick.style.left=(30+dx)+'px';stick.style.top=(30+dy)+'px';
}
function resetJoyStick(){$('joystick-stick').style.left='30px';$('joystick-stick').style.top='30px';}
function renderBattleSpellBar(){
  const bar=$('battle-spell-bar');bar.innerHTML='';
  battle.p1.spells.forEach((sp,i)=>{
    const d=document.createElement('div');d.className='spell-slot';
    const cv=document.createElement('canvas');cv.width=34;cv.height=34;drawSpellOn(cv,sp);
    d.appendChild(cv);
    const mn=document.createElement('div');mn.className='ss-mana';mn.textContent=sp.mana+'mp';
    d.appendChild(mn);
    d.onclick=()=>openBattleCast(i);
    bar.appendChild(d);
  });
}

/* === FINAL BATTLE CHUNK START === */

/* ---------- END BATTLE ---------- */
function endBattle(winner){
  if(battle.over)return;
  battle.over=true;
  clearInterval(battleLoop);
  const p=G.player;
  const won=winner==='p1';
  if(won){
    p.battlesWon++;
    p.fame+=20;
    const gold=50,mana=100;
    p.gold+=gold;p.mana=Math.min(p.manaMax*2,p.mana+mana);
    p.totalManaEarned+=mana;
    $('result-icon').textContent='🏆';
    $('result-title').textContent='Victory!';
    $('reward-gold').textContent='+'+gold+' Gold';
    $('reward-fame').textContent='+20 Fame';
    $('reward-mana').textContent='+'+mana+' Mana';
    checkCircleUp();
  }else{
    $('result-icon').textContent='💀';
    $('result-title').textContent='Defeat';
    $('reward-gold').textContent='+10 Gold';
    $('reward-fame').textContent='+5 Fame';
    $('reward-mana').textContent='+30 Mana';
    p.gold+=10;p.fame+=5;p.mana=Math.min(p.manaMax*2,p.mana+30);
  }
  saveGame();
  showScreen('battle-result');
}

/* ---------- TEST BATTLE (dummy) ---------- */
let testBattle=null,testLoop=null;
function startTestBattle(sp){
  testBattle={spell:sp,dummy:{x:280,y:200,hp:100,maxhp:100,r:14},player:{x:80,y:200,mana:100,maxmana:100,r:12},projectiles:[],particles:[],over:false};
  $('test-spell-name').textContent=sp.name+' (T'+sp.tier+', '+sp.damage+' dmg)';
  $('dummy-hp-fill').style.width='100%';
  $('dummy-hp-text').textContent='100/100';
  $('test-mana').textContent=100;$('test-mana-max').textContent=100;
  showScreen('test-battle');
  bindTestCanvas(sp);
  testLoop=setInterval(testTick,33);
}
function bindTestCanvas(sp){
  const cv=$('test-draw-canvas');const ctx=cv.getContext('2d');
  ctx.fillStyle='#0d0b1a';ctx.fillRect(0,0,cv.width,cv.height);
  ctx.strokeStyle=sp.color;ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';
  let drawing=false,last=null;
  cv.onpointerdown=(e)=>{e.preventDefault();drawing=true;last=tpos(e,cv);};
  cv.onpointermove=(e)=>{if(!drawing)return;const p=tpos(e,cv);ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();last=p;};
  cv.onpointerup=()=>{drawing=false;if(testBattle.player.mana>=sp.mana){testBattle.player.mana-=sp.mana;fireTest(sp);}};
}
function tpos(e,cv){const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)*(cv.width/r.width),y:(e.clientY-r.top)*(cv.height/r.height)};}
function fireTest(sp){
  const pl=testBattle.player,dm=testBattle.dummy;
  const ang=Math.atan2(dm.y-pl.y,dm.x-pl.x);
  const speed=260;
  testBattle.projectiles.push({owner:'p',x:pl.x,y:pl.y,vx:Math.cos(ang)*speed,vy:Math.sin(ang)*speed,r:6,dmg:sp.damage,type:sp.type,color:sp.color,life:1.6});
}
function testTick(){
  if(!testBattle||testBattle.over)return;
  const dt=0.033,t=testBattle;
  for(let i=t.projectiles.length-1;i>=0;i--){
    const pr=t.projectiles[i];pr.x+=pr.vx*dt;pr.y+=pr.vy*dt;pr.life-=dt;
    if(pr.life<=0||pr.x<0||pr.x>360||pr.y<0||pr.y>400){t.projectiles.splice(i,1);continue;}
    const dm=t.dummy;
    if(Math.hypot(pr.x-dm.x,pr.y-dm.y)<dm.r+pr.r){
      dm.hp=clamp(dm.hp-pr.dmg,0,dm.maxhp);
      burstTest(pr.x,pr.y,pr.color,10);
      t.projectiles.splice(i,1);
      $('dummy-hp-fill').style.width=(dm.hp/dm.maxhp*100)+'%';
      $('dummy-hp-text').textContent=Math.ceil(dm.hp)+'/'+dm.maxhp;
      if(dm.hp<=0){flashTest('Dummy destroyed!');}
    }
  }
  for(let i=t.particles.length-1;i>=0;i--){const pa=t.particles[i];pa.x+=pa.vx*dt;pa.y+=pa.vy*dt;pa.life-=dt;if(pa.life<=0)t.particles.splice(i,1);}
  drawTest();
}
function burstTest(x,y,color,n){for(let i=0;i<n;i++){const a=rand(0,Math.PI*2),s=rand(30,120);testBattle.particles.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:0.4,color:color});}}
function flashTest(msg){const s=$('battle-status');if(s){s.textContent=msg;}}
function drawTest(){
  const cv=$('test-battle-canvas');const ctx=cv.getContext('2d');
  ctx.fillStyle='#0a0814';ctx.fillRect(0,0,cv.width,cv.height);
  testBattle.particles.forEach(pa=>{ctx.globalAlpha=clamp(pa.life/0.4,0,1);ctx.fillStyle=pa.color;ctx.beginPath();ctx.arc(pa.x,pa.y,3,0,Math.PI*2);ctx.fill();});
  ctx.globalAlpha=1;
  testBattle.projectiles.forEach(pr=>{ctx.fillStyle=pr.color;ctx.shadowColor=pr.color;ctx.shadowBlur=12;ctx.beginPath();ctx.arc(pr.x,pr.y,pr.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;});
  // dummy
  const dm=testBattle.dummy;ctx.fillStyle='#ff6b6b';ctx.shadowColor='#ff6b6b';ctx.shadowBlur=10;ctx.beginPath();ctx.arc(dm.x,dm.y,dm.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  // player
  const pl=testBattle.player;ctx.fillStyle='#9affc0';ctx.beginPath();ctx.arc(pl.x,pl.y,pl.r,0,Math.PI*2);ctx.fill();
  $('test-mana').textContent=Math.ceil(testBattle.player.mana);
}
function endTestBattle(){
  if(testLoop)clearInterval(testLoop);
  testBattle=null;
  showScreen('spell-canvas');
}

/* ---------- INIT ---------- */
function init(){
  if(loadGame()&&G.player){showScreen('hub');}
  else{showScreen('title');}
}
window.addEventListener('load',init);

/* ---------- CASTING (player redraws spell) ---------- */
function openBattleCast(i){
  if(!battle||battle.over)return;
  const sp=battle.p1.spells[i];
  if(!sp)return;
  if(battle.p1.mana<sp.mana){flashStatus('Not enough mana!');return;}
  if(battle.p1.cd>0){flashStatus('Spell on cooldown...');return;}
  battle.castIndex=i;
  battle.casting=true;
  const ov=$('battleSpellOverlay');ov.classList.add('show');
  const cv=$('battle-draw-canvas');const ctx=cv.getContext('2d');
  ctx.fillStyle='#0d0b1a';ctx.fillRect(0,0,cv.width,cv.height);
  ctx.strokeStyle=sp.color;ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';
  let drawing=false,last=null;
  const end=()=>{drawing=false;};
  cv.onpointerdown=(e)=>{e.preventDefault();drawing=true;last=pos(e,cv);};
  cv.onpointermove=(e)=>{if(!drawing)return;const p=pos(e,cv);ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();last=p;};
  cv.onpointerup=()=>{end();fireBattleSpell(sp);};
  cv.onpointerleave=()=>{end();fireBattleSpell(sp);};
}
function pos(e,cv){const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)*(cv.width/r.width),y:(e.clientY-r.top)*(cv.height/r.height)};}
function flashStatus(msg){const s=$('battle-status');s.textContent=msg;s.style.opacity=1;setTimeout(()=>s.style.opacity=0,900);}

function fireBattleSpell(sp){
  if(!battle||!battle.casting)return;
  battle.casting=false;
  $('battleSpellOverlay').classList.remove('show');
  battle.p1.mana-=sp.mana;
  battle.p1.cd=0.6;
  const p=battle.p1;
  const ang=Math.atan2(battle.p2.y-p.y,battle.p2.x-p.x);
  fireSpell('p1',sp,ang);
}

function fireSpell(owner,sp,ang){
  const caster=owner==='p1'?battle.p1:battle.p2;
  const color=sp.color||'#9b6dff';
  const speed=260;
  if(sp.type==='Beam'||sp.type==='Nova'||sp.type==='Chain'){
    battle.projectiles.push({owner:owner,x:caster.x,y:caster.y,vx:Math.cos(ang)*speed,vy:Math.sin(ang)*speed,r:6,dmg:sp.damage,type:sp.type,color:color,life:1.6});
  }else if(sp.type==='AoE'){
    battle.projectiles.push({owner:owner,x:caster.x+Math.cos(ang)*40,y:caster.y+Math.sin(ang)*40,vx:Math.cos(ang)*120,vy:Math.sin(ang)*120,r:14,dmg:sp.damage,type:'AoE',color:color,life:1.2});
  }else if(sp.type==='Shield'){
    caster.shield=sp.damage;burstParticles(caster.x,caster.y,color,12);
  }
}

/* ---------- AI ---------- */
function aiMove(dt){
  const a=battle.p2,p=battle.p1;
  const dx=p.x-a.x,dy=p.y-a.y,d=Math.hypot(dx,dy);
  // keep mid distance
  let mvx=0,mvy=0;
  if(d<120){mvx=-dx/d;mvy=-dy/d;}
  else if(d>220){mvx=dx/d;mvy=dy/d;}
  else{mvx=Math.sin(Date.now()/600);mvy=Math.cos(Date.now()/700);}
  a.x=clamp(a.x+mvx*1.8,20,340);
  a.y=clamp(a.y+mvy*1.8,40,360);
}
function aiCast(){
  const a=battle.p2;
  const sp=a.spells[randInt(0,a.spells.length-1)];
  if(a.mana<sp.mana)return;
  a.mana-=sp.mana;
  const ang=Math.atan2(battle.p1.y-a.y,battle.p1.x-a.x);
  fireSpell('p2',sp,ang);
}

/* ---------- DRAW BATTLE ---------- */
function drawBattle(){
  const cv=$('battle-canvas');const ctx=cv.getContext('2d');
  ctx.fillStyle='#0a0814';ctx.fillRect(0,0,cv.width,cv.height);
  // center line
  ctx.strokeStyle='rgba(155,109,255,0.15)';ctx.beginPath();ctx.moveTo(180,0);ctx.lineTo(180,400);ctx.stroke();
  // particles
  battle.particles.forEach(pa=>{ctx.globalAlpha=clamp(pa.life/0.4,0,1);ctx.fillStyle=pa.color;ctx.beginPath();ctx.arc(pa.x,pa.y,3,0,Math.PI*2);ctx.fill();});
  ctx.globalAlpha=1;
  // projectiles
  battle.projectiles.forEach(pr=>{
    ctx.fillStyle=pr.color;ctx.shadowColor=pr.color;ctx.shadowBlur=12;
    ctx.beginPath();ctx.arc(pr.x,pr.y,pr.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  });
  // players
  drawFighter(ctx,battle.p1,'#9affc0');
  drawFighter(ctx,battle.p2,'#ff6b6b');
}
function drawFighter(ctx,f,col){
  ctx.save();ctx.translate(f.x,f.y);
  ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=10;
  ctx.beginPath();ctx.arc(0,0,f.r||12,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  if(f.shield){ctx.strokeStyle=col;ctx.globalAlpha=0.5;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,(f.r||12)+6,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
  ctx.restore();
}

function updateBattleHUD(){
  $('battle-timer').textContent=Math.ceil(battle.time);
  $('p1-hp-fill').style.width=(battle.p1.hp/battle.p1.maxhp*100)+'%';
  $('p1-hp-text').textContent=Math.ceil(battle.p1.hp)+'/'+battle.p1.maxhp;
  $('p1-mp-fill').style.width=(battle.p1.mana/battle.p1.maxmana*100)+'%';
  $('p2-hp-fill').style.width=(battle.p2.hp/battle.p2.maxhp*100)+'%';
  $('p2-hp-text').textContent=Math.ceil(battle.p2.hp)+'/'+battle.p2.maxhp;
}

/* ---------- BATTLE TICK ---------- */
function battleTick(){
  if(!battle||battle.over)return;
  const dt=0.033;
  const b=battle;
  // timer
  b.time-=dt;
  if(b.time<=0){b.time=0;endBattle(b.p1.hp>=b.p2.hp?'p1':'p2');return;}
  // player movement via joystick
  const p=b.p1;
  if(b.joyActive){
    p.x=clamp(p.x+b.joy.x*2.4,20,340);
    p.y=clamp(p.y+b.joy.y*2.4,40,360);
  }
  // mana regen
  p.mana=clamp(p.mana+6*dt,0,p.maxmana);
  b.p2.mana=clamp(b.p2.mana+6*dt,0,b.p2.maxmana);
  // AI movement
  aiMove(dt);
  // projectiles
  for(let i=b.projectiles.length-1;i>=0;i--){
    const pr=b.projectiles[i];
    pr.x+=pr.vx*dt;pr.y+=pr.vy*dt;pr.life-=dt;
    if(pr.life<=0||pr.x<0||pr.x>360||pr.y<0||pr.y>400){b.projectiles.splice(i,1);continue;}
    // hit opponent
    const target=pr.owner==='p1'?b.p2:b.p1;
    if(Math.hypot(pr.x-target.x,pr.y-target.y)<target.r+pr.r){
      applyDamage(target,pr);
      if(pr.type==='Chain')chainHit(pr);
      if(pr.type!=='Beam'&&pr.type!=='Chain')b.projectiles.splice(i,1);
      else if(pr.type==='Beam'){/* beam pierces briefly */}
    }
  }
  // particles
  for(let i=b.particles.length-1;i>=0;i--){
    const pa=b.particles[i];pa.x+=pa.vx*dt;pa.y+=pa.vy*dt;pa.life-=dt;
    if(pa.life<=0)b.particles.splice(i,1);
  }
  // AI casting
  if(b.p2.cd<=0&&b.p2.mana>=10){aiCast();b.p2.cd=rand(1.4,2.6);}
  else b.p2.cd-=dt;
  // player cast cooldown
  if(p.cd>0)p.cd-=dt;
  drawBattle();
  updateBattleHUD();
}

function applyDamage(target,pr){
  target.hp=clamp(target.hp-pr.dmg,0,target.maxhp);
  burstParticles(pr.x,pr.y,pr.color,10);
  if(target.hp<=0){endBattle(pr.owner);}
}

function chainHit(pr){
  const target=pr.owner==='p1'?battle.p2:battle.p1;
  // small extra zap
  burstParticles(target.x,target.y,pr.color,6);
}

function burstParticles(x,y,color,n){
  for(let i=0;i<n;i++){
    const a=rand(0,Math.PI*2),s=rand(30,120);
    battle.particles.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:0.4,color:color});
  }
}

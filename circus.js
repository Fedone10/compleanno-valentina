/* ===========================================================
   THE AMAZING DIGITAL CIRCUS — interazioni (v2)
   =========================================================== */
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---------- CORIANDOLI ---------- */
  function launchConfetti(){
    if(reduce) return;
    const cvs = document.createElement('canvas');
    cvs.style.cssText='position:fixed;inset:0;z-index:200;pointer-events:none;width:100%;height:100%';
    document.body.appendChild(cvs);
    const ctx = cvs.getContext('2d');
    cvs.width = window.innerWidth; cvs.height = window.innerHeight;
    const colors=['#d4313a','#283b9e','#f6c233','#fbf3e3','#e79aa2','#a3121f','#f0a500'];
    const pieces = Array.from({length:130}, ()=>({
      x: Math.random()*cvs.width, y: -20 - Math.random()*220,
      w: 8+Math.random()*12, h: 5+Math.random()*8,
      color: colors[Math.floor(Math.random()*colors.length)],
      vy: 2.5+Math.random()*4, vx:(Math.random()-.5)*2.5,
      rot:Math.random()*360, vr:(Math.random()-.5)*7, op:.75+Math.random()*.25
    }));
    let frame=0;
    function draw(){
      ctx.clearRect(0,0,cvs.width,cvs.height);
      pieces.forEach(p=>{
        p.y+=p.vy; p.x+=p.vx; p.rot+=p.vr;
        if(p.y>cvs.height+20){ p.y=-20; p.x=Math.random()*cvs.width; }
        ctx.save(); ctx.globalAlpha=p.op;
        ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
        ctx.fillStyle=p.color; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
        ctx.restore();
      });
      frame++;
      if(frame<240) requestAnimationFrame(draw); else cvs.remove();
    }
    draw();
  }

  /* ---------- SIPARIO ---------- */
  const stage = document.getElementById('curtainStage');
  let opened = false;
  function openCurtain(){
    if(opened) return; opened = true;
    stage.classList.add('open');
    document.body.style.overflow = '';
    startMusic();
    setTimeout(onScroll, 60);
    setTimeout(launchConfetti, 800);
  }
  document.body.style.overflow = 'hidden';
  stage.addEventListener('click', openCurtain);
  setTimeout(openCurtain, 6000);

  /* ---------- MUSICA DI SOTTOFONDO (YouTube) ---------- */
  const VIDEO_ID = 'H-AT42lYGBg';
  let ytPlayer = null, ytReady = false, musicOn = false;
  const musicBtn = document.getElementById('musicToggle');
  function updateMusicBtn(){ if(musicBtn) musicBtn.classList.toggle('off', !musicOn); }
  (function loadYT(){
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  })();
  window.onYouTubeIframeAPIReady = function(){
    ytPlayer = new YT.Player('ytHolder', {
      videoId: VIDEO_ID,
      playerVars: { autoplay:0, controls:0, loop:1, playlist:VIDEO_ID, playsinline:1, rel:0, modestbranding:1 },
      events: { onReady: function(){ ytReady = true; if(opened) startMusic(); } }
    });
  };
  function startMusic(){
    if(!ytPlayer || !ytReady) return;
    try{ ytPlayer.unMute(); ytPlayer.setVolume(55); ytPlayer.playVideo(); musicOn = true; updateMusicBtn(); }catch(e){}
  }
  if(musicBtn){
    musicBtn.addEventListener('click', function(e){
      e.stopPropagation();
      if(!ytPlayer || !ytReady){ openCurtain(); return; }
      if(musicOn){ ytPlayer.pauseVideo(); musicOn = false; }
      else { ytPlayer.unMute(); ytPlayer.setVolume(55); ytPlayer.playVideo(); musicOn = true; }
      updateMusicBtn();
    });
  }

  /* ---------- LUCI DEL MARQUEE ---------- */
  document.querySelectorAll('.marquee').forEach(marquee=>{
    const total = 30, pad = 4;
    for(let i=0;i<total;i++){
      const b = document.createElement('div');
      b.className = 'bulb';
      b.style.animationDelay = ((i%3) * 0.36) + 's';
      const frac = i/total; let x,y;
      if(frac < 0.25){ x = pad + (frac/0.25)*(100-2*pad); y = pad; }
      else if(frac < 0.5){ x = 100-pad; y = pad + ((frac-0.25)/0.25)*(100-2*pad); }
      else if(frac < 0.75){ x = (100-pad) - ((frac-0.5)/0.25)*(100-2*pad); y = 100-pad; }
      else { x = pad; y = (100-pad) - ((frac-0.75)/0.25)*(100-2*pad); }
      b.style.left = x+'%'; b.style.top = y+'%'; b.style.transform = 'translate(-50%,-50%)';
      marquee.appendChild(b);
    }
  });

  /* ---------- STELLE AGLI ANGOLI DEI FOGLI ---------- */
  // posizioni curate: angoli + un paio di bordi, come nelle locandine
  const starSpots = [
    {t:'-22px', l:'-20px', s:54, r:-12},
    {t:'-26px', r:'-16px', s:64, r2:14},
    {b:'-20px', l:'-14px', s:46, r:8},
    {b:'-24px', r:'-22px', s:58, r2:-10},
  ];
  document.querySelectorAll('.sheet').forEach((sheet,si)=>{
    // alterna quante stelle per non appesantire
    const spots = starSpots.filter((_,k)=> (si+k)%1===0 ? true : true);
    spots.forEach((sp,k)=>{
      const st = document.createElement('i');
      st.className = 'cstar';
      st.style.width = sp.s+'px'; st.style.height = sp.s+'px';
      if(sp.t!=null) st.style.top = sp.t;
      if(sp.b!=null) st.style.bottom = sp.b;
      if(sp.l!=null) st.style.left = sp.l;
      if(sp.r!=null && typeof sp.r==='string') st.style.right = sp.r;
      const rot = (sp.r2!=null ? sp.r2 : (typeof sp.r==='number'? sp.r : 0));
      st.style.transform = `rotate(${rot}deg)`;
      sheet.appendChild(st);
    });
  });

  /* ---------- STELLE NELLA LISTA DRESS CODE ---------- */
  document.querySelectorAll('.dc-list li').forEach(li=>{
    const st = document.createElement('span');
    st.className = 'li-star';
    li.insertBefore(st, li.firstChild);
  });

  /* ---------- DECORI FLUTTUANTI (parallasse) ---------- */
  function makeDeco(host, c){
    const wrap = document.createElement('div');
    wrap.className = 'deco'; wrap.dataset.speed = c.speed;
    if(c.left!=null) wrap.style.left = c.left;
    if(c.right!=null) wrap.style.right = c.right;
    wrap.style.top = c.top;
    const inner = document.createElement('div');
    inner.className = 'deco-inner ' + (c.anim||'');
    if(c.kind==='star'){ inner.classList.add('star'); inner.style.setProperty('--s', c.size+'px'); inner.style.transform=`rotate(${c.rot||0}deg)`; }
    else if(c.kind==='eye'){ inner.classList.add('eye');
      inner.style.setProperty('--e', c.size+'px'); inner.style.setProperty('--iris', c.iris||'#2f6fd6');
      const ir=document.createElement('div'); ir.className='iris';
      const pu=document.createElement('div'); pu.className='pupil'; ir.appendChild(pu);
      inner.appendChild(ir); }
    wrap.appendChild(inner); host.appendChild(wrap);
  }
  const heroEl = document.querySelector('.hero');
  // roster completo, ordinato così i primi sono la base più calma
  const HERO_DECOS = [
    {kind:'eye',  size:112, left:'6%',  top:'15%', iris:'#2f6fd6', speed:0.10, anim:'float'},
    {kind:'star', size:58, left:'10%', top:'76%', rot:-12, speed:0.22, anim:'spin'},
    {kind:'eye',  size:90, right:'7%', top:'69%', iris:'#1f8a4d', speed:0.16, anim:'float'},
    {kind:'star', size:46, right:'11%',top:'19%', rot:8,  speed:0.18, anim:'spin-rev'},
    {kind:'star', size:38, left:'18%', top:'40%', rot:-6, speed:0.30, anim:'spin'},
    {kind:'eye',  size:76, left:'3%',  top:'47%', iris:'#7a3fc0', speed:0.26, anim:'float'},
    {kind:'star', size:42, right:'5%', top:'46%', rot:14, speed:0.28, anim:'spin-rev'},
    {kind:'eye',  size:66, right:'17%',top:'87%', iris:'#d4313a', speed:0.34, anim:'float'},
  ];
  let decos = [];
  function buildFloatingDecos(intensity){
    document.querySelectorAll('.deco').forEach(d=>d.remove());
    if(heroEl){
      const count = Math.round(2 + intensity * (HERO_DECOS.length - 2));
      HERO_DECOS.slice(0, count).forEach(c=>makeDeco(heroEl, c));
      heroEl.querySelectorAll('.deco').forEach(d=>{ d.style.opacity = (0.62 + intensity*0.38).toFixed(2); });
    }
    decos = Array.from(document.querySelectorAll('.deco'));
  }

  /* ---------- PARALLASSE ---------- */
  let caosFactor = 0.55;
  let ticking = false;
  function onScroll(){
    const y = window.scrollY;
    decos.forEach(d=>{
      const sp = parseFloat(d.dataset.speed||0) * caosFactor;
      d.style.transform = `translate3d(0, ${(y*sp).toFixed(1)}px, 0)`;
    });
    ticking = false;
  }
  function requestTick(){ if(!ticking && !reduce){ ticking=true; requestAnimationFrame(onScroll); } }
  window.addEventListener('scroll', requestTick, {passive:true});
  window.addEventListener('resize', onScroll);

  /* ---------- AGGIUNGI AL CALENDARIO ---------- */
  const calBtn = document.getElementById('calBtn');
  if(calBtn){
    function pad(n){ return String(n).padStart(2,'0'); }
    function buildICS(){
      const dt = (y,mo,d,h,mi)=> `${y}${pad(mo)}${pad(d)}T${pad(h)}${pad(mi)}00`;
      const start = dt(2026,6,20,19,30);
      const end   = dt(2026,6,21,2,0);
      const stamp = new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
      return [
        'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Digital Circus//IT','CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        'UID:digital-circus-20260620@valentina',
        'DTSTAMP:'+stamp,
        'DTSTART:'+start,
        'DTEND:'+end,
        'SUMMARY:The Amazing Digital Circus \u2014 Compleanno di Valentina',
        'LOCATION:Via Podgora 33\\, Prato',
        'DESCRIPTION:Sei sulla lista! Dress code circo magico. Il sipario si alza alle 19:30.',
        'END:VEVENT','END:VCALENDAR'
      ].join('\r\n');
    }
    calBtn.addEventListener('click', function(e){
      e.stopPropagation();
      const blob = new Blob([buildICS()], {type:'text/calendar;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'digital-circus-valentina.ics';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(url), 1500);
      const old = calBtn.textContent;
      calBtn.textContent = '\u2726 data salvata \u2726';
      setTimeout(()=>{ calBtn.textContent = old; }, 2600);
    });
  }

  /* ---------- COUNTDOWN ---------- */
  (function initCountdown(){
    const target = new Date('2026-06-20T19:30:00');
    const elD = document.getElementById('cdDays');
    const elH = document.getElementById('cdHours');
    const elM = document.getElementById('cdMins');
    const elS = document.getElementById('cdSecs');
    if(!elD) return;
    function tick(){
      const diff = target - new Date();
      if(diff <= 0){
        elD.textContent = '0'; elH.textContent = '00';
        elM.textContent = '00'; elS.textContent = '🎪';
        return;
      }
      elD.textContent = Math.floor(diff/86400000);
      elH.textContent = String(Math.floor((diff%86400000)/3600000)).padStart(2,'0');
      elM.textContent = String(Math.floor((diff%3600000)/60000)).padStart(2,'0');
      elS.textContent = String(Math.floor((diff%60000)/1000)).padStart(2,'0');
    }
    tick(); setInterval(tick, 1000);
  })();

  /* ---------- HOOK PER I TWEAKS ---------- */
  window.__applyCircusTweaks = function(t){
    t = t || {};
    const root = document.documentElement;
    root.dataset.atmo = t.atmosfera || 'classico';
    root.dataset.tendone = t.tendone || 'rombi';
    const caos = Math.max(0, Math.min(1, (t.caos == null ? 55 : t.caos) / 100));
    caosFactor = caos;
    root.style.setProperty('--caos', caos.toFixed(3));
    buildFloatingDecos(caos);
    onScroll();
  };
  // baseline così la pagina è giusta anche prima che monti il pannello
  window.__applyCircusTweaks({ atmosfera:'classico', tendone:'rombi', caos:55 });
})();

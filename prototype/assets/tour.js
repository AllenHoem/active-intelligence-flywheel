/* Active Intelligence prototype — cross-page first-run product tour.
   Spotlights what's new on each page; "Step x of y"; persists across navigation. */
(function(){
  const STEPS = [
    { page:'index', href:'index.html', target:null,
      title:'Welcome to the new Active Intelligence',
      body:'It just got proactive. Take this quick tour to see what’s new — and how it moves you from a blank canvas to a ready, grounded campaign.' },
    { page:'index', href:'index.html', target:'.cards',
      title:'Proactive campaigns',
      body:'The agent watches your telemetry and surfaces ready-to-launch plays. You no longer start from scratch — you start from an opportunity it found for you.' },
    { page:'index', href:'index.html', target:'.gchips',
      title:'Grounded, not guessed',
      body:'Every play shows the semantic-layer scores behind it. Tap “Why this?” on any card to read the reasoning and the exact scores it’s built on — no wondering if the AI made it up.' },
    { page:'index', href:'index.html', target:'#roleSwitch',
      title:'One workspace, every role',
      body:'Switch between Marketing Manager, Executive, and Analyst — the feed and the notification bell (top-right) reframe for you. Your choice follows you across the app.' },
    { page:'reports', href:'reports.html', target:'.overview',
      title:'Reports that explain themselves',
      body:'A freeform AI overview tells you what changed and why. Then drill into the Content, Campaign, and Individual layers — every number traces back to a model score.' },
    { page:'builder', href:'builder.html?id=c1', target:'.gpanel',
      title:'From insight to launch',
      body:'Open a play and the reasoning travels with it: predicted lift, model tier, and the grounding scores sit right beside the campaign you’re about to send.' },
    { page:'automations', href:'automations.html', target:'.flow',
      title:'Automations you can trust',
      body:'When the agent drafts a journey, every step is tied to a score and a model tier. Activate with confidence — then let outcomes re-ground the next play.' }
  ];
  const Y = STEPS.length;

  function pageKey(){
    let f = (location.pathname.split('/').pop() || 'index.html');
    if(f === '' || f === 'index.html') return 'index';
    return f.replace('.html','');
  }
  const ls = {
    get(k,d){ try{ const v=localStorage.getItem(k); return v===null?d:v; }catch(e){ return d; } },
    set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  };

  // inject styles
  const css = `
  .tour-block{position:fixed;inset:0;z-index:90;background:transparent}
  .tour-block.dim{background:rgba(11,16,34,.74)}
  .tour-ring{position:fixed;z-index:91;border:2px solid #fff;border-radius:12px;box-shadow:0 0 0 9999px rgba(11,16,34,.74);pointer-events:none;display:none;transition:all .25s ease}
  .tour-ring.on{animation:tourpulse 1.7s infinite}
  @keyframes tourpulse{0%,100%{box-shadow:0 0 0 9999px rgba(11,16,34,.74),0 0 0 0 rgba(124,92,255,.45)}50%{box-shadow:0 0 0 9999px rgba(11,16,34,.74),0 0 0 9px rgba(124,92,255,0)}}
  .tour-card{position:fixed;z-index:92;width:332px;max-width:calc(100vw - 24px);background:#fff;border-radius:14px;box-shadow:0 18px 50px rgba(8,15,35,.45);padding:18px 18px 14px;transition:top .22s ease,left .22s ease;display:none}
  .tour-card .meta{font-size:11px;font-weight:800;letter-spacing:.6px;color:#7c5cff;text-transform:uppercase;margin-bottom:7px}
  .tour-card h4{margin:0 0 6px;font-size:16px;color:#1b2333}
  .tour-card p{margin:0 0 13px;font-size:13.3px;line-height:1.55;color:#475569}
  .tour-dots{display:flex;gap:5px;margin-bottom:13px}
  .tour-dots i{width:7px;height:7px;border-radius:50%;background:#d7deea}
  .tour-dots i.on{background:#7c5cff}
  .tour-row{display:flex;align-items:center;gap:8px}
  .tour-row .sp{flex:1}
  .tour-btn{border:none;border-radius:8px;padding:8px 14px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}
  .tour-btn.primary{background:#2f6bed;color:#fff}.tour-btn.primary:hover{background:#1f53c4}
  .tour-btn.ghost{background:#fff;color:#33405a;border:1px solid #e6ebf2}.tour-btn.ghost:hover{background:#f3f6fb}
  .tour-skip{background:none;border:none;color:#94a3b8;font-size:12px;cursor:pointer}
  .tour-launch{position:fixed;left:16px;bottom:16px;z-index:60;background:#0c1020;color:#fff;border:1px solid #28315c;border-radius:22px;padding:9px 15px;font-size:12.5px;font-weight:700;cursor:pointer;box-shadow:0 6px 20px rgba(8,15,35,.3);display:flex;gap:7px;align-items:center}
  .tour-launch:hover{background:#161d3a}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  let block, ring, card, launch, idx=0;

  function buildEls(){
    block = document.createElement('div'); block.className='tour-block';
    ring  = document.createElement('div'); ring.className='tour-ring';
    card  = document.createElement('div'); card.className='tour-card';
    launch= document.createElement('button'); launch.className='tour-launch'; launch.innerHTML='✨ What’s new — take the tour';
    document.body.append(block, ring, card, launch);
    launch.addEventListener('click', start);
    window.addEventListener('resize', ()=>{ if(active()) place(); });
    const v = document.getElementById('view'); if(v) v.addEventListener('scroll', ()=>{ if(active() && STEPS[idx].target) place(); }, {passive:true});
  }

  function active(){ return ls.get('ai_tour_active','0')==='1'; }
  function setActive(v){ ls.set('ai_tour_active', v?'1':'0'); }

  function show(){
    block.style.display='block';
    card.style.display='block';
    const s = STEPS[idx];
    const dots = STEPS.map((_,i)=>`<i class="${i===idx?'on':''}"></i>`).join('');
    const back = idx>0 ? '<button class="tour-btn ghost" data-t="back">Back</button>' : '';
    const nextLabel = idx===Y-1 ? 'Finish' : 'Next';
    const skip = idx===Y-1 ? '' : '<button class="tour-skip" data-t="skip">Skip tour</button>';
    card.innerHTML = `<div class="meta">Step ${idx+1} of ${Y}</div>
      <h4>${s.title}</h4><p>${s.body}</p>
      <div class="tour-dots">${dots}</div>
      <div class="tour-row">${back}<span class="sp"></span>${skip}
        <button class="tour-btn primary" data-t="next">${nextLabel}</button></div>`;
    launch.style.display='none';
    requestAnimationFrame(place);
  }

  function place(){
    const s = STEPS[idx];
    const el = s.target ? document.querySelector(s.target) : null;
    const cw = card.offsetWidth || 332, ch = card.offsetHeight || 180;
    if(el){
      el.scrollIntoView({block:'center', inline:'nearest'});
      const r = el.getBoundingClientRect(); const pad=8;
      ring.style.display='block'; ring.classList.add('on');
      ring.style.left=(r.left-pad)+'px'; ring.style.top=(r.top-pad)+'px';
      ring.style.width=(r.width+pad*2)+'px'; ring.style.height=(r.height+pad*2)+'px';
      block.classList.remove('dim');
      let top = r.bottom + 12;
      if(top + ch > window.innerHeight - 10) top = Math.max(10, r.top - ch - 12);
      let left = r.left + r.width/2 - cw/2;
      left = Math.min(Math.max(12, left), window.innerWidth - cw - 12);
      card.style.top = top+'px'; card.style.left = left+'px';
    } else {
      ring.style.display='none'; ring.classList.remove('on');
      block.classList.add('dim');
      card.style.top = (window.innerHeight/2 - ch/2)+'px';
      card.style.left = (window.innerWidth/2 - cw/2)+'px';
    }
  }

  function hide(){
    block.style.display='none'; card.style.display='none';
    ring.style.display='none'; ring.classList.remove('on');
    launch.style.display='flex';
  }

  function start(){
    idx=0; setActive(true); ls.set('ai_tour_step','0'); ls.set('ai_tour_seen','1');
    if(pageKey()!=='index'){ location.href='index.html'; return; }
    show();
  }
  function finish(){ setActive(false); hide(); }

  function go(delta){
    const cur = pageKey();
    let n = idx + delta;
    if(n<0) n=0;
    if(n>Y-1){ finish(); return; }
    idx=n; ls.set('ai_tour_step', String(idx));
    if(STEPS[idx].page !== cur){ location.href = STEPS[idx].href; return; }
    show();
  }

  function render(){
    idx = parseInt(ls.get('ai_tour_step','0'),10) || 0;
    if(active() && STEPS[idx] && STEPS[idx].page === pageKey()){ show(); }
    else { hide(); }
  }

  document.addEventListener('click', e=>{
    const b = e.target.closest('[data-t]'); if(!b) return;
    const t = b.dataset.t;
    if(t==='next') go(1);
    else if(t==='back') go(-1);
    else if(t==='skip') finish();
  });

  function boot(){
    buildEls();
    // auto-start on first ever visit (lands on home)
    if(ls.get('ai_tour_seen','0')!=='1' && pageKey()==='index' && !active()){
      start(); return;
    }
    render();
  }

  // run after shell + page have rendered
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', ()=>setTimeout(boot,0));
  else setTimeout(boot,0);

  window.Tour = { start, finish };
})();

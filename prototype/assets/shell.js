/* Active Intelligence prototype — shared app shell (nav rail, topbar, role switch, notifications).
   Each page: <body data-page="home" data-title="Active Intelligence"> ... then calls Shell.mount(renderFn). */
(function(){
  const ICO = {
    home:'<svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>',
    user:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
    flow:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M9 6h6a3 3 0 0 1 3 3v6"/></svg>',
    mail:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    chart:'<svg viewBox="0 0 24 24"><path d="M4 20V4"/><path d="M4 20h16"/><rect x="7" y="11" width="3" height="6"/><rect x="12" y="7" width="3" height="10"/><rect x="17" y="13" width="3" height="4"/></svg>',
    info:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></svg>',
    gear:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>',
    bell:'<svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
    chartSmall:'<svg viewBox="0 0 24 24"><path d="M4 20V4"/><path d="M4 20h16"/><rect x="7" y="12" width="3" height="5"/><rect x="13" y="8" width="3" height="9"/></svg>'
  };
  window.SHELL_ICONS = ICO;

  const NAV = [
    {key:'home',     href:'index.html',       ico:ICO.home,  tip:'Home · Active Intelligence'},
    {key:'contacts', href:'#',                ico:ICO.user,  tip:'Contacts'},
    {key:'automations',href:'automations.html',ico:ICO.flow, tip:'Automations'},
    {key:'campaigns',href:'#',                ico:ICO.mail,  tip:'Campaigns'},
    {key:'reports',  href:'reports.html',     ico:ICO.chart, tip:'Reports'},
    {key:'about',    href:'about.html',       ico:ICO.info,  tip:'About this prototype'}
  ];

  function getRole(){ try{ return localStorage.getItem('ai_role') || 'manager'; }catch(e){ return 'manager'; } }
  function setRole(r){ try{ localStorage.setItem('ai_role', r); }catch(e){} }

  const page  = document.body.getAttribute('data-page') || 'home';
  const title = document.body.getAttribute('data-title') || 'Active Intelligence';

  const Shell = {
    role: getRole(),
    view: null,
    _render: null,
    mount(fn){ this._render = fn; if(this.view) fn(this.view, this); },
    rerender(){ if(this._render && this.view){ this.view.scrollTop = 0; this._render(this.view, this); } },
    toast(msg){
      const t = document.getElementById('toast'); if(!t) return;
      t.textContent = msg; t.classList.add('show');
      clearTimeout(this._tt); this._tt = setTimeout(()=>t.classList.remove('show'), 2600);
    }
  };
  window.Shell = Shell;

  // defensive: strip git merge-conflict markers a bad merge may have left in the served HTML
  function stripConflicts(){
    try{
      const re = /^(<{7}|={7}|>{7})/;
      const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
      const kill = []; let n;
      while((n = walk.nextNode())){ if(re.test((n.nodeValue||'').trim())) kill.push(n); }
      kill.forEach(t=>{ if(t.parentNode) t.parentNode.removeChild(t); });
    }catch(e){}
  }

  function build(){
    stripConflicts();
    const railItems = NAV.map(n=>{
      const active = n.key===page ? ' active' : '';
      const tag = n.href==='#' ? 'div' : 'a';
      const href = n.href==='#' ? '' : ` href="${n.href}"`;
      return `<${tag} class="nico${active}"${href}><span class="tip">${n.tip}</span>${n.ico}</${tag}>`;
    });
    const railTop = railItems.slice(0,5).join('');
    const railBottom = railItems.slice(5).join('');

    const wrap = document.createElement('div');
    wrap.className = 'app';
    wrap.innerHTML = `
      <nav class="rail">
        <a class="logo" href="index.html">&rsaquo;</a>
        ${railTop}
        <div class="spacer"></div>
        ${railBottom}
        <div class="nico"><span class="tip">Settings</span>${ICO.gear}</div>
      </nav>
      <div class="main">
        <div class="topbar">
          <div class="tb-title"><span class="dot"></span> <span id="viewTitle">${title}</span></div>
          <div class="tb-spacer"></div>
          <div class="roleswitch" id="roleSwitch">
            <button data-role="manager">Marketing Mgr</button>
            <button data-role="exec">Executive</button>
            <button data-role="analyst">Analyst</button>
          </div>
          <div class="trial">You have <b>9 days</b> left in your trial <button class="up">Upgrade now</button></div>
          <div class="iconbtn" id="bellBtn">${ICO.bell}<span class="badge" id="bellBadge">3</span></div>
          <div class="avatar">AH</div>
        </div>
        <div class="view" id="view"></div>
      </div>`;
    document.body.appendChild(wrap);

    const drawer = document.createElement('aside');
    drawer.className = 'drawer'; drawer.id = 'drawer';
    drawer.innerHTML = `<div class="dw-h"><h3>Proactive alerts</h3><span class="x" id="dwClose">&times;</span></div>
      <div class="dw-role" id="dwRole"></div><div class="dwlist" id="dwList"></div>`;
    const scrim = document.createElement('div'); scrim.className='scrim'; scrim.id='scrim';
    const toast = document.createElement('div'); toast.className='toast'; toast.id='toast';
    document.body.append(scrim, drawer, toast);

    Shell.view = document.getElementById('view');

    // role switch
    const rs = document.getElementById('roleSwitch');
    rs.querySelectorAll('button').forEach(b=>b.classList.toggle('on', b.dataset.role===Shell.role));
    rs.addEventListener('click', e=>{
      const b = e.target.closest('button'); if(!b) return;
      Shell.role = b.dataset.role; setRole(Shell.role);
      rs.querySelectorAll('button').forEach(x=>x.classList.toggle('on', x===b));
      renderNotes(); Shell.rerender();
      Shell.toast('View re-framed for: ' + DATA.ROLE_LABEL[Shell.role]);
    });

    // notifications
    const open = ()=>{ scrim.classList.add('open'); drawer.classList.add('open'); const bb=document.getElementById('bellBadge'); if(bb) bb.style.display='none'; };
    const close = ()=>{ scrim.classList.remove('open'); drawer.classList.remove('open'); };
    document.getElementById('bellBtn').addEventListener('click', open);
    document.getElementById('dwClose').addEventListener('click', close);
    scrim.addEventListener('click', close);

    renderNotes();
  }

  function renderNotes(){
    const role = Shell.role;
    const dr = document.getElementById('dwRole'); if(dr) dr.innerHTML = 'Tailored for: <b>'+DATA.ROLE_LABEL[role]+'</b>';
    const list = document.getElementById('dwList'); if(!list) return;
    list.innerHTML = DATA.NOTES[role].map(n=>`
      <a class="note" href="${n.href||'#'}"><div class="ni" style="background:${n.bg}">${n.ic}</div>
        <div><div class="nt">${n.t}</div><div class="nd">${n.d}</div><div class="nm">${n.m}</div></div></a>`).join('');
    const bb = document.getElementById('bellBadge'); if(bb){ bb.textContent = DATA.NOTES[role].length; bb.style.display=''; }
  }
  Shell.renderNotes = renderNotes;

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', ()=>{ build(); if(Shell._render) Shell._render(Shell.view, Shell); });
  else { build(); if(Shell._render) Shell._render(Shell.view, Shell); }
})();

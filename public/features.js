(function(){
  var L={
    id:{cap:'Salin Caption',ok:'Tersalin!',cover:'Buka Cover',again:'Unduh Link Lain',recent:'Terakhir diunduh',clear:'Hapus riwayat'},
    en:{cap:'Copy Caption',ok:'Copied!',cover:'Open Cover',again:'Download Another',recent:'Recent downloads',clear:'Clear history'},
    ms:{cap:'Salin Kapsyen',ok:'Disalin!',cover:'Buka Kover',again:'Muat Turun Lain',recent:'Muat turun terkini',clear:'Padam sejarah'},
    es:{cap:'Copiar descripci\u00f3n',ok:'\u00a1Copiado!',cover:'Abrir portada',again:'Descargar otro',recent:'Descargas recientes',clear:'Borrar historial'},
    fr:{cap:'Copier la l\u00e9gende',ok:'Copi\u00e9 !',cover:'Ouvrir la couverture',again:'T\u00e9l\u00e9charger un autre',recent:'T\u00e9l\u00e9chargements r\u00e9cents',clear:'Effacer l\u2019historique'},
    pt:{cap:'Copiar legenda',ok:'Copiado!',cover:'Abrir capa',again:'Baixar outro',recent:'Downloads recentes',clear:'Limpar hist\u00f3rico'}
  };
  var lang=(document.documentElement.lang||'id').toLowerCase().slice(0,2);
  var T=L[lang]||L.en;
  var inp=document.getElementById('tiktokUrl'),btn=document.getElementById('downloadBtn'),res=document.getElementById('result'),pasteBtn=document.getElementById('pasteBtn');
  if(!inp||!btn||!res){return;}
  var KEY='ut_recent_v1',lastSaved='';
  function isTT(s){return /https?:\/\/[^\s]*tiktok\.com\/[^\s]*/i.test(s||'');}
  function ev(n,p){try{if(typeof gtag==='function'){gtag('event',n,p||{});}}catch(e){}}
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]');}catch(e){return [];}}
  function save(a){try{localStorage.setItem(KEY,JSON.stringify(a));}catch(e){}}
  function copyText(txt,done){
    function fb(){var t=document.createElement('textarea');t.value=txt;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();try{document.execCommand('copy');}catch(e){}document.body.removeChild(t);done();}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(done,fb);}else{fb();}
  }
  var st=document.createElement('style');
  st.textContent='.ut-recent{margin-top:18px;text-align:left}.ut-recent h4{margin:0 0 8px;font-size:.85rem;font-weight:700;opacity:.7}.ut-recent .ut-item{display:block;width:100%;margin:6px 0;padding:10px 14px;text-align:left;font:inherit;font-size:.9rem;color:inherit;background:transparent;border:1px solid rgba(124,92,255,.25);border-radius:12px;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ut-recent .ut-item:hover{border-color:#7c5cff}.ut-recent .ut-clear{margin-top:4px;padding:0;font:inherit;font-size:.8rem;color:inherit;opacity:.6;background:none;border:0;text-decoration:underline;cursor:pointer}';
  document.head.appendChild(st);
  var box=document.querySelector('.tool-box')||res.parentNode;
  var recentEl=document.createElement('div');recentEl.className='ut-recent';recentEl.id='utRecent';box.appendChild(recentEl);
  function renderRecent(){
    var a=load();recentEl.innerHTML='';
    if(!a.length){recentEl.style.display='none';return;}
    recentEl.style.display='block';
    var h=document.createElement('h4');h.textContent=T.recent;recentEl.appendChild(h);
    a.forEach(function(it){
      var b=document.createElement('button');b.type='button';b.className='ut-item';
      var name=(it.t||it.u||'').toString();b.textContent=name.length>60?name.slice(0,57)+'...':name;
      b.addEventListener('click',function(){inp.value=it.u;ev('recent_click');btn.click();window.scrollTo({top:0,behavior:'smooth'});});
      recentEl.appendChild(b);
    });
    var c=document.createElement('button');c.type='button';c.className='ut-clear';c.textContent=T.clear;
    c.addEventListener('click',function(){save([]);renderRecent();});
    recentEl.appendChild(c);
  }
  function remember(){
    var u=(inp.value||'').trim();if(!isTT(u)||u===lastSaved){return;}
    lastSaved=u;var te=document.getElementById('videoTitle');var t=te?te.textContent.trim():'';
    var a=load().filter(function(x){return x.u!==u;});a.unshift({u:u,t:t||u});save(a.slice(0,6));renderRecent();
  }
  function addButtons(){
    var bar=res.querySelector('.result-buttons');if(!bar||document.getElementById('utCap')){return;}
    var cap=document.createElement('button');cap.type='button';cap.id='utCap';cap.className='btn-result copy-btn';cap.innerHTML='<span>'+T.cap+'</span>';
    cap.addEventListener('click',function(){
      var te=document.getElementById('videoTitle');var txt=te?te.textContent.trim():'';
      copyText(txt,function(){var s=cap.querySelector('span');s.textContent=T.ok;ev('copy_caption');setTimeout(function(){s.textContent=T.cap;},1600);});
    });
    var cv=document.createElement('a');cv.id='utCover';cv.className='btn-result tertiary';cv.target='_blank';cv.rel='noopener noreferrer';cv.innerHTML='<span>'+T.cover+'</span>';
    cv.addEventListener('click',function(){var img=document.getElementById('cover');if(img&&img.src){cv.href=img.src;}ev('open_cover');});
    var again=document.createElement('button');again.type='button';again.id='utAgain';again.className='btn-result copy-btn';again.innerHTML='<span>'+T.again+'</span>';
    again.addEventListener('click',function(){inp.value='';inp.focus();window.scrollTo({top:0,behavior:'smooth'});ev('download_another');});
    bar.appendChild(cap);bar.appendChild(cv);bar.appendChild(again);
  }
  function check(){
    if(!res.classList.contains('hidden')){
      addButtons();
      var img=document.getElementById('cover');var cv=document.getElementById('utCover');if(cv&&img&&img.src){cv.href=img.src;}
      remember();
    }
  }
  new MutationObserver(check).observe(res,{attributes:true,attributeFilter:['class']});
  inp.addEventListener('paste',function(e){
    var txt=(e.clipboardData||window.clipboardData).getData('text');
    if(isTT(txt)){setTimeout(function(){if(!btn.disabled){ev('auto_start_paste');btn.click();}},300);}
  });
  if(pasteBtn){pasteBtn.addEventListener('click',function(){
    setTimeout(function(){if(isTT(inp.value)&&!btn.disabled&&res.classList.contains('hidden')){ev('auto_start_pastebtn');btn.click();}},800);
  });}
  renderRecent();check();
})();

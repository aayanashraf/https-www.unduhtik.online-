(function(){
  var L={
    id:{t1:'Tanpa pop-up',t2:'Tanpa daftar',t3:'Video tidak disimpan',inst:'Pasang Aplikasi \u00b7 Bagikan langsung dari TikTok',tag:'Salin Hashtag',ok:'Tersalin!',ios:'Tips iPhone: setelah video terbuka, ketuk ikon Bagikan lalu pilih \u201cSimpan Video\u201d atau \u201cSimpan ke File\u201d.'},
    en:{t1:'No pop-ups',t2:'No sign-up',t3:'Videos not stored',inst:'Install App \u00b7 Share straight from TikTok',tag:'Copy Hashtags',ok:'Copied!',ios:'iPhone tip: once the video opens, tap the Share icon and choose \u201cSave Video\u201d or \u201cSave to Files\u201d.'},
    ms:{t1:'Tiada pop-up',t2:'Tanpa daftar',t3:'Video tidak disimpan',inst:'Pasang Aplikasi \u00b7 Kongsi terus dari TikTok',tag:'Salin Hashtag',ok:'Disalin!',ios:'Petua iPhone: selepas video dibuka, ketik ikon Kongsi dan pilih \u201cSimpan Video\u201d atau \u201cSimpan ke Fail\u201d.'},
    es:{t1:'Sin ventanas emergentes',t2:'Sin registro',t3:'No guardamos videos',inst:'Instalar app \u00b7 Comparte directo desde TikTok',tag:'Copiar hashtags',ok:'\u00a1Copiado!',ios:'Consejo para iPhone: cuando se abra el video, toca Compartir y elige \u201cGuardar video\u201d o \u201cGuardar en Archivos\u201d.'},
    fr:{t1:'Sans pop-up',t2:'Sans inscription',t3:'Vid\u00e9os non stock\u00e9es',inst:'Installer l\u2019app \u00b7 Partagez depuis TikTok',tag:'Copier les hashtags',ok:'Copi\u00e9 !',ios:'Astuce iPhone : une fois la vid\u00e9o ouverte, touchez Partager puis \u00ab Enregistrer la vid\u00e9o \u00bb ou \u00ab Enregistrer dans Fichiers \u00bb.'},
    pt:{t1:'Sem pop-ups',t2:'Sem cadastro',t3:'V\u00eddeos n\u00e3o armazenados',inst:'Instalar app \u00b7 Compartilhe direto do TikTok',tag:'Copiar hashtags',ok:'Copiado!',ios:'Dica para iPhone: com o v\u00eddeo aberto, toque em Compartilhar e escolha \u201cSalvar v\u00eddeo\u201d ou \u201cSalvar em Arquivos\u201d.'}
  };
  var lang=(document.documentElement.lang||'id').toLowerCase().slice(0,2);
  var T=L[lang]||L.en;
  var box=document.querySelector('.tool-box'),res=document.getElementById('result');
  if(!box||!res){return;}
  function ev(n,p){try{if(typeof gtag==='function'){gtag('event',n,p||{});}}catch(e){}}
  var st=document.createElement('style');
  st.textContent='.ut-trust{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;list-style:none;margin:-14px auto 22px;padding:0}.ut-trust li{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;font-size:.86rem;font-weight:600;color:#fff;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);border-radius:999px;backdrop-filter:blur(6px)}.ut-trust li::before{content:"\\2713";font-weight:800;color:#7df5c0}.ut-install{display:none;align-items:center;justify-content:center;margin:0 auto 22px;padding:11px 20px;font:inherit;font-size:.92rem;font-weight:700;color:#14122b;background:#fff;border:0;border-radius:999px;cursor:pointer;box-shadow:0 8px 22px rgba(10,8,50,.3)}.ut-install:hover{transform:translateY(-1px)}.ut-ios{margin:14px 0 0;padding:12px 14px;font-size:.88rem;line-height:1.5;text-align:left;color:inherit;background:rgba(124,92,255,.10);border:1px solid rgba(124,92,255,.28);border-radius:12px}';
  document.head.appendChild(st);
  var strip=document.createElement('ul');strip.className='ut-trust';
  [T.t1,T.t2,T.t3].forEach(function(s){var li=document.createElement('li');li.textContent=s;strip.appendChild(li);});
  var sub=document.querySelector('.hero-subtitle');
  if(sub&&sub.parentNode){sub.parentNode.insertBefore(strip,sub.nextSibling);}else{box.parentNode.insertBefore(strip,box);}
  var standalone=(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches)||window.navigator.standalone;
  var ib=document.createElement('button');ib.type='button';ib.className='ut-install';ib.textContent=T.inst;
  strip.parentNode.insertBefore(ib,strip.nextSibling);
  var dp=null;
  if(!standalone){
    window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();dp=e;ib.style.display='inline-flex';ev('install_prompt_shown');});
    ib.addEventListener('click',function(){if(!dp){return;}ev('install_click');dp.prompt();dp.userChoice.then(function(){dp=null;ib.style.display='none';});});
    window.addEventListener('appinstalled',function(){ib.style.display='none';ev('app_installed');});
  }
  var isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  function copyText(txt,done){
    function fb(){var t=document.createElement('textarea');t.value=txt;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();try{document.execCommand('copy');}catch(e){}document.body.removeChild(t);done();}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(done,fb);}else{fb();}
  }
  function tags(){
    var te=document.getElementById('videoTitle');var s=te?te.textContent:'';
    var m=null;try{m=s.match(new RegExp('#[\\p{L}\\p{N}_]+','gu'));}catch(e){m=s.match(/#\w+/g);}
    return m?Array.from(new Set(m)):[];
  }
  function update(){
    if(res.classList.contains('hidden')){return;}
    var bar=res.querySelector('.result-buttons');
    if(bar){
      var tb=document.getElementById('utTags');var list=tags();
      if(list.length&&!tb){
        tb=document.createElement('button');tb.type='button';tb.id='utTags';tb.className='btn-result copy-btn';tb.innerHTML='<span>'+T.tag+'</span>';
        tb.addEventListener('click',function(){
          var l=tags();copyText(l.join(' '),function(){var sp=tb.querySelector('span');sp.textContent=T.ok;ev('copy_hashtags',{count:l.length});setTimeout(function(){sp.textContent=T.tag;},1600);});
        });
        bar.appendChild(tb);
      }
      if(tb){tb.style.display=list.length?'':'none';}
    }
    if(isIOS&&!document.getElementById('utIos')){
      var tip=document.createElement('p');tip.id='utIos';tip.className='ut-ios';tip.textContent=T.ios;
      var b=res.querySelector('.result-buttons');if(b&&b.parentNode){b.parentNode.insertBefore(tip,b.nextSibling);}else{res.appendChild(tip);}
    }
  }
  new MutationObserver(update).observe(res,{attributes:true,attributeFilter:['class']});
  var te0=document.getElementById('videoTitle');if(te0){new MutationObserver(update).observe(te0,{childList:true,characterData:true,subtree:true});}
  update();
})();

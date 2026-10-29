(function(){
  var inp=document.getElementById('tiktokUrl'),btn=document.getElementById('downloadBtn'),res=document.getElementById('result'),box=document.querySelector('.tool-box');
  if(!inp||!btn||!res||!box){return;}
  var lang=(document.documentElement.lang||'id').toLowerCase().slice(0,2);
  function ev(n,p){try{if(typeof gtag==='function'){gtag('event',n,p||{});}}catch(e){}}
  var LG={
    id:{p:'/',q:'Tampilkan dalam Bahasa Indonesia?',y:'Ya'},
    en:{p:'/en/',q:'View this site in English?',y:'Yes'},
    es:{p:'/es/',q:'\u00bfVer el sitio en espa\u00f1ol?',y:'S\u00ed'},
    fr:{p:'/fr/',q:'Voir le site en fran\u00e7ais ?',y:'Oui'},
    ms:{p:'/ms/',q:'Papar dalam Bahasa Melayu?',y:'Ya'},
    pt:{p:'/pt/',q:'Ver o site em portugu\u00eas?',y:'Sim'},
    tr:{p:'/tr/',q:'Siteyi T\u00fcrk\u00e7e g\u00f6r\u00fcnt\u00fcle?',y:'Evet'},
    vi:{p:'/vi/',q:'Xem trang b\u1eb1ng ti\u1ebfng Vi\u1ec7t?',y:'C\u00f3'},
    th:{p:'/th/',q:'\u0e14\u0e39\u0e40\u0e27\u0e47\u0e1a\u0e44\u0e0b\u0e15\u0e4c\u0e40\u0e1b\u0e47\u0e19\u0e20\u0e32\u0e29\u0e32\u0e44\u0e17\u0e22?',y:'\u0e43\u0e0a\u0e48'},
    hi:{p:'/hi/',q:'\u0938\u093e\u0907\u091f \u0939\u093f\u0928\u094d\u0926\u0940 \u092e\u0947\u0902 \u0926\u0947\u0916\u0947\u0902?',y:'\u0939\u093e\u0901'},
    ar:{p:'/ar/',q:'\u0639\u0631\u0636 \u0627\u0644\u0645\u0648\u0642\u0639 \u0628\u0627\u0644\u0639\u0631\u0628\u064a\u0629\u061f',y:'\u0646\u0639\u0645'}
  };
  var TX={
    id:{wa:'Kirim ke WhatsApp',chip:'Link TikTok di clipboard \u00b7 Unduh sekarang'},
    en:{wa:'Share on WhatsApp',chip:'TikTok link in clipboard \u00b7 Download now'},
    ms:{wa:'Kongsi di WhatsApp',chip:'Pautan TikTok dalam papan klip \u00b7 Muat turun'},
    es:{wa:'Enviar por WhatsApp',chip:'Enlace de TikTok en el portapapeles \u00b7 Descargar'},
    fr:{wa:'Partager sur WhatsApp',chip:'Lien TikTok dans le presse-papiers \u00b7 T\u00e9l\u00e9charger'},
    pt:{wa:'Enviar no WhatsApp',chip:'Link do TikTok na \u00e1rea de transfer\u00eancia \u00b7 Baixar'}
  };
  var T=TX[lang]||TX.en;
  var st=document.createElement('style');
  st.textContent='.ut-langbar{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px;padding:10px 16px;font-size:.92rem;font-weight:600;color:#fff;background:linear-gradient(135deg,#3b1d8f,#1d4ed8)}.ut-langbar a{padding:6px 16px;font-weight:700;color:#14122b;background:#fff;border-radius:999px;text-decoration:none}.ut-langbar button{padding:2px 8px;font-size:1.3rem;line-height:1;color:#fff;background:transparent;border:0;cursor:pointer;opacity:.8}.ut-chip{display:none;width:100%;margin:0 0 12px;padding:12px 16px;font:inherit;font-size:.92rem;font-weight:700;color:#7c5cff;background:rgba(124,92,255,.10);border:2px dashed rgba(124,92,255,.45);border-radius:14px;cursor:pointer}.ut-chip:hover{background:rgba(124,92,255,.18)}';
  document.head.appendChild(st);
  try{
    var nav=((navigator.languages&&navigator.languages[0])||navigator.language||'').toLowerCase().slice(0,2);
    if(nav==='in'){nav='id';}
    if(LG[nav]&&nav!==lang&&!localStorage.getItem('ut_lang_dis')){
      var bar=document.createElement('div');bar.className='ut-langbar';if(nav==='ar'){bar.dir='rtl';}
      var sp=document.createElement('span');sp.textContent=LG[nav].q;
      var a=document.createElement('a');a.href=LG[nav].p;a.textContent=LG[nav].y;
      a.addEventListener('click',function(){ev('lang_suggest_accept',{to:nav});});
      var x=document.createElement('button');x.type='button';x.setAttribute('aria-label','Close');x.textContent='\u00d7';
      x.addEventListener('click',function(){try{localStorage.setItem('ut_lang_dis','1');}catch(e){}bar.remove();ev('lang_suggest_dismiss');});
      bar.appendChild(sp);bar.appendChild(a);bar.appendChild(x);
      document.body.insertBefore(bar,document.body.firstChild);
    }
  }catch(e){}
  var RX=/https?:\/\/[^\s"'<>]*tiktok\.com[^\s"'<>]*/i;
  function cu(s){
    var m=(s||'').match(RX);if(!m){return '';}
    var u=m[0].replace(/[).,;!?]+$/,'');
    try{var o=new URL(u);o.search='';o.hash='';u=o.toString();}catch(e){}
    return u;
  }
  function clean(){var u=cu(inp.value);if(u&&u!==inp.value){inp.value=u;ev('link_cleaned');}}
  inp.addEventListener('paste',function(){setTimeout(clean,0);});
  inp.addEventListener('keydown',function(e){if(e.key==='Enter'){clean();}},true);
  btn.addEventListener('click',clean,true);
  function addWA(){
    if(res.classList.contains('hidden')){return;}
    var b=res.querySelector('.result-buttons');if(!b){return;}
    var w=document.getElementById('utWa');
    if(!w){
      w=document.createElement('a');w.id='utWa';w.className='btn-result tertiary';w.target='_blank';w.rel='noopener noreferrer';
      w.innerHTML='<span>'+T.wa+'</span>';
      w.addEventListener('click',function(){ev('share_whatsapp');});
      b.appendChild(w);
    }
    var d=document.getElementById('downloadNoWm');var h=(d&&d.href)||'';
    var link=(h.indexOf('http')===0)?h:(inp.value||'').trim();
    w.href='https://wa.me/?text='+encodeURIComponent(link+'\n\n'+location.origin);
  }
  new MutationObserver(addWA).observe(res,{attributes:true,attributeFilter:['class']});
  addWA();
  var chip=document.createElement('button');chip.type='button';chip.className='ut-chip';
  box.insertBefore(chip,box.firstChild);
  var pending='';
  chip.addEventListener('click',function(){
    if(!pending){return;}
    inp.value=pending;clean();ev('clipboard_chip_click');chip.style.display='none';btn.click();
  });
  function peek(){
    try{
      if(!navigator.clipboard||!navigator.clipboard.readText||!navigator.permissions){return;}
      if(document.visibilityState!=='visible'){return;}
      navigator.permissions.query({name:'clipboard-read'}).then(function(p){
        if(p.state!=='granted'){return;}
        return navigator.clipboard.readText().then(function(txt){
          var u=cu(txt);
          if(u&&!(inp.value||'').trim()&&res.classList.contains('hidden')){
            pending=u;chip.textContent=T.chip;chip.style.display='block';
          }else{chip.style.display='none';}
        });
      }).catch(function(){});
    }catch(e){}
  }
  window.addEventListener('focus',peek);
  document.addEventListener('visibilitychange',peek);
  inp.addEventListener('input',function(){if((inp.value||'').trim()){chip.style.display='none';}});
  setTimeout(peek,600);
})();

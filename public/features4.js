(function(){
  var inp=document.getElementById('tiktokUrl'),btn=document.getElementById('downloadBtn'),box=document.querySelector('.tool-box');
  if(!inp||!btn||!box){return;}
  var lang=(document.documentElement.lang||'id').toLowerCase().slice(0,2);
  function ev(n,p){try{if(typeof gtag==='function'){gtag('event',n,p||{});}}catch(e){}}
  var TX={
    id:{h:'Pengguna PC: unduh lebih cepat',d:'Seret tombol ini ke bookmark bar browser Anda. Saat berada di halaman video TikTok, klik tombolnya dan unduhan langsung dimulai.',b:'Unduh dengan UnduhTik'},
    en:{h:'On PC? Download even faster',d:'Drag this button to your browser bookmarks bar. When you are on a TikTok video page, click it and the download starts right away.',b:'Download with UnduhTik'},
    ms:{h:'Pengguna PC: muat turun lebih pantas',d:'Seret butang ini ke bar penanda buku pelayar anda. Apabila berada di halaman video TikTok, klik butang itu dan muat turun bermula serta-merta.',b:'Muat turun dengan UnduhTik'},
    es:{h:'En PC: descarga m\u00e1s r\u00e1pido',d:'Arrastra este bot\u00f3n a la barra de marcadores. En la p\u00e1gina de un video de TikTok, haz clic y la descarga empieza al instante.',b:'Descargar con UnduhTik'},
    fr:{h:'Sur PC : t\u00e9l\u00e9chargez plus vite',d:'Faites glisser ce bouton vers la barre de favoris. Sur la page d\u2019une vid\u00e9o TikTok, cliquez dessus et le t\u00e9l\u00e9chargement d\u00e9marre aussit\u00f4t.',b:'T\u00e9l\u00e9charger avec UnduhTik'},
    pt:{h:'No PC: baixe mais r\u00e1pido',d:'Arraste este bot\u00e3o para a barra de favoritos. Na p\u00e1gina de um v\u00eddeo do TikTok, clique nele e o download come\u00e7a na hora.',b:'Baixar com UnduhTik'}
  };
  var T=TX[lang]||TX.en;
  var RX=/https?:\/\/[^\s"'<>]*tiktok\.com[^\s"'<>]*/i;
  function find(s){var m=(s||'').match(RX);return m?m[0].replace(/[).,;!?]+$/,''):'';}
  function start(u,src){
    if(!u||btn.disabled){return;}
    inp.value=u;
    try{inp.dispatchEvent(new Event('input',{bubbles:true}));}catch(e){}
    ev(src);
    setTimeout(function(){btn.click();},150);
    try{window.scrollTo({top:0,behavior:'smooth'});}catch(e){}
  }
  document.addEventListener('paste',function(e){
    var t=e.target;
    if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.tagName==='SELECT'||t.isContentEditable)){return;}
    var txt=(e.clipboardData||window.clipboardData).getData('text');
    var u=find(txt);
    if(u){e.preventDefault();start(u,'global_paste');}
  });
  var hl='rgba(124,92,255,.65)';
  box.addEventListener('dragover',function(e){e.preventDefault();box.style.outline='3px dashed '+hl;box.style.outlineOffset='4px';});
  box.addEventListener('dragleave',function(){box.style.outline='';box.style.outlineOffset='';});
  box.addEventListener('drop',function(e){
    e.preventDefault();box.style.outline='';box.style.outlineOffset='';
    var dt=e.dataTransfer;if(!dt){return;}
    var u=find(dt.getData('text/uri-list'))||find(dt.getData('text/plain'))||find(dt.getData('text'));
    if(u){start(u,'drag_drop');}
  });
  var fine=false;try{fine=window.matchMedia('(pointer: fine)').matches&&!('ontouchstart' in window);}catch(e){}
  if(fine){
    var st=document.createElement('style');
    st.textContent='.ut-bm{max-width:800px;margin:18px auto 0;padding:16px 20px;text-align:center;font-size:.92rem;line-height:1.55;color:inherit;background:rgba(124,92,255,.08);border:1px solid rgba(124,92,255,.25);border-radius:18px}.ut-bm h4{margin:0 0 6px;font-size:1rem;font-weight:800}.ut-bm p{margin:0 0 12px;opacity:.8}.ut-bm a{display:inline-block;padding:10px 20px;font-weight:800;color:#fff;background:linear-gradient(135deg,#7c5cff,#2f7bff);border-radius:999px;text-decoration:none;cursor:grab;box-shadow:0 8px 20px rgba(76,56,220,.35)}.ut-bm a:active{cursor:grabbing}';
    document.head.appendChild(st);
    var card=document.createElement('div');card.className='ut-bm';
    var h=document.createElement('h4');h.textContent=T.h;
    var p=document.createElement('p');p.textContent=T.d;
    var a=document.createElement('a');a.textContent='\u2b07 '+T.b;
    var js="javascript:(function(){window.open('"+location.origin+"/?url='+encodeURIComponent(location.href),'_blank');})();";
    a.setAttribute('href',js);
    a.addEventListener('click',function(e){e.preventDefault();ev('bookmarklet_demo_click');});
    card.appendChild(h);card.appendChild(p);card.appendChild(a);
    box.parentNode.insertBefore(card,box.nextSibling);
  }
})();

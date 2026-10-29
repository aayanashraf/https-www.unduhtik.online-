(function(){
  if('serviceWorker' in navigator){
    window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){});});
  }
  try{
    var q=new URLSearchParams(location.search);
    var raw=(q.get('url')||'')+' '+(q.get('text')||'')+' '+(q.get('title')||'');
    var m=raw.match(/https?:\/\/[^\s"'<>]*tiktok\.com[^\s"'<>]*/i);
    if(!m){return;}
    var link=m[0];
    function go(){
      var inp=document.getElementById('tiktokUrl');
      var btn=document.getElementById('downloadBtn');
      if(!inp||!btn){return;}
      inp.value=link;
      inp.dispatchEvent(new Event('input',{bubbles:true}));
      try{ if(typeof gtag==='function'){gtag('event','share_target_use');} }catch(e){}
      try{ history.replaceState(null,'',location.pathname); }catch(e){}
      setTimeout(function(){btn.click();},400);
    }
    if(document.readyState==='complete'){ setTimeout(go,300); }
    else{ window.addEventListener('load',function(){setTimeout(go,300);}); }
  }catch(e){}
})();

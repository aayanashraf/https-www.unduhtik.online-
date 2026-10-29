self.addEventListener('install',function(){self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET'||e.request.mode!=='navigate'){return;}
  e.respondWith(fetch(e.request).catch(function(){
    return new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline</title><body style="font-family:system-ui;text-align:center;padding:48px"><h2>Tidak ada koneksi internet</h2><p>Periksa koneksi Anda lalu coba lagi.</p></body>',{headers:{'Content-Type':'text/html; charset=utf-8'}});
  }));
});

/* Service worker: сеть в приоритете (с таймаутом 3 с), без сети отдаёт из кэша. */
var V="uchyoba-v4";
var SHELL=["./","index.html","manifest.json","icon-192.png","icon-512.png","content/library.json","bg/porsche.jpg","bg/skull.jpg","bg/lake.jpg","bg/mountains.jpg","bg/fir.jpg","bg/road.jpg","bg/city.jpg","bg/blue.jpg","bg/spider.jpg","bg/porsche-t.jpg","bg/skull-t.jpg","bg/lake-t.jpg","bg/mountains-t.jpg","bg/fir-t.jpg","bg/road-t.jpg","bg/city-t.jpg","bg/blue-t.jpg","bg/spider-t.jpg"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(V).then(function(c){return Promise.all(SHELL.map(function(u){return c.add(u).catch(function(){})}))}).then(function(){return self.skipWaiting()}));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
function timeout(ms){return new Promise(function(_,rej){setTimeout(function(){rej(new Error("timeout"))},ms)})}
self.addEventListener("fetch",function(e){
  var r=e.request;if(r.method!=="GET")return;
  var u=new URL(r.url);if(u.origin!==location.origin)return;
  e.respondWith(
    Promise.race([fetch(r.url,{cache:"no-cache",credentials:"same-origin"}),timeout(3000)]).then(function(res){
      if(res&&res.ok){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)})}
      return res;
    }).catch(function(){
      return caches.match(r,{ignoreSearch:true}).then(function(m){return m||caches.match("index.html")});
    })
  );
});

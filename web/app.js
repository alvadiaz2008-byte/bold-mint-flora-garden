(function(){
  const STORE_KEY='atlas-tactico-store-v1';
  const app=document.querySelector('#app');
  async function boot(){
    try{
      const res=await fetch('web/catalog.json',{cache:'no-store'});
      if(res.ok){
        const data=await res.json();
        if(Array.isArray(data)&&data.length){
          localStorage.setItem(STORE_KEY, JSON.stringify(data));
        }
      }
    }catch(e){}
    // Load the real app from the previous good version hosted as raw on github
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/gh/alvadiaz2008-byte/bold-mint-flora-garden@fe6d9b176af50f8546c6597d913a090ddcbebb69/web/app.js';
    s.onload=function(){ /* app self-inits */ };
    document.body.appendChild(s);
  }
  if(app) app.innerHTML='<div class="wrap" style="padding:3rem 1rem;color:#ecebe3"><p>ATLAS TÁCTICO</p><h1>Cargando catálogo…</h1></div>';
  boot();
})();

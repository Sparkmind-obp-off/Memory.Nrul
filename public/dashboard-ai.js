const nav=document.querySelector('nav'),app=document.querySelector('#app')
const chatNav=nav?.querySelector('[data-view="chat"]')
if(nav&&app&&chatNav){chatNav.onclick=async()=>{document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('active',x===chatNav));app.innerHTML='<div id="ai-chat"></div>';await import('/ai-chat.js')}}

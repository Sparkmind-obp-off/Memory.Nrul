const app = document.querySelector('#app')
const title = document.querySelector('#title')
const subtitle = document.querySelector('#subtitle')

const esc = (s) => String(s).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]))

async function load(path) { const r = await fetch(path); return r.json() }

async function render(view='overview') {
  document.querySelectorAll('.nav').forEach(b => b.classList.toggle('active', b.dataset.view === view))
  if (view === 'overview') {
    title.textContent = 'Keep the conversation alive.'
    subtitle.textContent = 'Context yang relevan dibawa ke sesi berikutnya tanpa membuang privacy.'
    const c = await load('/api/context')
    app.innerHTML = `<div class="grid"><article class="hero"><p class="eyebrow">CURRENT CONTEXT</p><h2>${esc(c.currentContext)}</h2><p>${esc(c.sharedUnderstanding)}</p><div class="flow"><span>Conversation</span><b>→</b><span>Extract</span><b>→</b><span>Privacy</span><b>→</b><span>Memory</span><b>→</b><span>AI</span></div></article><article class="card"><h3>Current state</h3><strong>${esc(c.currentState)}</strong><p class="muted">${c.domains.length} memory domains · ${c.privacy.length} privacy classes</p></article></div><div class="grid"><article class="card"><h3>Pending</h3><ul>${c.pending.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></article><article class="card"><h3>Next</h3><ul>${c.next.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></article></div>`
  } else if (view === 'memories') {
    title.textContent = 'Memory records'
    subtitle.textContent = 'Satu tempat untuk context, keputusan, state, dan handoff.'
    const data = await load('/api/memories')
    app.innerHTML = `<div class="toolbar"><input id="q" placeholder="Cari memory…" /><select id="domain"><option value="all">Semua domain</option><option>Conversation</option><option>Project</option><option>Privacy</option></select><button id="search">Search</button></div><div id="list" class="cards">${data.memories.map(card).join('')}</div>`
    document.querySelector('#search').onclick = async () => { const q=encodeURIComponent(document.querySelector('#q').value); const d=encodeURIComponent(document.querySelector('#domain').value); const x=await load(`/api/memories?q=${q}&domain=${d}`); document.querySelector('#list').innerHTML=x.memories.map(card).join('') }
  } else if (view === 'context') {
    title.textContent = 'Context reconstruction'
    subtitle.textContent = 'AI membaca memory, memeriksa akses, lalu menyusun konteks yang bisa dilanjutkan.'
    app.innerHTML = `<article class="card"><div class="pipeline"><div>1. READ MEMORY</div><div>2. ACCESS CHECK</div><div>3. VERIFY STATE</div><div>4. RECONSTRUCT</div><div>5. CONTINUE</div></div><h3>Context package</h3><pre id="ctx">Loading…</pre></article>`
    const c=await load('/api/context'); document.querySelector('#ctx').textContent=JSON.stringify(c,null,2)
  } else {
    title.textContent = 'System architecture'
    subtitle.textContent = 'Full-stack foundation: UI → API → memory → privacy → retrieval → AI context.'
    app.innerHTML = `<article class="card"><div class="architecture"><span>USER / AI</span><i>↓</i><span>CONTEXT EXTRACTION</span><i>↓</i><span>PRIVACY ROUTER</span><div class="split"><span>PUBLIC MEMORY</span><span>PRIVATE MEMORY</span></div><i>↓</i><span>AUTHORIZED CONTEXT MERGER</span><i>↓</i><span>RECONSTRUCTION + VERIFY</span><i>↓</i><span>CONTINUE / EXECUTE / CHECKPOINT</span></div></article>`
  }
}
function card(m){return `<article class="memory"><div><span class="tag">${esc(m.domain)}</span><span class="privacy ${m.privacy.toLowerCase()}">${esc(m.privacy)}</span></div><h3>${esc(m.title)}</h3><p>${esc(m.summary)}</p><small>${esc(m.updatedAt)}</small></article>`}
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>render(b.dataset.view))
render()

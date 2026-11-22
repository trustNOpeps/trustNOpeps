import {TEMPLATES,makeDecision,makeBlankDecision,calculate,compareRankings,stressTest,importDecision,uid,clamp,safeText,weightTotal} from './core.js';

const STORAGE='elsewhere.decision.v1';
const LIBRARY_STORAGE='elsewhere.library.v2';
const MAX_DECISIONS=30;
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const esc=(v)=>String(v??'').replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const oneDecimal=(value)=>Number(value).toFixed(1);
const percent=(value)=>`${oneDecimal(value)}%`;
const tinyDate=(v)=>{try{return new Date(v).toLocaleDateString('en',{month:'short',day:'numeric'})}catch{return 'Saved'}};
const validDecision=(x)=>Boolean(x&&typeof x==='object'&&typeof x.id==='string'&&Array.isArray(x.criteria)&&x.criteria.length>=1&&x.criteria.length<=12&&Array.isArray(x.options)&&x.options.length>=2&&x.options.length<=12&&typeof x.title==='string');
let state;
let library=[];
try{
  const rawList=JSON.parse(localStorage.getItem(LIBRARY_STORAGE)||'null');
  if(rawList&&Array.isArray(rawList.items)&&rawList.items.length){
    library=rawList.items.filter(validDecision).slice(0,MAX_DECISIONS);
    state=library.find(d=>d.id===rawList.currentId)||library[0];
  }
  if(!state){
    const legacy=JSON.parse(localStorage.getItem(STORAGE)||'null');
    state=validDecision(legacy)?legacy:makeDecision();
    library=[state];
  }
}catch{state=makeDecision();library=[state]}
let currentView='overview';
let mobileSelected=null;
let toastTimer;
let dialogAction=null;
function save(){
  state.updatedAt=new Date().toISOString();
  const idx=library.findIndex(d=>d.id===state.id);
  if(idx>=0) library[idx]=state; else if(library.length<MAX_DECISIONS) library.unshift(state);
  try{
    localStorage.setItem(LIBRARY_STORAGE,JSON.stringify({currentId:state.id,items:library}));
    localStorage.setItem(STORAGE,JSON.stringify(state)); // backward-compatible backup
    updateLibraryCount();
  }catch{toast('Local storage is full or disabled. Export your decision as a backup.')}
}
function updateLibraryCount(){
  const n=library.length;
  if($('#library-side-count'))$('#library-side-count').textContent=n;
  if($('#library-top-count'))$('#library-top-count').textContent=`(${n})`;
}
function addDecision(decision){
  if(library.length>=MAX_DECISIONS){toast('You have 30 decisions. Remove an old one or export a backup first.');return false;}
  save();state=decision;library.unshift(state);mobileSelected=null;save();return true;
}
function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),3100)}
function baseline(){return calculate(state)}
function experiment(){return calculate(state,state.scenarioWeights||{})}
function weights(){return Object.fromEntries(state.criteria.map(c=>[c.id,clamp(state.scenarioWeights?.[c.id]??c.weight,0,100)]))}
function titleCase(view){return ({overview:'Overview',compare:'Compare options',scenario:'Scenario lab',notes:'Decision journal'})[view]??'Overview'}
function navigate(view){if(!['overview','compare','scenario','notes'].includes(view))return;currentView=view;$$('.page-section').forEach(n=>n.classList.toggle('active',n.id===`view-${view}`));$$('.nav-item[data-view]').forEach(n=>{n.classList.toggle('active',n.dataset.view===view);if(n.dataset.view===view)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current')});$('#breadcrumb-view').textContent=titleCase(view);window.scrollTo({top:0,behavior:'instant'});closeSidebar();render()}
function render(){if(currentView==='overview')renderOverview();if(currentView==='compare')renderCompare();if(currentView==='scenario')renderScenario();if(currentView==='notes')renderNotes()}
function renderOverview(){
 const rows=baseline(),lead=rows[0],runner=rows[1];const gap=(lead?.score??0)-(runner?.score??0);const tied=gap<0.0001;
 $('#example-banner').hidden=!state.isExample;
 $('#decision-heading').textContent=state.title;$('#decision-description').textContent=state.description;
 $('#metrics').innerHTML=`<div class="metric"><div class="metric-top">OPTIONS IN PLAY <span class="metric-glyph">◇</span></div><strong class="metric-value">${state.options.length.toString().padStart(2,'0')}</strong><div class="metric-footer">Paths worth exploring</div></div><div class="metric"><div class="metric-top">WHAT MATTERS <span class="metric-glyph">✳</span></div><strong class="metric-value">${state.criteria.length.toString().padStart(2,'0')}</strong><div class="metric-footer">Criteria in your model</div></div><div class="metric"><div class="metric-top">TOP TWO GAP <span class="metric-glyph">↗</span></div><strong class="metric-value">${oneDecimal(gap)}<small style="font-size:16px"> pts</small></strong><div class="metric-footer">Model score difference</div></div>`;
 $('#option-grid').innerHTML=rows.map((r,i)=>`<article class="option-card"><div class="option-top"><span class="option-number">PATH ${String(i+1).padStart(2,'0')} / ${String(rows.length).padStart(2,'0')}</span>${i===0&&!tied?'<span class="option-rank">HIGHEST FIT ↗</span>':i<2&&tied?'<span class="option-rank">TIED SCORE</span>':''}</div><h3 class="option-name">${esc(r.name)}</h3><p class="option-caption">${esc(r.note)||'No description yet. Add a note in the comparison.'}</p><div class="option-bottom"><span class="score-value">${oneDecimal(r.score)}<small>/100</small></span><span class="score-desc">YOUR WEIGHTED<br/>FIT SCORE</span></div><div class="option-progress"><span style="width:${clamp(r.score,0,100)}%"></span></div></article>`).join('');
 $('#insight-panel').innerHTML=`<div class="insight-title"><strong>What matters most right now</strong><span>YOUR WEIGHTS</span></div><div class="insight-graph">${[...state.criteria].sort((a,b)=>b.weight-a.weight).map(c=>`<div class="insight-rowline"><div class="bar-title"><span>${esc(c.name)}</span><span>${c.weight}</span></div><div class="track"><div class="track-fill" style="width:${clamp(c.weight,0,100)}%"></div></div></div>`).join('')}</div><div class="insight-footer">These are relative weights, not probabilities. Visit Scenario Lab to challenge them and see whether the leading path changes.</div>`;
}
function renderCompare(){
 const rows=baseline();
 $('#matrix-table').innerHTML=`<thead><tr><th scope="col">What matters</th><th scope="col">Weight</th>${state.options.map(o=>`<th scope="col"><span class="option-col-name">${esc(o.name)}</span><br/><button class="cell-edit" data-edit-option="${esc(o.id)}">Edit ↗</button> ${state.options.length>2?`<button aria-label="Remove ${esc(o.name)}" class="tiny-delete" data-delete-option="${esc(o.id)}">×</button>`:''}</th>`).join('')}<th aria-label="Remove criterion"></th></tr></thead><tbody>${state.criteria.map(c=>`<tr><td><div class="criterion-name">${esc(c.name)}</div><span class="criterion-meta">${esc(c.hint)}</span><button class="cell-edit" data-edit-criterion="${esc(c.id)}">Edit ↗</button></td><td><strong>${c.weight}</strong></td>${state.options.map(o=>`<td><select aria-label="${esc(c.name)} rating for ${esc(o.name)}" data-score-option="${esc(o.id)}" data-score-criterion="${esc(c.id)}">${Array.from({length:11},(_,n)=>`<option value="${n}" ${Number(o.scores[c.id])===n?'selected':''}>${n}/10</option>`).join('')}</select></td>`).join('')}<td>${state.criteria.length>1?`<button title="Remove criterion" aria-label="Remove ${esc(c.name)}" class="tiny-delete" data-delete-criterion="${esc(c.id)}">×</button>`:''}</td></tr>`).join('')}<tr class="strong-row"><td><strong>Weighted fit</strong><span class="criterion-meta">Higher = stronger fit · Zero weights are treated equally</span></td><td><strong>${weightTotal(state)||'Equal'}</strong></td>${state.options.map(o=>`<td class="result-cell">${oneDecimal(rows.find(x=>x.id===o.id)?.score??0)}<span style="font-size:12px;color:#96a49a">%</span></td>`).join('')}<td></td></tr></tbody>`;
 renderMobileScore();
 $('#compare-ranking').innerHTML=`<div class="section-label">MODELED RANKING</div><h2 style="font:normal 32px var(--serif);margin:10px 0 23px">Your paths, in order.</h2>${rows.map((r,i)=>`<div class="compare-rank-row"><div class="compare-rank-label"><span>${i+1}. ${esc(r.name)}</span><strong>${oneDecimal(r.score)}%</strong></div><div class="track" style="height:10px"><div class="track-fill" style="width:${clamp(r.score,0,100)}%;background:${i===0?'#809d82':'#c8d7c2'}"></div></div></div>`).join('')}`;
}

function renderMobileScore(){
  const active=state.options.find(o=>o.id===mobileSelected)||state.options[0];
  mobileSelected=active?.id;
  if(!active)return;
  $('#mobile-score').innerHTML=`<div class="mobile-score-intro"><strong>Score one option at a time</strong><span>Choose a path, then adjust each score.</span></div><label class="mobile-choice-label" for="mobile-option-select">Path to rate</label><select id="mobile-option-select" aria-label="Path to rate">${state.options.map(o=>`<option value="${esc(o.id)}" ${o.id===active.id?'selected':''}>${esc(o.name)}</option>`).join('')}</select><div class="mobile-score-list">${state.criteria.map(c=>`<div class="mobile-score-item"><div class="mobile-score-head"><label for="mobile-score-${esc(c.id)}">${esc(c.name)}</label><output id="mobile-output-${esc(c.id)}">${clamp(active.scores[c.id],0,10)}/10</output></div><p>${esc(c.hint)||'Higher means more desirable for you.'}</p><input type="range" min="0" max="10" step="1" id="mobile-score-${esc(c.id)}" data-mobile-score="${esc(c.id)}" value="${clamp(active.scores[c.id],0,10)}" /></div>`).join('')}</div><p class="mobile-score-tip">All ratings are personal estimates. You can revisit them anytime.</p><div class="mobile-score-actions"><button class="button outline" type="button" data-mobile-edit="${esc(active.id)}">Rename option</button><button class="button ink" type="button" data-go="scenario">Explore what-ifs ↗</button></div>`;
}
function openLibrary(){
  openDialog({kicker:'YOUR SAVED WORK',title:'Your decisions.',description:'Switch between decisions without losing your progress. They are kept on this device only. Export JSON before clearing browser data.',fields:[{id:'library',type:'library'}],onSave:()=>{}});
  $('#dialog-submit').hidden=true;
}
function loadDecision(id){
  const next=library.find(d=>d.id===id);if(!next)return;
  save();state=next;mobileSelected=null;$('#dialog').close();save();navigate('overview');toast('Decision opened');
}
function deleteDecision(id){
  const candidate=library.find(d=>d.id===id);if(!candidate)return;
  if(!confirm(`Delete “${candidate.title}” from this device? This cannot be undone.`))return;
  library=library.filter(d=>d.id!==id);
  if(!library.length){state=makeDecision();library=[state]}
  else if(state.id===id)state=library[0];
  save();$('#dialog').close();navigate('overview');toast('Decision removed');
}

function renderScenario(){renderWeightControls();renderScenarioResults();renderSaved()}
function renderWeightControls(){
 $('#weight-controls').innerHTML=state.criteria.map(c=>`<div class="weight-item"><div class="weight-item-head"><label for="weight-${esc(c.id)}">${esc(c.name)}</label><span class="weight-item-value" id="value-${esc(c.id)}">${weights()[c.id]}</span></div><input id="weight-${esc(c.id)}" type="range" min="0" max="100" value="${weights()[c.id]}" step="1" data-weight="${esc(c.id)}" /><div class="weight-hint">Original emphasis: ${c.weight} · ${esc(c.hint)}</div></div>`).join('');
 updatePresetStatus();
}
function updatePresetStatus(){const current=weights();const allOriginal=state.criteria.every(c=>current[c.id]===c.weight);$$('.pill').forEach(el=>el.classList.toggle('active',el.dataset.preset==='baseline'&&allOriginal))}
function renderScenarioResults(){
 const {baseline:base,experiment:exp,changed}=compareRankings(state,state.scenarioWeights);const currentMap=Object.fromEntries(exp.map(x=>[x.id,x]));
 const isTie=exp.length>1&&Math.abs(exp[0].score-exp[1].score)<0.000001;
 $('#scenario-outcome').textContent=isTie?'No clear leader':changed?'The leader changed ↗':'Leader stays the same';
 $('#scenario-outcome').style.background=changed?'#f7eade':'#e9f0e6';
 $('#scenario-chart').innerHTML=base.map(o=>{const cur=currentMap[o.id]||o;return `<div class="scenario-chart-row"><div class="scenario-chart-title"><span>${esc(o.name)}</span><strong>${oneDecimal(cur.score)}%</strong></div><div class="dual-track"><div class="baseline" style="width:${clamp(o.score,0,100)}%"></div><div class="current" style="width:${clamp(cur.score,0,100)}%"></div></div></div>`}).join('')||'<p>No options yet.</p>';
 const stress=stressTest(state,state.scenarioWeights,Number($('#stress-range').value));const colors=['#82a185','#b3c4aa','#bfa58f','#b0c7c4','#9ea3b6'];
 $('#stress-range-value').textContent=`±${$('#stress-range').value}%`;
 $('#stability-results').innerHTML=`<div class="stability-bars" aria-label="Share of model variations with each option leading">${exp.map((r,i)=>`<div title="${esc(r.name)}: ${stress.tally[r.id]} of 121 cases" style="width:${(stress.tally[r.id]/stress.count*100).toFixed(2)}%;background:${colors[i%colors.length]}"></div>`).join('')}${stress.tally.tie?`<div title="Tied outcomes: ${stress.tally.tie} of 121 cases" style="width:${(stress.tally.tie/stress.count*100).toFixed(2)}%;background:#97a09b"></div>`:''}</div>${exp.map((r,i)=>`<div class="stability-label"><span><i style="display:inline-block;width:7px;height:7px;margin-right:7px;background:${colors[i%colors.length]};border-radius:50%"></i>${esc(r.name)}</span><strong>${stress.tally[r.id]}/${stress.count}</strong></div>`).join('')}${stress.tally.tie?`<div class="stability-label"><span><i style="display:inline-block;width:7px;height:7px;margin-right:7px;background:#97a09b;border-radius:50%"></i>Tied outcomes</span><strong>${stress.tally.tie}/${stress.count}</strong></div>`:''}<div class="stability-clarifier">A high count means this option often leads in these <em>invented weight variations</em>, not that it is likely to succeed in real life.</div>`;
 updatePresetStatus();
}
function renderSaved(){
 $('#saved-scenarios').innerHTML=state.snapshots.length?state.snapshots.map(s=>`<article class="saved-card"><strong>${esc(s.name)}</strong><small>${esc(tinyDate(s.savedAt))} · ${state.criteria.length} weighted criteria</small><div class="saved-card-foot"><button data-load-snapshot="${esc(s.id)}">Load perspective ↗</button><button aria-label="Remove ${esc(s.name)}" data-delete-snapshot="${esc(s.id)}">×</button></div></article>`).join(''):'<div class="empty-state">No saved perspectives yet. Experiment with your weights and save the ones you want to revisit.</div>';
}
function renderNotes(){
 for(const field of ['reflection','unknowns','condition'])$(`#journal-${field}`).value=state.notes?.[field]??'';
 const ranks=baseline();const r=ranks[0],tied=ranks.length>1&&Math.abs(ranks[0].score-ranks[1].score)<0.000001;$('#journal-mini').innerHTML=`<span class="section-label">THE CURRENT MODEL</span><h3>${esc(r?.name??'No leader yet')}</h3><p>${tied?'Tied for highest model score':'Currently ranks first'} at ${r?percent(r.score):'—'} based on the criteria and scores you entered. This is a tool for reflection, not external validation.</p><button class="text-action" data-go="compare">Review your scoring ↗</button>`;
}
function setScore(optionId,criterionId,score){const o=state.options.find(x=>x.id===optionId);if(!o)return;o.scores[criterionId]=clamp(score,0,10);state.isExample=false;save();renderCompare();toast('Score updated')}
function openDialog({kicker,title,description='',fields=[],submit='Save changes',onSave}){
 dialogAction=onSave;
 $('#dialog-kicker').textContent=kicker;$('#dialog-title').textContent=title;$('#dialog-description').textContent=description;$('#dialog-submit').textContent=submit;$('#dialog-submit').hidden=false;
 $('#dialog-fields').innerHTML=fields.map(f=>f.type==='library'?`<div class="library-list">${[...library].sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt))).map(d=>`<div class="library-item"><button type="button" data-open-decision="${esc(d.id)}" class="library-choice"><span class="library-choice-symbol">◇</span><span><strong>${esc(d.title)}</strong><small>${esc(tinyDate(d.updatedAt))} · ${d.options.length} options · ${d.criteria.length} criteria ${state.id===d.id?'· Current':''}</small></span></button><button type="button" data-delete-decision="${esc(d.id)}" class="library-delete" aria-label="Delete ${esc(d.title)}">×</button></div>`).join('')}</div>`:f.type==='templates'?`<div class="template-list">${TEMPLATES.map(t=>`<button type="button" class="template-item" data-choose-template="${esc(t.id)}"><span>${t.symbol}</span><span><strong>${esc(t.label)}</strong><small>${esc(t.sub)}</small></span><span class="template-arrow">↗</span></button>`).join('')}</div>`:`<div class="dialog-field"><label for="field-${esc(f.id)}">${esc(f.label)}</label>${f.type==='textarea'?`<textarea id="field-${esc(f.id)}" name="${esc(f.id)}" maxlength="${f.max??300}" placeholder="${esc(f.placeholder??'')}">${esc(f.value??'')}</textarea>`:`<input id="field-${esc(f.id)}" name="${esc(f.id)}" type="${esc(f.type??'text')}" ${f.required?'required':''} min="${f.min??0}" max="${f.max??120}" ${f.type==='number'?'step="1"':''} value="${esc(f.value??'')}" placeholder="${esc(f.placeholder??'')}" />`}</div>`).join('');
 $('#dialog').showModal();
 const first=$('input,textarea,button[data-choose-template]',$('#dialog-fields'));first?.focus();
}
function openEditDecision(){openDialog({kicker:'THE QUESTION',title:'Name the choice.',description:'Give your decision a clear question. It can be as small or as significant as you like.',fields:[{id:'title',label:'Question or decision',required:true,max:120,value:state.title},{id:'description',label:'A little context (optional)',type:'textarea',max:300,value:state.description}],onSave:values=>{state.title=safeText(values.title,120);state.description=safeText(values.description,300);state.isExample=false;save();render();toast('Decision updated')}})}
function openNew(){if(library.length>=MAX_DECISIONS)return toast('Decision library is full.');openDialog({kicker:'A CLEAN SLATE',title:'What are you deciding?',description:'Begin with a blank workspace and a few editable starting points.',fields:[{id:'title',label:'Your question',required:true,max:120,placeholder:'Which direction should I take?'},{id:'description',label:'Some context (optional)',type:'textarea',max:300,placeholder:'What makes this decision important?'}],submit:'Create workspace ↗',onSave:values=>{if(!values.title.trim())return;if(!addDecision(makeBlankDecision(values.title,values.description)))return;navigate('compare');toast('New decision saved. Start by naming the options.')}})}
function openOptionEditor(id){const o=id?state.options.find(x=>x.id===id):null;if(!o&&state.options.length>=12)return toast('Maximum of 12 options per decision.');openDialog({kicker:o?'EDIT A PATH':'NEW PATH',title:o?'Refine this option.':'Another way forward.',description:'Describe this path in your own words. Ratings can be adjusted in the comparison matrix.',fields:[{id:'name',label:'Option name',required:true,value:o?.name??'',max:75,placeholder:'A possible path'},{id:'note',label:'What does this option mean?',type:'textarea',value:o?.note??'',max:300,placeholder:'What would this look like in practice?'}],onSave:values=>{if(!values.name.trim())return; if(o){o.name=safeText(values.name,75);o.note=safeText(values.note,300)}else{state.options.push({id:uid(),name:safeText(values.name,75),note:safeText(values.note,300),scores:Object.fromEntries(state.criteria.map(c=>[c.id,5]))})}state.isExample=false;save();render();toast('Option saved')}})}
function openCriterionEditor(id){const c=id?state.criteria.find(x=>x.id===id):null;if(!c&&state.criteria.length>=12)return toast('Maximum of 12 criteria per decision.');openDialog({kicker:c?'EDIT CRITERION':'NEW CRITERION',title:c?'Make it measurable.':'What else matters?',description:'Every criterion is rated from 0 to 10. Use higher scores for a more desirable outcome (including lower cost or less effort).',fields:[{id:'name',label:'Criterion name',required:true,max:70,value:c?.name??'',placeholder:'e.g. Time flexibility'},{id:'weight',label:'Importance weight (0–100)',required:true,type:'number',min:0,max:100,value:c?.weight??20},{id:'hint',label:'What does a 10/10 mean?',max:100,value:c?.hint??'',placeholder:'Higher = better for this criterion'}],onSave:values=>{if(!values.name.trim())return;const name=safeText(values.name,70),weight=clamp(values.weight,0,100),hint=safeText(values.hint,100);if(c){c.name=name;c.weight=weight;c.hint=hint;delete state.scenarioWeights[c.id]}else{const id=uid();state.criteria.push({id,name,weight,hint});state.options.forEach(x=>x.scores[id]=5)}state.snapshots=[];state.isExample=false;save();render();toast('Criterion saved')}})}
function openTemplates(){openDialog({kicker:'EXAMPLE DECISIONS',title:'Start somewhere.',description:'Try a sample, then replace the made-up ratings with your own. Your current decision remains saved in My decisions.',fields:[{id:'templates',type:'templates'}],onSave:()=>{}});$('#dialog-submit').hidden=true}
function loadTemplate(id){const t=TEMPLATES.find(x=>x.id===id);if(!t)return;if(!addDecision(makeDecision(t)))return;$('#dialog').close();navigate('overview');toast('Example created. Customize it to make it yours.')}
function saveScenario(){if(state.snapshots.length>=15)return toast('Maximum of 15 saved scenarios.');openDialog({kicker:'SAVE PERSPECTIVE',title:'Name this experiment.',description:'Keep a snapshot of these priorities so you can return to them later.',fields:[{id:'name',label:'Scenario name',required:true,max:60,value:'What if I prioritized differently?',placeholder:'My balanced priorities'}],onSave:values=>{state.snapshots.unshift({id:uid(),name:safeText(values.name,60)||'A different perspective',weights:weights(),savedAt:new Date().toISOString()});save();renderSaved();toast('Perspective saved')}})}
function importFile(file){if(!file)return;if(file.size>1500000){toast('This file is too large.');return}file.text().then(text=>{const parsed=JSON.parse(text);const imported=importDecision(parsed);if(!addDecision(imported))return;navigate('overview');toast('Decision added to your library')}).catch(()=>toast('Could not import this JSON decision.'))}
function exportFile(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const link=document.createElement('a');const href=URL.createObjectURL(blob);link.href=href;link.download=`elsewhere-${state.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,45)||'decision'}.json`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(href),5000);toast('Your decision has been exported')}
function closeSidebar(){$('#sidebar').classList.remove('open');$('#mobile-scrim').hidden=true}

// Navigation and global controls.
$$('.nav-item[data-view]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.view)));
document.addEventListener('click',e=>{const nav=e.target.closest('[data-go]');if(nav)navigate(nav.dataset.go)});
$('#hero-new').addEventListener('click',openNew);$('#hero-examples').addEventListener('click',openTemplates);
$('#step-question').addEventListener('click',openEditDecision);$('#example-personalize').addEventListener('click',()=>navigate('compare'));
$('#change-decision').addEventListener('click',openEditDecision);
for(const id of ['new-sidebar','new-top'])$(`#${id}`).addEventListener('click',openNew);
$('#templates-button').addEventListener('click',openTemplates);
for(const id of ['library-top','library-sidebar'])$(`#${id}`).addEventListener('click',openLibrary);
for(const id of ['export-button','export-from-notes'])$(`#${id}`).addEventListener('click',exportFile);
$('#import-button').addEventListener('click',()=>$('#import-file').click());
$('#import-file').addEventListener('change',e=>{importFile(e.target.files?.[0]);e.target.value=''});
$('#menu-button').addEventListener('click',()=>{$('#sidebar').classList.add('open');$('#mobile-scrim').hidden=false});
$('#close-sidebar').addEventListener('click',closeSidebar);$('#mobile-scrim').addEventListener('click',closeSidebar);
$('#about-button').addEventListener('click',()=>openDialog({kicker:'ABOUT ELSEWHERE',title:'Better questions, not perfect answers.',description:'ELSEWHERE is a local-first decision tool. You decide the scores and weights. Rankings and stress-test variations follow transparent math; they are neither forecasts nor objective recommendations. We do not collect your information.',fields:[],submit:'Understood',onSave:()=>{}}));
// Modal.
$('#dialog-close').addEventListener('click',()=>$('#dialog').close());$('#dialog-cancel').addEventListener('click',()=>$('#dialog').close());
$('#dialog-form').addEventListener('submit',e=>{e.preventDefault();if(!$('#dialog-form').reportValidity())return;const values=Object.fromEntries(new FormData(e.currentTarget));const action=dialogAction;$('#dialog').close();action?.(values)});
$('#dialog-fields').addEventListener('click',e=>{const el=e.target.closest('[data-choose-template]');if(el)loadTemplate(el.dataset.chooseTemplate);const open=e.target.closest('[data-open-decision]');if(open)loadDecision(open.dataset.openDecision);const del=e.target.closest('[data-delete-decision]');if(del)deleteDecision(del.dataset.deleteDecision)});
// Options / criteria / score matrix.
$('#add-criterion').addEventListener('click',()=>openCriterionEditor(null));$('#add-option').addEventListener('click',()=>openOptionEditor(null));
$('#mobile-score').addEventListener('change',e=>{const selected=e.target.closest('#mobile-option-select');if(selected){mobileSelected=selected.value;renderMobileScore();return;}const range=e.target.closest('[data-mobile-score]');if(range&&mobileSelected)setScore(mobileSelected,range.dataset.mobileScore,range.value)});
$('#mobile-score').addEventListener('input',e=>{const range=e.target.closest('[data-mobile-score]');if(range){const out=$(`#mobile-output-${CSS.escape(range.dataset.mobileScore)}`);if(out)out.textContent=`${range.value}/10`}});
$('#mobile-score').addEventListener('click',e=>{const edit=e.target.closest('[data-mobile-edit]');if(edit)openOptionEditor(edit.dataset.mobileEdit)});
$('#matrix-table').addEventListener('change',e=>{const t=e.target.closest('select[data-score-option]');if(t)setScore(t.dataset.scoreOption,t.dataset.scoreCriterion,t.value)});
$('#matrix-table').addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.editOption)openOptionEditor(b.dataset.editOption);
 if(b.dataset.editCriterion)openCriterionEditor(b.dataset.editCriterion);
 if(b.dataset.deleteOption){if(state.options.length<=2){toast('Keep at least two options to compare.');return}if(!confirm('Remove this option?'))return;state.options=state.options.filter(x=>x.id!==b.dataset.deleteOption);save();renderCompare();toast('Option removed')}
 if(b.dataset.deleteCriterion){if(!confirm('Remove this criterion?'))return;const id=b.dataset.deleteCriterion;state.criteria=state.criteria.filter(x=>x.id!==id);state.options.forEach(x=>delete x.scores[id]);delete state.scenarioWeights[id];state.snapshots=[];save();renderCompare();toast('Criterion removed')}
});
// Live scenario controls.
$('#weight-controls').addEventListener('input',e=>{const input=e.target.closest('input[data-weight]');if(!input)return;state.scenarioWeights[input.dataset.weight]=clamp(input.value,0,100);$(`#value-${CSS.escape(input.dataset.weight)}`).textContent=input.value;save();renderScenarioResults()});
$('#reset-weights').addEventListener('click',()=>{state.scenarioWeights={};save();renderScenario();toast('Original priorities restored')});
$$('.pill').forEach(b=>b.addEventListener('click',()=>{const type=b.dataset.preset;const vals=Object.fromEntries(state.criteria.map(c=>[c.id,c.weight]));if(type==='balanced')state.scenarioWeights=Object.fromEntries(state.criteria.map(c=>[c.id,50]));else if(type==='invert'){const maximum=Math.max(1,...state.criteria.map(c=>c.weight));state.scenarioWeights=Object.fromEntries(state.criteria.map(c=>[c.id,maximum-c.weight+10]))}else state.scenarioWeights={};save();renderScenario()}));
$('#stress-range').addEventListener('input',renderScenarioResults);
$('#save-scenario').addEventListener('click',saveScenario);
$('#saved-scenarios').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.loadSnapshot){const s=state.snapshots.find(x=>x.id===b.dataset.loadSnapshot);if(s){state.scenarioWeights={...s.weights};save();renderScenario();toast('Saved perspective loaded')}}if(b.dataset.deleteSnapshot){state.snapshots=state.snapshots.filter(s=>s.id!==b.dataset.deleteSnapshot);save();renderSaved();toast('Perspective removed')}});
// Journal is saved locally as the user types (no remote requests).
for(const field of ['reflection','unknowns','condition'])$(`#journal-${field}`).addEventListener('input',e=>{state.notes[field]=safeText(e.target.value,7000);save()});
$('#print-report').addEventListener('click',()=>window.print());

updateLibraryCount();
render();

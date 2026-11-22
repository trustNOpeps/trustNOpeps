/** Pure decision-scoring engine. No remote APIs, trackers, or hidden AI judgment. */
export const clamp = (value, min, max) => Math.min(max, Math.max(min, Number.isFinite(Number(value)) ? Number(value) : min));
export const safeText = (value, max = 160) => String(value ?? '').replace(/[\x00-\x1F\x7F]/g, ' ').trim().slice(0, max);
export const uid = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `id_${Math.random().toString(36).slice(2, 12)}`);
const c = (id, name, weight, hint) => ({ id, name, weight, hint });
const o = (id, name, note, scores) => ({ id, name, note, scores });

export const TEMPLATES = [
  { id:'weekend', symbol:'☼', label:'Plan a weekend', sub:'Simple choices, different rewards', title:'How should I spend my next free weekend?', description:'Three very different ways to spend the same two days. Sample scores are illustrative; make them yours.',
    criteria:[c('budget','Budget friendly',25,'Higher = easier on your wallet'),c('rest','Rest & recovery',30,'Higher = more restful'),c('novelty','Something new',25,'Higher = more memorable'),c('effort','Low travel effort',20,'Higher = less time and effort')],
    options:[o('beach','A day by the sea','Fresh air, a slow afternoon, and no big plan.',{budget:8,rest:8,novelty:6,effort:9}),o('mountain','A mountain escape','A new view, a longer journey, and a change of pace.',{budget:5,rest:7,novelty:10,effort:4}),o('local','Stay close to home','More space to reset, read, and recharge.',{budget:10,rest:9,novelty:3,effort:10})] },
  { id:'career', symbol:'↗', label:'Choose a career path', sub:'Money, growth, meaning, balance', title:'Which next career move fits me best?', description:'Compare different professional paths without pretending the future is predictable.',
    criteria:[c('growth','Learning & growth',35,'Skill-building potential'),c('money','Income stability',25,'Higher = steadier income'),c('meaning','Personal meaning',25,'How worthwhile it feels'),c('time','Work-life flexibility',15,'Higher = more control of time')],
    options:[o('role','Full-time role','A structured team and clearer routine.',{growth:8,money:9,meaning:7,time:5}),o('freelance','Freelance work','Autonomy with changing demand.',{growth:8,money:5,meaning:8,time:9}),o('study','Further study','Longer-term investment in expertise.',{growth:10,money:3,meaning:8,time:6})] },
  { id:'tech', symbol:'▣', label:'Choose a device', sub:'Value, performance, portability', title:'Which laptop is right for my needs?', description:'Think beyond a spec sheet and compare what matters in daily use.',
    criteria:[c('value','Value for money',35,'Higher = better value'),c('speed','Performance',30,'Higher = faster for your tasks'),c('port','Portability',20,'Higher = easier to carry'),c('battery','Battery life',15,'Higher = longer runtime')],
    options:[o('light','Lightweight laptop','Portable and built for everyday productivity.',{value:8,speed:6,port:10,battery:9}),o('power','Performance laptop','More capability with extra bulk.',{value:7,speed:10,port:4,battery:5}),o('used','Refurbished model','A lower-cost alternative worth checking carefully.',{value:9,speed:7,port:7,battery:6})] },
  { id:'living', symbol:'⌂', label:'Find a place to live', sub:'Affordability, commute, lifestyle', title:'Which neighborhood should I choose?', description:'A place is more than a price. Compare the life each location might enable.',
    criteria:[c('afford','Affordability',30,'Higher = lower total housing cost'),c('commute','Ease of commute',25,'Higher = shorter or easier'),c('lifestyle','Lifestyle fit',30,'Higher = better personal fit'),c('space','Space & comfort',15,'Higher = more practical comfort')],
    options:[o('central','City center','Shorter commutes, smaller spaces.',{afford:4,commute:9,lifestyle:8,space:5}),o('suburb','Outer neighborhood','More space and a quieter routine.',{afford:8,commute:5,lifestyle:7,space:9}),o('shared','Shared home','Affordable and social, with compromises.',{afford:10,commute:7,lifestyle:6,space:4})] }
];

export function makeDecision(template = TEMPLATES[0]) {
  return { version: 1, id: uid(), isExample:true, title: template.title, description: template.description,
    criteria: template.criteria.map(x=>({...x})), options:template.options.map(x=>({...x, scores:{...x.scores}})),
    scenarioWeights:{}, snapshots:[], notes:{reflection:'',unknowns:'',condition:''}, updatedAt:new Date().toISOString() };
}
export function makeBlankDecision(title, description='') {
  const result=makeDecision({title: safeText(title, 120)||'A question worth exploring',description:safeText(description,300)||'Start with a few options and make the scores your own.',
    criteria:[c('value','Overall value',30,'How much value it creates'),c('effort','Ease & effort',25,'Higher = easier to achieve'),c('fit','Personal fit',30,'How well it meets your needs'),c('risk','Confidence',15,'Higher = greater confidence')],
    options:[o('a','Option A','Add a description',{value:5,effort:5,fit:5,risk:5}),o('b','Option B','Add a description',{value:5,effort:5,fit:5,risk:5})]});
  result.isExample=false; return result;
}

/** Scores: 0..10 per criterion. Weights are non-negative and relative; 100 is not required. */
export function calculate(decision, overrides = {}) {
  const cs = decision.criteria || [];
  const raw = cs.map(x=>clamp(Object.hasOwn(overrides, x.id)?overrides[x.id]:x.weight,0,100));
  const sum = raw.reduce((a,b)=>a+b,0);
  const weights = sum>0 ? raw : cs.map(()=>1);
  const denominator = weights.reduce((a,b)=>a+b,0) || 1;
  return (decision.options||[]).map((opt,index)=>({
    id:opt.id, name:opt.name, note:opt.note, index,
    score:cs.reduce((total,criterion,i)=>total+clamp(opt.scores[criterion.id],0,10)*weights[i],0)/denominator*10,
  })).sort((a,b)=> b.score-a.score || a.index-b.index);
}
export function weightTotal(decision, overrides={}) {
  return decision.criteria.reduce((acc,criterion)=>acc+clamp(Object.hasOwn(overrides,criterion.id)?overrides[criterion.id]:criterion.weight,0,100),0);
}
export function compareRankings(decision, overrides={}) {
  const baseline = calculate(decision);
  const experiment = calculate(decision, overrides);
  return {baseline,experiment,changed:baseline[0]?.id !== experiment[0]?.id};
}
/**
 * Sensitivity experiment, NOT a probabilistic forecast. Generates 121 fixed, deterministic
 * pseudo-samples of independently perturbed weights within +/- variation%.
 * Every run of the same inputs gives the same tally (including first unperturbed sample).
 */
export function stressTest(decision, overrides={},variation=20) {
  const tally = {...Object.fromEntries(decision.options.map(x=>[x.id,0])),tie:0};
  const pct=clamp(variation,0,50)/100;
  const count=121;
  for(let i=0;i<count;i++){
    const perturbed={};
    decision.criteria.forEach((criterion,j)=>{
      const base=clamp(Object.hasOwn(overrides,criterion.id)?overrides[criterion.id]:criterion.weight,0,100);
      const direction=i===0?0:(Math.sin(i*12.9898+j*78.233)*43758.5453)%1;
      perturbed[criterion.id]=Math.max(0,base*(1+pct*direction));
    });
    const results=calculate(decision,perturbed);
    if(results.length>1 && Math.abs(results[0].score-results[1].score)<0.000001)tally.tie++;
    else if(results[0])tally[results[0].id]++;
  }
  return {count, tally, leader:calculate(decision,overrides)[0]?.id};
}
export function importDecision(raw){
  if(!raw||typeof raw!=='object'||!Array.isArray(raw.criteria)||!Array.isArray(raw.options))throw new Error('Invalid decision file.');
  if(raw.criteria.length<1||raw.criteria.length>12||raw.options.length<2||raw.options.length>12)throw new Error('The file must have 1–12 criteria and 2–12 options.');
  const idMap=new Map();
  const criteria=raw.criteria.map((x,i)=>{const id=`c${i}_${uid().slice(0,8)}`; idMap.set(String(x.id),id);return {id,name:safeText(x.name,70)||`Criterion ${i+1}`,weight:clamp(x.weight,0,100),hint:safeText(x.hint,100)}});
  const options=raw.options.map((x,i)=>({id:`o${i}_${uid().slice(0,8)}`,name:safeText(x.name,75)||`Option ${i+1}`,note:safeText(x.note,300),scores:Object.fromEntries([...idMap.entries()].map(([old,newId])=>[newId,clamp(x.scores?.[old],0,10)]))}));
  const scenarioWeights=Object.fromEntries([...idMap.entries()].filter(([old])=>raw.scenarioWeights&&Object.hasOwn(raw.scenarioWeights,old)).map(([old,id])=>[id,clamp(raw.scenarioWeights[old],0,100)]));
  const snapshots=(Array.isArray(raw.snapshots)?raw.snapshots:[]).slice(0,15).map((s,i)=>({id:`snap${i}_${uid().slice(0,7)}`,name:safeText(s.name,60)||`Scenario ${i+1}`,savedAt:safeText(s.savedAt,40),weights:Object.fromEntries([...idMap.entries()].map(([old,id])=>[id,clamp(s.weights?.[old]??raw.criteria.find(x=>String(x.id)===old)?.weight??0,0,100)]))}));
  return {version:1,id:uid(),isExample:Boolean(raw.isExample),title:safeText(raw.title,120)||'Imported decision',description:safeText(raw.description,300),criteria,options,scenarioWeights,snapshots,notes:{reflection:safeText(raw.notes?.reflection,7000),unknowns:safeText(raw.notes?.unknowns,7000),condition:safeText(raw.notes?.condition,7000)},updatedAt:new Date().toISOString()};
}

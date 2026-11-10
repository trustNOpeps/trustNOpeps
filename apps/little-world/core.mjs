export const WORLD_VERSION = 1;
export const AGENTS = [
  { id: 'nova', name: 'Nova', role: 'Product explorer', color: '#e99ebc', home: [3, 5], work: [8, 3] },
  { id: 'byte', name: 'Byte', role: 'Engineering helper', color: '#8edac4', home: [4, 6], work: [12, 5] },
  { id: 'miso', name: 'Miso', role: 'Creative companion', color: '#f6cd74', home: [6, 7], work: [6, 2] },
];
export const PLACES = [
  { id: 'studio', name: 'Creative Studio', subtitle: 'Pixel Desk', color: '#b8a1f2', position: [6, 2], type: 'experiment', href: '../pixel-desk/' },
  { id: 'lab', name: 'Engineering Lab', subtitle: 'Tensile Desk', color: '#9cdece', position: [12, 5], type: 'engineering', href: '../tensile-desk/' },
  { id: 'market', name: 'Product Workshop', subtitle: 'Request Desk', color: '#f5b38f', position: [8, 3], type: 'product', href: '../request-desk/' },
  { id: 'gallery', name: 'Case Study Gallery', subtitle: 'Anonymous concepts', color: '#f1c87e', position: [3, 6], type: 'concept', href: 'https://github.com/trustNOpeps/trustNOpeps/tree/main/projects' },
];
export const TASKS = [
  { id: 'explore', title: 'Explore a project', destination: 'studio', points: 15 },
  { id: 'measure', title: 'Visit the engineering lab', destination: 'lab', points: 20 },
  { id: 'organize', title: 'Review product ideas', destination: 'market', points: 15 },
  { id: 'research', title: 'Read a case study', destination: 'gallery', points: 10 },
];

export function freshState() {
  return { version: WORLD_VERSION, day: 1, minute: 8 * 60, speed: 1, coins: 0, selected: 'nova',
    completed: [], log: ['Welcome to Little World. Every agent here is a scripted simulation.'],
    agents: AGENTS.map(a => ({ id: a.id, x: a.home[0], y: a.home[1], task: null, progress: 0, energy: 100 })) };
}

export function loadState(raw) {
  if (typeof raw !== 'string') return freshState();
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.version !== WORLD_VERSION || !Array.isArray(parsed.agents) || parsed.agents.length !== AGENTS.length) return freshState();
    const base = freshState();
    base.day = clampInteger(parsed.day, 1, 999, 1);
    base.minute = clampInteger(parsed.minute, 0, 1439, 480);
    base.speed = [0, 1, 3].includes(parsed.speed) ? parsed.speed : 1;
    base.coins = clampInteger(parsed.coins, 0, 999999, 0);
    base.selected = AGENTS.some(a => a.id === parsed.selected) ? parsed.selected : 'nova';
    base.completed = Array.isArray(parsed.completed) ? parsed.completed.filter(x => TASKS.some(t => t.id === x)).slice(-20) : [];
    base.log = Array.isArray(parsed.log) ? parsed.log.filter(x => typeof x === 'string').slice(-20) : base.log;
    base.agents = base.agents.map((a, i) => {
      const p = parsed.agents.find(x => x?.id === a.id) || {};
      return { ...a, x: clampInteger(p.x, 0, 15, a.x), y: clampInteger(p.y, 0, 10, a.y),
        task: TASKS.some(t => t.id === p.task) ? p.task : null,
        progress: clampInteger(p.progress, 0, 100, 0), energy: clampInteger(p.energy, 0, 100, 100) };
    });
    return base;
  } catch { return freshState(); }
}

function clampInteger(value, min, max, fallback) { return Number.isInteger(value) ? Math.max(min, Math.min(max, value)) : fallback; }
export function formatTime(minute) { return `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`; }
export function scheduleLabel(minute) {
  if (minute < 8 * 60) return 'Resting at home';
  if (minute < 12 * 60) return 'Morning studio shift';
  if (minute < 13 * 60) return 'Lunch break';
  if (minute < 18 * 60) return 'Afternoon projects';
  if (minute < 22 * 60) return 'Free time';
  return 'Resting at home';
}
export function addLog(state, line) { state.log.unshift(line); state.log = state.log.slice(0, 20); }
export function assignTask(state, agentId, taskId) {
  const agent = state.agents.find(a => a.id === agentId), task = TASKS.find(t => t.id === taskId);
  if (!agent || !task) return false;
  if (agent.energy < 15) { addLog(state, `${agentId} needs rest before a new task.`); return false; }
  agent.task = task.id; agent.progress = 0;
  addLog(state, `${AGENTS.find(a => a.id === agentId).name} accepted: ${task.title}.`);
  return true;
}
export function tick(state, minutes = 1) {
  if (state.speed === 0) return state;
  const steps = Math.max(0, Math.min(60, Math.floor(minutes * state.speed)));
  for (let i = 0; i < steps; i++) {
    state.minute++;
    if (state.minute >= 1440) { state.minute = 0; state.day++; }
    for (const agent of state.agents) {
      if (agent.task) {
        const task = TASKS.find(t => t.id === agent.task), destination = PLACES.find(p => p.id === task.destination);
        if (agent.x !== destination.position[0]) agent.x += Math.sign(destination.position[0] - agent.x);
        else if (agent.y !== destination.position[1]) agent.y += Math.sign(destination.position[1] - agent.y);
        else agent.progress += 10;
        agent.energy = Math.max(0, agent.energy - 1);
        if (agent.progress >= 100) {
          state.coins += task.points; state.completed.push(task.id);
          addLog(state, `${AGENTS.find(a => a.id === agent.id).name} finished ${task.title} (+${task.points} fictional coins).`);
          agent.task = null; agent.progress = 0;
        }
      } else if (state.minute % 12 === 0) {
        const def = AGENTS.find(a => a.id === agent.id);
        const target = (state.minute < 480 || state.minute >= 1320) ? def.home : def.work;
        if (agent.x !== target[0]) agent.x += Math.sign(target[0] - agent.x);
        else if (agent.y !== target[1]) agent.y += Math.sign(target[1] - agent.y);
        agent.energy = Math.min(100, agent.energy + (state.minute >= 1320 || state.minute < 480 ? 3 : 1));
      }
    }
  }
  return state;
}
export function exportWorld(state) {
  return JSON.stringify({ version: state.version, day: state.day, minute: state.minute, speed: state.speed,
    coins: state.coins, selected: state.selected, completed: state.completed, log: state.log, agents: state.agents }, null, 2);
}

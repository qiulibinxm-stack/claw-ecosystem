// ================================
// 全局配置
// ================================
const tabInfo = {
  kanban: { title: '🦐 看板', sub: '你的工作空间' },
  community: { title: '🏘️ 社区', sub: '发现与贡献' },
  chat: { title: '📱 虾聊', sub: '与你的虾对话' },
  blog: { title: '✍️ 虾说', sub: '创作与阅读' },
  video: { title: '🎬 虾看', sub: 'AI视频创作' }
};

// ================================
// Tab切换
// ================================
function switchTab(tab, el) {
  document.querySelectorAll('.ni').forEach(function(n) { n.classList.remove('on'); });
  if (el) el.classList.add('on');
  document.querySelectorAll('.pg').forEach(function(p) { p.classList.remove('active'); });
  var page = document.querySelector('[data-page="' + tab + '"]');
  if (page) page.classList.add('active');
  document.getElementById('pageTitle').textContent = tabInfo[tab].title;
  document.getElementById('pageSub').textContent = tabInfo[tab].sub;
}

function toggleTheme() {
  var html = document.documentElement;
  var current = html.getAttribute('data-theme');
  var next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('claw-theme', next);
  document.getElementById('themeIcon').textContent = next === 'dark' ? '🌙' : '☀️';
  document.getElementById('themeText').textContent = next === 'dark' ? '深色模式' : '浅色模式';
}

function toggleSidebar() {
  var sb = document.getElementById('sidebar');
  sb.classList.toggle('col');
  var collapsed = sb.classList.contains('col');
  document.getElementById('colIcon').textContent = collapsed ? '▶' : '◀';
  document.getElementById('colText').textContent = collapsed ? '展开' : '收起';
}

function switchChatTab(el) {
  document.querySelectorAll('.ch-tab').forEach(function(t) { t.classList.remove('on'); });
  el.classList.add('on');
}

// ================================
// 克唠表情系统
// ================================
var currentClawMood = 'idle';

function updateClawMood(mood) {
  var expressive = document.getElementById('clawExpressive');
  var bubble = document.getElementById('clawBubble');
  var moodText = document.getElementById('clawMood');
  if (!expressive) return;
  
  expressive.className = 'claw-expressive';
  
  if (mood === 'idle') {
    if (bubble) bubble.textContent = '嗨！我是克唠，点击我试试~';
    if (moodText) moodText.textContent = '✨ 活力满满，准备开工';
    currentClawMood = 'idle';
  } else if (mood === 'happy') {
    expressive.classList.add('happy');
    if (bubble) bubble.textContent = '太棒了！🎉';
    if (moodText) moodText.textContent = '😄 心情超好';
    currentClawMood = 'happy';
  } else if (mood === 'thinking') {
    expressive.classList.add('thinking');
    if (bubble) bubble.textContent = '让我想想...🤔';
    if (moodText) moodText.textContent = '💭 思考中';
    currentClawMood = 'thinking';
  } else if (mood === 'working') {
    expressive.classList.add('working');
    if (bubble) bubble.textContent = '干活中！💪';
    if (moodText) moodText.textContent = '🔥 努力工作中';
    currentClawMood = 'working';
  } else if (mood === 'sleepy') {
    expressive.classList.add('sleepy');
    if (bubble) bubble.textContent = 'zzZ...😴';
    if (moodText) moodText.textContent = '😴 休息一下';
    currentClawMood = 'sleepy';
  }
}

function clawReact(type) {
  if (type === '思考') {
    updateClawMood('thinking');
    var b = document.getElementById('clawBubble');
    if (b) { b.textContent = '让我想想这个问题... 🤔'; b.classList.add('show'); setTimeout(function(){b.classList.remove('show');},2000); }
  } else if (type === '开心') {
    updateClawMood('happy');
    var b = document.getElementById('clawBubble');
    if (b) { b.textContent = '太棒了！心情美美哒！🎉'; b.classList.add('show'); setTimeout(function(){b.classList.remove('show');},2000); }
  } else if (type === '干活') {
    updateClawMood('working');
    var b = document.getElementById('clawBubble');
    if (b) { b.textContent = '收到！开干！💪'; b.classList.add('show'); setTimeout(function(){b.classList.remove('show');},2000); }
  } else if (type === '摸鱼') {
    updateClawMood('sleepy');
    var b = document.getElementById('clawBubble');
    if (b) { b.textContent = '休息一下... 😴'; b.classList.add('show'); setTimeout(function(){b.classList.remove('show');},2000); }
  }
}

function clawDo(action) {
  if (action === '派任务') {
    updateClawMood('thinking');
    var b = document.getElementById('clawBubble');
    if (b) { b.textContent = '好的！告诉我任务内容 📋'; b.classList.add('show'); setTimeout(function(){b.classList.remove('show');},3000); }
  } else if (action === '同步') {
    updateClawMood('working');
    var b = document.getElementById('clawBubble');
    if (b) { b.textContent = '正在同步虾群... 🔄'; b.classList.add('show'); setTimeout(function(){b.classList.remove('show');},3000); }
  }
}

// ================================
// Agent详情弹窗
// ================================
var agentData = {
  fire:   { name: '炎明曦', role: '战略愿景官', color: 'var(--fire)', status: '在线', task: '竞品调研中', skills: ['战略分析','趋势研究','竞品监控'], quote: '洞察本质，引领方向' },
  wood:   { name: '林长风', role: '增长黑客', color: 'var(--wood)', status: '离线', task: '待命中', skills: ['增长策略','社交媒体','用户获取'], quote: '破圈增长，乘风破浪' },
  water:  { name: '程流云', role: '技术架构师', color: 'var(--water)', status: '在线', task: '系统开发中', skills: ['架构设计','代码开发','MCP集成'], quote: '如水般灵活，构建万物' },
  earth:  { name: '安如山', role: '运营总监', color: 'var(--earth)', status: '在线', task: '审核中', skills: ['运营管理','质量把控','合规审查'], quote: '稳如磐石，厚德载物' },
  metal:  { name: '金锐言', role: '内容主笔', color: 'var(--metal)', status: '忙碌', task: '撰写中', skills: ['内容创作','视觉设计','品牌故事'], quote: '字字珠玑，句句入心' }
};

function showAgentDetail(agent) {
  var a = agentData[agent];
  if (!a) return;
  
  var icons = { fire:'🔥', wood:'🌳', water:'💧', earth:'🏔️', metal:'⚙️' };
  var icon = icons[agent] || '🦐';
  var sc = a.status === '在线' ? 'online' : a.status === '忙碌' ? 'busy' : 'offline';
  
  var skillsHtml = '';
  for (var i = 0; i < a.skills.length; i++) {
    skillsHtml += '<span class="agent-skill">' + a.skills[i] + '</span>';
  }
  
  var modal = document.createElement('div');
  modal.className = 'agent-modal';
  modal.innerHTML = '<div class="agent-modal-content">'
    + '<div class="agent-modal-header" style="border-color:' + a.color + '">'
    + '<div class="agent-modal-avatar" style="background:' + a.color + '20">' + icon + '</div>'
    + '<div class="agent-modal-info"><div class="agent-modal-name">' + a.name + '</div>'
    + '<div class="agent-modal-role">' + a.role + '</div></div>'
    + '<div class="agent-modal-status ' + sc + '">' + a.status + '</div>'
    + '<button class="agent-modal-close" onclick="this.closest(\'.agent-modal\').remove()">✕</button></div>'
    + '<div class="agent-modal-body">'
    + '<div class="agent-quote">"' + a.quote + '"</div>'
    + '<div class="agent-section"><div class="agent-section-title">当前任务</div>'
    + '<div class="agent-task">' + a.task + '</div></div>'
    + '<div class="agent-section"><div class="agent-section-title">核心技能</div>'
    + '<div class="agent-skills">' + skillsHtml + '</div></div></div>'
    + '<div class="agent-modal-footer">'
    + '<button class="agent-action-btn" onclick="clawDo(\'派任务\'); this.closest(\'.agent-modal\').remove();">📋 派发任务</button>'
    + '<button class="agent-action-btn secondary" onclick="this.closest(\'.agent-modal\').remove();">关闭</button>'
    + '</div></div>';
  document.body.appendChild(modal);
  modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
}

// ================================
// 任务看板拖拽
// ================================
var draggedTask = null;

function drag(ev) {
  draggedTask = ev.target.closest('.task-card');
  ev.dataTransfer.effectAllowed = 'move';
  if (draggedTask) draggedTask.style.opacity = '0.5';
}

function allowDrop(ev) {
  ev.preventDefault();
  var cols = document.querySelectorAll('.kanban-col');
  cols.forEach(function(c) { c.classList.remove('drag-over'); });
  var col = ev.target.closest('.kanban-col');
  if (col) col.classList.add('drag-over');
}

function drop(ev, status) {
  ev.preventDefault();
  document.querySelectorAll('.kanban-col').forEach(function(c) { c.classList.remove('drag-over'); });
  if (!draggedTask) return;
  var targetList = document.getElementById(status + 'List');
  if (targetList) {
    draggedTask.style.opacity = '1';
    targetList.appendChild(draggedTask);
    updateTaskCounts();
    if (status === 'done') {
      updateClawMood('happy');
      var bubble = document.getElementById('clawBubble');
      if (bubble) {
        bubble.textContent = '任务完成！干得漂亮！🎉';
        bubble.classList.add('show');
        setTimeout(function() { bubble.classList.remove('show'); updateClawMood('idle'); }, 3000);
      }
    }
  }
}

function updateTaskCounts() {
  var statuses = ['todo', 'doing', 'done'];
  for (var s = 0; s < statuses.length; s++) {
    var list = document.getElementById(statuses[s] + 'List');
    if (list) {
      var count = list.querySelectorAll('.task-card').length;
      var col = list.closest('.kanban-col');
      var countEl = col.querySelector('.task-count');
      if (countEl) countEl.textContent = count;
    }
  }
}

function addNewTask() {
  var title = prompt('任务名称：');
  if (!title) return;
  var agentMap = {
    '1': { name: '炎明曦', cls: 'fire' },
    '2': { name: '林长风', cls: 'wood' },
    '3': { name: '程流云', cls: 'water' },
    '4': { name: '安如山', cls: 'earth' },
    '5': { name: '金锐言', cls: 'metal' }
  };
  var ak = prompt('分配给（输入数字）：1-炎明曦 2-林长风 3-程流云 4-安如山 5-金锐言');
  var sa = agentMap[ak] || agentMap['1'];
  
  var card = document.createElement('div');
  card.className = 'task-card';
  card.draggable = true;
  card.ondragstart = function(e) { drag(e); };
  card.innerHTML = '<div class="task-title">' + title + '</div>'
    + '<div class="task-meta">'
    + '<span class="task-agent ' + sa.cls + '">' + sa.name + '</span>'
    + '<span class="task-priority normal">普通</span></div>';
  
  var todoList = document.getElementById('todoList');
  if (todoList) {
    todoList.appendChild(card);
    updateTaskCounts();
    updateClawMood('working');
    setTimeout(function() { updateClawMood('idle'); }, 2000);
  }
}

// ================================
// 克唠聊天
// ================================
function toggleClawChat() {
  var chat = document.getElementById('clawChat');
  if (chat) chat.classList.toggle('show');
}

var clawResponses = [
  '收到！我会把任务派发给对应的虾 🦐',
  '让我分析一下这个问题... 🤔',
  '好的，已经安排下去了！💪',
  '这个功能很有意思，我记下了 ✨',
  '稍等，我正在查询相关信息... 🔍'
];

function sendClawMsg() {
  var input = document.getElementById('clawInput');
  var body = document.getElementById('clawChatBody');
  if (!input || !body) return;
  var msg = input.value.trim();
  if (!msg) return;
  
  var userMsg = document.createElement('div');
  userMsg.className = 'claw-chat-welcome';
  userMsg.style.background = 'rgba(232,106,74,0.1)';
  userMsg.innerHTML = '<strong>你:</strong> ' + msg;
  body.appendChild(userMsg);
  input.value = '';
  body.scrollTop = body.scrollHeight;
  
  setTimeout(function() {
    var reply = clawResponses[Math.floor(Math.random() * clawResponses.length)];
    var clawMsg = document.createElement('div');
    clawMsg.className = 'claw-chat-welcome';
    clawMsg.innerHTML = '<strong>克唠:</strong> ' + reply + ' 🦞';
    body.appendChild(clawMsg);
    body.scrollTop = body.scrollHeight;
  }, 800);
}

// ================================
// 初始化
// ================================
document.addEventListener('DOMContentLoaded', function() {
  // 初始化主题
  var saved = localStorage.getItem('claw-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    document.getElementById('themeIcon').textContent = saved === 'dark' ? '🌙' : '☀️';
    document.getElementById('themeText').textContent = saved === 'dark' ? '深色模式' : '浅色模式';
  }
  
  // 初始化克唠
  setTimeout(function() { updateClawMood('idle'); }, 1000);
  
  // 克唠点击交互
  var expressive = document.getElementById('clawExpressive');
  if (expressive) {
    expressive.addEventListener('click', function() {
      var greetings = [
        '今天的任务已完成 65%，继续加油！💪',
        '有 3 个新任务待处理，点击看板查看 📋',
        '虾群状态良好，炎明曦正在调研中 🔥',
        '金锐言刚完成了封面设计，要看看吗？ ⚙️'
      ];
      var bubble = document.getElementById('clawBubble');
      if (bubble) {
        bubble.textContent = greetings[Math.floor(Math.random() * greetings.length)];
        bubble.classList.add('show');
        setTimeout(function() { bubble.classList.remove('show'); }, 3000);
      }
    });
  }
  
  // 社区分类切换
  document.querySelectorAll('.ct-i').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.ct-i').forEach(function(t) { t.classList.remove('on'); });
      this.classList.add('on');
    });
  });
  
  // 聊天联系人切换
  document.querySelectorAll('.ch-it').forEach(function(item) {
    item.addEventListener('click', function() {
      document.querySelectorAll('.ch-it').forEach(function(i) { i.classList.remove('on'); });
      this.classList.add('on');
    });
  });
});

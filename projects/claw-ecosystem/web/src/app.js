// Tab切换
const tabInfo = {
  kanban: { title: '🦐 看板', sub: '你的工作空间' },
  community: { title: '🏘️ 社区', sub: '发现与贡献' },
  chat: { title: '📱 虾聊', sub: '与你的虾对话' },
  blog: { title: '✍️ 虾说', sub: '创作与阅读' },
  video: { title: '🎬 虾看', sub: 'AI视频创作' }
};

function switchTab(tab, el) {
  document.querySelectorAll('.ni').forEach(n => n.classList.remove('on'));
  if (el) el.classList.add('on');
  document.querySelectorAll('.pg').forEach(p => p.classList.remove('active'));
  const page = document.querySelector('[data-page="' + tab + '"]');
  if (page) page.classList.add('active');
  document.getElementById('pageTitle').textContent = tabInfo[tab].title;
  document.getElementById('pageSub').textContent = tabInfo[tab].sub;
}

// 主题切换
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('claw-theme', next);
  document.getElementById('themeIcon').textContent = next === 'dark' ? '🌙' : '☀️';
  document.getElementById('themeText').textContent = next === 'dark' ? '深色模式' : '浅色模式';
}

// 侧边栏收起
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  sb.classList.toggle('col');
  const collapsed = sb.classList.contains('col');
  document.getElementById('colIcon').textContent = collapsed ? '▶' : '◀';
  document.getElementById('colText').textContent = collapsed ? '展开' : '收起';
}

// 聊天Tab切换
function switchChatTab(el) {
  document.querySelectorAll('.ch-tab').forEach(t => t.classList.remove('on'));
  el.classList.add('on');
}

// 社区分类切换
document.querySelectorAll('.ct-i').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.ct-i').forEach(t => t.classList.remove('on'));
    this.classList.add('on');
  });
});

// 聊天联系人切换
document.querySelectorAll('.ch-it').forEach(item => {
  item.addEventListener('click', function() {
    document.querySelectorAll('.ch-it').forEach(i => i.classList.remove('on'));
    this.classList.add('on');
  });
});

// 初始化主题
(function() {
  const saved = localStorage.getItem('claw-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    document.getElementById('themeIcon').textContent = saved === 'dark' ? '🌙' : '☀️';
    document.getElementById('themeText').textContent = saved === 'dark' ? '深色模式' : '浅色模式';
  }
})();

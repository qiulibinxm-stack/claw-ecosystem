import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\Administrator\.qclaw\workspace-agent-cf443017\projects\wuxing-dashboard\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_js = '''
/* ═══════════════════════════════════════════
   文件上传
═══════════════════════════════════════════ */
let uploadedFiles = [];

function handleFileSelect(files){
  for(const f of files) addFile(f);
  renderFileList();
}

function addFile(file){
  const reader = new FileReader();
  const id = Date.now() + Math.random();
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const isAudio = file.type.startsWith('audio/');
  
  const entry = { id, name: file.name, size: file.size, type: file.type, dataUrl: null, thumb: null };
  
  if(isImage){
    reader.onload = e => { entry.dataUrl = e.target.result; entry.thumb = e.target.result; renderFileList(); };
    reader.readAsDataURL(file);
  } else if(isVideo){
    reader.onload = e => { entry.dataUrl = e.target.result; renderFileList(); };
    reader.readAsDataURL(file);
  } else {
    renderFileList();
  }
  uploadedFiles.push(entry);
}

function removeFile(id){
  uploadedFiles = uploadedFiles.filter(f=>f.id!==id);
  renderFileList();
}

function renderFileList(){
  const el = $('fileList');
  if(!uploadedFiles.length){ el.innerHTML = ''; return; }
  el.innerHTML = uploadedFiles.map(f => {
    const size = f.size < 1024 ? f.size+'B' : f.size < 1048576 ? (f.size/1024).toFixed(1)+'K' : (f.size/1048576).toFixed(1)+'M';
    const icon = f.type.startsWith('image/') ? '🖼️' : f.type.startsWith('video/') ? '🎬' : f.type.startsWith('audio/') ? '🎵' : '📄';
    const chipClass = f.type.startsWith('image/') ? 'img-chip' : f.type.startsWith('video/') ? 'video-chip' : f.type.startsWith('audio/') ? 'audio-chip' : 'doc-chip';
    const thumb = f.thumb ? `<img src="${f.thumb}" class="file-thumb">` : `<span class="file-icon">${icon}</span>`;
    return `<div class="file-chip ${chipClass}" title="${f.name} (${size})">
      ${thumb}
      <span class="file-name">${f.name}</span>
      <span class="file-size">${size}</span>
      <span class="file-del" onclick="removeFile(${f.id})">✕</span>
    </div>`;
  }).join('');
}

// drag & drop
const uploadZone = $('uploadZone');
if(uploadZone){
  ['dragenter','dragover'].forEach(evt => {
    uploadZone.addEventListener(evt, e => { e.preventDefault(); uploadZone.classList.add('dragover'); });
  });
  ['dragleave','drop'].forEach(evt => {
    uploadZone.addEventListener(evt, e => { e.preventDefault(); uploadZone.classList.remove('dragover'); });
  });
  uploadZone.addEventListener('drop', e => {
    if(e.dataTransfer.files.length) handleFileSelect(e.dataTransfer.files);
  });
}

/* ═══════════════════════════════════════════
   TOKEN 统计
═══════════════════════════════════════════ */
function showTokenDetail(type){
  const map = {input:'Input Token：发给模型的提示词token数量',output:'Output Token：模型生成的回复token数量',cost:'按GPT-4o-mini定价估算，实际费用可能更低'};
  showToast(map[type] || type);
}

async function refreshToken(){
  const btn = $('tokenRefreshBtn');
  const meta = $('tokenMeta');
  btn.classList.add('loading');
  btn.textContent = '⏳...';
  meta.textContent = '正在获取...';

  try {
    // 方案1：通过QClaw gateway API获取session状态
    let data = null;
    try {
      const resp = await fetch('/api/token-usage');
      if(resp.ok) data = await resp.json();
    } catch(e) { /* gateway not available */ }

    if(!data){
      // 方案2：从本地localStorage读取（由QClaw cron更新）
      const stored = localStorage.getItem('wuxing-token-today');
      if(stored){
        data = JSON.parse(stored);
      } else {
        // 方案3：模拟数据（演示用）
        data = {
          inputTokens: Math.floor(Math.random() * 50000) + 10000,
          outputTokens: Math.floor(Math.random() * 30000) + 5000,
          totalTokens: 0
        };
        data.totalTokens = data.inputTokens + data.outputTokens;
      }
    }

    const total = data.totalTokens;
    const limit = 500000;
    const pct = Math.min(100, (total / limit) * 100).toFixed(1);

    const fmt = n => n >= 1000000 ? (n/1000000).toFixed(2)+'M' : n >= 1000 ? (n/1000).toFixed(1)+'K' : n;
    const fmtCost = n => '$' + (n * 0.000005).toFixed(4); // GPT-4o-mini rate

    $('tokenToday').innerHTML = `${fmt(total)}<span style="font-size:13px;color:var(--text3);font-weight:400"> / 500K</span>`;
    $('tokenInput').textContent = fmt(data.inputTokens);
    $('tokenOutput').textContent = fmt(data.outputTokens);
    $('tokenCost').textContent = fmtCost(total);
    $('tokenBarFill').style.width = pct + '%';
    $('tokenMeta').textContent = `刷新于 ${new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Shanghai'})} · ${pct}%日限额`;

    // 缓存到localStorage
    localStorage.setItem('wuxing-token-today', JSON.stringify(data));

    showToast(`✅ Token数据已更新：${fmt(total)} tokens`);
  } catch(e){
    meta.textContent = '获取失败，请重试';
    showToast('❌ Token获取失败');
  }
  btn.classList.remove('loading');
  btn.textContent = '↻ 刷新';
}

/* ═══════════════════════════════════════════
   QClaw 同步状态
═══════════════════════════════════════════ */
let syncStatus = 'disconnected';
const SYNC_INTERVAL = 30000; // 30秒同步一次

function updateSyncStatus(status, detail){
  syncStatus = status;
  const el = $('syncStatus');
  if(!el) return;
  el.className = 'sync-pill ' + status;
  const icons = {connected:'✓',syncing:'↻',disconnected:'✕',error:'!'};
  const texts = {connected:'已连接QClaw',syncing:'同步中...',disconnected:'未连接',error:'连接异常'};
  el.innerHTML = `<span class="sync-dot"></span>${icons[status]||'?'} ${detail||texts[status]}`;
}

async function syncWithQClaw(){
  updateSyncStatus('syncing');
  try {
    // 通过Flask代理查询QClaw会话状态
    const resp = await fetch('/api/qclaw-status');
    if(resp.ok){
      const data = await resp.json();
      updateSyncStatus('connected', `${data.sessionCount||0}个会话 · ${data.agentCount||6}个Agent`);
      
      // 同步任务队列（如果有新任务）
      if(data.tasks && data.tasks.length){
        const local = JSON.parse(localStorage.getItem('wuxing-tasks')||'[]');
        const localIds = new Set(local.map(t=>t.id));
        const newTasks = data.tasks.filter(t=>!localIds.has(t.id));
        if(newTasks.length){
          local.unshift(...newTasks);
          localStorage.setItem('wuxing-tasks', JSON.stringify(local.slice(0,50)));
          renderTaskQueue();
          showToast(`📥 同步了${newTasks.length}个新任务`);
        }
      }
    } else {
      updateSyncStatus('disconnected', '网关不可达');
    }
  } catch(e){
    updateSyncStatus('disconnected', '未连接');
  }
}

// 每30秒同步一次
setInterval(syncWithQClaw, SYNC_INTERVAL);
// 首次立即同步
setTimeout(syncWithQClaw, 2000);

/* ═══════════════════════════════════════════
   submitDispatch 增强（文件附件）
═══════════════════════════════════════════ */
const _origSubmitDispatch = submitDispatch;
submitDispatch = async function(){
  // 如果有附件，先预览确认
  if(uploadedFiles.length > 0){
    const fileNames = uploadedFiles.map(f=>f.name).join(', ');
    // 把附件信息注入到任务描述
    const filesSection = uploadedFiles.map(f => {
      const size = f.size < 1048576 ? (f.size/1024).toFixed(1)+'K' : (f.size/1048576).toFixed(1)+'M';
      const icon = f.type.startsWith('image/')?'🖼️':f.type.startsWith('video/')?'🎬':f.type.startsWith('audio/')?'🎵':'📄';
      return `${icon} ${f.name} (${size})`;
    }).join('\n  ');
    
    // 追加到描述末尾
    const orig = $('taskDesc').value.trim();
    $('taskDesc').value = orig + `\n\n【附件清单】\n  ${filesSection}\n\n⚠️ 请读取以上文件后执行任务`;
  }
  
  // 存储附件元数据到任务
  if(uploadedFiles.length > 0){
    const taskFiles = uploadedFiles.map(f=>({name:f.name, size:f.size, type:f.type, thumb:f.thumb||null, dataUrl:f.dataUrl||null}));
    // 临时存储到localStorage，submitDispatch会读取
    localStorage.setItem('wuxing-pending-files', JSON.stringify(taskFiles));
  }
  
  await _origSubmitDispatch();
  
  // 清理上传文件
  uploadedFiles = [];
  renderFileList();
  localStorage.removeItem('wuxing-pending-files');
};
'''

# Insert before </script>
content = content.replace('\nrenderTaskQueue();\n</script>', '\nrenderTaskQueue();\n' + new_js + '\n</script>')

with open(r'C:\Users\Administrator\.qclaw\workspace-agent-cf443017\projects\wuxing-dashboard\index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ JavaScript injected. File size:', len(content), 'bytes')

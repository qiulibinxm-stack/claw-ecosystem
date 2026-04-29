"""
五行备份系统控制台服务器
扩展：代理QClaw API，实现看板↔QClaw双向同步
用法: python server.py
访问: http://localhost:8899
"""
import os, json, hashlib, datetime, subprocess, urllib.request, urllib.error
from pathlib import Path
from flask import Flask, send_file, jsonify, request, abort

BASE_DIR = Path(__file__).parent
BACKUP_ROOT = Path(r"C:\Users\Administrator\QClaw-Backup")
WORKSPACE = Path(r"C:\Users\Administrator\.qclaw\workspace-agent-cf443017")
GATEWAY_URL = "http://127.0.0.1:28789"
GATEWAY_TOKEN = "b110bab36fb6cf116d3a192000e9bd3998e424205f24c07e"
QCLAW_USER_ID = "1452930380"  # 丘禄的微信/企微ID

app = Flask(__name__, static_folder=str(BASE_DIR), static_url_path='')

# ── 备份相关路径 ──
DAILY_DIR = BACKUP_ROOT / "daily"
CATALOG_FILE = BACKUP_ROOT / "catalog" / "五行时间轴.json"
EXCLUDE_DIRS = {"node_modules", "__pycache__", ".git", ".venv", "venv", ".cache", ".tmp"}
EXCLUDE_EXTS = {".pyc", ".pyo", ".log", ".tmp"}

# ── QClaw通信中间文件 ──
MSG_OUT_FILE = WORKSPACE / "queue" / "msg_out.json"  # 看板→QClaw
MSG_IN_FILE  = WORKSPACE / "queue" / "msg_in.json"   # QClaw→看板
TOKEN_FILE   = WORKSPACE / "queue" / "token_today.json"

MSG_OUT_FILE.parent.mkdir(parents=True, exist_ok=True)


# ═══════════════════════════════════════════
#   通用工具
# ═══════════════════════════════════════════

def gateway_request(method, path, data=None, timeout=10):
    """向QClaw Gateway发请求"""
    url = f"{GATEWAY_URL}{path}"
    headers = {
        "Authorization": f"Bearer {GATEWAY_TOKEN}",
        "Content-Type": "application/json"
    }
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode()), resp.status
    except urllib.error.HTTPError as e:
        try:
            return json.loads(e.read().decode()), e.code
        except:
            return {"error": str(e)}, e.code
    except Exception as e:
        return {"error": str(e)}, 500


# ═══════════════════════════════════════════
#   QClaw 代理 API
# ═══════════════════════════════════════════

@app.route("/api/send", methods=["POST"])
def api_send():
    """
    看板 → QClaw：发送任务消息
    Body: { "message": "...", "target": "fire|wood|water|earth|metal|all" }
    """
    data = request.get_json() or {}
    message = data.get("message", "").strip()
    target = data.get("target", "all")

    if not message:
        return jsonify({"success": False, "error": "消息不能为空"}), 400

    # 写入队列文件，QClaw cron 读取并处理
    queue = []
    if MSG_OUT_FILE.exists():
        try:
            queue = json.loads(MSG_OUT_FILE.read_text(encoding="utf-8"))
        except: pass

    queue.append({
        "id": datetime.datetime.now().strftime("%Y%m%d%H%M%S%f"),
        "target": target,
        "message": message,
        "files": data.get("files", []),
        "createdAt": datetime.datetime.now().isoformat(),
        "status": "pending"
    })
    MSG_OUT_FILE.write_text(json.dumps(queue, ensure_ascii=False, indent=2), encoding="utf-8")

    # 同时尝试通过Gateway API直接发到QClaw会话
    send_ok = False
    try:
        resp_data, status = gateway_request("POST", "/v1/sessions/agent-cf443017/messages", {
            "message": message
        })
        if status == 200:
            send_ok = True
    except Exception as e:
        pass  # Gateway不可用则降级到队列模式

    return jsonify({
        "success": True,
        "queued": True,
        "direct": send_ok,
        "message": "任务已派发至QClaw",
        "target": target
    })


@app.route("/api/token-usage", methods=["GET"])
def api_token_usage():
    """
    看板 ← QClaw：获取今日Token消耗
    """
    # 先从缓存文件读（QClaw cron 每15分钟更新一次）
    if TOKEN_FILE.exists():
        try:
            data = json.loads(TOKEN_FILE.read_text(encoding="utf-8"))
            return jsonify({**data, "source": "cache", "cached": True})
        except: pass

    # 从Gateway API读（如果可用）
    try:
        resp_data, status = gateway_request("GET", "/v1/usage/today")
        if status == 200 and resp_data:
            return jsonify({**resp_data, "source": "gateway", "cached": False})
    except: pass

    # 返回空数据（不阻塞UI）
    today = datetime.date.today().isoformat()
    return jsonify({
        "date": today,
        "inputTokens": 0,
        "outputTokens": 0,
        "totalTokens": 0,
        "source": "none",
        "cached": False
    })


@app.route("/api/qclaw-status", methods=["GET"])
def api_qclaw_status():
    """
    看板 ← QClaw：获取会话状态 + 任务同步
    """
    result = {
        "connected": True,
        "sessionCount": 1,
        "agentCount": 6,
        "agents": [
            {"id": "agent-cf443017", "name": "万能虾", "status": "online"},
            {"id": "agent-d6df6112", "name": "炎明曦", "status": "idle"},
            {"id": "agent-40af150b", "name": "林长风", "status": "idle"},
            {"id": "agent-a81a6a89", "name": "程流云", "status": "idle"},
            {"id": "agent-d7701f9e", "name": "安如山", "status": "idle"},
            {"id": "agent-5c9c3fe1", "name": "金锐言", "status": "idle"},
        ],
        "tasks": [],
        "serverTime": datetime.datetime.now().isoformat()
    }

    # 读取QClaw→看板的队列（如果有响应消息）
    if MSG_IN_FILE.exists():
        try:
            messages = json.loads(MSG_IN_FILE.read_text(encoding="utf-8"))
            result["messages"] = messages[-10:]  # 最近10条
        except: pass

    return jsonify(result)


@app.route("/api/upload", methods=["POST"])
def api_upload():
    """
    看板 → QClaw：上传文件（存储到workspace供QClaw读取）
    Body: multipart/form-data 或 JSON { files: [{name, type, data(base64)}] }
    """
    data = request.get_json() or {}
    files = data.get("files", [])

    if not files:
        # 处理 multipart upload
        uploaded = []
        for fname, f in request.files.items():
            content = f.read()
            size = len(content)
            ext = Path(fname).suffix.lower()
            storage_dir = WORKSPACE / "uploads" / datetime.date.today().isoformat()
            storage_dir.mkdir(parents=True, exist_ok=True)
            dest = storage_dir / fname
            dest.write_bytes(content)
            uploaded.append({
                "name": fname,
                "size": size,
                "path": str(dest.relative_to(WORKSPACE)),
                "type": f.content_type or "application/octet-stream"
            })
        return jsonify({"success": True, "files": uploaded})

    # JSON 模式（base64）
    uploaded = []
    storage_dir = WORKSPACE / "uploads" / datetime.date.today().isoformat()
    storage_dir.mkdir(parents=True, exist_ok=True)
    for f in files:
        name = f.get("name", "file")
        import base64
        try:
            content = base64.b64decode(f.get("data", ""))
        except:
            content = f.get("data", "").encode()
        dest = storage_dir / name
        dest.write_bytes(content)
        uploaded.append({
            "name": name,
            "size": len(content),
            "path": str(dest.relative_to(WORKSPACE)),
            "type": f.get("type", "application/octet-stream"),
            "thumb": f.get("thumb", None)
        })

    return jsonify({"success": True, "files": uploaded})


# ═══════════════════════════════════════════
#   备份原有路由
# ═══════════════════════════════════════════

def get_changed_files(root, exclude_dirs, exclude_exts):
    today = datetime.date.today().isoformat()
    changes = []
    for f in root.rglob("*"):
        if f.is_file():
            rel = f.relative_to(root)
            if any(part in exclude_dirs or rel.suffix in exclude_exts for part in rel.parts):
                continue
            mtime = datetime.datetime.fromtimestamp(f.stat().st_mtime)
            if mtime.date().isoformat() == today:
                changes.append({
                    "path": str(rel), "size_kb": round(f.stat().st_size/1024,1),
                    "mtime": mtime.strftime("%H:%M:%S"), "category": guess_category(str(rel))
                })
    return changes

def guess_category(path):
    p = path.lower()
    if "workspace" in p or "projects" in p: return "workspace"
    if "memory" in p: return "memory"
    if "agents" in p or "agent-" in p: return "agents"
    if "skill" in p or "skills" in p: return "skills"
    if "knowledge" in p: return "knowledge"
    if "config" in p: return "config"
    return "其他"

def load_timeline():
    if CATALOG_FILE.exists():
        with open(CATALOG_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"version": "1.0", "entries": []}

def save_timeline(data):
    CATALOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(CATALOG_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def calc_md5(file_path):
    h = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""): h.update(chunk)
    return h.hexdigest()

def do_backup():
    today = datetime.date.today().isoformat()
    pkg_name = f"{today}-五行增量.tar.gz"
    pkg_path = DAILY_DIR / pkg_name
    manifest_name = f"{today}-manifest.json"
    manifest_path = DAILY_DIR / manifest_name
    DAILY_DIR.mkdir(parents=True, exist_ok=True)
    changes = get_changed_files(WORKSPACE, EXCLUDE_DIRS, EXCLUDE_EXTS)
    if changes:
        import tarfile, io
        buf = io.BytesIO()
        with tarfile.open(fileobj=buf, mode="w:gz") as tar:
            for c in changes:
                fpath = WORKSPACE / c["path"]
                if fpath.exists(): tar.add(fpath, arcname=c["path"])
        buf.seek(0)
        with open(pkg_path, "wb") as out: out.write(buf.read())
        md5_val = calc_md5(pkg_path)
        with open(manifest_path, "w", encoding="utf-8") as f:
            json.dump({"date": today, "files": changes, "total": len(changes)}, f, ensure_ascii=False, indent=2)
        with open(DAILY_DIR / f"{today}.md5", "w") as f:
            f.write(f"{md5_val}  {pkg_name}\n")
        size_mb = round(pkg_path.stat().st_size/1024, 1)
    else:
        md5_val = "da39a3ee5e6b4b0d3255bfef95601890afd80709"
        size_mb = 0.0
    timeline = load_timeline()
    cats = {}
    for c in changes: cats[c["category"]] = cats.get(c["category"], 0) + 1
    cats_str = " · ".join(f"{k}={v}" for k, v in cats.items()) if cats else "其他=0"
    new_entry = {
        "date": today, "type": "daily", "description": f"增量备份 ({cats_str})",
        "packages": [f"daily/{pkg_name}"], "total_size_mb": size_mb,
        "changed_files": len(changes), "categories": cats or {"其他": 0},
        "created": datetime.datetime.now().isoformat()
    }
    timeline["entries"] = [e for e in timeline["entries"] if e["date"] != today]
    timeline["entries"].insert(0, new_entry)
    save_timeline(timeline)
    return {"success": True, "date": today, "files": len(changes), "size_kb": size_mb,
            "md5": md5_val, "categories": cats}

@app.route("/")
def index():
    # 优先用wuxing-dashboard.html
    dash = BASE_DIR / "wuxing-dashboard.html"
    if dash.exists():
        return send_file(dash)
    return send_file(BASE_DIR / "index.html")

@app.route("/dashboard")
def dashboard():
    return send_file(BASE_DIR / "wuxing-dashboard.html")

@app.route("/backup/run", methods=["POST"])
def backup_run():
    try: return jsonify(do_backup())
    except Exception as e: return jsonify({"success": False, "error": str(e)}), 500

@app.route("/backup/status", methods=["GET"])
def backup_status():
    timeline = load_timeline()
    entries = timeline.get("entries", [])
    return jsonify({
        "success": True, "total_backups": len(entries),
        "total_files": sum(e.get("changed_files",0) for e in entries),
        "total_size_mb": round(sum(e.get("total_size_mb",0) for e in entries),1),
        "latest": entries[0] if entries else None, "entries": entries
    })

@app.route("/backup/restore", methods=["POST"])
def backup_restore():
    date = request.args.get("date")
    if not date: return jsonify({"success":False,"error":"缺少日期参数"}), 400
    pkg_path = DAILY_DIR / f"{date}-五行增量.tar.gz"
    if not pkg_path.exists(): return jsonify({"success":False,"error":f"找不到{date}的备份"}), 404
    import tarfile
    restore_dir = BACKUP_ROOT / "_pre_restore" / date
    restore_dir.mkdir(parents=True, exist_ok=True)
    try:
        with tarfile.open(pkg_path, "r:gz") as tar: tar.extractall(restore_dir)
        restored_files = list(restore_dir.rglob("*"))
        return jsonify({
            "success": True, "date": date,
            "files": len([f for f in restored_files if f.is_file()]),
            "restore_path": str(restore_dir),
            "message": f"已恢复到{restore_dir}，请手动检查后覆盖"
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    print("[*] 五行备份系统控制台 (含QClaw代理)")
    print(f"[*] 工作区: {WORKSPACE}")
    print(f"[*] 备份目录: {BACKUP_ROOT}")
    print(f"[*] Gateway: {GATEWAY_URL}")
    print("[*] 访问: http://localhost:8899")
    print("[*] 看板: http://localhost:8899/dashboard")
    app.run(host="0.0.0.0", port=8899, debug=False)

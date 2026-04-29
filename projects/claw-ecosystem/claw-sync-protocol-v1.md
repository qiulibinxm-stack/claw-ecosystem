# 龙虾同步协议 v1 (Claw Sync Protocol v1)

> **定位**：AI Agent 的开放交换协议，类比 Git 之于 GitHub  
> **目标**：让任何平台的 AI Agent 都能被导出、发现、导入、复用  
> **状态**：🟢 正式版 v1.0.0（含完整安全设计）

---

## 一、协议概述

### 1.1 核心理念

**三位一体模型**：
```
Agent（虾） = 身份元数据 + 能力声明 + 运行时配置
```

- **身份元数据**：这只虾是谁？长什么样？属于谁？
- **能力声明**：它能做什么？有哪些技能？
- **运行时配置**：它在你的环境里怎么跑？
- **安全门禁**：什么能同步？什么绝对禁止？

### 1.2 协议流程

```
[导出] QClaw/OpenClaw → 选择性同步面板 → 生成 claw-agent.json → 上传到生态网（触发云端扫描）
[发现] 生态网展示所有公开的 Agent → 用户浏览/搜索 → 查看安全报告
[导入] 用户下载 claw-agent.json → 本地安全扫描 → 权限确认 → 导入到本地（默认只读）
[运行] 用户手动激活后，Agent才能在本地运行（数据不出本地）
```

### 1.3 安全设计原则（用户核心关切）

| 铁律 | 说明 | 违反后果 |
|------|------|----------|
| **最小暴露** | 只同步"让别人能用这只虾"的最少数据 | 隐私泄露 |
| **敏感隔离** | API Key/密码/历史对话永远不上传 | 账号被盗 |
| **默认安全** | 导出时默认排除所有敏感字段 | 用户无感知泄露 |
| **三层扫描** | 上传前（本地）+ 上传后（云端）+ 安装前（本地） | 恶意代码注入 |
| **权限透明** | 明确声明这只虾需要什么权限 | 越权操作 |

---

## 二、数据模型（Schema）

### 2.1 顶层结构

```json
{
  "schema": "claw-sync/v1",
  "version": "1.0.0",
  "agent": { ... },
  "skills": [ ... ],
  "permissions": { ... },
  "security": { ... },
  "metadata": { ... }
}
```

### 2.2 Agent 对象

```json
{
  "agent": {
    "id": "fire-yi-ming-xi",
    "name": "炎明曦",
    "element": "fire",
    "role": "战略愿景官",
    "avatar": {
      "type": "emoji",
      "emoji": "🔥"
    },
    "description": "洞察本质，引领方向。专注战略分析与趋势研究。",
    "quote": "数据会说谎，但趋势不会。",
    "status": "active",
    "created_at": "2026-04-29T00:00:00Z",
    "updated_at": "2026-04-29T00:00:00Z"
  }
}
```

#### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 全局唯一标识，格式：`{element}-{slug}` |
| `name` | string | ✅ | 显示名称 |
| `element` | string | ✅ | 五行属性：`fire`/`wood`/`water`/`earth`/`metal` |
| `role` | string | ✅ | 角色定位 |
| `avatar.type` | string | ✅ | `image` 或 `emoji` |
| `avatar.emoji` | string | ⚠️ | Emoji fallback（type=emoji时必填） |
| `avatar.url` | string | ⚠️ | 图片URL（type=image时必填，**禁止data:协议**） |
| `description` | string | ✅ | 一句话介绍 |
| `quote` | string | ❌ | 代表性语录 |
| `status` | string | ✅ | `active`/`archived`/`deprecated` |
| `created_at` | string | ✅ | ISO 8601 时间戳 |
| `updated_at` | string | ✅ | 最后更新时间 |

### 2.3 Skills 数组

```json
{
  "skills": [
    {
      "id": "skill-market-research",
      "name": "市场调研",
      "version": "1.2.0",
      "description": "自动化市场调研，生成结构化报告",
      "category": "research",
      "requires": {
        "runtime": ["python>=3.9"],
        "apis": ["amap", "tavily"],
        "skills": []
      },
      "capabilities": [
        "高德地图POI查询",
        "竞品SWOT分析",
        "在线口碑抓取"
      ],
      "exclude_from_sync": false
    }
  ]
}
```

#### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | Skill唯一标识 |
| `name` | string | ✅ | 显示名称 |
| `version` | string | ✅ | 语义化版本号 |
| `description` | string | ✅ | 功能描述 |
| `category` | string | ✅ | 分类：`research`/`coding`/`design`/`ops`/`content` |
| `requires.runtime` | array | ❌ | 运行时要求（Python/Node版本等） |
| `requires.apis` | array | ❌ | 依赖的API服务（**不含API Key**） |
| `requires.skills` | array | ❌ | 依赖的其他Skill |
| `capabilities` | array | ✅ | 具体能力列表（用于搜索匹配） |
| `exclude_from_sync` | boolean | ❌ | 用户选择不同步此Skill（默认false） |

### 2.4 Permissions 对象（新增 - 权限声明）

```json
{
  "permissions": {
    "network": {
      "allowed": true,
      "domains": ["api.amap.com", "api.tavily.com"],
      "reason": "调用高德地图API和Tavily搜索"
    },
    "file_read": {
      "allowed": true,
      "paths": ["knowledge/", "projects/"],
      "reason": "读取知识库和项目文件"
    },
    "file_write": {
      "allowed": false,
      "paths": [],
      "reason": "不需要写入文件"
    },
    "api_access": {
      "allowed": true,
      "apis": ["amap", "tavily"],
      "reason": "需要调用地图和搜索API"
    },
    "system_access": {
      "allowed": false,
      "capabilities": [],
      "reason": "不需要系统级权限"
    },
    "execution": {
      "allowed": true,
      "timeout_seconds": 300,
      "reason": "需要执行代码生成报告"
    }
  }
}
```

#### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `network.allowed` | boolean | ✅ | 是否允许网络访问 |
| `network.domains` | array | ⚠️ | 允许的域名白名单（allowed=true时必填） |
| `network.reason` | string | ✅ | 为什么需要网络访问 |
| `file_read.allowed` | boolean | ✅ | 是否允许读取文件 |
| `file_read.paths` | array | ⚠️ | 允许读取的路径白名单 |
| `file_write.allowed` | boolean | ✅ | 是否允许写入文件 |
| `file_write.paths` | array | ⚠️ | 允许写入的路径白名单 |
| `api_access.allowed` | boolean | ✅ | 是否允许调用API |
| `api_access.apis` | array | ⚠️ | 允许的API列表（**不含Key**） |
| `system_access.allowed` | boolean | ✅ | 是否允许系统级访问（危险！） |
| `execution.allowed` | boolean | ✅ | 是否允许执行代码 |
| `execution.timeout_seconds` | number | ⚠️ | 执行超时时间（allowed=true时必填） |

### 2.5 Security 对象（新增 - 安全扫描结果）

```json
{
  "security": {
    "scanned": true,
    "scan_date": "2026-04-29T00:00:00Z",
    "scan_result": "clean",
    "scanner_version": "1.0.0",
    "scan_details": {
      "virus_scan": "passed",
      "malicious_code": "not_detected",
      "sensitive_data": "filtered",
      "permissions_verified": true
    },
    "local_scan": {
      "scanned": true,
      "sensitive_data_found": false,
      "excluded_fields": ["TOOLS.md", "USER.md", "API Keys"]
    }
  }
}
```

#### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `scanned` | boolean | ✅ | 是否已通过云端扫描 |
| `scan_date` | string | ⚠️ | 扫描时间（scanned=true时必填） |
| `scan_result` | string | ⚠️ | 扫描结果：`clean`/`suspicious`/`malicious` |
| `scanner_version` | string | ⚠️ | 扫描器版本 |
| `scan_details.virus_scan` | string | ✅ | 病毒扫描结果：`passed`/`failed` |
| `scan_details.malicious_code` | string | ✅ | 恶意代码检测：`not_detected`/`detected` |
| `scan_details.sensitive_data` | string | ✅ | 敏感数据处理：`filtered`/`found`/`none` |
| `scan_details.permissions_verified` | boolean | ✅ | 权限声明是否验证通过 |
| `local_scan.scanned` | boolean | ✅ | 导出前是否做了本地扫描 |
| `local_scan.sensitive_data_found` | boolean | ✅ | 本地扫描是否发现敏感数据 |
| `local_scan.excluded_fields` | array | ⚠️ | 用户选择排除的字段列表 |

### 2.6 Metadata 对象（含排除列表）

```json
{
  "metadata": {
    "owner": {
      "platform": "qclaw",
      "user_id": "user-xxx",
      "display_name": "丘禄"
    },
    "source": {
      "platform": "qclaw",
      "workspace": "agent-cf443017",
      "exported_at": "2026-04-29T00:00:00Z"
    },
    "excludes": {
      "skills": ["skill-bazi-master"],
      "configs": ["TOOLS.md", "USER.md"],
      "history": true,
      "api_keys": true,
      "passwords": true
    },
    "stats": {
      "imports": 0,
      "rating": null,
      "reviews": 0
    },
    "license": "MIT",
    "tags": ["战略", "市场调研", "趋势分析"],
    "visibility": "public"
  }
}
```

#### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `owner.platform` | string | ✅ | 来源平台：`qclaw`/`openclaw`/`other` |
| `owner.user_id` | string | ✅ | 用户标识（匿名化） |
| `owner.display_name` | string | ❌ | 展示名称 |
| `source.platform` | string | ✅ | 导出平台 |
| `source.workspace` | string | ❌ | 工作区标识 |
| `source.exported_at` | string | ✅ | 导出时间 |
| `excludes.skills` | array | ❌ | 用户选择不同步的Skill ID列表 |
| `excludes.configs` | array | ❌ | 用户选择不同步的配置文件列表 |
| `excludes.history` | boolean | ✅ | 是否排除聊天历史（默认true） |
| `excludes.api_keys` | boolean | ✅ | 是否排除API Key（默认true，强制） |
| `excludes.passwords` | boolean | ✅ | 是否排除密码（默认true，强制） |
| `stats.imports` | number | ❌ | 被导入次数（由生态网维护） |
| `stats.rating` | number | ❌ | 平均评分 0-5（由生态网维护） |
| `stats.reviews` | number | ❌ | 评价数量（由生态网维护） |
| `license` | string | ✅ | 许可证：`MIT`/`Apache-2.0`/`proprietary` |
| `tags` | array | ✅ | 标签（用于搜索） |
| `visibility` | string | ✅ | `public`/`unlisted`/`private` |

---

## 三、同步边界（什么能同步，什么不能）

### 3.1 白名单（可以同步）

✅ **公开数据**：
- Agent身份（名字/角色/五行属性/头像）
- 技能列表（技能名/描述/能力清单/版本号）
- SOUL.md（角色定义，但需扫描敏感词）
- 公开配置（模型选择/温度参数/token限制）
- 作者信息（匿名化用户ID，不含真实姓名/邮箱）
- 权限声明（permissions字段，不含实际Key）
- 技能依赖（requires字段，不含API Key）

### 3.2 黑名单（绝对禁止同步）

❌ **敏感数据（永远不上传）**：

| 类别 | 具体内容 | 处理方式 |
|------|----------|----------|
| **认证凭证** | API Key / Secret / Token / OAuth刷新令牌 | 强制过滤，不在JSON中出现 |
| **账号密码** | 谷歌账号/微信密码/邮箱密码/数据库密码 | 强制过滤 |
| **聊天记录** | MEMORY.md / memory/*.md / 对话历史 | 默认排除，用户无法选择同步 |
| **本地配置** | TOOLS.md / 本地文件路径 / 系统信息 | 默认排除 |
| **私有数据** | 用户姓名/手机号/邮箱/住址 | 强制过滤 |
| **财务信息** | 信用卡号/银行账号/支付密码 | 强制过滤 |

### 3.3 灰名单（用户可选择）

⚠️ **用户可选择的排除项**：

| 内容 | 默认 | 用户可修改 |
|------|------|------------|
| 特定Skill（如私人训练的八字技能） | 包含 | ✅ 可排除 |
| USER.md（用户偏好设置） | 排除 | ✅ 可包含（需警告） |
| 样本对话（最多3条，匿名化） | 排除 | ✅ 可包含 |
| 项目文件（projects/下的特定文件） | 排除 | ✅ 可包含 |

---

## 四、导出规范

### 4.1 选择性同步面板（UI设计）

**用户需求**：需要一个"全数据看板"来选择同步哪些内容。

**UI设计草图**：

```
┌─────────────────────────────────────────┐
│  🦞 同步配置面板 - 炎明曦                    │
├─────────────────────────────────────────┤
│                                          │
│  ✅ 基本信息（必选）                         │
│     ☑ 名字/角色/五行属性                     │
│     ☑ 头像（emoji或图片URL）                 │
│                                          │
│  🔥 技能配置（可多选）                       │
│     ☑ 市场调研（skill-market-research）      │
│     ☑ 趋势分析（skill-trend-analysis）      │
│     ☐ 八字精算（skill-bazi-master）⚠️ 私人技能 │
│     ☐ 我的秘密技能 ⚠️ 包含API Key          │
│                                          │
│  📄 配置文件（选择性）                       │
│     ☑ SOUL.md（角色定义）                    │
│     ☐ USER.md（用户偏好）⚠️ 含私人信息      │
│     ☐ TOOLS.md ⚠️ 含API Key               │
│                                          │
│  💬 对话数据（不包含）                       │
│     ☐ 导出样本对话（最多3条，匿名化）        │
│     ❌ 完整聊天历史（永远不同步）             │
│                                          │
│  🔒 敏感数据检查                            │
│     ✅ 未检测到API Key                      │
│     ⚠️ 发现2处可能的敏感路径                │
│     [查看详情]                             │
│                                          │
│  [预览JSON] [导出并上传]                     │
└─────────────────────────────────────────┘
```

### 4.2 标准导出流程

**QClaw/OpenClaw 内部**：

```python
# 伪代码
def export_agent_secure(agent_config, user_selections):
    # 1. 敏感数据扫描（强制）
    sensitive_found = scan_sensitive_data(agent_config)
    if sensitive_found:
        warn(f"发现敏感数据：{sensitive_found}")
        # 自动添加到排除列表
        user_selections.excludes.update(sensitive_found)
    
    # 2. 按用户选择过滤
    filtered_config = filter_by_selection(agent_config, user_selections)
    
    # 3. 二次扫描（确保过滤生效）
    if scan_sensitive_data(filtered_config):
        raise SecurityError("过滤失败，仍有敏感数据")
    
    # 4. 构建协议对象
    claw_json = {
        "schema": "claw-sync/v1",
        "version": "1.0.0",
        "agent": build_agent_object(filtered_config),
        "skills": build_skills_array(filtered_config, user_selections),
        "permissions": build_permissions(filtered_config),
        "security": {
            "scanned": True,
            "local_scan": {
                "scanned": True,
                "sensitive_data_found": False,
                "excluded_fields": user_selections.excludes
            }
        },
        "metadata": build_metadata(filtered_config, user_selections)
    }
    
    # 5. 生成预览（用户确认）
    preview_result = show_preview(claw_json)
    if not preview_result.confirmed:
        return "CANCELLED"
    
    # 6. 写入文件
    write_file("claw-agent.json", claw_json)
    
    # 7. 上传到生态网（触发云端扫描）
    if upload_to_ecosystem:
        response = post("https://ecosystem.claw/api/v1/agents", claw_json)
        # 云端扫描开始...
        return response
```

### 4.3 敏感数据扫描规则

**扫描目标**：
- API Key模式：`sk-xxxx`, `api_key`, `secret_key`, `AK-xxxx` 等
- 密码字段：`password`, `passwd`, `pwd`, `token` 等
- 路径泄露：`C:\Users\`, `/home/user/`, `/var/www/` 等
- 个人信息：`email`, `phone`, `address` 等

**扫描逻辑**：
```python
def scan_sensitive_data(config):
    sensitive_found = []
    
    # 1. 正则匹配API Key
    api_key_patterns = [
        r'sk-[a-zA-Z0-9]{32,}',  # OpenAI格式
        r'AK-[a-zA-Z0-9]{32,}',  # 阿里云格式
        r'api_key["\s:]+[^\s"]+', # 通用格式
    ]
    for pattern in api_key_patterns:
        if re.search(pattern, str(config)):
            sensitive_found.append(f"可能的API Key（匹配：{pattern}）")
    
    # 2. 关键词匹配
    sensitive_keywords = ['password', 'secret', 'token', 'credential']
    for keyword in sensitive_keywords:
        if keyword in str(config).lower():
            sensitive_found.append(f"包含敏感关键词：{keyword}")
    
    # 3. 路径检测
    path_patterns = [
        r'C:\\[Uu]sers\\[^\\]+',  # Windows用户路径
        r'/home/[^/]+',            # Linux用户路径
    ]
    for pattern in path_patterns:
        if re.search(pattern, str(config)):
            sensitive_found.append(f"包含本地路径（匹配：{pattern}）")
    
    return sensitive_found
```

### 4.4 文件命名

- **标准文件名**：`claw-agent.json`
- **带标识**：`claw-agent-{agent-id}.json`（如 `claw-agent-fire-yi-ming-xi.json`）

---

## 五、导入规范

### 5.1 三层安全扫描

#### 第一层：上传到生态网时（云端扫描）

```
生态网服务器扫描（自动）：
├─ 病毒扫描（ClamAV或类似）
│   └─ 扫描JSON文件 + 内嵌的任何代码/脚本
├─ 恶意代码检测（静态分析）
│   └─ 检测危险函数调用：exec/eval/system/os.popen等
├─ 敏感词过滤
│   └─ 再次扫描API Key/password/secret等
├─ 权限声明验证
│   └─ 检查permissions字段是否合理
└─ 生成安全报告
    └─ 返回 scan_result: "clean"/"suspicious"/"malicious"
```

#### 第二层：下载到本地时（本地扫描）

```python
# 伪代码
def import_agent_secure(json_file_or_url):
    # 1. 获取JSON
    if is_url(json_file_or_url):
        claw_json = fetch(json_file_or_url)
    else:
        claw_json = read_file(json_file_or_url)
    
    # 2. 验证Schema
    if not validate_schema(claw_json, "claw-sync/v1"):
        raise InvalidSchemaError()
    
    # 3. 本地安全扫描（双重保险）
    local_scan_result = local_security_scan(claw_json)
    if local_scan_result.threat_detected:
        warn(f"本地扫描发现威胁：{local_scan_result.details}")
        # 让用户决定是否继续
        if not user_confirms_continue():
            return "CANCELLED"
    
    # 4. 显示权限要求（用户确认）
    permissions = extract_permissions(claw_json)
    show_permissions_warning(permissions)
    if not user_confirms_permissions(permissions):
        return "CANCELLED"
    
    # 5. 显示安全报告
    security = claw_json.get("security", {})
    show_security_report(security)
    
    # 6. 导入到本地（默认只读模式）
    create_agent_from_json(claw_json, mode="readonly")
    
    # 7. 上报统计（可选）
    if claw_json["metadata"]["source"]["platform"] == "qclaw":
        post("https://ecosystem.claw/api/v1/agents/{agent_id}/import", {
            "agent_id": claw_json["agent"]["id"],
            "imported_at": now(),
            "security_scan_passed": local_scan_result.passed
        })
    
    # 8. 提示用户如何激活
    show_activation_hint()
```

#### 第三层：用户激活时（运行时门禁）

```python
# 用户手动点击"激活"后
def activate_agent(agent_id):
    agent = get_agent(agent_id)
    
    # 1. 再次检查权限
    if agent.permissions.system_access.allowed:
        warn("此Agent需要系统级权限，确认要继续吗？")
        if not user_confirms:
            return "CANCELLED"
    
    # 2. 设置沙箱环境（如果技术可行）
    if sandbox_available:
        agent.run_env = "sandbox"
    else:
        agent.run_env = "isolated"  # 只读模式，不能写文件
    
    # 3. 激活
    agent.status = "active"
    save_agent(agent)
    
    # 4. 提示用户
    show_message("Agent已激活，现在可以运行了！")
```

### 5.2 导入后行为

- **默认状态**：导入的Agent处于**只读模式**（不能执行，只能查看配置）
- **用户授权**：用户手动点击"激活"后，Agent才能运行
- **权限隔离**：导入的Agent只能访问自己的对话历史，不能访问用户其他数据
- **沙箱运行**：如果技术可行，在沙箱中运行；否则在隔离模式运行

### 5.3 安全报告展示

**下载时显示报告**：

```
┌─────────────────────────────────────────┐
│  🔍 安全扫描报告 - 炎明曦               │
├─────────────────────────────────────────┤
│                                          │
│  上传时云端扫描：                          │
│  ✅ 病毒扫描：通过                         │
│  ✅ 恶意代码：未发现                       │
│  ⚠️ 敏感词：发现1处（已自动脱敏）        │
│  ✅ 权限声明：验证通过                     │
│                                          │
│  下载时本地扫描：                          │
│  ✅ 本地扫描：通过                         │
│  ✅ 未检测到威胁                          │
│                                          │
│  权限要求：                                │
│  ⚠️ 网络访问：需要（api.amap.com等）     │
│  ⚠️ 文件读取：需要（knowledge/等）        │
│  ✅ 文件写入：不需要                       │
│  ⚠️ 代码执行：需要（超时300秒）           │
│                                          │
│  [查看详细报告] [仍然下载] [取消]          │
└─────────────────────────────────────────┘
```

---

## 六、API 接口（生态网）

### 6.1 上传 Agent

```
POST /api/v1/agents
Content-Type: application/json

{ /* claw-sync/v1 JSON */ }
```

**响应**：
```json
{
  "success": true,
  "agent_id": "fire-yi-ming-xi",
  "url": "https://ecosystem.claw/agents/fire-yi-ming-xi",
  "security_scan": {
    "scan_id": "scan-xxx",
    "status": "pending",
    "estimated_time_seconds": 30
  }
}
```

### 6.2 查询扫描结果

```
GET /api/v1/agents/{agent_id}/security-scan
```

**响应**：
```json
{
  "scan_id": "scan-xxx",
  "status": "completed",
  "result": "clean",
  "details": {
    "virus_scan": "passed",
    "malicious_code": "not_detected",
    "sensitive_data": "filtered"
  }
}
```

### 6.3 搜索 Agent

```
GET /api/v1/agents?q=市场调研&element=fire&sort=imports
```

**响应**：
```json
{
  "total": 42,
  "agents": [ /* claw-sync/v1 数组 */ ]
}
```

### 6.4 获取 Agent

```
GET /api/v1/agents/{agent_id}
```

### 6.5 导入统计

```
POST /api/v1/agents/{agent_id}/import
```

---

## 七、完整性检查清单

### 7.1 导出前必查（导出方）

- [ ] 未包含任何API Key / Secret / Token
- [ ] 未包含任何密码 / 账号信息
- [ ] 未包含聊天历史 / MEMORY.md / memory/*.md
- [ ] 未包含本地文件路径（C:\Users\... / /home/user/...）
- [ ] 用户已确认排除列表（excludes字段）
- [ ] 权限声明合理（permissions字段）
- [ ] 用户已预览JSON并确认

### 7.2 导入前必查（导入方）

- [ ] JSON Schema验证通过
- [ ] 本地安全扫描通过
- [ ] 用户已确认权限要求
- [ ] 用户已查看安全报告
- [ ] 导入后默认只读模式
- [ ] 用户手动激活才能运行

### 7.3 生态网必查（平台方）

- [ ] 病毒扫描通过
- [ ] 恶意代码检测通过
- [ ] 敏感词过滤完成
- [ ] 权限声明验证通过
- [ ] 生成安全报告并公示
- [ ] 支持用户举报可疑Agent

---

## 八、扩展性设计

### 8.1 未来版本规划

| 版本 | 日期 | 计划功能 |
|------|------|----------|
| v1.0 | 2026-04-29 | 基础导出/导入，完整安全设计，三层扫描 |
| v1.1 | 2026-05 | 增加 `capabilities` 标准化词汇表 |
| v1.2 | 2026-06 | 支持 Skill 依赖自动安装（沙箱环境） |
| v2.0 | 2026-08 | 运行时沙箱，支持执行导入的Agent |
| v2.1 | 2026-10 | Agent 组合（多Agent协作编排） |
| v3.0 | 2027-01 | 跨平台Agent迁移（QClaw ↔ OpenClaw ↔ 其他） |

### 8.2 自定义扩展

允许平台在 `metadata.extensions` 中添加自定义字段：

```json
{
  "metadata": {
    "extensions": {
      "qclaw": {
        "workspace": "agent-cf443017",
        "model_preference": "qclaw/modelroute"
      },
      "openclaw": {
        "gateway_url": "https://...",
        "agent_id": "xxx"
      }
    }
  }
}
```

---

## 九、完整示例

### 9.1 炎明曦（火）- 完整导出示例

```json
{
  "schema": "claw-sync/v1",
  "version": "1.0.0",
  "agent": {
    "id": "fire-yi-ming-xi",
    "name": "炎明曦",
    "element": "fire",
    "role": "战略愿景官",
    "avatar": {
      "type": "emoji",
      "emoji": "🔥"
    },
    "description": "洞察本质，引领方向。专注战略分析与趋势研究。",
    "quote": "数据会说谎，但趋势不会。",
    "status": "active",
    "created_at": "2026-04-15T00:00:00Z",
    "updated_at": "2026-04-29T00:00:00Z"
  },
  "skills": [
    {
      "id": "skill-market-research",
      "name": "市场调研",
      "version": "1.2.0",
      "description": "自动化市场调研，生成结构化报告",
      "category": "research",
      "requires": {
        "runtime": ["python>=3.9"],
        "apis": ["amap", "tavily"],
        "skills": []
      },
      "capabilities": [
        "高德地图POI查询",
        "竞品SWOT分析",
        "在线口碑抓取"
      ],
      "exclude_from_sync": false
    }
  ],
  "permissions": {
    "network": {
      "allowed": true,
      "domains": ["api.amap.com", "api.tavily.com"],
      "reason": "调用高德地图API和Tavily搜索"
    },
    "file_read": {
      "allowed": true,
      "paths": ["knowledge/", "projects/"],
      "reason": "读取知识库和项目文件"
    },
    "file_write": {
      "allowed": false,
      "paths": [],
      "reason": "不需要写入文件"
    },
    "api_access": {
      "allowed": true,
      "apis": ["amap", "tavily"],
      "reason": "需要调用地图和搜索API"
    },
    "system_access": {
      "allowed": false,
      "capabilities": [],
      "reason": "不需要系统级权限"
    },
    "execution": {
      "allowed": true,
      "timeout_seconds": 300,
      "reason": "需要执行代码生成报告"
    }
  },
  "security": {
    "scanned": true,
    "scan_date": "2026-04-29T00:00:00Z",
    "scan_result": "clean",
    "scanner_version": "1.0.0",
    "scan_details": {
      "virus_scan": "passed",
      "malicious_code": "not_detected",
      "sensitive_data": "filtered",
      "permissions_verified": true
    },
    "local_scan": {
      "scanned": true,
      "sensitive_data_found": false,
      "excluded_fields": ["TOOLS.md", "USER.md"]
    }
  },
  "metadata": {
    "owner": {
      "platform": "qclaw",
      "user_id": "user-xxx",
      "display_name": "丘禄"
    },
    "source": {
      "platform": "qclaw",
      "workspace": "agent-cf443017",
      "exported_at": "2026-04-29T00:00:00Z"
    },
    "excludes": {
      "skills": [],
      "configs": ["TOOLS.md", "USER.md"],
      "history": true,
      "api_keys": true,
      "passwords": true
    },
    "stats": {
      "imports": 0,
      "rating": null,
      "reviews": 0
    },
    "license": "MIT",
    "tags": ["战略", "市场调研", "趋势分析"],
    "visibility": "public"
  }
}
```

---

## 附录：常见问题

### Q1: API Key会不会同步进去？

**A**: 绝对不会！协议明确禁止同步任何认证凭证。导出时会自动扫描并过滤API Key/Secret/Token。如果检测到，会自动添加到`excludes`字段，并在安全报告中提示。

### Q2: 谷歌账号密码会不会同步进去？

**A**: 永远不可能！密码属于"敏感数据黑名单"，强制过滤，不在JSON中出现。即使用户想包含，系统也会阻止。

### Q3: 能不能只同步哪些技能？

**A**: 可以！导出时会出现"选择性同步面板"，你可以勾选要同步的Skill。未勾选的Skill会出现在`metadata.excludes.skills`列表中。

### Q4: 能不能自定义把列出来的某些不同步？

**A**: 可以！你可以自定义排除：
- 特定Skill（如私人训练的八字技能）
- 配置文件（如TOOLS.md、USER.md）
- 样本对话（最多3条，匿名化）
- 聊天历史（永远排除，不可选择）

### Q5: 下载后需要安全扫描吗？

**A**: 必须！三层扫描保障安全：
1. **上传前**：本地扫描（导出方）
2. **上传后**：云端扫描（生态网服务器）
3. **下载后**：本地扫描（导入方，双重保险）

### Q6: 安全以后才给安装吗？

**A**: 是的！流程是：
1. 下载JSON → 本地安全扫描
2. 显示权限要求 + 安全报告
3. 用户手动确认后才安装
4. 安装后默认**只读模式**，不能执行
5. 用户手动点击"激活"后，才能运行

### Q7: 能不能设计一个虾的各项能力，技能各种数据？

**A**: 可以！你可以完全自定义：
- Agent身份（名字/角色/五行/头像）
- 技能列表（增删改Skill）
- 权限声明（需要什么权限）
- 排除列表（不同步哪些数据）

然后使用"选择性同步面板"导出你设计的虾。

---

*协议版本：v1.0.0*  
*最后更新：2026-04-29*  
*维护者：龙虾生态项目组*

---

## 用户确认的核心需求（已纳入协议）

✅ **API Key/密码/历史记录绝对不同步** → 黑名单强制过滤  
✅ **选择性同步面板**（全数据看板） → 用户可勾选要同步的内容  
✅ **自定义排除列表** → excludes字段支持细粒度控制  
✅ **三层安全扫描** → 上传前+上传后+下载后  
✅ **权限透明声明** → permissions字段明确声明这只虾需要什么权限  
✅ **安全报告公示** → 下载前必须查看安全报告  
✅ **默认只读模式** → 导入后不能执行，手动激活才行  

**结论**：这个协议设计已经完全回应了你的所有关切！🎉

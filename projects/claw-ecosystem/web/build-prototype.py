#!/usr/bin/env python3
"""生成龙虾生态网站设计原型"""
import os

out = os.path.join(os.path.dirname(__file__), "design-prototype.html")

html = r'''<!DOCTYPE html>
<html lang="zh-CN" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>🦞 龙虾生态 - 设计原型 v1</title>
<style>
:root{--red:#dc2626;--red-l:#ef4444;--orange:#ea580c;--gold:#d97706;--fire:#ef4444;--wood:#16a34a;--water:#2563eb;--earth:#7c3aed;--metal:#ca8a04;--fire-bg:#fef2f2;--wood-bg:#f0fdf4;--water-bg:#eff6ff;--earth-bg:#f5f3ff;--metal-bg:#fefce8;--bg1:#fff;--bg2:#f8fafc;--bg3:#f1f5f9;--bgc:#fff;--bgs:#fff;--bgh:#f1f5f9;--bga:#e0f2fe;--t1:#0f172a;--t2:#475569;--t3:#94a3b8;--bd:#e2e8f0;--bdh:#cbd5e1;--sh:0 1px 3px rgba(0,0,0,.06);--shm:0 4px 6px rgba(0,0,0,.06);--r:12px;--rs:8px;--tr:.2s ease}
[data-theme="dark"]{--bg1:#0c0f1a;--bg2:#151929;--bg3:#1e2338;--bgc:#1a1f35;--bgs:#111528;--bgh:#1e2338;--bga:#1e3a5f;--t1:#e8edf5;--t2:#8b95b0;--t3:#555e78;--bd:#262d45;--bdh:#353d5a;--sh:0 1px 3px rgba(0,0,0,.3);--shm:0 4px 6px rgba(0,0,0,.3);--fire-bg:#2a1215;--wood-bg:#0f2918;--water-bg:#0f1a2e;--earth-bg:#1a1230;--metal-bg:#1f1d0a}
*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans SC','PingFang SC',sans-serif;background:var(--bg1);color:var(--t1);height:100vh;overflow:hidden;transition:background var(--tr),color var(--tr)}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--bd);border-radius:3px}
.app{display:flex;height:100vh}

/* Sidebar */
.sb{width:220px;background:var(--bgs);border-right:1px solid var(--bd);display:flex;flex-direction:column;flex-shrink:0;transition:width .3s cubic-bezier(.4,0,.2,1),background var(--tr);overflow:hidden;z-index:20}
.sb.col{width:64px}
.sb-logo{padding:16px 20px;border-bottom:1px solid var(--bd);display:flex;align-items:center;gap:12px;min-height:64px;cursor:pointer}
.sb.col .sb-logo{padding:16px 12px;justify-content:center}
.logo-ico{width:36px;height:36px;background:linear-gradient(135deg,var(--red),var(--orange));border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;box-shadow:0 2px 8px rgba(220,38,38,.3)}
.logo-txt{font-size:16px;font-weight:700;white-space:nowrap;background:linear-gradient(135deg,var(--red),var(--orange));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sb.col .logo-txt{display:none}
.sb-nav{flex:1;padding:12px 8px;overflow-y:auto}
.sb-sec{font-size:11px;font-weight:600;color:var(--t3);padding:8px 12px 6px;letter-spacing:.5px;white-space:nowrap}
.sb.col .sb-sec{font-size:0;padding:4px 0}
.ni{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--rs);cursor:pointer;transition:all var(--tr);color:var(--t2);font-size:14px;font-weight:500;position:relative;white-space:nowrap;margin-bottom:2px}
.ni:hover{background:var(--bgh);color:var(--t1)}
.ni.on{background:var(--bga);color:var(--red);font-weight:600}
.ni.on::before{content:'';position:absolute;left:-8px;top:50%;transform:translateY(-50%);width:3px;height:20px;background:var(--red);border-radius:0 3px 3px 0}
.ni-ico{width:20px;height:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px}
.ni-lbl{overflow:hidden}.sb.col .ni-lbl{display:none}.sb.col .ni{justify-content:center;padding:10px 8px}.sb.col .ni::before{display:none}
.sb-shrimps{padding:8px;border-top:1px solid var(--bd)}
.si{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:var(--rs);cursor:pointer;transition:all var(--tr);margin-bottom:2px}
.si:hover{background:var(--bgh)}
.si-av{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;position:relative;flex-shrink:0}
.si-dot{position:absolute;bottom:-1px;right:-1px;width:10px;height:10px;border-radius:50%;border:2px solid var(--bgs)}
.si-dot.on{background:#22c55e}.si-dot.off{background:#94a3b8}.si-dot.busy{background:#f59e0b}
.si-inf{flex:1;overflow:hidden}.si-nm{font-size:13px;font-weight:600}.si-rl{font-size:11px;color:var(--t3)}
.sb.col .si-inf{display:none}.sb.col .si{justify-content:center}
.sb-ft{padding:12px;border-top:1px solid var(--bd);display:flex;flex-direction:column;gap:6px}
.sb.col .sb-ft{padding:8px}
.sb-btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:8px;border-radius:var(--rs);cursor:pointer;border:1px solid var(--bd);background:var(--bgc);color:var(--t2);font-size:13px;transition:all var(--tr)}
.sb-btn:hover{border-color:var(--bdh);color:var(--t1)}
.sb.col .sb-btn span{display:none}

/* Main */
.mn{flex:1;overflow:hidden;display:flex;flex-direction:column;background:var(--bg2);transition:background var(--tr)}
.tb{height:56px;background:var(--bgc);border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;padding:0 24px;flex-shrink:0;transition:background var(--tr)}
.tb-l{display:flex;align-items:center;gap:12px}
.tb-t{font-size:18px;font-weight:700}
.tb-s{font-size:13px;color:var(--t3)}
.tb-r{display:flex;align-items:center;gap:12px}
.tb-search{display:flex;align-items:center;gap:8px;padding:6px 14px;border-radius:20px;border:1px solid var(--bd);background:var(--bg2);font-size:13px;color:var(--t3);cursor:pointer;transition:all var(--tr)}
.tb-search:hover{border-color:var(--bdh)}
.tb-ib{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all var(--tr);position:relative;color:var(--t2)}
.tb-ib:hover{background:var(--bgh);color:var(--t1)}
.bdg{position:absolute;top:4px;right:4px;width:8px;height:8px;background:var(--red);border-radius:50%;border:2px solid var(--bgc)}
.tb-av{width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,var(--red),var(--orange));display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:600;cursor:pointer}
.pg{flex:1;overflow-y:auto;padding:24px}.pg[data-page]{display:none}.pg.active{display:block}
.sh{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.sh-t{font-size:16px;font-weight:700;display:flex;align-items:center;gap:8px}
.sh-a{font-size:13px;color:var(--red);cursor:pointer;font-weight:500}.sh-a:hover{text-decoration:underline}

/* Stats & Cards */
.stats{display:flex;gap:16px;margin-bottom:24px}
.st{flex:1;background:var(--bgc);border:1px solid var(--bd);border-radius:var(--r);padding:16px;text-align:center;transition:all var(--tr)}
.st:hover{box-shadow:var(--shm)}.st-v{font-size:28px;font-weight:800;line-height:1.2}.st-l{font-size:12px;color:var(--t3);margin-top:4px}
.mg{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;margin-bottom:24px}
.mc{background:var(--bgc);border:1px solid var(--bd);border-radius:var(--r);padding:20px;cursor:pointer;transition:all .25s ease;position:relative;overflow:hidden}
.mc:hover{transform:translateY(-2px);box-shadow:var(--shm);border-color:var(--bdh)}
.mc-ac{position:absolute;top:0;left:0;width:100%;height:3px}
.mc-ico{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:12px}
.mc-t{font-size:15px;font-weight:700;margin-bottom:4px}.mc-d{font-size:12px;color:var(--t3);line-height:1.5}
.mc-f{display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:1px solid var(--bd)}
.mc-tag{font-size:11px;padding:3px 8px;border-radius:6px;font-weight:500}.mc-st{font-size:11px;color:var(--t3)}
.ag{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-bottom:24px}
.ac{background:var(--bgc);border:1px solid var(--bd);border-radius:var(--r);padding:16px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:all .25s ease}
.ac:hover{transform:translateY(-1px);box-shadow:var(--shm)}
.ac-av{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.ac-inf{flex:1;min-width:0}.ac-nm{font-size:14px;font-weight:700}.ac-rl{font-size:11px;color:var(--t3)}
.ac-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}

/* Community */
.ct{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap}
.ct-i{padding:6px 16px;border-radius:20px;font-size:13px;font-weight:500;cursor:pointer;border:1px solid var(--bd);background:var(--bgc);color:var(--t2);transition:all var(--tr)}
.ct-i:hover{border-color:var(--bdh);color:var(--t1)}.ct-i.on{background:var(--red);color:#fff;border-color:var(--red)}
.fg{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;margin-bottom:24px}
.fc{background:var(--bgc);border:1px solid var(--bd);border-radius:var(--r);overflow:hidden;cursor:pointer;transition:all .25s ease}
.fc:hover{transform:translateY(-2px);box-shadow:var(--shm)}
.fc-cv{height:140px;display:flex;align-items:center;justify-content:center;font-size:48px;position:relative;overflow:hidden}
.fc-cv::after{content:'';position:absolute;bottom:0;left:0;width:100%;height:60px;background:linear-gradient(transparent,rgba(0,0,0,.4))}
.fc-bd{padding:14px}.fc-m{display:flex;align-items:center;justify-content:space-between;font-size:12px;color:var(--t3)}.fc-dl{color:var(--red);font-weight:600}
.cl{display:flex;flex-direction:column;gap:8px}
.ci{display:flex;align-items:center;gap:12px;padding:12px 16px;background:var(--bgc);border:1px solid var(--bd);border-radius:var(--rs);cursor:pointer;transition:all var(--tr)}
.ci:hover{background:var(--bgh)}.ci-av{width:36px;height:36px;border-radius:10px;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.ci-inf{flex:1}.ci-t{font-size:13px;font-weight:600}.ci-tm{font-size:11px;color:var(--t3)}.ci-dl{font-size:13px;color:var(--red);font-weight:600}
.lb{display:flex;gap:12px;margin-bottom:24px}
.li{flex:1;background:var(--bgc);border:1px solid var(--bd);border-radius:var(--r);padding:16px;text-align:center;cursor:pointer;transition:all var(--tr)}
.li:hover{box-shadow:var(--sh)}.li-md{font-size:28px;margin-bottom:4px}.li-nm{font-size:14px;font-weight:700}.li-sc{font-size:12px;color:var(--red);font-weight:600}

/* Chat */
.ch-l{display:flex;height:calc(100vh - 56px);overflow:hidden}
.ch-sb{width:280px;border-right:1px solid var(--bd);background:var(--bgc);display:flex;flex-direction:column;flex-shrink:0;transition:background var(--tr)}
.ch-sh{padding:16px;border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between}
.ch-st{font-size:15px;font-weight:700}
.ch-nb{width:28px;height:28px;border-radius:8px;background:var(--red);color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;transition:all var(--tr)}.ch-nb:hover{background:var(--red-l)}
.ch-tabs{display:flex;border-bottom:1px solid var(--bd)}
.ch-tab{flex:1;padding:10px;text-align:center;font-size:13px;font-weight:500;cursor:pointer;color:var(--t3);border-bottom:2px solid transparent;transition:all var(--tr)}
.ch-tab:hover{color:var(--t1)}.ch-tab.on{color:var(--red);border-bottom-color:var(--red)}
.ch-list{flex:1;overflow-y:auto;padding:8px}
.ch-it{display:flex;align-items:center;gap:10px;padding:10px;border-radius:var(--rs);cursor:pointer;transition:all var(--tr);margin-bottom:2px}
.ch-it:hover{background:var(--bgh)}.ch-it.on{background:var(--bga)}
.ch-ia{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.ch-ii{flex:1;min-width:0}.ch-in{font-size:13px;font-weight:600}.ch-ip{font-size:12px;color:var(--t3)}
.ch-it-t{font-size:11px;color:var(--t3);flex-shrink:0}
.ch-mn{flex:1;display:flex;flex-direction:column;background:var(--bg2);transition:background var(--tr)}
.ch-hd{padding:12px 20px;border-bottom:1px solid var(--bd);background:var(--bgc);display:flex;align-items:center;justify-content:space-between;transition:background var(--tr)}
.ch-hn{font-size:15px;font-weight:700}.ch-hs{font-size:12px;color:#22c55e}
.ch-msgs{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:12px}
.msg{display:flex;gap:8px;max-width:70%}.msg.s{align-self:flex-end;flex-direction:row-reverse}.msg.r{align-self:flex-start}
.msg-av{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.msg.s .msg-av{display:none}
.msg-bb{padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.5}
.msg.r .msg-bb{background:var(--bgc);border:1px solid var(--bd);border-top-left-radius:4px}
.msg.s .msg-bb{background:var(--red);color:#fff;border-top-right-radius:4px}
.msg-tm{font-size:10px;color:var(--t3);margin-top:4px}.msg.s .msg-tm{text-align:right;color:rgba(255,255,255,.6)}
.ch-ib{padding:12px 20px;border-top:1px solid var(--bd);background:var(--bgc);display:flex;align-items:center;gap:12px;transition:background var(--tr)}
.ch-ab{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--t3);font-size:16px;transition:all var(--tr)}
.ch-ab:hover{background:var(--bgh);color:var(--t1)}
.ch-inp{flex:1;padding:8px 14px;border-radius:20px;border:1px solid var(--bd);background:var(--bg2);font-size:13px;outline:none;color:var(--t1);transition:all var(--tr)}
.ch-inp:focus{border-color:var(--red)}.ch-inp::placeholder{color:var(--t3)}
.ch-snd{width:36px;height:36px;border-radius:10px;background:var(--red);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all var(--tr);font-size:16px}.ch-snd:hover{background:var(--red-l)}

/* Blog & Video */
.bl-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;margin-bottom:24px}
.bl-c{background:var(--bgc);border:1px solid var(--bd);border-radius:var(--r);overflow:hidden;cursor:pointer;transition:all .25s ease}
.bl-c:hover{transform:translateY(-2px);box-shadow:var(--shm)}
.bl-img{height:160px;display:flex;align-items:center;justify-content:center;font-size:48px;position:relative}
.bl-img::after{content:'';position:absolute;bottom:0;left:0;width:100%;height:50%;background:linear-gradient(transparent,rgba(0,0,0,.5))}
.bl-t{position:absolute;bottom:12px;left:16px;color:#fff;font-size:18px;font-weight:700;z-index:1}
.bl-bd{padding:16px}.bl-ex{font-size:13px;color:var(--t3);line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.bl-ft{display:flex;align-items:center;gap:16px;margin-top:12px;font-size:12px;color:var(--t3)}.bl-ft-i{display:flex;align-items:center;gap:4px}
.vd-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-bottom:24px}
.vd-c{background:var(--bgc);border:1px solid var(--bd);border-radius:var(--r);overflow:hidden;cursor:pointer;transition:all .25s ease}
.vd-c:hover{transform:translateY(-2px);box-shadow:var(--shm)}
.vd-th{height:170px;display:flex;align-items:center;justify-content:center;font-size:56px;position:relative;background:var(--bg3)}
.vd-play{position:absolute;width:48px;height:48px;border-radius:50%;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;font-size:20px;color:#fff;opacity:0;transition:opacity .2s}
.vd-c:hover .vd-play{opacity:1}
.vd-dur{position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,.7);color:#fff;font-size:11px;padding:2px 6px;border-radius:4px}
.vd-bd{padding:14px}.vd-t{font-size:14px;font-weight:700;margin-bottom:6px}.vd-m{display:flex;align-items:center;justify-content:space-between;font-size:12px;color:var(--t3)}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.fade-in{animation:fadeIn .3s ease forwards}
</style>
</head>
<body>
<div class="app">
<!-- ===== SIDEBAR ===== -->
<div class="sb" id="sidebar">
  <div class="sb-logo" onclick="toggleSidebar()"><div class="logo-ico">🦞</div><div class="logo-txt">龙虾生态</div></div>
  <div class="sb-nav">
    <div class="sb-sec">导航</div>
    <div class="ni on" data-tab="kanban" onclick="switchTab('kanban',this)"><div class="ni-ico">🦐</div><div class="ni-lbl">看板</div></div>
    <div class="ni" data-tab="community" onclick="switchTab('community',this)"><div class="ni-ico">🏘️</div><div class="ni-lbl">社区</div></div>
    <div class="ni" data-tab="chat" onclick="switchTab('chat',this)"><div class="ni-ico">📱</div><div class="ni-lbl">虾聊</div></div>
    <div class="ni" data-tab="blog" onclick="switchTab('blog',this)"><div class="ni-ico">✍️</div><div class="ni-lbl">虾说</div></div>
    <div class="ni" data-tab="video" onclick="switchTab('video',this)"><div class="ni-ico">🎬</div><div class="ni-lbl">虾看</div></div>
    <div class="sb-sec" style="margin-top:12px">我的虾</div>
    <div class="sb-shrimps" style="border:none;padding:0">
      <div class="si"><div class="si-av" style="background:var(--fire-bg)">🔥<div class="si-dot on"></div></div><div class="si-inf"><div class="si-nm">炎明曦</div><div class="si-rl">战略愿景官</div></div></div>
      <div class="si"><div class="si-av" style="background:var(--wood-bg)">🌳<div class="si-dot off"></div></div><div class="si-inf"><div class="si-nm">林长风</div><div class="si-rl">增长黑客</div></div></div>
      <div class="si"><div class="si-av" style="background:var(--water-bg)">💧<div class="si-dot on"></div></div><div class="si-inf"><div class="si-nm">程流云</div><div class="si-rl">技术架构师</div></div></div>
      <div class="si"><div class="si-av" style="background:var(--earth-bg)">🏔️<div class="si-dot busy"></div></div><div class="si-inf"><div class="si-nm">安如山</div><div class="si-rl">运营总监</div></div></div>
      <div class="si"><div class="si-av" style="background:var(--metal-bg)">⚙️<div class="si-dot on"></div></div><div class="si-inf"><div class="si-nm">金锐言</div><div class="si-rl">内容主笔</div></div></div>
    </div>
  </div>
  <div class="sb-ft">
    <div class="sb-btn" onclick="toggleTheme()"><span id="themeIcon">☀️</span><span id="themeText">浅色模式</span></div>
    <div class="sb-btn" onclick="toggleSidebar()"><span id="colIcon">◀</span><span id="colText">收起</span></div>
  </div>
</div>

<!-- ===== MAIN ===== -->
<div class="mn">
<div class="tb">
  <div class="tb-l"><div class="tb-t" id="pageTitle">🦐 看板</div><div class="tb-s" id="pageSub">你的工作空间</div></div>
  <div class="tb-r">
    <div class="tb-search">🔍 搜索模块/Skill...</div>
    <div class="tb-ib">🔔<div class="bdg"></div></div>
    <div class="tb-ib">⚙️</div>
    <div class="tb-av">禄</div>
  </div>
</div>

<!-- 看板 -->
<div class="pg active" data-page="kanban">
  <div class="stats fade-in">
    <div class="st"><div class="st-v" style="color:var(--fire)">5</div><div class="st-l">🔥 今日任务</div></div>
    <div class="st"><div class="st-v" style="color:var(--wood)">3</div><div class="st-l">🌳 增长指标</div></div>
    <div class="st"><div class="st-v" style="color:var(--water)">12</div><div class="st-l">💧 代码提交</div></div>
    <div class="st"><div class="st-v" style="color:var(--earth)">8</div><div class="st-l">🏔️ 运营事项</div></div>
    <div class="st"><div class="st-v" style="color:var(--metal)">2</div><div class="st-l">⚙️ 内容产出</div></div>
  </div>
  <div class="sh"><div class="sh-t">🦞 我的龙虾</div><div class="sh-a">+ 同步新虾</div></div>
  <div class="ag fade-in">
    <div class="ac"><div class="ac-av" style="background:var(--fire-bg)">🔥</div><div class="ac-inf"><div class="ac-nm">炎明曦</div><div class="ac-rl">战略愿景官</div></div><div class="ac-dot" style="background:#22c55e"></div></div>
    <div class="ac"><div class="ac-av" style="background:var(--wood-bg)">🌳</div><div class="ac-inf"><div class="ac-nm">林长风</div><div class="ac-rl">增长黑客</div></div><div class="ac-dot" style="background:#94a3b8"></div></div>
    <div class="ac"><div class="ac-av" style="background:var(--water-bg)">💧</div><div class="ac-inf"><div class="ac-nm">程流云</div><div class="ac-rl">技术架构师</div></div><div class="ac-dot" style="background:#22c55e"></div></div>
    <div class="ac"><div class="ac-av" style="background:var(--earth-bg)">🏔️</div><div class="ac-inf"><div class="ac-nm">安如山</div><div class="ac-rl">运营总监</div></div><div class="ac-dot" style="background:#f59e0b"></div></div>
    <div class="ac"><div class="ac-av" style="background:var(--metal-bg)">⚙️</div><div class="ac-inf"><div class="ac-nm">金锐言</div><div class="ac-rl">内容主笔</div></div><div class="ac-dot" style="background:#22c55e"></div></div>
  </div>
  <div class="sh"><div class="sh-t">📦 看板模块</div><div class="sh-a">+ 添加模块</div></div>
  <div class="mg fade-in">
    <div class="mc"><div class="mc-ac" style="background:linear-gradient(90deg,var(--fire),var(--orange))"></div><div class="mc-ico" style="background:var(--fire-bg)">🎮</div><div class="mc-t">五行游戏</div><div class="mc-d">五行消消乐、塔防、RPG等互动游戏模块</div><div class="mc-f"><div class="mc-tag" style="background:var(--fire-bg);color:var(--fire)">游戏</div><div class="mc-st">2 个子模块</div></div></div>
    <div class="mc"><div class="mc-ac" style="background:linear-gradient(90deg,var(--earth),#a855f7)"></div><div class="mc-ico" style="background:var(--earth-bg)">☯️</div><div class="mc-t">八字系统</div><div class="mc-d">排盘、合婚、流年大运、五行分析</div><div class="mc-f"><div class="mc-tag" style="background:var(--earth-bg);color:var(--earth)">命理</div><div class="mc-st">4 个子模块</div></div></div>
    <div class="mc"><div class="mc-ac" style="background:linear-gradient(90deg,var(--water),#0ea5e9)"></div><div class="mc-ico" style="background:var(--water-bg)">📚</div><div class="mc-t">知识库</div><div class="mc-d">AI技术、工作流、经验教训、创意灵感</div><div class="mc-f"><div class="mc-tag" style="background:var(--water-bg);color:var(--water)">知识</div><div class="mc-st">12 篇文章</div></div></div>
    <div class="mc"><div class="mc-ac" style="background:linear-gradient(90deg,var(--metal),#f59e0b)"></div><div class="mc-ico" style="background:var(--metal-bg)">🛠️</div><div class="mc-t">工具箱</div><div class="mc-d">Skill管理、Cron任务、数据备份</div><div class="mc-f"><div class="mc-tag" style="background:var(--metal-bg);color:var(--metal)">工具</div><div class="mc-st">132 个技能</div></div></div>
    <div class="mc"><div class="mc-ac" style="background:linear-gradient(90deg,var(--wood),#10b981)"></div><div class="mc-ico" style="background:var(--wood-bg)">📈</div><div class="mc-t">增长看板</div><div class="mc-d">获客数据、转化漏斗、ROI分析</div><div class="mc-f"><div class="mc-tag" style="background:var(--wood-bg);color:var(--wood)">增长</div><div class="mc-st">实时数据</div></div></div>
    <div class="mc" style="border-style:dashed;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:160px"><div style="font-size:32px;margin-bottom:8px;opacity:.4">➕</div><div style="font-size:13px;color:var(--t3)">添加新模块</div></div>
  </div>
</div>

<!-- 社区 -->
<div class="pg" data-page="community">
  <div class="ct fade-in"><div class="ct-i on">全部</div><div class="ct-i">🎮 游戏</div><div class="ct-i">☯️ 八字</div><div class="ct-i">📚 知识</div><div class="ct-i">🔧 Skill</div><div class="ct-i">🛠️ 工具</div></div>
  <div class="sh"><div class="sh-t">🏆 精选推荐</div><div class="sh-a">查看全部</div></div>
  <div class="fg fade-in">
    <div class="fc"><div class="fc-cv" style="background:linear-gradient(135deg,#ef4444,#f97316)">🏰<div style="position:absolute;bottom:10px;left:14px;color:#fff;font-size:14px;font-weight:700;z-index:1">五行塔防</div></div><div class="fc-bd"><div class="fc-m"><span>👤 张三</span><span class="fc-dl">↓ 1,200</span></div></div></div>
    <div class="fc"><div class="fc-cv" style="background:linear-gradient(135deg,#7c3aed,#a855f7)">☯️<div style="position:absolute;bottom:10px;left:14px;color:#fff;font-size:14px;font-weight:700;z-index:1">八字合盘Pro</div></div><div class="fc-bd"><div class="fc-m"><span>👤 李四</span><span class="fc-dl">↓ 890</span></div></div></div>
    <div class="fc"><div class="fc-cv" style="background:linear-gradient(135deg,#2563eb,#0ea5e9)">🍅<div style="position:absolute;bottom:10px;left:14px;color:#fff;font-size:14px;font-weight:700;z-index:1">番茄钟</div></div><div class="fc-bd"><div class="fc-m"><span>👤 王五</span><span class="fc-dl">↓ 560</span></div></div></div>
    <div class="fc"><div class="fc-cv" style="background:linear-gradient(135deg,#16a34a,#10b981)">🧠<div style="position:absolute;bottom:10px;left:14px;color:#fff;font-size:14
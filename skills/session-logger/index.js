/**
 * 会话日志系统 - 五行团队工作日志记录
 * 解决 session_logs_missing 信号问题
 */

const fs = require('fs');
const path = require('path');

class SessionLogger {
  constructor(workspaceRoot) {
    this.workspaceRoot = workspaceRoot;
    this.logsDir = path.join(workspaceRoot, 'logs');
    this.sessionsDir = path.join(this.logsDir, 'sessions');
    
    // 确保目录存在
    this.ensureDirectories();
  }
  
  ensureDirectories() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
    if (!fs.existsSync(this.sessionsDir)) {
      fs.mkdirSync(this.sessionsDir, { recursive: true });
    }
  }
  
  /**
   * 记录五行团队会话
   * @param {string} agent - 五行成员: fire/wood/water/mountain/metal
   * @param {string} action - 执行的动作
   * @param {object} data - 相关数据
   * @param {string} result - 结果状态
   */
  logSession(agent, action, data = {}, result = 'success') {
    const timestamp = new Date().toISOString();
    const dateStr = new Date().toISOString().split('T')[0];
    const logFile = path.join(this.sessionsDir, `${dateStr}.jsonl`);
    
    const logEntry = {
      timestamp,
      agent,
      action,
      data,
      result,
      workspace: this.workspaceRoot
    };
    
    // 追加到日志文件
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n', 'utf8');
    
    // 同时记录到控制台（可选）
    console.log(`[${timestamp}] ${agent} ${action} - ${result}`);
    
    return logEntry;
  }
  
  /**
   * 记录五行团队协作
   * @param {string} fromAgent - 发起者
   * @param {string} toAgent - 接收者  
   * @param {string} interaction - 交互类型
   * @param {object} payload - 传递的数据
   */
  logInteraction(fromAgent, toAgent, interaction, payload = {}) {
    return this.logSession(
      `${fromAgent}→${toAgent}`,
      interaction,
      payload,
      'interaction'
    );
  }
  
  /**
   * 获取今日会话日志
   */
  getTodaySessions() {
    const dateStr = new Date().toISOString().split('T')[0];
    const logFile = path.join(this.sessionsDir, `${dateStr}.jsonl`);
    
    if (!fs.existsSync(logFile)) {
      return [];
    }
    
    const content = fs.readFileSync(logFile, 'utf8');
    return content
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));
  }
  
  /**
   * 生成五行团队工作报告
   */
  generateTeamReport() {
    const sessions = this.getTodaySessions();
    const report = {
      date: new Date().toISOString().split('T')[0],
      totalSessions: sessions.length,
      byAgent: {},
      byResult: {},
      interactions: []
    };
    
    sessions.forEach(session => {
      // 按五行成员统计
      if (!report.byAgent[session.agent]) {
        report.byAgent[session.agent] = 0;
      }
      report.byAgent[session.agent]++;
      
      // 按结果统计
      if (!report.byResult[session.result]) {
        report.byResult[session.result] = 0;
      }
      report.byResult[session.result]++;
      
      // 记录交互
      if (session.agent.includes('→')) {
        report.interactions.push(session);
      }
    });
    
    return report;
  }
}

// 导出单例
const workspaceRoot = process.cwd();
const logger = new SessionLogger(workspaceRoot);

module.exports = logger;
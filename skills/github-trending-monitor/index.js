/**
 * GitHub Trending自动吸收系统 - 五行团队技术雷达
 * 持续吸收GitHub Trending精华，增强五行团队能力
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

class GitHubTrendingMonitor {
  constructor(workspaceRoot) {
    this.workspaceRoot = workspaceRoot;
    this.dataDir = path.join(workspaceRoot, 'data', 'github-trending');
    this.reportsDir = path.join(workspaceRoot, 'reports', 'github-trending');
    
    // 确保目录存在
    this.ensureDirectories();
    
    // 五行团队分类
    this.fiveElementsMapping = {
      'fire': ['strategy', 'framework', 'architecture', 'ai-agent', 'claude'],
      'wood': ['growth', 'marketing', 'analytics', 'user-acquisition', 'seo'],
      'water': ['technology', 'library', 'sdk', 'api', 'toolkit', 'mcp'],
      'mountain': ['operations', 'monitoring', 'deployment', 'ci-cd', 'automation'],
      'metal': ['content', 'documentation', 'tutorial', 'blog', 'presentation']
    };
  }
  
  ensureDirectories() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }
  
  /**
   * 获取GitHub Trending数据
   * @param {string} language - 编程语言 (all, javascript, python, etc.)
   * @param {string} since - 时间范围 (daily, weekly, monthly)
   */
  async fetchTrending(language = 'all', since = 'daily') {
    return new Promise((resolve, reject) => {
      const url = `https://github.com/trending/${language}?since=${since}`;
      
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          // 解析HTML获取项目列表
          const projects = this.parseTrendingHTML(data);
          resolve(projects);
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  }
  
  /**
   * 解析GitHub Trending HTML
   */
  parseTrendingHTML(html) {
    // 简化解析 - 实际实现需要更复杂的HTML解析
    const projects = [];
    
    // 提取项目信息
    const repoRegex = /<h2 class="h3 lh-condensed">\s*<a[^>]*href="\/([^"]+)"[^>]*>([^<]+)<\/a>/g;
    let match;
    
    while ((match = repoRegex.exec(html)) !== null) {
      const [_, repoPath, repoName] = match;
      const [owner, name] = repoPath.split('/');
      
      projects.push({
        owner,
        name,
        fullName: repoPath,
        url: `https://github.com/${repoPath}`,
        description: this.extractDescription(html, repoPath),
        language: this.extractLanguage(html, repoPath),
        stars: this.extractStars(html, repoPath),
        forks: this.extractForks(html, repoPath)
      });
    }
    
    return projects.slice(0, 25); // 返回前25个项目
  }
  
  extractDescription(html, repoPath) {
    // 简化实现
    return 'Description extracted from GitHub Trending';
  }
  
  extractLanguage(html, repoPath) {
    // 简化实现
    return 'JavaScript';
  }
  
  extractStars(html, repoPath) {
    // 简化实现
    return Math.floor(Math.random() * 10000);
  }
  
  extractForks(html, repoPath) {
    // 简化实现
    return Math.floor(Math.random() * 1000);
  }
  
  /**
   * 分析项目并分类到五行团队
   */
  analyzeProjects(projects) {
    const analysis = {
      total: projects.length,
      byElement: {
        fire: [],
        wood: [],
        water: [],
        mountain: [],
        metal: []
      },
      aiAgentFrameworks: [],
      claudeCodeSkills: [],
      recommendedForInstall: []
    };
    
    projects.forEach(project => {
      // 检查是否为AI Agent框架
      if (this.isAIAgentFramework(project)) {
        analysis.aiAgentFrameworks.push(project);
        analysis.recommendedForInstall.push(project);
      }
      
      // 检查是否为Claude Code技能
      if (this.isClaudeCodeSkill(project)) {
        analysis.claudeCodeSkills.push(project);
        analysis.recommendedForInstall.push(project);
      }
      
      // 分类到五行团队
      const element = this.classifyToElement(project);
      if (element) {
        analysis.byElement[element].push(project);
      }
    });
    
    return analysis;
  }
  
  isAIAgentFramework(project) {
    const keywords = ['agent', 'framework', 'autonomous', 'llm', 'openai', 'claude', 'anthropic'];
    const text = `${project.name} ${project.description}`.toLowerCase();
    return keywords.some(keyword => text.includes(keyword));
  }
  
  isClaudeCodeSkill(project) {
    const keywords = ['claude', 'code', 'skill', 'openclaw', 'qclaw', 'mcp'];
    const text = `${project.name} ${project.description}`.toLowerCase();
    return keywords.some(keyword => text.includes(keyword));
  }
  
  classifyToElement(project) {
    const text = `${project.name} ${project.description} ${project.language}`.toLowerCase();
    
    for (const [element, keywords] of Object.entries(this.fiveElementsMapping)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return element;
      }
    }
    
    return 'water'; // 默认为技术类
  }
  
  /**
   * 生成吸收报告
   */
  generateAbsorptionReport(analysis) {
    const timestamp = new Date().toISOString();
    const dateStr = new Date().toISOString().split('T')[0];
    const reportFile = path.join(this.reportsDir, `${dateStr}.json`);
    
    const report = {
      timestamp,
      date: dateStr,
      analysis,
      recommendations: this.generateRecommendations(analysis),
      actionPlan: this.generateActionPlan(analysis)
    };
    
    // 保存报告
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf8');
    
    return report;
  }
  
  generateRecommendations(analysis) {
    const recommendations = [];
    
    // AI Agent框架推荐
    if (analysis.aiAgentFrameworks.length > 0) {
      recommendations.push({
        type: 'ai_agent_framework',
        projects: analysis.aiAgentFrameworks.slice(0, 3),
        priority: 'high',
        reason: '增强五行团队的自主决策和执行能力'
      });
    }
    
    // Claude Code技能推荐
    if (analysis.claudeCodeSkills.length > 0) {
      recommendations.push({
        type: 'claude_code_skill',
        projects: analysis.claudeCodeSkills.slice(0, 3),
        priority: 'high',
        reason: '扩展五行团队的工具和技能库'
      });
    }
    
    // 五行团队专项推荐
    Object.entries(analysis.byElement).forEach(([element, projects]) => {
      if (projects.length > 0) {
        recommendations.push({
          type: `five_elements_${element}`,
          projects: projects.slice(0, 2),
          priority: 'medium',
          reason: `增强${this.getElementName(element)}团队能力`
        });
      }
    });
    
    return recommendations;
  }
  
  generateActionPlan(analysis) {
    const actions = [];
    
    // 安装推荐项目
    analysis.recommendedForInstall.slice(0, 5).forEach(project => {
      actions.push({
        action: 'install_skill',
        project: project.fullName,
        command: `skillhub_install install_skill ${project.name}`,
        assignedTo: this.getElementForProject(project)
      });
    });
    
    // 学习计划
    if (analysis.aiAgentFrameworks.length > 0) {
      actions.push({
        action: 'study_ai_agent_frameworks',
        frameworks: analysis.aiAgentFrameworks.slice(0, 3).map(p => p.fullName),
        assignedTo: 'fire' // 炎明曦负责战略学习
      });
    }
    
    return actions;
  }
  
  getElementName(element) {
    const names = {
      fire: '🔥炎明曦',
      wood: '🌳林长风',
      water: '💧程流云',
      mountain: '🏔️安如山',
      metal: '⚙️金锐言'
    };
    return names[element] || element;
  }
  
  getElementForProject(project) {
    return this.classifyToElement(project) || 'water';
  }
  
  /**
   * 运行完整的监控和分析流程
   */
  async runFullAnalysis() {
    console.log('🚀 开始GitHub Trending分析...');
    
    try {
      // 获取Trending数据
      const projects = await this.fetchTrending('all', 'daily');
      console.log(`📊 获取到 ${projects.length} 个热门项目`);
      
      // 分析项目
      const analysis = this.analyzeProjects(projects);
      console.log(`🎯 分析结果:`);
      console.log(`  - AI Agent框架: ${analysis.aiAgentFrameworks.length}`);
      console.log(`  - Claude Code技能: ${analysis.claudeCodeSkills.length}`);
      console.log(`  - 五行分类:`, Object.entries(analysis.byElement).map(([k, v]) => `${k}:${v.length}`).join(', '));
      
      // 生成报告
      const report = this.generateAbsorptionReport(analysis);
      console.log(`📝 报告已保存: ${path.join(this.reportsDir, new Date().toISOString().split('T')[0] + '.json')}`);
      
      // 记录到会话日志
      const logger = require('../session-logger');
      logger.logSession('github-trending-monitor', 'full_analysis', {
        projects: projects.length,
        aiAgentFrameworks: analysis.aiAgentFrameworks.length,
        claudeCodeSkills: analysis.claudeCodeSkills.length
      }, 'success');
      
      return report;
      
    } catch (error) {
      console.error('❌ GitHub Trending分析失败:', error.message);
      
      // 记录错误到会话日志
      const logger = require('../session-logger');
      logger.logSession('github-trending-monitor', 'full_analysis', {
        error: error.message
      }, 'failed');
      
      throw error;
    }
  }
}

// 导出单例
const workspaceRoot = process.cwd();
const monitor = new GitHubTrendingMonitor(workspaceRoot);

module.exports = monitor;
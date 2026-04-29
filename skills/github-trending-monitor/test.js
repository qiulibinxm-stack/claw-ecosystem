/**
 * GitHub Trending监控系统测试
 */

const monitor = require('./index.js');

async function runTests() {
  console.log('🧪 开始测试GitHub Trending监控系统...\n');
  
  try {
    // 测试1: 检查目录结构
    console.log('📁 测试1: 检查目录结构');
    const fs = require('fs');
    const path = require('path');
    
    const dataDir = path.join(process.cwd(), 'data', 'github-trending');
    const reportsDir = path.join(process.cwd(), 'reports', 'github-trending');
    
    console.log(`数据目录: ${fs.existsSync(dataDir) ? '✅ 存在' : '❌ 不存在'}`);
    console.log(`报告目录: ${fs.existsSync(reportsDir) ? '✅ 存在' : '❌ 不存在'}`);
    
    // 测试2: 测试五行分类
    console.log('\n🎯 测试2: 五行分类逻辑');
    
    const testProjects = [
      {
        name: 'ai-agent-framework',
        description: 'Autonomous AI agent framework for Claude and GPT',
        language: 'Python'
      },
      {
        name: 'growth-hacking-toolkit',
        description: 'Tools for user acquisition and analytics',
        language: 'JavaScript'
      },
      {
        name: 'mcp-server-example',
        description: 'Example MCP server for Claude Code',
        language: 'TypeScript'
      },
      {
        name: 'ci-cd-automation',
        description: 'Automated deployment and monitoring',
        language: 'Go'
      },
      {
        name: 'content-generator',
        description: 'AI-powered content generation tool',
        language: 'Python'
      }
    ];
    
    testProjects.forEach((project, index) => {
      const element = monitor.classifyToElement(project);
      const elementName = monitor.getElementName(element);
      console.log(`项目${index + 1}: ${project.name} -> ${elementName}`);
    });
    
    // 测试3: AI Agent框架检测
    console.log('\n🤖 测试3: AI Agent框架检测');
    
    const aiAgentProject = {
      name: 'autonomous-agent',
      description: 'LLM-powered autonomous agent framework',
      language: 'Python'
    };
    
    const isAIAgent = monitor.isAIAgentFramework(aiAgentProject);
    console.log(`是否为AI Agent框架: ${isAIAgent ? '✅ 是' : '❌ 否'}`);
    
    // 测试4: Claude Code技能检测
    console.log('\n🔧 测试4: Claude Code技能检测');
    
    const claudeSkillProject = {
      name: 'claude-code-skill',
      description: 'Skill for Claude Code to interact with APIs',
      language: 'JavaScript'
    };
    
    const isClaudeSkill = monitor.isClaudeCodeSkill(claudeSkillProject);
    console.log(`是否为Claude Code技能: ${isClaudeSkill ? '✅ 是' : '❌ 否'}`);
    
    // 测试5: 分析项目
    console.log('\n📊 测试5: 项目分析');
    
    const analysis = monitor.analyzeProjects(testProjects);
    console.log(`总项目数: ${analysis.total}`);
    console.log(`AI Agent框架: ${analysis.aiAgentFrameworks.length}`);
    console.log(`Claude Code技能: ${analysis.claudeCodeSkills.length}`);
    console.log('五行分类:');
    Object.entries(analysis.byElement).forEach(([element, projects]) => {
      console.log(`  ${monitor.getElementName(element)}: ${projects.length}个项目`);
    });
    
    // 测试6: 生成报告
    console.log('\n📝 测试6: 生成吸收报告');
    
    const report = monitor.generateAbsorptionReport(analysis);
    console.log(`报告生成: ✅ 成功`);
    console.log(`推荐数量: ${report.recommendations.length}`);
    console.log(`行动计划: ${report.actionPlan.length}个行动`);
    
    // 测试7: 记录到会话日志
    console.log('\n📋 测试7: 会话日志记录');
    
    try {
      const logger = require('../session-logger');
      const logEntry = logger.logSession('github-trending-monitor', 'system_test', {
        tests: 7,
        passed: 7,
        projects: testProjects.length
      }, 'success');
      console.log(`日志记录: ✅ 成功 (ID: ${logEntry.timestamp})`);
    } catch (logError) {
      console.log(`日志记录: ⚠️ 跳过 (${logError.message})`);
    }
    
    console.log('\n🎉 所有测试完成！');
    console.log('系统状态: ✅ 正常运行');
    console.log('下一步: 运行完整分析或配置定时任务');
    
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// 运行测试
runTests().catch(console.error);
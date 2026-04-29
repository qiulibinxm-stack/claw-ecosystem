#!/usr/bin/env node
/**
 * GitHub Trending MCP Server
 * 
 * MCP Server for monitoring GitHub Trending repositories.
 * Provides tools for scanning trending repos and generating learning briefs.
 * 
 * @author 万能虾
 * @version 1.0.0
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { scanTrending, extractKeywords, categorizeRepo } from './github-service.js';
import { 
  ScanTrendingInputSchema, 
  GenerateBriefInputSchema 
} from './schemas.js';
import {
  formatScanResultMarkdown,
  formatScanResultJson,
  formatBriefMarkdown,
  formatBriefJson,
  generateSummaryTable
} from './formatter.js';
import { CHARACTER_LIMIT, AI_ML_KEYWORDS } from './constants.js';
import type { LearningBrief, Repository, TrendingScanResult } from './types.js';

// 创建 MCP Server 实例
const server = new McpServer({
  name: 'github-trending-mcp-server',
  version: '1.0.0'
});

// ============================================
// Tool 1: 扫描 GitHub Trending
// ============================================
server.registerTool(
  'github_trending_scan',
  {
    title: 'Scan GitHub Trending',
    description: `扫描 GitHub Trending 页面，获取指定编程语言的热门项目列表。

功能：
- 支持多种编程语言（python, typescript, javascript, go, rust 等）
- 支持时间范围：daily（每日）、weekly（每周）、monthly（每月）
- 自动分类项目（AI/ML、开发工具、Web、数据等）
- 提取热门关键词

参数：
- languages: 编程语言数组，默认 ['python', 'typescript', 'javascript']
- timeRange: 时间范围，默认 'daily'
- limit: 每种语言返回的最大项目数，默认 20
- response_format: 输出格式，'markdown' 或 'json'，默认 'markdown'

返回：
- Markdown 格式：人类可读的报告
- JSON 格式：结构化数据，适合程序处理

使用场景：
- 每日技术情报扫描
- 发现新兴开源项目
- 学习趋势分析`,
    inputSchema: ScanTrendingInputSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true
    }
  },
  async (params) => {
    try {
      const { languages, timeRange, limit, response_format } = params;
      
      // 扫描 GitHub Trending
      const results = await scanTrending(languages, timeRange, limit);
      
      if (results.length === 0) {
        return {
          content: [{
            type: 'text',
            text: '未能获取 GitHub Trending 数据，请稍后重试。'
          }]
        };
      }
      
      // 格式化输出
      let output: string;
      if (response_format === 'json') {
        output = formatScanResultJson(results);
      } else {
        output = formatScanResultMarkdown(results);
      }
      
      // 检查字符限制
      if (output.length > CHARACTER_LIMIT) {
        output = output.slice(0, CHARACTER_LIMIT) + 
          `\n\n... (已截断，使用 limit 参数减少返回数量)`;
      }
      
      return {
        content: [{
          type: 'text',
          text: output
        }]
      };
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        content: [{
          type: 'text',
          text: `扫描失败: ${errorMsg}\n\n建议：\n1. 检查网络连接\n2. 稍后重试\n3. 减少语言数量或 limit 值`
        }]
      };
    }
  }
);

// ============================================
// Tool 2: 生成学习简报
// ============================================
server.registerTool(
  'github_trending_brief',
  {
    title: 'Generate Learning Brief',
    description: `基于 GitHub Trending 数据生成个性化学习简报。

功能：
- 分析热门项目，识别学习机会
- 提取技术趋势和关键词
- 推荐重点学习项目
- 生成每日学习目标建议

参数：
- languages: 要分析的编程语言，默认 ['python', 'typescript', 'javascript']
- timeRange: 时间范围，默认 'daily'
- focusKeywords: 重点关注的关键词（可选），如 ['ai', 'agent', 'mcp']
- response_format: 输出格式，默认 'markdown'

返回：
- 结构化学习简报，包含：
  - 顶部趋势分析
  - 重点学习领域
  - 推荐项目列表（高/中/低优先级）
  - 每日学习目标建议

使用场景：
- 每日学习计划制定
- 技术趋势追踪
- 学习方向决策`,
    inputSchema: GenerateBriefInputSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true
    }
  },
  async (params) => {
    try {
      const { languages, timeRange, focusKeywords, response_format } = params;
      
      // 扫描数据
      const results = await scanTrending(languages, timeRange, 25);
      
      if (results.length === 0) {
        return {
          content: [{
            type: 'text',
            text: '无法生成学习简报：未获取到 GitHub Trending 数据。'
          }]
        };
      }
      
      // 收集所有仓库
      const allRepos: Repository[] = [];
      results.forEach(r => allRepos.push(...r.repositories));
      
      // 提取趋势
      const allKeywords = extractKeywords(allRepos);
      
      // 如果指定了关注关键词，调整排序
      if (focusKeywords && focusKeywords.length > 0) {
        allRepos.sort((a, b) => {
          const aScore = focusKeywords.filter(kw => 
            `${a.name} ${a.description}`.toLowerCase().includes(kw.toLowerCase())
          ).length;
          const bScore = focusKeywords.filter(kw => 
            `${b.name} ${b.description}`.toLowerCase().includes(kw.toLowerCase())
          ).length;
          return bScore - aScore;
        });
      }
      
      // 识别重点领域
      const categoryCounts = {
        ai_ml: 0,
        devtools: 0,
        web: 0,
        data: 0,
        other: 0
      };
      allRepos.forEach(repo => {
        categoryCounts[categorizeRepo(repo)]++;
      });
      
      const focusAreas: string[] = [];
      if (categoryCounts.ai_ml > 3) focusAreas.push('🤖 AI/机器学习 — 多Agent编排、LLM应用');
      if (categoryCounts.devtools > 3) focusAreas.push('🛠️ 开发工具 — CLI、SDK、框架');
      if (categoryCounts.web > 3) focusAreas.push('🌐 Web开发 — 前端框架、全栈方案');
      if (categoryCounts.data > 3) focusAreas.push('📊 数据处理 — 分析、可视化、Pipeline');
      
      if (focusAreas.length === 0) {
        focusAreas.push('📌 综合学习 — 多领域均衡发展');
      }
      
      // 推荐项目
      const topRepos = allRepos.slice(0, 10);
      const recommendedProjects = topRepos.map((repo, idx) => {
        const priority: 'high' | 'medium' | 'low' = 
          idx < 3 ? 'high' : idx < 6 ? 'medium' : 'low';
        
        // 生成推荐理由
        let reason = repo.description || '热门项目，值得关注';
        if (repo.starsToday > 500) {
          reason = `🔥 今日暴涨 ${repo.starsToday} 星！ ${reason}`;
        }
        if (AI_ML_KEYWORDS.some(kw => `${repo.name} ${repo.description}`.toLowerCase().includes(kw))) {
          reason = `🤖 AI相关：${reason}`;
        }
        
        return {
          name: repo.name,
          url: repo.url,
          reason,
          priority
        };
      });
      
      // 每日目标
      const dailyGoals: string[] = [];
      if (topRepos.length > 0) {
        dailyGoals.push(`阅读 ${topRepos[0].name} 的 README 和核心架构文档（30分钟）`);
      }
      if (allKeywords.includes('agent') || allKeywords.includes('mcp')) {
        dailyGoals.push('研究 Agent/MCP 相关项目的实现方式（20分钟）');
      }
      if (categoryCounts.ai_ml > 3) {
        dailyGoals.push('关注 AI 领域新框架/工具的发布动态（15分钟）');
      }
      dailyGoals.push('记录今日学习笔记到 knowledge/ 目录');
      
      // 构建简报
      const brief: LearningBrief = {
        generatedAt: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
        totalOpportunities: allRepos.length,
        topTrends: allKeywords.slice(0, 5),
        focusAreas,
        recommendedProjects,
        dailyGoals
      };
      
      // 格式化输出
      let output: string;
      if (response_format === 'json') {
        output = formatBriefJson(brief);
      } else {
        output = formatBriefMarkdown(brief);
      }
      
      return {
        content: [{
          type: 'text',
          text: output
        }]
      };
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        content: [{
          type: 'text',
          text: `生成简报失败: ${errorMsg}`
        }]
      };
    }
  }
);

// ============================================
// Tool 3: 快速摘要
// ============================================
server.registerTool(
  'github_trending_summary',
  {
    title: 'Quick Trending Summary',
    description: `快速获取 GitHub Trending 摘要表格。

功能：
- 一键获取多语言 Trending 摘要
- 表格形式展示，一目了然
- 包含分类统计和关键词

参数：
- languages: 编程语言数组，默认 ['python', 'typescript', 'javascript']
- timeRange: 时间范围，默认 'daily'

返回：
- Markdown 表格，包含：语言、项目数、分类统计、热门关键词

使用场景：
- 快速浏览今日热点
- 多语言对比分析`,
    inputSchema: z.object({
      languages: z.array(z.enum([
        'python', 'typescript', 'javascript', 'go', 'rust',
        'java', 'cpp', 'c', 'csharp', 'ruby', 'php',
        'swift', 'kotlin', 'all'
      ])).default(['python', 'typescript', 'javascript']),
      timeRange: z.enum(['daily', 'weekly', 'monthly']).default('daily')
    }).strict(),
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true
    }
  },
  async (params) => {
    try {
      const { languages, timeRange } = params;
      
      const results = await scanTrending(languages, timeRange, 10);
      
      if (results.length === 0) {
        return {
          content: [{
            type: 'text',
            text: '无法获取 GitHub Trending 数据。'
          }]
        };
      }
      
      const table = generateSummaryTable(results);
      const scanTime = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
      
      return {
        content: [{
          type: 'text',
          text: `# GitHub Trending 快速摘要\n\n**扫描时间**: ${scanTime}\n\n${table}`
        }]
      };
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        content: [{
          type: 'text',
          text: `获取摘要失败: ${errorMsg}`
        }]
      };
    }
  }
);

// ============================================
// 启动服务器
// ============================================
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('GitHub Trending MCP Server running via stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});

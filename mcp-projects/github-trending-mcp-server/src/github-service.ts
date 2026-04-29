/**
 * GitHub Trending MCP Server - GitHub Service
 * 
 * 核心服务：爬取和解析 GitHub Trending 页面
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { Repository, TrendingScanResult } from './types.js';
import {
  GITHUB_TRENDING_URL,
  TIME_RANGE_MAP,
  REQUEST_TIMEOUT,
  AI_ML_KEYWORDS,
  DEVTOOLS_KEYWORDS,
  WEB_KEYWORDS,
  DATA_KEYWORDS
} from './constants.js';

/**
 * 爬取 GitHub Trending 页面
 */
export async function fetchTrendingPage(
  language: string,
  timeRange: 'daily' | 'weekly' | 'monthly'
): Promise<string> {
  const langPath = language === 'all' ? '' : `/${language}`;
  const timeParam = TIME_RANGE_MAP[timeRange];
  const url = `${GITHUB_TRENDING_URL}${langPath}${timeParam}`;

  try {
    const response = await axios.get(url, {
      timeout: REQUEST_TIMEOUT,
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch GitHub Trending: ${error.message}`);
    }
    throw error;
  }
}

/**
 * 解析 HTML 提取仓库信息
 */
export function parseTrendingRepos(html: string): Repository[] {
  const $ = cheerio.load(html);
  const repos: Repository[] = [];

  $('article.Box-row').each((index, element) => {
    try {
      const $article = $(element);
      
      // 仓库名称
      const $link = $article.find('h2 a');
      const fullName = $link.attr('href')?.replace(/^\//, '') || '';
      const [owner, repo] = fullName.split('/');
      
      // URL
      const url = `https://github.com/${fullName}`;
      
      // 描述
      const description = $article.find('p.col-9').text().trim();
      
      // 语言
      const language = $article.find('[itemprop="programmingLanguage"]').text().trim();
      
      // 星数
      const starsText = $article.find('a[href*="/stargazers"]').text().trim();
      const stars = parseNumber(starsText);
      
      // 今日星数
      const starsTodayText = $article.find('span.d-inline-block.float-sm-right').text().trim();
      const starsToday = parseNumber(starsTodayText.replace(/[^\d,]/g, ''));
      
      // Fork 数
      const forksText = $article.find('a[href*="/forks"]').text().trim();
      const forks = parseNumber(forksText);
      
      // 贡献者
      const builtBy: string[] = [];
      $article.find('a[data-hovercard-type="user"]').each((_, el) => {
        const username = $(el).find('img').attr('alt')?.replace('@', '') || '';
        if (username) builtBy.push(username);
      });

      repos.push({
        name: fullName,
        owner,
        repo,
        url,
        description,
        language,
        stars,
        starsToday,
        forks,
        isBuiltBy: builtBy.slice(0, 5),
        trendingRank: index + 1
      });
    } catch (e) {
      // 跳过解析失败的条目
    }
  });

  return repos;
}

/**
 * 解析数字（处理 k, m 后缀）
 */
function parseNumber(text: string): number {
  if (!text) return 0;
  
  const cleanText = text.toLowerCase().replace(/,/g, '').trim();
  
  if (cleanText.endsWith('k')) {
    return Math.round(parseFloat(cleanText) * 1000);
  }
  if (cleanText.endsWith('m')) {
    return Math.round(parseFloat(cleanText) * 1000000);
  }
  
  const num = parseInt(cleanText, 10);
  return isNaN(num) ? 0 : num;
}

/**
 * 分类仓库
 */
export function categorizeRepo(repo: Repository): 'ai_ml' | 'devtools' | 'web' | 'data' | 'other' {
  const text = `${repo.name} ${repo.description}`.toLowerCase();
  
  if (AI_ML_KEYWORDS.some(kw => text.includes(kw))) return 'ai_ml';
  if (DEVTOOLS_KEYWORDS.some(kw => text.includes(kw))) return 'devtools';
  if (WEB_KEYWORDS.some(kw => text.includes(kw))) return 'web';
  if (DATA_KEYWORDS.some(kw => text.includes(kw))) return 'data';
  
  return 'other';
}

/**
 * 提取热门关键词
 */
export function extractKeywords(repos: Repository[]): string[] {
  const keywordCounts = new Map<string, number>();
  
  repos.forEach(repo => {
    const text = `${repo.name} ${repo.description}`.toLowerCase();
    
    // 统计所有关键词
    [...AI_ML_KEYWORDS, ...DEVTOOLS_KEYWORDS, ...WEB_KEYWORDS, ...DATA_KEYWORDS].forEach(kw => {
      if (text.includes(kw)) {
        keywordCounts.set(kw, (keywordCounts.get(kw) || 0) + 1);
      }
    });
  });
  
  // 返回出现次数最多的关键词
  return Array.from(keywordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([kw]) => kw);
}

/**
 * 扫描 GitHub Trending
 */
export async function scanTrending(
  languages: string[],
  timeRange: 'daily' | 'weekly' | 'monthly',
  limit: number
): Promise<TrendingScanResult[]> {
  const results: TrendingScanResult[] = [];
  
  for (const language of languages) {
    try {
      const html = await fetchTrendingPage(language, timeRange);
      let repos = parseTrendingRepos(html);
      
      // 限制数量
      repos = repos.slice(0, limit);
      
      // 分类统计
      const categories = {
        ai_ml: 0,
        devtools: 0,
        web: 0,
        data: 0,
        other: 0
      };
      
      repos.forEach(repo => {
        categories[categorizeRepo(repo)]++;
      });
      
      results.push({
        language,
        timeRange,
        scanTime: new Date().toISOString(),
        totalCount: repos.length,
        repositories: repos,
        topKeywords: extractKeywords(repos),
        categories
      });
      
      // 避免请求过快
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`Failed to scan ${language}:`, error);
    }
  }
  
  return results;
}

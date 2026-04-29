/**
 * GitHub Trending MCP Server - GitHub Service
 *
 * 核心服务：爬取和解析 GitHub Trending 页面
 */
import { Repository, TrendingScanResult } from './types.js';
/**
 * 爬取 GitHub Trending 页面
 */
export declare function fetchTrendingPage(language: string, timeRange: 'daily' | 'weekly' | 'monthly'): Promise<string>;
/**
 * 解析 HTML 提取仓库信息
 */
export declare function parseTrendingRepos(html: string): Repository[];
/**
 * 分类仓库
 */
export declare function categorizeRepo(repo: Repository): 'ai_ml' | 'devtools' | 'web' | 'data' | 'other';
/**
 * 提取热门关键词
 */
export declare function extractKeywords(repos: Repository[]): string[];
/**
 * 扫描 GitHub Trending
 */
export declare function scanTrending(languages: string[], timeRange: 'daily' | 'weekly' | 'monthly', limit: number): Promise<TrendingScanResult[]>;
//# sourceMappingURL=github-service.d.ts.map
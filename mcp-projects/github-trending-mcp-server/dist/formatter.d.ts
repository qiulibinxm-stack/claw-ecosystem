/**
 * GitHub Trending MCP Server - Formatter
 *
 * 输出格式化工具
 */
import { Repository, TrendingScanResult, LearningBrief } from './types.js';
/**
 * 格式化单个仓库为 Markdown
 */
export declare function formatRepoMarkdown(repo: Repository, rank: number): string;
/**
 * 格式化扫描结果为 Markdown
 */
export declare function formatScanResultMarkdown(results: TrendingScanResult[]): string;
/**
 * 格式化扫描结果为 JSON
 */
export declare function formatScanResultJson(results: TrendingScanResult[]): string;
/**
 * 格式化学习简报为 Markdown
 */
export declare function formatBriefMarkdown(brief: LearningBrief): string;
/**
 * 格式化学习简报为 JSON
 */
export declare function formatBriefJson(brief: LearningBrief): string;
/**
 * 生成摘要表格（Markdown）
 */
export declare function generateSummaryTable(results: TrendingScanResult[]): string;
//# sourceMappingURL=formatter.d.ts.map
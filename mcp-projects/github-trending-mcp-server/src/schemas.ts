/**
 * GitHub Trending MCP Server - Schemas
 * 
 * Zod 验证 Schema
 */

import { z } from 'zod';

// 编程语言枚举
export const ProgrammingLanguageSchema = z.enum([
  'python', 'typescript', 'javascript', 'go', 'rust',
  'java', 'cpp', 'c', 'csharp', 'ruby', 'php',
  'swift', 'kotlin', 'all'
]).describe('Programming language to filter trending repos');

// 时间范围枚举
export const TimeRangeSchema = z.enum(['daily', 'weekly', 'monthly'])
  .default('daily')
  .describe('Time range for trending: daily, weekly, or monthly');

// 输出格式枚举
export const ResponseFormatSchema = z.enum(['markdown', 'json'])
  .default('markdown')
  .describe('Output format: markdown (human-readable) or json (machine-readable)');

// 扫描 Trending 输入 Schema
export const ScanTrendingInputSchema = z.object({
  languages: z.array(ProgrammingLanguageSchema)
    .default(['python', 'typescript', 'javascript'])
    .describe('Array of programming languages to scan (default: python, typescript, javascript)'),
  timeRange: TimeRangeSchema,
  limit: z.number()
    .int()
    .min(1)
    .max(50)
    .default(20)
    .describe('Maximum number of repos to return per language'),
  response_format: ResponseFormatSchema
}).strict();

// 生成学习简报输入 Schema
export const GenerateBriefInputSchema = z.object({
  languages: z.array(ProgrammingLanguageSchema)
    .default(['python', 'typescript', 'javascript'])
    .describe('Languages to include in the brief'),
  timeRange: TimeRangeSchema,
  focusKeywords: z.array(z.string())
    .optional()
    .describe('Keywords to prioritize in analysis (e.g., ["ai", "agent", "mcp"])'),
  response_format: ResponseFormatSchema
}).strict();

// 导出类型
export type ScanTrendingInput = z.infer<typeof ScanTrendingInputSchema>;
export type GenerateBriefInput = z.infer<typeof GenerateBriefInputSchema>;

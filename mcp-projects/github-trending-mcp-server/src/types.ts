/**
 * GitHub Trending MCP Server - Types
 * 
 * 类型定义和接口
 */

// 支持的编程语言
export type ProgrammingLanguage = 
  | 'python'
  | 'typescript'
  | 'javascript'
  | 'go'
  | 'rust'
  | 'java'
  | 'cpp'
  | 'c'
  | 'csharp'
  | 'ruby'
  | 'php'
  | 'swift'
  | 'kotlin'
  | 'all';

// 时间范围
export type TimeRange = 'daily' | 'weekly' | 'monthly';

// 输出格式
export type ResponseFormat = 'markdown' | 'json';

// 单个仓库信息
export interface Repository {
  name: string;              // 完整名称，如 "openai/openai-agents-python"
  owner: string;             // 所有者
  repo: string;              // 仓库名
  url: string;               // GitHub URL
  description: string;       // 描述
  language: string;          // 主要语言
  stars: number;             // 总星数
  starsToday: number;        // 今日新增星数
  forks: number;             // Fork 数
  isBuiltBy: string[];       // 贡献者列表
  trendingRank: number;      // 排名
}

// 扫描结果
export interface TrendingScanResult {
  language: string;
  timeRange: string;
  scanTime: string;
  totalCount: number;
  repositories: Repository[];
  topKeywords: string[];     // 提取的热门关键词
  categories: {              // 分类统计
    ai_ml: number;           // AI/机器学习
    devtools: number;        // 开发工具
    web: number;             // Web开发
    data: number;            // 数据处理
    other: number;           // 其他
  };
}

// 学习简报
export interface LearningBrief {
  generatedAt: string;
  totalOpportunities: number;
  topTrends: string[];
  focusAreas: string[];
  recommendedProjects: {
    name: string;
    url: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  dailyGoals: string[];
}

// 工具输入 Schema 类型
export interface ScanTrendingInput {
  languages?: ProgrammingLanguage[];
  timeRange?: TimeRange;
  limit?: number;
  response_format?: ResponseFormat;
}

export interface GenerateBriefInput {
  languages?: ProgrammingLanguage[];
  timeRange?: TimeRange;
  focusKeywords?: string[];
  response_format?: ResponseFormat;
}

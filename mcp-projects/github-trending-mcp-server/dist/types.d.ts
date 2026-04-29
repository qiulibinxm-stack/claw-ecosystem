/**
 * GitHub Trending MCP Server - Types
 *
 * 类型定义和接口
 */
export type ProgrammingLanguage = 'python' | 'typescript' | 'javascript' | 'go' | 'rust' | 'java' | 'cpp' | 'c' | 'csharp' | 'ruby' | 'php' | 'swift' | 'kotlin' | 'all';
export type TimeRange = 'daily' | 'weekly' | 'monthly';
export type ResponseFormat = 'markdown' | 'json';
export interface Repository {
    name: string;
    owner: string;
    repo: string;
    url: string;
    description: string;
    language: string;
    stars: number;
    starsToday: number;
    forks: number;
    isBuiltBy: string[];
    trendingRank: number;
}
export interface TrendingScanResult {
    language: string;
    timeRange: string;
    scanTime: string;
    totalCount: number;
    repositories: Repository[];
    topKeywords: string[];
    categories: {
        ai_ml: number;
        devtools: number;
        web: number;
        data: number;
        other: number;
    };
}
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
//# sourceMappingURL=types.d.ts.map
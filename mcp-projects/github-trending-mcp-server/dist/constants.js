/**
 * GitHub Trending MCP Server - Constants
 *
 * 常量配置
 */
// GitHub Trending 基础 URL
export const GITHUB_TRENDING_URL = 'https://github.com/trending';
// 支持的语言列表
export const SUPPORTED_LANGUAGES = [
    'python',
    'typescript',
    'javascript',
    'go',
    'rust',
    'java',
    'cpp',
    'c',
    'csharp',
    'ruby',
    'php',
    'swift',
    'kotlin',
    'all'
];
// 时间范围映射
export const TIME_RANGE_MAP = {
    daily: '',
    weekly: '?since=weekly',
    monthly: '?since=monthly'
};
// 响应字符限制
export const CHARACTER_LIMIT = 25000;
// 默认请求超时
export const REQUEST_TIMEOUT = 30000;
// 默认返回数量
export const DEFAULT_LIMIT = 20;
// AI/ML 相关关键词（用于分类）
export const AI_ML_KEYWORDS = [
    'ai', 'ml', 'machine learning', 'deep learning', 'neural',
    'gpt', 'llm', 'language model', 'transformer', 'agent',
    'openai', 'anthropic', 'claude', 'chatbot', 'nlp',
    'computer vision', 'rag', 'embedding', 'vector', 'mcp',
    'autonomous', 'inference', 'training', 'fine-tuning'
];
// 开发工具关键词
export const DEVTOOLS_KEYWORDS = [
    'cli', 'api', 'sdk', 'framework', 'library',
    'tool', 'utility', 'helper', 'generator', 'builder',
    'template', 'boilerplate', 'starter', 'devtools'
];
// Web开发关键词
export const WEB_KEYWORDS = [
    'react', 'vue', 'angular', 'svelte', 'next', 'nuxt',
    'frontend', 'backend', 'fullstack', 'web', 'ui', 'ux',
    'css', 'html', 'server', 'http', 'rest', 'graphql'
];
// 数据处理关键词
export const DATA_KEYWORDS = [
    'data', 'analytics', 'visualization', 'etl', 'pipeline',
    'database', 'sql', 'nosql', 'bigdata', 'spark', 'kafka',
    'streaming', 'batch', 'processing', 'mining', 'analysis'
];
//# sourceMappingURL=constants.js.map
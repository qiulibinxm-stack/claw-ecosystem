/**
 * GitHub Trending MCP Server - Formatter
 *
 * 输出格式化工具
 */
/**
 * 格式化单个仓库为 Markdown
 */
export function formatRepoMarkdown(repo, rank) {
    const starsToday = repo.starsToday > 0 ? ` ⭐${repo.starsToday} today` : '';
    return `### ${rank}. [${repo.name}](${repo.url})${starsToday}

- **描述**: ${repo.description || 'N/A'}
- **语言**: ${repo.language || 'N/A'}
- **星数**: ${repo.stars.toLocaleString()} | **Fork**: ${repo.forks.toLocaleString()}
- **贡献者**: ${repo.isBuiltBy.length > 0 ? repo.isBuiltBy.join(', ') : 'N/A'}
`;
}
/**
 * 格式化扫描结果为 Markdown
 */
export function formatScanResultMarkdown(results) {
    const lines = [];
    lines.push('# GitHub Trending 扫描结果\n');
    lines.push(`**扫描时间**: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n`);
    for (const result of results) {
        lines.push(`\n---\n\n## 📊 ${result.language.toUpperCase()} (${result.timeRange})\n`);
        lines.push(`**发现**: ${result.totalCount} 个热门项目\n`);
        // 分类统计
        lines.push(`\n**分类分布**:\n`);
        lines.push(`- 🤖 AI/ML: ${result.categories.ai_ml}`);
        lines.push(`- 🛠️ 开发工具: ${result.categories.devtools}`);
        lines.push(`- 🌐 Web: ${result.categories.web}`);
        lines.push(`- 📊 数据: ${result.categories.data}`);
        lines.push(`- 📦 其他: ${result.categories.other}\n`);
        // 热门关键词
        if (result.topKeywords.length > 0) {
            lines.push(`\n**🔥 热门关键词**: ${result.topKeywords.join(', ')}\n`);
        }
        // 项目列表
        lines.push(`\n### 热门项目\n`);
        result.repositories.forEach((repo, idx) => {
            lines.push(formatRepoMarkdown(repo, idx + 1));
        });
    }
    return lines.join('\n');
}
/**
 * 格式化扫描结果为 JSON
 */
export function formatScanResultJson(results) {
    return JSON.stringify(results, null, 2);
}
/**
 * 格式化学习简报为 Markdown
 */
export function formatBriefMarkdown(brief) {
    const lines = [];
    lines.push('🧠 **今日学习简报**\n');
    lines.push(`**生成时间**: ${brief.generatedAt}\n`);
    lines.push(`**发现学习机会**: ${brief.totalOpportunities} 个\n`);
    // 顶部趋势
    lines.push(`\n### 📈 顶部趋势\n`);
    brief.topTrends.forEach((trend, idx) => {
        lines.push(`${idx + 1}. ${trend}`);
    });
    // 重点领域
    lines.push(`\n### 🎯 重点学习领域\n`);
    brief.focusAreas.forEach((area, idx) => {
        lines.push(`${idx + 1}. ${area}`);
    });
    // 推荐项目
    lines.push(`\n### 🔖 推荐项目\n`);
    brief.recommendedProjects.forEach((proj, idx) => {
        const priorityEmoji = {
            high: '🔴',
            medium: '🟡',
            low: '🟢'
        };
        lines.push(`${idx + 1}. ${priorityEmoji[proj.priority]} **[${proj.name}](${proj.url})**`);
        lines.push(`   > ${proj.reason}`);
    });
    // 每日目标
    lines.push(`\n### 📝 今日学习目标\n`);
    brief.dailyGoals.forEach((goal, idx) => {
        lines.push(`${idx + 1}. ${goal}`);
    });
    return lines.join('\n');
}
/**
 * 格式化学习简报为 JSON
 */
export function formatBriefJson(brief) {
    return JSON.stringify(brief, null, 2);
}
/**
 * 生成摘要表格（Markdown）
 */
export function generateSummaryTable(results) {
    const lines = [];
    lines.push('| 语言 | 项目数 | AI/ML | 开发工具 | Web | 数据 | 热门关键词 |');
    lines.push('|------|--------|-------|----------|-----|------|------------|');
    for (const result of results) {
        const keywords = result.topKeywords.slice(0, 3).join(', ');
        lines.push(`| ${result.language} | ${result.totalCount} | ${result.categories.ai_ml} | ${result.categories.devtools} | ${result.categories.web} | ${result.categories.data} | ${keywords} |`);
    }
    return lines.join('\n');
}
//# sourceMappingURL=formatter.js.map
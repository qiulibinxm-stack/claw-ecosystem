/**
 * 简单测试脚本 - 验证 GitHub Trending MCP Server 核心功能
 */

import { scanTrending } from './dist/github-service.js';
import { formatScanResultMarkdown, generateSummaryTable } from './dist/formatter.js';

async function test() {
  console.log('🧪 Testing GitHub Trending MCP Server...\n');
  
  try {
    // 测试扫描
    console.log('📊 Scanning GitHub Trending (Python)...');
    const results = await scanTrending(['python'], 'daily', 5);
    
    if (results.length > 0) {
      console.log(`✅ Success! Found ${results[0].totalCount} repos\n`);
      
      // 显示项目列表
      console.log('--- Top 5 Python Repos ---');
      results[0].repositories.forEach((repo, idx) => {
        console.log(`${idx + 1}. ${repo.name} ⭐${repo.starsToday}`);
        console.log(`   ${repo.description?.slice(0, 80)}...`);
      });
      
      // 显示分类统计
      console.log('\n--- Categories ---');
      console.log(`AI/ML: ${results[0].categories.ai_ml}`);
      console.log(`DevTools: ${results[0].categories.devtools}`);
      console.log(`Web: ${results[0].categories.web}`);
      console.log(`Data: ${results[0].categories.data}`);
      
      // 显示关键词
      console.log('\n--- Top Keywords ---');
      console.log(results[0].topKeywords.join(', '));
      
      console.log('\n✅ All tests passed!');
    } else {
      console.log('❌ No results returned');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

test();

import fs from 'fs';
import path from 'path';

export function parseMarkdown(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath, '.md');
    const name = fileName.replace('.md', '');
    const tags = extractTags(content);
    const parsedContent = content.replace(/^#(.+)\n/, '');
    const placeholders = [...content.matchAll(/\${(.*?)}/g)].map(match => match[1]);

    return {
        name,
        tags,
        content: parsedContent,
        placeholders,
    };
}

function extractTags(content: string): string[] {
    // 正则表达式匹配以 # 开头，后面跟着中文、字母或数字的标签
    const tagRegex = /#([\u4e00-\u9fa5\w]+)/g;
    const tags: string[] = [];
    let match;

    while ((match = tagRegex.exec(content)) !== null) {
        tags.push(match[1]); // 提取标签内容（去掉#号）
    }

    return Array.from(new Set(tags)); // 去重
}

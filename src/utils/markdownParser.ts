export function parseMarkdown(content: string) {
    const tags = extractTags(content);
    const parsedContent = content.replace(/^#(.+)\n/, '');
    const placeholders = [...content.matchAll(/\${(.*?)}/g)].map(match => match[1]);

    return {
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

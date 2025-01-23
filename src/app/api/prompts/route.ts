import fs from 'fs';
import path from 'path';
import { parseMarkdown } from '@/utils/markdownParser';
import { NextResponse } from 'next/server';

const PROMPT_DIR = path.join(process.cwd(), 'data/prompts');

export async function POST(request: Request) {
    const { name, content }: { name: string; content: string; } = await request.json();
    const filePath = path.join(PROMPT_DIR, `${name}.md`);
    fs.writeFileSync(filePath, content, 'utf-8');
    return new NextResponse(null, { status: 201 });
}

export async function GET() {
    const files = fs.readdirSync(PROMPT_DIR);
    const prompts: Prompt[] = files
        .map((file) => {
            const filePath = path.join(PROMPT_DIR, file);
            const parsed = parseMarkdown(filePath);
            return {
                ...parsed
            };
        })
        .filter(prompt => !prompt.name.startsWith('_'));
    return NextResponse.json(prompts);
}

import { parseMarkdown } from '@/utils/markdownParser';
import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/db/localmddb';

const model = "prompt";
export async function POST(request: Request) {
    const { name, content }: { name: string; content: string; } = await request.json();
    writeDb(model, [{ id: name, content }]);
    return new NextResponse(null, { status: 201 });
}

export async function GET() {
    const data = await readDb(model);
    const prompts = data.map((prompt: { id: string, content: string }) => {
        const parsed = parseMarkdown(prompt.content);
        return {
            ...parsed,
            name: prompt.id
        };
    });
    return NextResponse.json(prompts);
}

import { readDb, writeDb } from '@/db/localmddb';
import { NextResponse } from 'next/server';

const model = "knowentry";

function knowEntryToMd(entry: KnowEntry): { id: string, content: string } {
    return { id: entry.title + '.' + entry.timestamp?.toString(), content: entry.content };
}

function mdToKnowEntry(md: { id: string, content: string }): KnowEntry {
    return {
        title: md.id.split('.')[0],
        content: md.content,
        tags: [],
        timestamp: parseInt(md.id.split('.')[1])
    }
}

export async function POST(request: Request) {
    const { title, content, tags } = await request.json();
    const knowEntry: KnowEntry = { title, content, tags, timestamp: Date.now() };
    await writeDb(model, [knowEntryToMd(knowEntry)]);
    return new NextResponse(null, { status: 201 });
}

export async function GET() {
    const entries = await readDb(model);
    const knowEntries = entries.map(mdToKnowEntry);
    return NextResponse.json(knowEntries);
}



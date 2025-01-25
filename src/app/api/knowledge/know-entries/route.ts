import { readDb, writeDb, deleteDbById } from '@/db/localmddb';
import { NextResponse } from 'next/server';

const model = "knowentry";

function knowEntryToMd(entry: KnowEntry): { id: string, content: string } {
    return { id: entry.title + '.' + entry.timestamp?.toString(), content: entry.content };
}

function mdToKnowEntry(md: { id: string, content: string }): KnowEntry {
    return {
        title: md.id.split('.').slice(0, -1).join('.'),
        timestamp: parseInt(md.id.split('.').slice(-1)[0]),
        content: md.content,
        tags: [],
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

// get query params
export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || '';
    const timestamp = searchParams.get('timestamp') || '';
    const id = title + '.' + timestamp;
    await deleteDbById(model, id);
    return new NextResponse(null, { status: 204 });
}



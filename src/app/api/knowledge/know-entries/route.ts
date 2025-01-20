import { writeDb } from '@/db/localdb';

const model = "knowentry";

export async function POST(request: Request) {
    const { title, content, tags } = await request.json();
    const knowEntry: KnowEntry = { title, content, tags, timestamp: Date.now() };

    await writeDb<KnowEntry>(model, [knowEntry]);
}



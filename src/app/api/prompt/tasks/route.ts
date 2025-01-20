import { Task } from '@/core/Task';
import { readDb, writeDb } from '@/db/localdb';
import { NextResponse } from 'next/server';

const model = "task";
export async function POST(request: Request) {
    const { goal, role, skills, workflow, example, checkPoints } = await request.json();
    const task: Task = { goal, role, skills, workflow, example, checkPoints };

    await writeDb<Task>(model, [task]);

    return new NextResponse(null, { status: 201 });
}

export async function GET() {
    const tasks = await readDb<Task>(model);
    return NextResponse.json(tasks);
}



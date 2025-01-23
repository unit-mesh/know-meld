import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { parseMarkdown } from "@/utils/markdownParser";

const EXAMPLE_PATH = path.join(process.cwd(), 'data/prompts/_example.md');

export async function GET() {
    const filePath = EXAMPLE_PATH;

    if (!fs.existsSync(filePath)) {
        return new NextResponse(null, { status: 404 });
    }

    const parsed = parseMarkdown(filePath);
    return NextResponse.json(parsed);

}


import { NextResponse } from "next/server";
import { parseMarkdown } from "@/utils/markdownParser";
import { readDbById } from "@/db/localmddb";

export async function GET() {
    const prompt = await readDbById('prompt', '_example');

    const parsed = parseMarkdown(prompt.content);
    return NextResponse.json(parsed);

}


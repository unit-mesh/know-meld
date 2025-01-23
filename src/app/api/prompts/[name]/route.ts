import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { parseMarkdown } from "@/utils/markdownParser";

const PROMPT_DIR = path.join(process.cwd(), 'data/prompts');

export async function GET(request: Request, { params }: { params: { name: string } }) {
  const filePath = path.join(PROMPT_DIR, `${params.name}.md`);
  if (!fs.existsSync(filePath)) {
    return new NextResponse(null, { status: 404 });
  }

  const parsed = parseMarkdown(filePath);
  return NextResponse.json(parsed);

}

export async function DELETE(request: Request, { name }: { name: string }) {
  const filePath = path.join(PROMPT_DIR, `${name}.md`);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  return new NextResponse(null, { status: 204 });
}

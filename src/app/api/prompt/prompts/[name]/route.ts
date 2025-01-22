import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

const PROMPT_DIR = path.join(process.cwd(), 'data/prompts');

export async function DELETE(request: Request, { name }: { name: string }) {
  const filePath = path.join(PROMPT_DIR, `${name}.md`);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  return new NextResponse(null, { status: 204 });
}


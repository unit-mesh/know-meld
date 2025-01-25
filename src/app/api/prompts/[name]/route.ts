import { NextResponse } from "next/server";
import { parseMarkdown } from "@/utils/markdownParser";
import { readDbById, deleteDbById } from '@/db/localmddb';

const model = "prompt";

export async function GET(request: Request, { params }: { params: { name: string } }) {
  const prompt = await readDbById(model, params.name);

  const parsed = parseMarkdown(prompt.content);
  return NextResponse.json(parsed);

}

export async function DELETE(request: Request, { name }: { name: string }) {
  deleteDbById(model, name);

  return new NextResponse(null, { status: 204 });
}

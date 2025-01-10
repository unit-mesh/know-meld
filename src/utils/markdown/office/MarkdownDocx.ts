import { unified } from "unified";
import remarkParse from "remark-parse";
import docx from "remark-docx";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

import mammoth from "mammoth";
import TurndownService from "turndown";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import * as turndownPluginGfm from "turndown-plugin-gfm";

export async function markdownToDocx(markdownContent: string) {
  const processor = unified().use(remarkParse)
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(docx, { output: "blob" } as any);

  const doc = await processor.process(markdownContent);
  return await doc.result;
}

export function htmlToMarkdown(html: string) {
  const turndownService = new TurndownService();

  const gfm = turndownPluginGfm.gfm
  turndownService.use(gfm)

  return turndownService.turndown(html);
}

export async function docxToMarkdown(arrayBuffer: ArrayBuffer, isForFeatureUsecase = false) {
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const html = result.value;
  return htmlToMarkdown(html);
}

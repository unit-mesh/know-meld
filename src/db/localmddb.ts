import fs from 'fs';
import path from 'path';

const dbDataPath = process.env.DB_DATA_PATH || path.resolve('./data');

function getDirPath(model: string): string {
  return path.join(dbDataPath, model);
}

function getFilePath(model: string, id: string): string {
  const fileName = `${id}.md`;
  const dirPath = getDirPath(model);
  return path.join(dirPath, fileName);
}

export async function readDb(model: string): Promise<{ id: string, content: string }[]> {
  const dirPath = getDirPath(model);
  const files = await fs.promises
    .readdir(dirPath)
    .catch(() => []);
  const entries = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(dirPath, file);
      const content = await fs.promises.readFile(filePath, 'utf-8');
      return { id: file.replace('.md', ''), content };
    })
  );
  return entries;
}

export async function readDbById(model: string, id: string): Promise<{ id: string, content: string }> {
  const filePath = getFilePath(model, id);
  const content = await fs.promises
    .readFile(filePath, 'utf-8')
    .catch(() => '');
  return { id, content };
}

export async function writeDb(model: string, entries: { id: string, content: string }[]): Promise<void> {
  for (const entry of entries) {
    const filePath = getFilePath(model, entry.id);
    await fs.promises.writeFile(filePath, entry.content, 'utf-8');
  }
}

export async function deleteDbById(model: string, id: string): Promise<void> {
  const filePath = getFilePath(model, id);
  console.log('Deleting file:', filePath);
  await fs.promises.unlink
    .call(fs.promises, filePath)
    .catch(() => { });
}


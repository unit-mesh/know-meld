import fs from 'fs';
import path from 'path';

const dbDataPath = process.env.DB_DATA_PATH || path.resolve('./data');

function getFileName(model: string): string {
  return `${model}.json`;
}

function getFilePath(model: string): string {
  const fileName = getFileName(model);
  console.log("fileName", fileName)
  return path.join(dbDataPath, fileName);
}

export async function readDb<T>(model: string): Promise<T[]> {
  const filePath = getFilePath(model);
  console.log("filePath", filePath)
  let entries: T[] = [];
  if (fs.existsSync(filePath)) {
    const data = await fs.promises.readFile(filePath, 'utf-8');
    entries = JSON.parse(data);
  }
  return entries;
}

export async function writeDb<T>(model: string, entries: T[]): Promise<void> {
  const filePath = getFilePath(model);
  await fs.promises.writeFile(filePath, JSON.stringify(entries, null, 2), 'utf-8');
}

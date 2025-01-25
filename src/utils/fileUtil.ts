import mammoth from 'mammoth';

function removeFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');

    if (lastDotIndex === -1) {
        return filename;
    }

    return filename.substring(0, lastDotIndex);
}


export const readFileContent = (file: File) => {
    return new Promise<{ name: string; content: string }>((resolve, reject) => {
      const reader = new FileReader();
      const fileType = file.name.split('.').pop()?.toLowerCase();
      const fileName = removeFileExtension(file.name);
  
      reader.onload = () => {
        const result = reader.result;
        if (fileType === 'docx' && result instanceof ArrayBuffer) {
          mammoth.extractRawText({ arrayBuffer: result })
            .then((mammothResult) => {
              resolve({ name: fileName, content: mammothResult.value });
            })
            .catch(reject);
        } else if (fileType === 'md' || fileType === 'txt' || fileType === 'text') {
          if (typeof result === 'string') {
            resolve({ name: fileName, content: result });
          } else {
            reject(new Error('Failed to read the file as text.'));
          }
        } else {
          reject(new Error('Unsupported file type.'));
        }
      };
  
      if (fileType === 'docx') {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  };
export const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const downloadBase64File = (base64Data: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = base64Data;
  link.download = fileName;
  link.click();
};

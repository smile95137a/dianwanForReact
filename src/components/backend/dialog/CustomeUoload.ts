import { uploadImage } from '@/services/backend/NewsService';
import { getImageUrl } from '@/utils/ImageUtils';

class CustomUploadAdapter {
  loader: any;
  constructor(loader: any) {
    // The file loader instance to use during the upload.
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(async (file: File) => {
      const res: any = await uploadImage(file);
      const url = getImageUrl(res.data);

      return {
        default: url,
      };
    });
  }

  abort() {
    console.log('圖片上傳被中止');
  }
}

export default function CustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new CustomUploadAdapter(loader);
  };
}

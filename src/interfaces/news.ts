export interface News {
  newsUid: string; // 新聞的唯一識別碼
  title: string; // 新聞標題
  preview: string; // 新聞預覽
  content: string; // 新聞內容
  createdDate: string; // 新聞創建日期
  updatedDate?: string; // 新聞更新日期（可選）
  imageUrls: (string | File)[]; // 圖片 URL 列表
  status: NewsStatus; // 新聞的狀態
  author: string; // 作者
}

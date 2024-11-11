const API_IMAGE_URL = import.meta.env.VITE_BASE_API_URL3;

export const getImageUrl = (imagePath: string): string => {
  return `${API_IMAGE_URL}/img${imagePath}`;
};

import { api } from './BackendAPI';
import {
  ApiResponse,
  DetailApiResponse,
  DetailListApiResponse,
  DetailReq,
  ProductApiResponse,
  ProductListApiResponse,
  ProductReq,
  ProductType,
  PrizeCategory,
  ProductCategory,
  ProductCategoryApiResponse,
  ProductCategoryListApiResponse,
} from '@/interfaces/product';

const basePath = '/product';
const productCategoryPath = '/productCategory';
const productDetailPath = '/productDetail';

export const getAllProducts = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.get<ApiResponse<any[]>>(`${basePath}/query`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
};

export const getProductById = async (
  id: number
): Promise<ApiResponse<ProductApiResponse>> => {
  try {
    const response = await api.get<ApiResponse<ProductApiResponse>>(
      `${basePath}/query/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching product by ID: ${id}`, error);
    throw error;
  }
};

export const createProduct = async (
  productReq: ProductReq
): Promise<ApiResponse<ProductApiResponse>> => {
  const formData = new FormData();
  const imageFiles: File[] = [];

  productReq.imageUrls.forEach((url, index) => {
    if (url instanceof File) {
      imageFiles.push(url);
      productReq.imageUrls[index] = ''; // Placeholder for backend replacement
    }
  });

  formData.append('productReq', JSON.stringify(productReq));
  imageFiles.forEach((file) => {
    formData.append('images', file);
  });

  try {
    const response = await api.post<ApiResponse<ProductApiResponse>>(
      `${basePath}/add`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (
  id: number,
  productReq: ProductReq
): Promise<ApiResponse<ProductApiResponse>> => {
  const formData = new FormData();
  const imageFiles: File[] = [];

  productReq.imageUrls.forEach((url, index) => {
    if (url instanceof File) {
      imageFiles.push(url);
      productReq.imageUrls[index] = ''; // Placeholder for backend replacement
    }
  });

  formData.append('productReq', JSON.stringify(productReq));
  imageFiles.forEach((file) => {
    formData.append('images', file);
  });

  try {
    const response = await api.put<ApiResponse<ProductApiResponse>>(
      `${basePath}/update/${id}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating product by ID: ${id}`, error);
    throw error;
  }
};

export const deleteProduct = async (id: number): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete<ApiResponse<void>>(
      `${basePath}/delete/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting product by ID: ${id}`, error);
    throw error;
  }
};

export const getAllProductsByType = async (
  productType: any
): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.post<ApiResponse<any[]>>(`${basePath}/type`, {
      type: productType,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching products by type: ${productType}`, error);
    throw error;
  }
};

export const getOneKuJiType = async (
  prizeCategory: PrizeCategory
): Promise<ApiResponse<ProductListApiResponse>> => {
  try {
    const response = await api.post<ApiResponse<ProductListApiResponse>>(
      `${basePath}/OneKuJi/type`,
      { type: prizeCategory }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching one KuJi by category: ${prizeCategory}`,
      error
    );
    throw error;
  }
};

// Product Details
export const getAllProductDetails = async (): Promise<
  ApiResponse<DetailListApiResponse>
> => {
  try {
    const response = await api.get<ApiResponse<DetailListApiResponse>>(
      `${productDetailPath}/all`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching all product details:', error);
    throw error;
  }
};

export const createProductDetail = async (
  detailReq: DetailReq
): Promise<ApiResponse<DetailApiResponse>> => {
  const formData = new FormData();
  const imageFiles: File[] = [];

  detailReq.imageUrls.forEach((url, index) => {
    if (url instanceof File) {
      imageFiles.push(url);
      detailReq.imageUrls[index] = ''; // Placeholder for backend replacement
    }
  });

  formData.append('productDetailReq', JSON.stringify(detailReq));
  imageFiles.forEach((file) => {
    formData.append('images', file);
  });

  try {
    const response = await api.post<ApiResponse<DetailApiResponse>>(
      `${productDetailPath}/add`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating product detail:', error);
    throw error;
  }
};

// Product Categories
export const getAllCategories = async (): Promise<
  ApiResponse<ProductCategoryListApiResponse>
> => {
  try {
    const response = await api.get<ApiResponse<ProductCategoryListApiResponse>>(
      `${productCategoryPath}/all`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching all product categories:', error);
    throw error;
  }
};

export const getCategoryById = async (
  id: number
): Promise<ApiResponse<ProductCategoryApiResponse>> => {
  try {
    const response = await api.get<ApiResponse<ProductCategoryApiResponse>>(
      `${productCategoryPath}/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching category by ID: ${id}`, error);
    throw error;
  }
};

export const createCategory = async (category: {
  categoryName: string;
}): Promise<ApiResponse<ProductCategoryApiResponse>> => {
  try {
    const response = await api.post<ApiResponse<ProductCategoryApiResponse>>(
      productCategoryPath,
      category
    );
    return response.data;
  } catch (error) {
    console.error('Error creating product category:', error);
    throw error;
  }
};

export const updateCategory = async (
  id: number,
  category: ProductCategory
): Promise<ApiResponse<ProductCategoryApiResponse>> => {
  try {
    const response = await api.put<ApiResponse<ProductCategoryApiResponse>>(
      `${productCategoryPath}/${id}`,
      category
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating category by ID: ${id}`, error);
    throw error;
  }
};

export const deleteCategory = async (
  id: number
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete<ApiResponse<void>>(
      `${productCategoryPath}/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting category by ID: ${id}`, error);
    throw error;
  }
};

// Utility function for generating image URLs
export const getImageUrl = (imagePath: string): string => {
  return `${process.env.VITE_BASE_API_URL3}/img${imagePath}`;
};

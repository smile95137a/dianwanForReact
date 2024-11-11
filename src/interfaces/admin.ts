export interface LoginDto {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  // 添加其他需要的用户属性
}

export interface JWTAuthResponse {
  accessToken: string;
  user: User;
}

export interface ApiResponse<T> {
  code: number;
  message: string | null;
  data: T | null;
  success: boolean;
}
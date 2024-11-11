export interface User {
  id: number;
  username: string;
  password?: string;
  nickName: string;

  phoneNumber: string;
  address: string;
  createdAt: string;
  updatedAt: number;
  roleId: number;
  status: string;
  balance: number;
  bonus: number;
  sliverCoin: number;
  provider: string;
  roles: Role[];
}

export interface Role {
  id: number;
  name: string;
}

export interface UserReq {
  username: string;
  password: string;
  nickName: string;

  phoneNumber: string;
  address: string;
  roleId: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string | null;
  data: T | null;
}

// 新增的 SliverUpdate 接口
export interface SliverUpdate {
  userId: number[];
  sliverCoin: number;
  bonus: number;
}
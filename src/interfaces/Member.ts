export interface Role {
  id: number;
  name: string;
}

export interface Member {
  id: number;
  username: string;
  password: string;
  nickname: string;
  email: string;
  phoneNumber: string; // 確保大小寫正確
  address: string;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
  balance: number;
  bonusPoints: number;
  lastTopUpTime: string;
  userType: string;
  roleId: number;
  status: string;
}

export interface MemberResponse {
  data: Member[];
}

export interface StatResponse {
  additionalProp1: number;
  additionalProp2: number;
  additionalProp3: number;
}

import { api } from './FrontendAPI';

const basePath = '/password';

export const generateResetPasswordLink = async (
  email: string
): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.post<ApiResponse<boolean>>(
      `${basePath}/genResetPwd`,
      { email }
    );
    return response.data;
  } catch (error) {
    console.error('Error generating reset password link:', error);
    throw error;
  }
};

export const verifyPasswordToken = async (
  token: string
): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.post<ApiResponse<boolean>>(
      `${basePath}/verifyPasswordToken/${token}`
    );
    return response.data;
  } catch (error) {
    console.error('Error verifying password token:', error);
    throw error;
  }
};

export const resetPassword = async (
  token: string,
  pwd: string
): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.post<ApiResponse<boolean>>(
      `${basePath}/resetPassword`,
      { token, pwd }
    );
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

import { api } from './FrontendAPI';

export interface VerificationResponse {
  message: string;
}

const basePath = '/verify';

export const verifyUser = async (token: string) => {
  try {
    const response = await api.post<VerificationResponse>(
      `${basePath}/${token}`
    );
    return response.data;
  } catch (error) {
    console.error('Error during verification:', error);
    throw error;
  }
};

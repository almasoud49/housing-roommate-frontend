export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegistrationPayload {
  name: string;
  email: string;
  password: string;
  role: "TENANT" | "LANDLORD" | "PROPERTY_MANAGER";
}

export interface VerifyAccountPayload {
  email: string;
  otp: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: { accessToken: string };
}

export interface GoogleLoginPayload {
  idToken: string;
}

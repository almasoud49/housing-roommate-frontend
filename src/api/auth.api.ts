import apiClient from "@/lib/apiClient";
import {
  ForgotPasswordPayload,
  GoogleLoginPayload,
  LoginPayload,
  RegistrationPayload,
  ResetPasswordPayload,
  VerifyAccountPayload,
} from "@/types";

export function userLogin(payload: LoginPayload) {
  return apiClient("/auth/login", { method: "POST", body: payload });
}

export function userRegistration(payload: RegistrationPayload) {
  return apiClient("/auth/register", { method: "POST", body: payload });
}

export function verifyAccount(payload: VerifyAccountPayload) {
  return apiClient("/auth/verify-email", { method: "POST", body: payload });
}

export function googleLogin(payload: GoogleLoginPayload) {
  return apiClient("/auth/google-login", { method: "POST", body: payload });
}

export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiClient("/auth/forgot-password", { method: "POST", body: payload });
}

export function resetPassword(payload: ResetPasswordPayload) {
  return apiClient("/auth/reset-password", { method: "POST", body: payload });
}

/** Uses the httpOnly `refreshToken` cookie; returns `{ data: { accessToken } }`. */
export function refreshToken() {
  return apiClient("/auth/refresh-token", { method: "POST" });
}

export function userLogout() {
  return apiClient("/auth/logout", { method: "POST" });
}

export function getMe() {
  return apiClient("/auth/me");
}

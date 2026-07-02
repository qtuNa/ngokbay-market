/** Vai trò người dùng — khớp enum UserRole trong schema Prisma */
export type UserRole = "BUYER" | "SELLER" | "CONTENT_EDITOR" | "ADMIN";

/** Payload JWT sau khi xác thực OTP thành công */
export interface JwtUserPayload {
  sub: string;
  phone: string;
  role: UserRole;
}

/** Bản ghi user tối thiểu dùng khi phát hành JWT */
export interface AuthUser {
  id: string;
  phone: string;
  role: UserRole;
}

/** Body POST /api/auth/send-otp */
export interface SendOtpRequestBody {
  phone: string;
}

/** Body POST /api/auth/verify-otp */
export interface VerifyOtpRequestBody {
  phone: string;
  otp: string;
}

/** Giá trị lưu Redis tại key `otp:{phone}` */
export interface OtpRedisRecord {
  code: string;
  attempts: number;
}

/** Phản hồi thành công khi gửi OTP */
export interface SendOtpSuccessResponse {
  success: true;
  message: string;
  expiresIn: number;
}

/** Phản hồi thành công khi xác thực OTP */
export interface VerifyOtpSuccessResponse {
  success: true;
  token: string;
  user: AuthUser;
}

/** Phản hồi lỗi chuẩn */
export interface AuthErrorResponse {
  success: false;
  error: string;
  code?: string;
}

export type SendOtpResponse = SendOtpSuccessResponse | AuthErrorResponse;
export type VerifyOtpResponse = VerifyOtpSuccessResponse | AuthErrorResponse;

/** Kết quả đối chiếu OTP từ Redis */
export type OtpVerificationResult =
  | { status: "valid"; record: OtpRedisRecord }
  | { status: "invalid"; remainingAttempts: number }
  | { status: "expired" }
  | { status: "blocked" }
  | { status: "max_attempts_exceeded" };

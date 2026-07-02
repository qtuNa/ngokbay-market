/**
 * Giả lập SDK Zalo OA gửi tin nhắn OTP.
 * Production: thay bằng HTTP call tới Zalo OA Message API.
 * @see https://developers.zalo.me/docs/official-account/
 */

export interface ZaloOASendOtpRequest {
  phone: string;
  code: string;
  templateId?: string;
}

export interface ZaloOASendOtpResult {
  success: boolean;
  messageId: string;
  provider: "zalo_oa";
}

export class ZaloOAError extends Error {
  constructor(
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = "ZaloOAError";
  }
}

const DEFAULT_OTP_TEMPLATE =
  "Ma xac thuc Ngok Bay cua ban la {code}. Hieu luc trong 5 phut. Khong chia se ma nay voi bat ky ai.";

function buildOtpMessage(code: string, templateId?: string): string {
  if (templateId) {
    return `[template:${templateId}] ${DEFAULT_OTP_TEMPLATE.replace("{code}", code)}`;
  }
  return DEFAULT_OTP_TEMPLATE.replace("{code}", code);
}

/**
 * Giả lập gọi Zalo OA SDK để gửi OTP tới SĐT.
 * Dev: log ra console thay vì gọi API thật.
 */
export async function sendOtpViaZaloOA(
  request: ZaloOASendOtpRequest,
): Promise<ZaloOASendOtpResult> {
  const accessToken = process.env.ZALO_OA_ACCESS_TOKEN;

  if (!accessToken && process.env.NODE_ENV === "production") {
    throw new ZaloOAError("ZALO_OA_ACCESS_TOKEN chua duoc cau hinh");
  }

  const message = buildOtpMessage(request.code, request.templateId);
  const messageId = `zalo_mock_${Date.now()}_${request.phone.slice(-4)}`;

  // Giả lập độ trễ mạng SDK
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 120);
  });

  console.info("[ZaloOA Mock] Gui OTP", {
    phone: request.phone,
    messageId,
    preview: message,
    hasAccessToken: Boolean(accessToken),
  });

  return {
    success: true,
    messageId,
    provider: "zalo_oa",
  };
}

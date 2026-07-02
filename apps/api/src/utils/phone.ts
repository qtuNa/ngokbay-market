const VIETNAM_PHONE_REGEX = /^(?:\+84|84|0)(3|5|7|8|9)\d{8}$/;

/** Chuẩn hóa SĐT Việt Nam về dạng 0xxxxxxxxx */
export function normalizeVietnamesePhone(input: string): string {
  const trimmed = input.trim().replace(/[\s.-]/g, "");

  if (trimmed.startsWith("+84")) {
    return `0${trimmed.slice(3)}`;
  }

  if (trimmed.startsWith("84") && trimmed.length === 11) {
    return `0${trimmed.slice(2)}`;
  }

  return trimmed;
}

export function isValidVietnamesePhone(phone: string): boolean {
  return VIETNAM_PHONE_REGEX.test(phone);
}

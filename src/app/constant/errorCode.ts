/** String error codes (const object — compatible with `erasableSyntaxOnly`). */
export const ErrorCodes = {
  SESSION_INVALID: "12016",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

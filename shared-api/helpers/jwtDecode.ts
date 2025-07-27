import * as jose from "jose";
type Role = "ADMINISTRATOR" | "RECRUITER" | "MEMBER";
export type JwtPayload = {
  sub?: string;
  email?: string;
  role?: Role;
  verified?: boolean;
};
export interface JwtUserPayload extends JwtPayload {
  iat: number;
  exp: number;
}

export const jwtDecode = (token: string) =>
  jose.decodeJwt<JwtUserPayload>(token);

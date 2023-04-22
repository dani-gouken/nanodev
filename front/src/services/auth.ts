import { AUTH_BASE_URL } from "../config";
import { postRequest } from "./helper";

const url = (path: string) => `${AUTH_BASE_URL}${path}`
type LoginRes = {
    "otp": {
        "uuid": string
    }
}

export type User = {
    "jwt": string,
    "user": {
        "id": number,
        "username": string,
        "email": string,
        "role": {
            "id": number,
            "name": string,
        }
    }
}
export function login(data: { email: string, password: string }): Promise<LoginRes> {
    return postRequest<LoginRes>(url("/api/auth/local"), {
        password: data.password,
        identifier: data.email
    });
}
export function verifyOtp({ uuid, code }: { uuid: string, code: string }): Promise<User> {
    return postRequest<User>(url(`/api/auth/otp/${uuid}/verify`), { code });
}

export function register(data: { email: string, username: string, password: string }) {
    return postRequest<User>(url("/api/auth/local/register"), data);
}

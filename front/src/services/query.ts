import { API_BASE_URL } from "../config";
import { User } from "./auth";
import { apiUrl, getRequest, postRequest } from "./helper";

export enum RequestStatus {
    DRAFT = "DRAFT",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
}
export type Request = {
    "ID": number,
    "description": string,
    "title": string,
    "status": RequestStatus,
    "categoryLink": {
        "category": {
            "ID": number,
            "name": string
        }
    },
}
export type CreateRequest = {
    title: string,
    description: string,
    categoryId: number
}
export function getQueries() {
    return getRequest<Request[]>(apiUrl("/api/request"));
}
export function createQuery(data: CreateRequest) {
    return postRequest(apiUrl("/api/request"),
        data
    );
}


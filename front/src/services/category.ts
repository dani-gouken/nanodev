import { apiUrl, getRequest } from "./helper";
type Category = {
    name: string;
    ID: number
}
export function getCategories(): Promise<Category[]> {
    return getRequest<Category[]>(apiUrl("/api/category"));
}

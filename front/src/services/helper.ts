import { API_BASE_URL } from "../config";
import { readCachedUser } from "../hooks/useAuth";
export const apiUrl = (path: string) => `${API_BASE_URL}${path}`

function sendRequest<T>(url: RequestInfo | URL, options?: RequestInit): Promise<T> {
  let user = readCachedUser();
  let headers = options?.headers
  if (user != null) {
    if (Array.isArray(headers)) {
      headers.push(["Authorization", `Bearer ${user.jwt}`]);
    } else if (typeof headers == "object") {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${user.jwt}`;
    } else {
      headers = { "Authorization": `Bearer ${user.jwt}` };
    }
  }
  options = {
    ...options,
    headers
  }
  return fetch(url, options)
    .then(async function (response) {
      if (response.ok) {
        return await response.json();
      } else {
        throw response;
      }
    }).catch(async (err) => {
      console.error(err);
      let msg = "An unexpected error occured";
      if (err instanceof Response) {
        throw {
          message: await err.json().then((e) => e.message ?? e.error.message ?? msg).catch((e) => {
            return msg
          })
        }
      } else {
        throw {
          message: msg
        }
      }
    });
}

function postRequest<T>(url: RequestInfo | URL, body?: object, headers?: HeadersInit): Promise<T> {
  const options = {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      'Content-Type': "application/json",
      "Accept": "application/json",
      ...headers
    }
  };

  return sendRequest<T>(url, options);
}

function getRequest<T>(path: RequestInfo | URL, queryParams?: { string: string }, headers?: HeadersInit) {
  const params = new URLSearchParams(queryParams);
  var options = {
    method: "get",
    headers: {
      "Accept": "application/json",
      ...headers,
    }
  };
  return sendRequest<T>(`${path}?${params.toString()}`, options);
}
export {
  sendRequest,
  getRequest,
  postRequest
};

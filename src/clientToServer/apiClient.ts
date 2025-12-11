type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions<TBody> {
  body?: TBody;
  headers?: Record<string, string>;
}

const jsonHeaders = { "Content-Type": "application/json" };

async function request<TResponse, TBody = unknown>(
  url: string,
  method: HttpMethod,
  options: RequestOptions<TBody> = {},
): Promise<TResponse> {
  const response = await fetch(url, {
    method,
    headers: { ...jsonHeaders, ...options.headers },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Request failed (${response.status}): ${errorText || response.statusText}`,
    );
  }

  if (response.status === 204) {
    return null as TResponse;
  }

  return (await response.json()) as TResponse;
}

export const apiClient = {
  get: <TResponse>(url: string) => request<TResponse>(url, "GET"),
  post: <TResponse, TBody = unknown>(url: string, body?: TBody) =>
    request<TResponse, TBody>(url, "POST", { body }),
  put: <TResponse, TBody = unknown>(url: string, body?: TBody) =>
    request<TResponse, TBody>(url, "PUT", { body }),
  patch: <TResponse, TBody = unknown>(url: string, body?: TBody) =>
    request<TResponse, TBody>(url, "PATCH", { body }),
  delete: <TResponse>(url: string) => request<TResponse>(url, "DELETE"),
};

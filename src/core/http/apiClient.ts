import { useAuthStore } from "@/features/auth/stores/authStore";

export async function apiClient(
  path: string,
  options: RequestInit = {},
  retry = true
) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
  const fullUrl = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const { access, setAccess, clearAuth } = useAuthStore.getState();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (access) headers["Authorization"] = `Bearer ${access}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers,
    cache: "no-store",
    credentials: "include",
  });

  if (res.status === 401 && retry) {
    const refreshed = await tryRefresh(setAccess, clearAuth);
    if (refreshed) return apiClient(path, options, false);
  }

  if (!res.ok) {
    let errorMessage = `API Error ${res.status}`;
    try {
      const data = await res.clone().json();
      errorMessage += data.detail ? `: ${data.detail}` : "";
    } catch {
      const text = await res.text();
      errorMessage += `: ${text.slice(0, 200)}`;
    }
    throw new Error(errorMessage);
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function tryRefresh(
  setAccess: (token: string) => void,
  clearAuth: () => void
) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
  const refreshUrl = `${baseUrl}/auth/token/refresh/`;

  try {
    const res = await fetch(refreshUrl, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: "cookie" }), // 서버는 쿠키를 우선 읽으므로 더미 값 전달
    });

    if (!res.ok) {
      clearAuth();
      return false;
    }

    const data = await res.json();
    if (data?.access) {
      setAccess(data.access);
      return true;
    }

    clearAuth();
    return false;
  } catch {
    clearAuth();
    return false;
  }
}

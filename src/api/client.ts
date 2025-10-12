export async function apiClient(path: string, options: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  const fullUrl = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  if (process.env.NEXT_PUBLIC_DEBUG === "true") {
    console.log("📡 API 요청 URL:", fullUrl);
  }

  const res = await fetch(fullUrl, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
    credentials: "include", 
    ...options,
  });

  if (!res.ok) {
    let errorMessage = `API Error ${res.status}`;

    try {
      // clone()으로 복제 → stream 중복 읽기 방지
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

let globalToken: string | null = null;

export const setGlobalToken = (token: string | null) => {
  globalToken = token;
};

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  
  let token = globalToken;
  if (!token && typeof window !== 'undefined') {
    token = localStorage.getItem('token') || sessionStorage.getItem('token');
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined' && !endpoint.includes('/auth/me') && !endpoint.includes('/auth/login')) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      globalToken = null;
      window.location.href = '/masuk?expired=1';
      throw new Error('Sesi Anda telah berakhir, silakan masuk kembali.');
    }

    let message = 'An error occurred';
    try {
      const errData = await res.json();
      message = errData.message || message;
    } catch (e) {}
    throw new Error(message);
  }

  // Handle empty responses
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

// -------------------------
// STORIES
// -------------------------

export async function fetchStories(category?: string, search?: string) {
  const url = new URL(`${API_URL}/stories`);
  if (category && category !== 'Semua') {
    const categoryMap: Record<string, string> = {
      'Lingkungan Kerja': 'WORK',
      'Pendidikan': 'SCHOOL',
      'Rumah Tangga': 'HOME',
      'Ruang Publik': 'PUBLIC_SPACE',
      'Media Sosial': 'SOCIAL_MEDIA',
      'Lainnya': 'OTHER',
    };
    if (categoryMap[category]) {
      url.searchParams.append('category', categoryMap[category]);
    }
  }
  if (search) {
    url.searchParams.append('search', search);
  }
  
  const res = await fetch(url.toString(), {
    next: { revalidate: 10 },
  });

  if (!res.ok) throw new Error('Failed to fetch stories');
  return res.json();
}

export async function createStory(data: { title: string; content: string; category: string; isAnonymous: boolean }) {
  return apiFetch('/stories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchStory(id: string) {
  return apiFetch(`/stories/${id}`, { next: { revalidate: 10 } } as RequestInit);
}

export const fetchEducationFeed = async () => {
  return apiFetch('/articles/feed');
};

export const fetchProfile = async () => {
  return apiFetch('/profile');
};

export const fetchMyStories = async () => {
  return apiFetch('/profile/stories');
};

export const fetchMyBookmarks = async () => {
  return apiFetch('/profile/bookmarks');
};

export const updateProfile = async (data: { username: string }) => {
  return apiFetch('/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const updatePassword = async (data: { oldPassword: string; newPassword: string }) => {
  return apiFetch('/profile/password', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};


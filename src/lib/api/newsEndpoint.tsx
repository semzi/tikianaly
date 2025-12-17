import API from "../api/axios";

export const getAllPosts = async (page: number = 1, limit: number = 20) => {
  const { data } = await API.get(`blogpost?page=${page}&limit=${limit}`);
  return data;
};

export const getPostById = async (id: string) => {
  const { data } = await API.get(`/blogpost/${id}`);
  return data;
};

export const getPostBySlug = async (slug: string) => {
  const { data } = await API.get(`/blogpost/${slug}`);
  return data;
}

export type ReactionType = "like" | "love" | "clap";

export const reactToPost = async (id: string, type: ReactionType) => {
  const { data } = await API.post(`/blogpost/${id}/react`, { type });
  return data;
};

export type NewComment = { displayName: string; message: string };
export const commentOnPost = async (id: string, comment: NewComment) => {
  const { data } = await API.post(`/blogpost/${id}/comments`, comment);
  return data;
};

export type LoginCredentials = { email: string; password: string };
export const adminLogin = async (credentials: LoginCredentials) => {
  const { data } = await API.post("/admin/login", credentials);
  return data;
};

// Create blog post
export type CreateBlogPostPayload = {
  title: string;
  imageUrl?: string;
  content: string;
  hashTag: string;
  authToken: string;
};
export const createBlogPost = async (payload: CreateBlogPostPayload) => {
  const { data } = await API.post("blogpost", payload);
  return data;
};

// Update blog post
export type UpdateBlogPostPayload = CreateBlogPostPayload;
export const updateBlogPost = async (id: string, payload: UpdateBlogPostPayload) => {
  const { data } = await API.put(`blogpost/${id}`, payload);
  return data;
};

// Delete blog post
export const deleteBlogPost = async (id: string) => {
  const { data } = await API.delete(`blogpost/${id}`);
  return data;
};

// Get dashboard stats
export const getDashboardStats = async () => {
  const { data } = await API.get("blogpost/totals");
  return data;
};

// Join waitlist (external backend domain, not via axios base)
export const joinWaitlist = async (email: string) => {
  const res = await fetch("https://corsproxy.io/https://tikianaly-service-backend.onrender.com/api/v1/waitlist/join-waitlist", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || 'Failed to join waitlist');
  }
  return await res.json();
};
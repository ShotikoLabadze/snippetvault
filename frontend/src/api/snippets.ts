import api from "./axios";

export const SnippetAPI = {
  getAll: async () => {
    const response = await api.get("/snippets");
    return response.data.data || response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/snippets/${id}`);
    return response.data.data || response.data;
  },

  create: async (data: {
    title: string;
    imageUrl?: string;
    description?: string;
    language: string;
    code: string;
    tags: string[];
  }) => {
    const response = await api.post("/snippets", data);
    return response.data;
  },

  update: async (
    id: string,
    data: {
      title: string;
      description: string;
      language: string;
      code: string;
      tags: string[];
    },
  ) => {
    const response = await api.patch(`/snippets/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/snippets/${id}`);
    return response.data;
  },

  smartFill: async (code: string, language: string) => {
    const response = await api.post("/ai/smart-fill", { code, language });
    return response.data;
  },
};

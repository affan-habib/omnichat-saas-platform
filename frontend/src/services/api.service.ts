import api from '../lib/api-client';

export const conversationService = {
  getAll: (filters = {}) => api.get('/conversations', { params: filters }),
  getById: (id: string) => api.get(`/conversations/${id}`),
  create: (data: any) => api.post('/conversations', data),
  assign: (id: string, assigneeId: string | null) => api.put(`/conversations/${id}/assign`, { assigneeId }),
  updateStatus: (id: string, status: string, disposition?: string) =>
    api.put(`/conversations/${id}/status`, { status, disposition }),
};

export const messageService = {
  getByConversation: (conversationId: string) => api.get(`/messages/conversation/${conversationId}`),
  send: (conversationId: string, content: string, type = 'TEXT') =>
    api.post(`/messages/conversation/${conversationId}`, { content, type }),
  markRead: (id: string) => api.put(`/messages/${id}/read`),
};

export const authService = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  register: (data: any) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
};

export const tenantService = {
  get: () => api.get('/tenants/me'),
  update: (data: any) => api.put('/tenants/me', data),
};

export const userService = {
  list: () => api.get('/users'),
  invite: (data: any) => api.post('/users/invite', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  updateStatus: (id: string, status: string) => api.put(`/users/${id}/status`, { status }),
  remove: (id: string) => api.delete(`/users/${id}`),
};

export const teamService = {
  list: () => api.get('/teams'),
  create: (data: any) => api.post('/teams', data),
  update: (id: string, data: any) => api.put(`/teams/${id}`, data),
  remove: (id: string) => api.delete(`/teams/${id}`),
  addMember: (teamId: string, userId: string) => api.post(`/teams/${teamId}/members`, { userId }),
  removeMember: (teamId: string, userId: string) => api.delete(`/teams/${teamId}/members/${userId}`),
};

export const contactService = {
  list: (query?: string) => api.get('/contacts', { params: { q: query } }),
  create: (data: any) => api.post('/contacts', data),
  getById: (id: string) => api.get(`/contacts/${id}`),
  update: (id: string, data: any) => api.put(`/contacts/${id}`, data),
  remove: (id: string) => api.delete(`/contacts/${id}`),
};

export const cannedService = {
  list: (query?: string) => api.get('/canned-responses', { params: { q: query } }),
  create: (data: any) => api.post('/canned-responses', data),
  update: (id: string, data: any) => api.put(`/canned-responses/${id}`, data),
  remove: (id: string) => api.delete(`/canned-responses/${id}`),
};

export const tagService = {
  list: () => api.get('/tags'),
  create: (data: any) => api.post('/tags', data),
  update: (id: string, data: any) => api.put(`/tags/${id}`, data),
  remove: (id: string) => api.delete(`/tags/${id}`),
  addToConversation: (convoId: string, tagId: string) => api.post(`/tags/conversation/${convoId}`, { tagId }),
  removeFromConversation: (convoId: string, tagId: string) => api.delete(`/tags/conversation/${convoId}/${tagId}`),
};

export const workforceService = userService;

export const auditService = {
  list: (filters?: { action?: string; resource?: string; userId?: string; from?: string; to?: string }) =>
    api.get('/audit-logs', { params: filters }),
};

export const analyticsService = {
  getOverview: () => api.get('/analytics/overview'),
  getAgents: () => api.get('/analytics/agents'),
  getChannels: () => api.get('/analytics/channels'),
  getDispositions: () => api.get('/analytics/dispositions'),
};

export const routingService = {
  list: () => api.get('/routing-rules'),
  create: (data: any) => api.post('/routing-rules', data),
  update: (id: string, data: any) => api.put(`/routing-rules/${id}`, data),
  toggle: (id: string, isActive: boolean) => api.put(`/routing-rules/${id}/toggle`, { isActive }),
  remove: (id: string) => api.delete(`/routing-rules/${id}`),
};

export const connectorService = {
  list: () => api.get('/connectors'),
  create: (data: any) => api.post('/connectors', data),
  update: (id: string, data: any) => api.put(`/connectors/${id}`, data),
  remove: (id: string) => api.delete(`/connectors/${id}`),
  test: (id: string) => api.post(`/connectors/${id}/test`, {}),
};

export const adminService = {
  getOverview: () => api.get('/admin/overview'),
  listTenants: () => api.get('/admin/tenants'),
  updateTenantStatus: (id: string, status: string) => api.put(`/admin/tenants/${id}/status`, { status }),
  getLogs: () => api.get('/admin/logs'),
};

import { z } from 'zod';
import { 
  insertAdminSchema, 
  insertFacultySchema, 
  insertStudentSchema, 
  insertEventSchema, 
  insertEventImageSchema,
  admins,
  faculty,
  students,
  events,
  eventImages
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: insertAdminSchema,
      responses: {
        200: z.object({ message: z.string() }),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    check: {
      method: 'GET' as const,
      path: '/api/auth/check',
      responses: {
        200: z.object({ authenticated: z.boolean() }),
      },
    }
  },
  faculty: {
    list: {
      method: 'GET' as const,
      path: '/api/faculty',
      input: z.object({
        department: z.enum(['junior_high', 'senior_high']).optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof faculty.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/faculty',
      input: insertFacultySchema,
      responses: {
        201: z.custom<typeof faculty.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/faculty/:id',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
      },
    }
  },
  students: {
    list: {
      method: 'GET' as const,
      path: '/api/students',
      responses: {
        200: z.array(z.custom<typeof students.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/students',
      input: insertStudentSchema,
      responses: {
        201: z.custom<typeof students.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/students/:id',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
      },
    }
  },
  events: {
    list: {
      method: 'GET' as const,
      path: '/api/events',
      responses: {
        200: z.array(z.custom<typeof events.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/events/:id',
      responses: {
        200: z.custom<typeof events.$inferSelect & { images: (typeof eventImages.$inferSelect)[] }>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/events',
      input: insertEventSchema,
      responses: {
        201: z.custom<typeof events.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/events/:id',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
      },
    }
  },
  eventImages: {
    create: {
      method: 'POST' as const,
      path: '/api/events/:id/images',
      input: z.object({
        imageUrl: z.string(),
      }),
      responses: {
        201: z.custom<typeof eventImages.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

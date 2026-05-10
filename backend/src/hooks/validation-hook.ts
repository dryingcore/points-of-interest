import { Hook } from '@hono/zod-openapi';
import { ZodError } from 'zod';

export const validationHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    const error = result.error as ZodError;
    const formattedErrors = error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return c.json(
      {
        success: false,
        error: 'Erro de Validação',
        details: formattedErrors,
      },  
      400
    );
  }
};

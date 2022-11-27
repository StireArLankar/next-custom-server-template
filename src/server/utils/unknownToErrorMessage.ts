import * as z from 'zod';

export const unknownToErrorMessage = (e: unknown, def?: string): string => {
  const msg = (() => {
    if (e instanceof z.ZodError) {
      const msg0 = e.issues[0].path.join('.');
      const msg = e.issues[0].message + ': ' + msg0 ?? e.message;
      return msg;
    } else if (e instanceof Error) {
      return e.message;
    }

    return JSON.stringify(e);
  })();

  return msg ?? `[empty error] ${def}` ?? '[empty error]';
};

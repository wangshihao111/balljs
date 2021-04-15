export class BaseException extends Error {
  status: number;

  constructor(code: number, msg?: string) {
    super(msg || 'unauthorized.');
    this.status = code;
    this.name = 'BaseException';
  }
}

function exceptionFactory(name: string, code: number, defaultMessage?: string) {
  return class extends BaseException {
    constructor(msg?: string) {
      super(code, msg || defaultMessage);
      this.name = name;
    }
  };
}

export const UnAuthorizedException = exceptionFactory(
  'UnAuthorizedException',
  401,
  'Unauthorized.'
);

export const BadRequestException = exceptionFactory(
  'BadRequestException',
  400,
  'Bad Request.'
);

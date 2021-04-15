import { ContainerProps, createPool, Injector } from 'some-di';

let inject: Injector;

export function initIoc(opts: ContainerProps): void {
  const { inject: _inject } = createPool(opts);
  inject = _inject;
}

export { inject };

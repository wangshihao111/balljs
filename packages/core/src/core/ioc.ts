import { createPool } from 'some-di';
import { Config } from './Config';
import { Container } from './Container';

const containerInstance = new Container(new Config());

const { inject, Inject, container } = createPool({
  providers: [],
});
export { inject, Inject, container };
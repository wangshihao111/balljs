import { Service } from '@balljs/core';

@Service()
export class AppService {
  name = 'wang';

  generateHello() {
    return 'Hello World.'
  }
}

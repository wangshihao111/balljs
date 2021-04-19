import { Service } from '@guku/core';

@Service()
export class AppService {
  name = 'wang';

  generateHello() {
    return 'Hello World.'
  }
}

import { autoWired, Service } from '@balljs/core';
import { DBService } from './DBService';

@Service()
export class UserService {
  name = 'wang';

  @autoWired(DBService)
  dbService!: DBService;
}

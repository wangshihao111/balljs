import { autoWired, Service } from '@balljs/core';
import { UserService } from './UserService';

@Service()
export class DBService {
  name = 'DB';

  @autoWired(UserService)
  user!: UserService;
}

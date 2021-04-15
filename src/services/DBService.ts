import { autoWired, Service } from '@guku/core';
import { UserService } from './UserService';

@Service()
export class DBService {
  name = 'DB';

  @autoWired(UserService)
  user!: UserService;
}

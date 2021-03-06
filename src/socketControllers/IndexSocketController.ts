import { Action, SocketController } from '@balljs/plugin-socket';

@SocketController('demo')
export class IndexSocketController {
  @Action('index')
  index(payload: any, { success }: any) {
    success({ name: 111, reqData: payload });
  }
}

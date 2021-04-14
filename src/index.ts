import "reflect-metadata";

import { IndexController } from "./controllers/IndexController";
import { Server } from "./core";

new Server({ controllers: [IndexController] }).start(3030);

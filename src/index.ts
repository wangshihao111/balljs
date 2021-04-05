import 'reflect-metadata';

import { IndexController } from './controllers/IndexController';
import { createApp } from './core/entry';

createApp({port: 4200, controllers: [IndexController]});
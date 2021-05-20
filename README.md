# balljs

一个简单实用的 Nodejs 库。用于便捷的创建服务端应用。

## Quick start

### 安装

- 安装 CLI

```sh
npm install -g @balljs/cli # yarn add global @balljs/cli
```

### 创建项目

```bash
ball create demo
```

### 运行项目

```bash
cd demo
yarn dev
```

打开服务器运行地址即可看到 `Hello World.` 字样

## 概念简介

### Controller 控制器

控制器用于路由的处理。每个控制器使用@Controller 装饰，定义前缀，并将其放入 controllers 文件夹，框架会自动加载控制器。例如：

```ts
import { Controller } from '@balljs/core';

@Controller('/') // 定义路径前缀
export class IndexController {}
```

控制器内可以有 n 个路由处理方法，路由方法需要使用方法装饰器进行装饰：@Post, @Get, @Put, @Delete, @Patch, 参数为路由路径，例如：

```ts
import { Controller, RouterCtx, Get } from '@balljs/core';

@Controller('/demo') // 定义路径前缀
export class IndexController {
  @Get('/hello') // 定义路径，实际访问路径为基础路径和该路径的拼接：/demo/hello
  hello(ctx: RouterCtx) {
    ctx.body = 'Hello boy.';
  }
}
```

### Service 服务

我们在路由处理中，必然会使用一些服务，这些服务里封装了必要或可复用逻辑，我们希望能够便捷地进行调用。

- 定义：
  使用 @Service 装饰器进行装饰，并将其放到 services 文件夹。框架会自动加载并注册服务。例如：

```ts
import { Service } from '@balljs/core';

@Service()
export class UserService {
  public login() {
    // ...
  }
}
```

- 使用

在我们的 controller 中可以使用 @autoWired 进行自动装载：

```ts
import { Controller, RouterCtx, Get } from '@balljs/core';
import { UserService } from '../Services/UserService';

@Controller('/demo') // 定义路径前缀
export class IndexController {
  // 使用装饰器自动装载，参数为需要装载的服务
  @autoWired(UserService)
  userService!: UserService;

  @Get('/hello') // 定义路径，实际访问路径为基础路径和该路径的拼接：/demo/hello
  hello(ctx: RouterCtx) {
    this.userService.login();
    ctx.body = 'Hello boy.';
  }
}
```

### Interceptor 拦截器

对于某些路由，我们可能需要进行权限校验，用于拦截掉一些请求，那么我们可以使用拦截器解决；拦截器为使用@Interceptor 装饰的类，并实现了 CommonInterceptor 接口的类。将其放入 interceptors 文件夹中，框架会自动加载并注册。

拦截器里可以对请求做任何处理，甚至提前结束请求。

如果拦截器用于校验，那么校验不通过时，可以抛出一些内置的错误，提前结束请求的处理。

使用方法如下：

- 定义

```ts
import {
  BadRequestException,
  CommonInterceptor,
  Interceptor,
  RouterCtx,
} from '@balljs/core';

@Interceptor()
export class AuthInterceptor implements CommonInterceptor {
  async request(ctx: RouterCtx): Promise<void> {
    if (!ctx.query.name) {
      throw new BadRequestException();
    }
  }
  // 暂未实现，敬请期待。
  response() {}
}
```

- 使用

在需要拦截的控制器上加上@useInterceptor 装饰器，并传入拦截器数组：

```ts
import { Controller, RouterCtx, useInterceptor, Get } from '@balljs/core';
import { UserService } from '../Services/UserService';
import { AuthInterceptor } from '../interceptors/AuthInterceptor';

@useInterceptor([AuthInterceptor])
@Controller('/demo') // 定义路径前缀
export class IndexController {
  // 使用装饰器自动装载，参数为需要装载的服务
  @autoWired(UserService)
  userService!: UserService;

  @Get('/hello') // 定义路径，实际访问路径为基础路径和该路径的拼接：/demo/hello
  hello(ctx: RouterCtx) {
    this.userService.login();
    ctx.body = 'Hello boy.';
  }
}
```

此时，该控制器的所有路由处理之前，都会先执行拦截器的 request 函数。

### Exceptions 异常机制

框架内可以通过一些错误机制，方便地向客户端返回一些错误。

框架内置了以下异常：UnAuthorizedException、BadRequestException、ServerErrorException

使用方法：在控制器路由处理函数或拦截器中直接抛出即可，框架会进行处理并返回到前端。例如：

```ts
import { BadRequestException } from '@balljs/core';

import {
  BadRequestException,
  CommonInterceptor,
  Interceptor,
  RouterCtx,
} from '@balljs/core';

@Interceptor()
export class AuthInterceptor implements CommonInterceptor {
  async request(ctx: RouterCtx): Promise<void> {
    if (!ctx.query.name) {
      // 在拦截器中直接抛出异常，该异常会被框架处理并返回到前端。
      throw new BadRequestException();
    }
  }
  // 暂未实现，敬请期待。
  response() {}
}
```

如果内置异常不满足需求，则可以定义自己的异常类。

我们可以使用 exceptionFactory 生成异常类，如下所示：

```ts
import { exceptionFactory } from '@balljs/core';

export const MyException = exceptionFactory(
  'MyException', // name
  401, // http 状态码
  'This is my exception.' // 默认错误信息，在 new 的时候可以选择传入 message覆盖该默认值
);
```

### 插件

框架支持插件机制。

#### 使用方法

在 src/app.config.ts 中的 plugins 选项中可以进行插件的配置。
plugins 配置项为一个数组，包含了插件列表。
插件的引用形式可以是字符串、绝对路径或者一个对象。
如果是字符或绝对路径，则框架内部会去引入该插件并创建实例。如果需要向插件传递参数，请使用 new 来创建一个插件对象。
如下所示：

```ts
import { IConfig } from '@balljs/core';
import PluginSocket from '@balljs/plugin-socket';
import PluginTypeOrm from '@balljs/plugin-typeorm';
import path from 'path';

export default {
  plugins: [
    require.resolve('../plugin.js'),
    '@balljs/plugin-static',
    '@balljs/plugin-cors',
    new PluginSocket({
      prefix: '/socket',
      dirs: [path.resolve(__dirname, './socketControllers')],
    }),
    new PluginTypeOrm({ connsConfig: [] }),
  ],
} as IConfig;
```

#### 插件格式

每个插件为一个拥有公共成员 apply 的类。apply 方法会在框架内部自动调用。
例如我们可以实现一个简单的 CORS 插件：

```ts
import { PluginApi } from '@balljs/core';
import cors, { Options } from '@koa/cors';

export type PluginCorsOpts = Options;

export default class PluginSocket {
  constructor(private opts: PluginCorsOpts) {}
  apply(api: PluginApi) {
    api.addMiddleWares([cors(this.opts)]);
  }
}
```

其中，PluginApi 请参考 API 接口。

## properties

### 概述

用于设置 app 运行时的某些变量，默认使用 src/app.properties。

如果需要根据环境启用不同的 properties，则可以指定 SERVER_APP_ENV=xxx，应用会自动加载 app.xxx.properties。并用加载到的 app.xxx.properties 与 app.properties 合并。

### 引用

在 Controller 或 Service 中，使用 Value 装饰器获取。例如：

在 app.properties 中设置一下内容

```properties
appName=myAppName
server.port=9800
server.host=0.0.0.0
```

则可使用如下方式引用：

```ts
@Service()
class MyService {
  @Value('appName')
  appName!: string;

  @Value('server')
  server!: { port: number; host: string };

  echo() {
    console.log(this.appName, this.server);
  }
}
```

## 其它

TODO: 补充

## 资源

- @balljs/plugin-socket websocket 插件
- @balljs/plugin-static 静态资源插件
- @balljs/plugin-cors CORS 插件
- @balljs/plugin-typeorm typeorm 插件

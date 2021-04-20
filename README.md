# GUKU

一个简单实用的Nodejs库。用于便捷的创建服务端应用。

## Quick start

### 安装

- 安装CLI

```sh
npm install -g @guku/cli # yarn add @guku/core
```

### 创建项目

```bash
guku create server
```

### 运行项目

```bash
yarn dev
```

打开服务器运行地址即可看到 `Hello World.` 字样

## 概念简介

### Controller 控制器

控制器用于路由的处理。每个控制器使用@Controller装饰，定义前缀，并将其放入controllers文件夹，框架会自动加载控制器。例如：

```ts
import {
  Controller
} from '@guku/core';

@Controller('/') // 定义路径前缀
export class IndexController { }
```

控制器内可以有 n 个路由处理方法，路由方法需要使用方法装饰器进行装饰：@Post, @Get, @Put, @Delete, @Patch, 参数为路由路径，例如：

```ts
import {
  Controller,
  RouterCtx,
  Get
} from '@guku/core';

@Controller('/demo') // 定义路径前缀
export class IndexController {
  @Get("/hello") // 定义路径，实际访问路径为基础路径和该路径的拼接：/demo/hello
  hello(ctx: RouterCtx) {
    ctx.body = "Hello boy."
  }
}
```

### Service 服务

我们在路由处理中，必然会使用一些服务，这些服务里封装了必要或可复用逻辑，我们希望能够便捷地进行调用。

- 定义：
使用 @Service 装饰器进行装饰，并将其放到services文件夹。框架会自动加载并注册服务。例如：

```ts
import {
  Service
} from '@guku/core';

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
import {
  Controller,
  RouterCtx,
  Get
} from '@guku/core';
import { UserService } from '../Services/UserService'

@Controller('/demo') // 定义路径前缀
export class IndexController {
  // 使用装饰器自动装载，参数为需要装载的服务
  @autoWired(UserService)
  userService!: UserService;

  @Get("/hello") // 定义路径，实际访问路径为基础路径和该路径的拼接：/demo/hello
  hello(ctx: RouterCtx) {
    this.userService.login();
    ctx.body = "Hello boy."
  }
}
```

### Interceptor 拦截器

对于某些路由，我们可能需要进行权限校验，用于拦截掉一些请求，那么我们可以使用拦截器解决；拦截器为使用@Interceptor装饰，并实现了CommonInterceptor接口的类。将其放入interceptors文件夹中，框架会自动加载并注册。

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
} from '@guku/core';

@Interceptor()
export class AuthInterceptor implements CommonInterceptor {
  async beforeHandle(ctx: RouterCtx): Promise<void> {
    if (!ctx.query.name) {
      throw new BadRequestException();
    }
  }
  // 暂未实现，敬请期待。
  afterHandle() { }
}
```

- 使用

在需要拦截的控制器上加上@useInterceptor 装饰器，并传入拦截器数组：

```ts
import {
  Controller,
  RouterCtx,
  useInterceptor,
  Get
} from '@guku/core';
import { UserService } from '../Services/UserService'
import { AuthInterceptor } from '../interceptors/AuthInterceptor';

@useInterceptor([AuthInterceptor])
@Controller('/demo') // 定义路径前缀
export class IndexController {
  // 使用装饰器自动装载，参数为需要装载的服务
  @autoWired(UserService)
  userService!: UserService;

  @Get("/hello") // 定义路径，实际访问路径为基础路径和该路径的拼接：/demo/hello
  hello(ctx: RouterCtx) {
    this.userService.login();
    ctx.body = "Hello boy."
  }
}

```

此时，该控制器的所有路由处理之前，都会先执行拦截器的beforeHandle函数。

### Exceptions 异常机制

框架内可以通过一些错误机制，方便地向客户端返回一些错误。

框架内置了以下异常：UnAuthorizedException、BadRequestException、ServerErrorException

使用方法：在控制器路由处理函数或拦截器中直接抛出即可，框架会进行处理并返回到前端。例如：

```ts

import {
  BadRequestException,
} from '@guku/core';

import {
  BadRequestException,
  CommonInterceptor,
  Interceptor,
  RouterCtx,
} from '@guku/core';

@Interceptor()
export class AuthInterceptor implements CommonInterceptor {
  async beforeHandle(ctx: RouterCtx): Promise<void> {
    if (!ctx.query.name) {
      // 在拦截器中直接抛出异常，该异常会被框架处理并返回到前端。
      throw new BadRequestException();
    }
  }
  // 暂未实现，敬请期待。
  afterHandle() { }
}
```

如果内置异常不满足需求，则可以定义自己的异常类。

我们可以使用 exceptionFactory 生成异常类，如下所示：

```ts
import { exceptionFactory } from '@guku/core';

export const MyException = exceptionFactory(
  'MyException', // name
  401, // http 状态码
  'This is my exception.' // 默认错误信息，在 new 的时候可以选择传入 message覆盖该默认值
);

```

### 插件

TODO: 补充。


## 其它

TODO: 补充
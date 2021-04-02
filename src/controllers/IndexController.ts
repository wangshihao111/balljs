import { AbstractController } from "../core/AbstractController";
import { Controller, Get, Post, Put } from "../decorators";

@Controller("/api")
export class IndexController extends AbstractController {
  age: number;
  constructor() {
    super({});
    this.age = 999;
  }

  @Get("/index")
  index() {
    console.log(this.age)
  }
}

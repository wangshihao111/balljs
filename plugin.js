/* eslint-disable */
module.exports = class {
  apply(api) {
    api.addMiddleWares([
      async (ctx, next) => {
        console.log('test middleware in plugin');
        next();
      },
    ]);
  }
};

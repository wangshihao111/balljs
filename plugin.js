/* eslint-disable */
module.exports = class {
  apply(api) {
    api.addMiddleWares([
      async (ctx, next) => {
        // console.log('test middleware in plugin');
        await next();
      },
    ]);
    api.addAppCtxMethod({
      name: 'render',
      handler() {
        return 'I am handler';
      }
    })
  }
};

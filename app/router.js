'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  // 用户相关
  router.post('/reg', controller.user.reg); // 注册
  router.post('/login', controller.user.login); // 登录
  router.post('/logout', controller.user.logout); // 退出

  
};

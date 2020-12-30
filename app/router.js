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
  router.get('/info', controller.user.info); // 查看用户资料
  router.get('/user/list', controller.user.list); // 用户列表
  router.get('/user/count', controller.user.count); // 用户总数
  router.get('/user/read/:id', controller.user.read); // 查看用户资料

  // 类别相关
  router.post('/type/insert', controller.type.insert); // 添加类别
  router.get('/type/list', controller.type.list); // 类别列表
  router.get('/type/count', controller.type.count); // 类别总数
  router.get('/type/:id', controller.type.read); // 子类别
  router.post('/type/delete', controller.type.delete); // 删除类别

  // 标签相关
  router.post('/tag/insert', controller.tag.insert); // 添加类别
  router.get('/tag/list', controller.tag.list); // 类别列表
  router.get('/tag/count', controller.tag.count); // 标签总数
  router.post('/tag/delete', controller.tag.delete); // 删除类别

  // 文章相关
  router.get('/article/list', controller.article.list); // 文章列表
  router.post('/article/insert', controller.article.insert); // 添加文章
  router.get('/article/read/:id', controller.article.read); // 查看单篇文章
  router.post('/article/addtag', controller.article.addtag); // 为文章添加标签

};

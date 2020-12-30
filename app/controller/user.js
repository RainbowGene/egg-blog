'use strict';

const Controller = require('egg').Controller;
const crypto = require('crypto')

class UserController extends Controller {
  async reg() {
    const { ctx, app } = this
    let { username, password, repassword } = ctx.request.body

    // 参数验证
    ctx.validate({
      username: { type: 'string', required: true, range: { min: 6, max: 18 }, desc: '用户名' },
      password: { type: 'string', required: true, desc: '密码' },
      repassword: { type: 'string', required: true, desc: '确认密码' }
    }, {
      equals: [['password', 'repassword']]
    });

    // 验证用户是否已存在
    if (await app.model.User.findOne({
      where: {
        username
      }
    })) { // 存在
      ctx.throw(400, '用户已存在！')
    }

    // 创建用户
    let user = await app.model.User.create({
      username, password
    })
    if (!user) ctx.throw(400, '注册失败！')
    ctx.apiSuccess(user)
  }

  async login() {
    const { ctx, app } = this
    // 参数验证
    ctx.validate({
      username: { type: 'string', required: true, desc: '用户名' },
      password: { type: 'string', required: true, desc: '密码' }
    });

    // 验证用户
    let { username, password } = ctx.request.body;
    let user = await app.model.User.findOne({
      where: {
        username,
        status: 1 // 验证用户是否启用
      }
    })

    if (!user) ctx.throw(400, '不存在的用户或已被禁用')

    // 验证密码
    await this.checkPassword(password, user.password);

    // 生成token:jwt加密鉴权
    user = JSON.parse(JSON.stringify(user))
    let token = ctx.getToken(user)
    user.token = token
    delete user.password // 不返回密码

    // 放入缓存redis npm i egg-redis --save * 确保开启了redis服务，不然服务器启动会报错
    if (!await this.service.cache.set('user_' + user.id, token)) {
      ctx.throw(400, '登录失败')
    }

    return ctx.apiSuccess(user)
  }

  async logout() {
    const { ctx, service } = this
    // 拿到当前用户id
    let current_user_id = ctx.authUser.id
    // 移除redis的当前用户信息
    const rd = await service.cache.remove('user_' + current_user_id)
    if (!rd) ctx.throw(400, '退出失败！')
    ctx.apiSuccess('退出成功！')
  }

  // 我的资料(博客主人)
  async info() {
    const { ctx, app } = this
    let user = await app.model.User.findOne({
      where: {
        id: 1,
        status: 1
      },
      attributes: {
        exclude: ['password']
      }
    })

    ctx.apiSuccess(user)
  }

  // 查询用户基本资料
  async read() {
    const { ctx, app } = this
    // let current_user_id = ctx.authUser.id; // 不需要个人资料
    let user_id = ctx.params.id ? parseInt(ctx.params.id) : 0;

    let user = await app.model.User.findOne({
      where: {
        id: user_id,
        status: 1
      },
      attributes: {
        exclude: ['password']
      }
    })

    if (!user) ctx.throw(400, '不存在的用户')

    ctx.apiSuccess(user)
  }

  // 验证密码
  async checkPassword(password, hash_password) {
    const hmac = crypto.createHash('sha256', this.app.config.crypto.secret)
    hmac.update(password)
    password = hmac.digest('hex')
    let bool = password === hash_password
    if (!bool) this.ctx.throw(400, '密码错误')
    return bool
  }

  // 用户列表
  async list() {
    let { ctx, app } = this

    let page = ctx.query.page ? parseInt(ctx.query.page) : 1;
    let limit = ctx.query.limit ? parseInt(ctx.query.limit) : 10;
    let offset = (page - 1) * limit;

    let rows = await app.model.User.findAll({
      offset,
      limit,
      attributes: {
        exclude: ['password']
      }
    });

    return ctx.apiSuccess(rows);
  }

  // 获取用户总数
  async count() {
    let { ctx, app } = this
    let count = await app.model.User.count(); // 记录总条数
    return ctx.apiSuccess(count);
  }
}

module.exports = UserController;

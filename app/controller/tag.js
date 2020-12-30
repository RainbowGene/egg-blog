'use strict';

const Controller = require('egg').Controller;

class TagController extends Controller {
  // 标签列表
  async list() {
    let { ctx, app } = this

    let page = ctx.query.page ? parseInt(ctx.query.page) : 1;
    let limit = ctx.query.limit ? parseInt(ctx.query.limit) : 10;
    let offset = (page - 1) * limit;

    let rows = await app.model.Tag.findAll({
      offset,
      limit
    });

    return ctx.apiSuccess(rows);
  }

  // 标签总数
  async count() {
    let { ctx, app } = this
    let count = await app.model.Tag.count(); // 记录总条数
    return ctx.apiSuccess(count);
  }

  // 添加标签
  async insert() {
    let { ctx, app } = this
    let { name } = ctx.request.body

    ctx.validate({
      name: { type: 'string', required: true, desc: '类别名' },
    });

    let tag = await app.model.Tag.findOne({
      where: {
        name
      }
    })

    if (tag) return ctx.apiFail('已有标签名')

    // 创建类别
    let res = await app.model.Tag.create({
      name
    })
    if (!res) ctx.throw(400, '添加失败！')
    ctx.apiSuccess(res)
  }

  // 删除标签
  async delete() {
    let { ctx, app } = this
    let { id } = ctx.request.body;

    // 删除使用该标签的连接记录
    // let atag = await app.model.ArticleTag.destroy({
    //   where:{
        
    //   }
    // })

    // 删除标签
    await app.model.Tag.destroy({
      where: {
        id
      }
    });
    ctx.apiSuccess('删除成功')
  }
}

module.exports = TagController;

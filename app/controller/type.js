'use strict';

const Controller = require('egg').Controller;

class TypeController extends Controller {
  // 类别列表
  async list() {
    let { ctx, app } = this

    let page = ctx.query.page ? parseInt(ctx.query.page) : 1;
    let limit = ctx.query.limit ? parseInt(ctx.query.limit) : 10;
    let offset = (page - 1) * limit;

    let rows = await app.model.Type.findAll({
      offset,
      limit
    });

    return ctx.apiSuccess(rows);
  }

  // 获取类别总数
  async count() {
    let { ctx, app } = this
    let count = await app.model.Type.count(); // 记录总条数
    return ctx.apiSuccess(count);
  }

  // 查询下级类别
  async read() {
    let { ctx, app } = this
    let id = ctx.params.id; // 父级类别id

    // 所有子级类别
    let childType = await app.model.Type.findAll({
      where: {
        typeof_id: id
      }
    })
    ctx.apiSuccess(childType)
  }

  // 添加类别
  async insert() {
    let { ctx, app } = this
    let { typeof_id, typename } = ctx.request.body

    ctx.validate({
      typeof_id: { type: 'int', required: true, desc: '所属类别id' },
      typename: { type: 'string', required: true, desc: '类别名' },
    });

    // 创建类别
    let type = await app.model.Type.create({
      typeof_id, typename
    })
    if (!type) ctx.throw(400, '添加失败！')
    ctx.apiSuccess(type)
  }

  // 删除类别
  async delete() {
    let { ctx, app } = this
    let { id } = ctx.request.body;

    // 判断是否是父类别
    let childType = await app.model.Type.findAll({
      where: {
        typeof_id: id
      }
    })
    if (childType.length > 0) return ctx.apiFail('该类别下还有子类别！')

    // 判断类别下有无文章

    // 删除类别
    await app.model.Type.destroy({
      where: {
        id
      }
    });

    ctx.apiSuccess('删除成功')
  }
}

module.exports = TypeController;

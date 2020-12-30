'use strict';

const Controller = require('egg').Controller;

class ArticleController extends Controller {
  // 添加文章
  async insert() {
    const { ctx, app } = this;
    let current_user_id = ctx.authUser.id; // 当前用户

    // 参数验证
    ctx.validate({
      type_id: { type: 'int', required: true, desc: '所属类别' },
      title: { type: 'string', required: true, desc: '文章标题' },
      cover: { type: 'string', required: false, desc: '文章封面' },
      content: { type: 'string', required: false, desc: '文章内容' },
    })

    let { type_id, title, cover, content } = ctx.request.body;

    let article = await app.model.Article.create({
      user_id: current_user_id,
      type_id, title, cover, content
    })

    if (!article) return ctx.apiFail('发布失败')

    ctx.apiSuccess(article)
  }

  // 查询单篇文章
  async read() {
    const { app, ctx } = this
    let article_id = ctx.params.id

    let article = await app.model.Article.findOne({
      where: {
        id: article_id
      },
      include: [{
        model: app.model.Type,
        attributes: ['typename']
      }, {
        model: app.model.User,
        attributes: ['nickname', 'avatar']
      }, {
        model: app.model.Tag,
        attributes: ['name']
      }]
    })

    if (!article) return ctx.apiFail('不存在的文章！')

    ctx.apiSuccess(article)
  }

  // 文章列表
  async list() {
    let { ctx, app } = this

    let page = ctx.query.page ? parseInt(ctx.query.page) : 1;
    let limit = ctx.query.limit ? parseInt(ctx.query.limit) : 10;
    let offset = (page - 1) * limit;

    let rows = await app.model.Article.findAll({
      offset,
      limit,
      include: [{
        model: app.model.Type,
        attributes: ['typename']
      }, {
        model: app.model.User,
        attributes: ['nickname', 'avatar']
      }]
    });

    return ctx.apiSuccess(rows);
  }

  // add tag of article
  async addtag() {
    const { ctx, app } = this

    // 参数验证
    ctx.validate({
      article_id: { type: 'int', required: true, desc: '文章id' },
      tag_id: { type: 'string', required: true, desc: 'tag id' },
    })

    let { article_id, tag_id } = ctx.request.body;

    // 判断该文章是否已有该标签
    const isExit = await app.model.ArticleTag.findOne({
      where: {
        article_id, tag_id
      }
    })

    if (isExit) return ctx.apiFail('已有的标签，无需重复添加')

    const res = await app.model.ArticleTag.create({
      article_id, tag_id
    })

    if (!res) return ctx.apiFail('添加失败!')
    ctx.apiSuccess(res)
  }
}

module.exports = ArticleController;

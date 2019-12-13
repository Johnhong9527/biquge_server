'use strict';

const Controller = require('egg').Controller;
const util = require('../util/index');

class ChapterController extends Controller {
  async index() {
    const { ctx } = this;
    try {
      const { index, aid, cid } = ctx.query;
      if (isNaN(index) || isNaN(aid) || isNaN(cid)) {
        throw '参数格式错误';
      }
      if (!index || !aid || !cid) {
        throw '缺少参数';
      }
      ctx.body = await ctx.model.Chapter.find({ index, aid, cid });
    } catch (e) {
      ctx.body = e;
    }
  }

  async setChapter() {
    const { ctx } = this;
    try {
      const { index, aid, cid, title, content } = ctx.query;
      if (isNaN(index) || isNaN(aid) || isNaN(cid)) {
        throw '参数格式错误';
      }
      if (!index || !aid || !cid) {
        throw '缺少参数';
      }
      let params = {};
      if (title && title !== '') {
        params.title = title;
      }
      if (content && content !== '') {
        params.content = content;
      }
      ctx.body = await ctx.model.Chapter.updateOne({ index, aid, cid }, { '$set': params });
    } catch (e) {
      ctx.body = e;
    }
  }
}

module.exports = ChapterController;

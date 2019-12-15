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
      ctx.body = await ctx.model.Chapter.findOne({
        index: Number.parseInt(index),
        aid: Number.parseInt(aid),
        cid: Number.parseInt(cid)
      });
    } catch (e) {
      ctx.body = e;
    }
  }

  async setChapter() {
    const { ctx } = this;
    try {
      const { index, aid, cid, title, content } = ctx.request.body;
      if (isNaN(index) || isNaN(aid) || isNaN(cid)) {
        throw '参数格式错误';
      }
      if (index < 0 || !aid || !cid) {
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

  async createChapter() {
    const { ctx } = this;
    try {
      const { book_index, index, aid, cid, title, content } = ctx.request.body;

      if (
        isNaN(index) || Number.parseInt(index) < 0 ||
        isNaN(aid) || Number.parseInt(aid) < 1 ||
        isNaN(cid) || Number.parseInt(cid) < 1) {
        throw '参数错误';
      }
      if (!index || !aid || !cid) {
        throw '缺少参数';
      }
      let params = {
        index: Number.parseInt(book_index),
        aid: Number.parseInt(aid),
        cid: Number.parseInt(cid),
        title: !title ? '' : title,
        content: !content ? '' : content,
      };
      // 查询章节是否存在
      const chapter = await ctx.model.Chapter.find({ index: params.index, aid: params.aid, cid: params.cid });
      console.log(chapter);
      if (JSON.stringify(chapter) !== '[]') {
        throw '该章节已存在';
      }
      // 查询书籍数据是否存在
      let book = await ctx.model.Book.find({ index: params.index, aid: params.aid });
      book = JSON.stringify(book);
      if (book === '[]') {
        throw '该书籍不存在';
      }
      const newChapter = await new ctx.model.Chapter(params);
      ctx.body = await newChapter.save();
      // ctx.body = params;
      // console.log(params);
      // ctx.body = 'ok';
    } catch (e) {
      ctx.body = e;
    }
  }

  async delChapter() {
    const { ctx } = this;
    try {
      const { index, aid, cid } = ctx.request.body;
      if (!index || isNaN(index) || !aid || isNaN(aid) || !cid || isNaN(cid)) {
        throw new Error('参数错误');
      }
      ctx.body = await ctx.model.Chapter.remove({
        index: Number.parseInt(index),
        aid: Number.parseInt(aid),
        cid: Number.parseInt(cid),
      });
    } catch (e) {
      ctx.body = e;
    }
  }
}

module.exports = ChapterController;

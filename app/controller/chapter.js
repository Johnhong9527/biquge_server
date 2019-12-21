'use strict';

const Controller = require('egg').Controller;
const util = require('../util/index');

class ChapterController extends Controller {
  async index() {
    const { ctx } = this;
    try {
      let { index, aid, cid } = ctx.request.body;

      if (isNaN(aid) || isNaN(cid)) {
        throw new Error('参数格式错误');
      }
      if (!aid || !cid) {
        throw new Error('缺少参数');
      }
      aid = Number.parseInt(aid);
      cid = Number.parseInt(cid);
      const chapter = await ctx.model.Chapter.findOne({
        aid,
        cid,
      });
      if (!chapter) {
        throw new Error('null');
      }

      ctx.body = chapter;
    } catch (e) {
      ctx.body = e.message;
    }
  }
  async nextChapter() {
    const { ctx } = this;
    try {
      // next 0:上一个；1:下一个；默认为1
      let { index, aid, cid, next = 1 } = ctx.request.body;
      let newAid = -1;
      if (isNaN(aid) || isNaN(cid)) {
        throw new Error('参数格式错误');
      }
      if (!aid || !cid) {
        throw new Error('缺少参数');
      }
      index = Number.parseInt(index);
      aid = Number.parseInt(aid);
      cid = Number.parseInt(cid);
      let book = await ctx.model.Book.findOne({
        index,
        aid,
      });
      let chapters = book.chapters;
      for (let i = 0; i < chapters.length; i++) {
        if (chapters[i].cid === cid) {
          newAid = next > 0 ? chapters[i + 1].cid : chapters[i - 1].cid;
        }
      }
      if (newAid < 0) {
        throw new Error('no next chapter');
      }
      ctx.body = newAid;
    } catch (e) {
      ctx.body = e.message;
    }
  }

  async setChapter() {
    const { ctx } = this;
    try {
      const { index, aid, cid, title, content } = ctx.request.body;
      if (isNaN(aid) || isNaN(cid)) {
        throw new Error('参数格式错误');
      }
      if (!aid || !cid) {
        throw new Error('缺少参数');
      }
      let params = {};
      if (title && title !== '') {
        params.title = title;
      }
      if (content && content !== '') {
        params.content = content;
      }

      await ctx.model.Chapter.updateOne(
        {
          aid: Number.parseInt(aid),
          cid: Number.parseInt(cid),
        },
        { $set: { title, content } },
      );
      await ctx.model.Book.updateOne(
        {
          'chapters.aid': Number.parseInt(aid),
          'chapters.cid': Number.parseInt(cid),
        },
        { $set: { 'chapters.$.title': title } },
      );
      ctx.body = 'ok';
    } catch (e) {
      ctx.body = e.message;
    }
  }

  async createChapter() {
    const { ctx } = this;
    try {
      let {
        book_index,
        index,
        aid,
        cid,
        title,
        content,
        href,
      } = ctx.request.body;
      if (
        isNaN(book_index) ||
        Number.parseInt(book_index) < 0 ||
        isNaN(index) ||
        Number.parseInt(index) < 0 ||
        isNaN(aid) ||
        Number.parseInt(aid) < 1 ||
        isNaN(cid) ||
        Number.parseInt(cid) < 1
      ) {
        throw new Error('参数错误');
      }
      if (!book_index || !index || !aid || !cid) {
        throw new Error('缺少参数');
      }

      book_index = Number.parseInt(book_index);
      index = Number.parseInt(index);
      aid = Number.parseInt(aid);
      cid = Number.parseInt(cid);

      // 查询章节是否存在
      const chapter = await ctx.model.Chapter.find({
        // index: book_index,
        aid,
        title,
      });
      // 判断章节是否存在
      if (JSON.stringify(chapter) !== '[]') {
        throw new Error('该章节已存在');
      }

      // 查询书籍数据是否存在
      let book = await ctx.model.Book.findOne({
        index: book_index,
        aid,
      });
      // 查询章节索引是否过大过小
      if (index > book.chapters.length) {
        throw new Error('index过大');
      }
      if (index < 0) {
        throw new Error('index小于0');
      }
      // console.log(book);
      if (JSON.stringify(book) === '{}') {
        throw new Error('该书籍不存在');
      }

      // book文档中插入字段
      book.chapters.splice(index, 0, {
        title,
        aid,
        cid,
        href,
      });

      await ctx.model.Book.updateOne(
        { index: book_index, aid },
        { $set: book },
      );
      const newChapter = await new ctx.model.Chapter({
        index: book_index,
        aid,
        cid,
        title,
        content,
        href,
      });
      newChapter.save();
      ctx.body = 'ok';

      // ctx.body = params;
      // console.log(params);
      // ctx.body = 'ok';
    } catch (e) {
      console.log(e);
      ctx.body = e.message;
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
      ctx.body = e.message;
    }
  }
}

module.exports = ChapterController;

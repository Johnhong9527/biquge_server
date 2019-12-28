'use strict';

const Controller = require('egg').Controller;
const util = require('../util/index');

class ChapterController extends Controller {
  async index() {
    const { ctx } = this;
    try {
      let { index, aid, cid } = ctx.request.body;
      console.log(ctx.request.body);
      if (isNaN(aid) || isNaN(cid)) {
        throw new Error('参数格式错误');
      }
      if (!aid || !cid) {
        throw new Error('缺少参数');
      }
      aid = Number.parseInt(aid);
      cid = Number.parseInt(cid);
      const book = await ctx.model.Book.findOne({ aid, index });
      const chapter = await ctx.model.Chapter.findOne({
        book_id: book.open_id,
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
          newCid = next > 0 ? chapters[i + 1].cid : chapters[i - 1].cid;
        }
      }
      if (newCid < 0) {
        throw new Error('no next chapter');
      }
      ctx.body = newCid;
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
      const book = await ctx.model.Book.findOne({ index, aid });
      await ctx.model.Chapter.updateOne(
        {
          book_id: book.open_id,
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
      // cid = Date.parse(new Date()) / 1000 + aid;
      // cid = aid + index;
      if (
        isNaN(book_index) ||
        Number.parseInt(book_index) < 0 ||
        isNaN(aid) ||
        Number.parseInt(aid) < 1 ||
        isNaN(cid) ||
        Number.parseInt(cid) < 1
      ) {
        throw new Error('参数错误');
      }
      if (!book_index || !aid || !cid) {
        throw new Error('缺少参数');
      }

      book_index = Number.parseInt(book_index);
      aid = Number.parseInt(aid);
      cid = Number.parseInt(cid);

      // 查询章节是否存在
      const chapter = await ctx.model.Chapter.find({
        // index: book_index,
        aid,
        cid,
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
      // console.log(book);
      if (JSON.stringify(book) === '{}') {
        throw new Error('该书籍不存在');
      }
      // console.log('index', index);
      // 设置新的cid
      let chapterIndex = -1;

      for (var i = book.chapters.length - 1; i >= 0; i--) {
        if (book.chapters[i].cid === cid) {
          chapterIndex = i;
        }
      }
      cid = book.chapters.length + aid;
      // book文档中插入字段

      // console.log('chapterIndex', chapterIndex);
      // ctx.body = 'ok';

      book.chapters.splice(index > 0 ? chapterIndex + 1 : chapterIndex, 0, {
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
      ctx.body = await newChapter.save();
    } catch (e) {
      // console.log(e);
      ctx.body = e.message;
    }
  }

  async delChapter() {
    const { ctx } = this;
    try {
      let { index, aid, cid } = ctx.request.body;
      if (!index || isNaN(index) || !aid || isNaN(aid) || !cid || isNaN(cid)) {
        throw new Error('参数错误');
      }
      index = Number.parseInt(index);
      aid = Number.parseInt(aid);
      cid = Number.parseInt(cid);
      let chapter_index = -1;
      const book = await ctx.model.Book.findOne({ index, aid });
      if (JSON.stringify(book) === '{}') {
        throw new Error('该书籍不存在');
      }
      // 删除书籍中的章节数据
      for (var i = 0; i < book.chapters.length; i++) {
        if (book.chapters[i].cid === cid) {
          book.chapters.splice(i, 1);
          const r = await ctx.model.Book.updateOne(
            { index, aid },
            {
              $set: book,
            },
          );
          // console.log(r);
        }
      }

      ctx.body = await ctx.model.Chapter.remove({
        aid: Number.parseInt(aid),
        cid: Number.parseInt(cid),
      });
    } catch (e) {
      ctx.body = e.message;
    }
  }
}

module.exports = ChapterController;

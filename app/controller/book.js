'use strict';

const Controller = require('egg').Controller;
const util = require('../util/index');

class BookController extends Controller {
  // 分页查询
  async index() {
    const { ctx } = this;
    try {
      // currentPage    当前页数
      // pageSize       每页显示条目个数
      let { currentPage, pageSize } = ctx.query;
      if (!currentPage || !pageSize) {
        currentPage = 1;
        pageSize = 10;
      }

      if (isNaN(currentPage)) {
        throw new Error('currentPage只能为数字');
      } else {
        currentPage = Number.parseInt(currentPage);
      }
      if (isNaN(pageSize)) {
        throw new Error('pageSize只能为数字');
      } else {
        pageSize = Number.parseInt(pageSize);
      }
      const count = await ctx.model.Book.countDocuments({ source: '笔趣阁' });
      // currentPage = currentPage < 3 ? 5 : (currentPage - 1) * pageSize;
      // currentPage = currentPage === 1 ? 8 : (currentPage-1) * pageSize + 8;
      currentPage = (currentPage - 1) * pageSize;
      let books = await ctx.model.Book.find({
        index: { $gt: currentPage },
        source: '笔趣阁',
      }).limit(pageSize);
      let body = [];
      books.forEach(el => {
        body.push({
          title: el.title,
          author: el.author,
          aid: el.aid,
          lastUpdate: el.lastUpdate,
          status: el.status,
          intro: el.intro,
          index: el.index,
          length: el.chapters.length,
        });
      });
      ctx.body = {
        total: count,
        data: body,
      };
    } catch (e) {
      ctx.body = e.message;
    }
  }

  // 获取书籍所有信息
  async getBook() {
    const { ctx } = this;
    try {
      // currentPage    当前页数
      // pageSize       每页显示条目个数
      let { currentPage = 2, pageSize = 5, index, aid } = ctx.query;
      /*if (!util.isNumber(currentPage)) throw new Error('currentPage参数错误');
      if (!util.isNumber(pageSize)) throw new Error('pageSize参数错误');
      if (!util.isNumber(index)) throw new Error('index参数错误');
      if (!util.isNumber(aid)) throw new Error('aid参数错误');*/
      const book = await ctx.model.Book.findOne({ index, aid });
      const total = book.chapters.length;
      book.chapters = book.chapters.splice(
        (currentPage - 1) * pageSize,
        pageSize,
      );
      ctx.body = {
        ...book._doc,
        total,
      };
    } catch (e) {
      ctx.body = e.message;
    }
  }
  async nextBook() {
    const { ctx } = this;
    try {
      let { index = 0 } = ctx.query;
      const book = await ctx.model.Book.findOne({ index });
      ctx.body = book.aid;
    } catch (e) {
      ctx.body = e.message;
    }
  }

  // 创建书籍基本数据
  async create() {
    const { ctx } = this;
    try {
      /* 书名 --> title str
       * 作者 --> author str
       * 书籍ID --> aid num
       */
      const { title, author, aid } = ctx.request.body;
      if (isNaN(aid) || aid < 1) {
        throw new Error('aid只能为大于0的整数');
      }
      if (!aid) {
        throw new Error('aid为必传参数');
      }
      // 查询aid是否存在，存在返回数据重复
      const findAid = await ctx.model.Book.find({ aid });
      if (findAid.length > 0) {
        throw new Error('书籍已存在');
      }
      // 创建书籍信息
      const books = await ctx.model.Book.find({}, { aid: 1 });
      const createBook = await new ctx.model.Book({
        index: books.length,
        aid: Number.parseInt(aid),
        title,
        author,
      });
      ctx.body = await createBook.save();
    } catch (e) {
      ctx.body = e.message;
    }
  }

  // 删除整本书籍
  async delete() {
    const { ctx } = this;
    try {
      const { aid, index } = ctx.request.body;
      if (isNaN(aid) || aid < 1 || isNaN(index) || index < 0) {
        throw new Error('aid只能为大于0的整数');
      }
      if (!aid) {
        throw new Error('aid为必传参数');
      }
      ctx.body = await ctx.model.Book.remove({ aid, index });
    } catch (e) {
      ctx.body = e.message;
    }
  }

  // 编辑单个章节数据，仅限修改title和href
  async editChapters() {
    const { ctx } = this;
    try {
      /*
      title: { type: String },
      aid: { type: Number },
      cid: { type: Number },
      href: { type: String },
      * */
      let { title, aid, cid, href } = ctx.request.body;

      if (
        title === '' ||
        isNaN(aid) ||
        aid === '' ||
        isNaN(cid) ||
        cid === ''
      ) {
        throw new Error('参数不为空');
      }
      const book = await ctx.model.Book.update(
        {
          'chapters.aid': Number.parseInt(aid),
          'chapters.cid': Number.parseInt(cid),
        },
        { $set: { 'chapters.$.title': title } },
      );
      await ctx.model.Chapter.updateOne(
        { index, aid, cid },
        { $set: { title } },
      );
      ctx.body = book;
    } catch (e) {
      ctx.body = e.message;
    }
  }

  // 插入单个章节
  async insertChapters() {
    const { ctx } = this;
    try {
      /*
      title: { type: String },
      aid: { type: Number },
      cid: { type: Number },
      href: { type: String }
      index: { type: Number },*/
      const { title, aid, cid, href, index } = ctx.request.body;
      // 必传项
      if (
        !aid ||
        isNaN(aid) ||
        Number.parseInt(aid) < 1 ||
        !cid ||
        isNaN(cid) ||
        Number.parseInt(cid) < 1 ||
        !title ||
        !index ||
        Number.parseInt(index) < 0
      ) {
        throw new Error('参数错误');
      }
      const book = await ctx.model.Book.findOne({ aid });
      if (index > book.chapters.length) {
        throw new Error('index过大');
      }
      book.chapters.splice(index, 0, {
        title,
        aid: Number.parseInt(aid),
        cid: Number.parseInt(cid),
        href,
      });
      ctx.body = await ctx.model.Book.update({ aid }, { $set: book });
    } catch (e) {
      ctx.body = e.message;
    }
  }

  // 删除单个章节信息
  async delChapters() {
    const { ctx } = this;
    try {
      const { aid, cid } = ctx.request.body;
      const book = await ctx.model.Book.findOne(
        { aid: Number.parseInt(aid) },
        {},
      );
      let index = util.getChaptersIndex(book.chapters, cid);
      if (index > -1) {
        book.chapters.splice(index, 1);
      } else {
        throw new Error('参数错误');
      }
      ctx.body = await ctx.model.Book.update({ aid }, { $set: book });
    } catch (e) {
      ctx.body = e.message;
    }
  }

  // 修改doc中chapters的数据类型
  async setCidType() {
    const { ctx } = this;
    try {
      const aid = 10806;
      const book = await ctx.model.Book.findOne({ aid });
      book.chapters.map(el => {
        el.cid = Number.parseInt(el.cid);
      });
      ctx.body = await ctx.model.Book.updateOne({ aid }, { $set: book });
    } catch (e) {
      ctx.body = e.message;
    }
  }
}

module.exports = BookController;

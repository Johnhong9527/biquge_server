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
        throw 'currentPage只能为数字';
      }
      if (isNaN(pageSize)) {
        throw 'pageSize只能为数字';
      }
      currentPage = currentPage === 1 ? -1 : (currentPage - 1) * pageSize;
      let books = await ctx.model.Book.find({ index: { $gt: currentPage } })
        .sort({ 'index': 1 })
        .limit(Number.parseInt(pageSize));
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
      ctx.body = body;
    } catch (e) {
      ctx.body = e;
    }
  }

  // 获取书籍所有信息
  async getBook() {
    const { ctx } = this;
    const { index, aid } = ctx.query;
    try {
      if (isNaN(index) || index < 0) {
        throw '请输入index';
      }
      if (isNaN(index)) {
        throw 'index格式错误';
      }
      if (!aid) {
        throw '请输入aid';
      }
      if (isNaN(aid)) {
        throw 'aid格式错误';
      }
      ctx.body = await ctx.model.Book.findOne({ index, aid });
    } catch (e) {
      ctx.body = e;
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
      const { title, author, aid } = ctx.query;
      if (isNaN(aid) || aid < 1) {
        throw 'aid只能为大于0的整数';
      }
      if (!aid) {
        throw 'aid为必传参数';
      }
      // 查询aid是否存在，存在返回数据重复
      const findAid = await ctx.model.Book.find({ aid });
      if (findAid.length > 0) {
        throw '书籍已存在';
      }
      // 创建书籍信息
      const books = await ctx.model.Book.find({}, { aid: 1 });
      const createBook = await new ctx.model.Book({
        index: books.length,
        aid: Number.parseInt(aid), title, author
      });
      ctx.body = await createBook.save();
    } catch (e) {
      ctx.body = e;
    }
  }

  // 删除整本书籍
  async delete() {
    const { ctx } = this;
    try {
      const { aid } = ctx.query;
      if (isNaN(aid) || aid < 1) {
        throw 'aid只能为大于0的整数';
      }
      if (!aid) {
        throw 'aid为必传参数';
      }
      const remove = await ctx.model.Book.remove({ aid });
      ctx.body = remove;

    } catch (e) {
      ctx.body = e;
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
      const { title, aid, cid, href } = ctx.request.body;
      if (title === '' || isNaN(aid) || aid === '' || isNaN(cid) || cid === '') {
        throw '参数不为空';
      }
      const book = await ctx.model.Book.update({
        'chapters.aid': Number.parseInt(aid),
        'chapters.cid': Number.parseInt(cid),
      }, { '$set': { 'chapters.$.title': title } });
      ctx.body = book;
    } catch (e) {
      ctx.body = e;
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
      const { title, aid, cid, href, index } = ctx.query;
      // 必传项
      if (!aid || isNaN(aid) || Number.parseInt(aid) < 1 || !cid || isNaN(cid) || Number.parseInt(cid) < 1 || !title || !index || Number.parseInt(index) < 0) {
        throw '参数错误';
      }
      const book = await ctx.model.Book.findOne({ aid });
      if (index > book.chapters.length) {
        throw 'index过大';
      }
      book.chapters.splice(index, 0, { title, aid: Number.parseInt(aid), cid: Number.parseInt(cid), href });
      ctx.body = await ctx.model.Book.update({ aid }, { '$set': book });
    } catch (e) {
      ctx.body = e;
    }
  }

  // 删除单个章节信息
  async delChapters() {
    const { ctx } = this;
    try {
      const { aid, cid } = ctx.query;
      const book = await ctx.model.Book.findOne({ aid: Number.parseInt(aid) }, {});
      let index = util.getChaptersIndex(book.chapters, cid);
      if (index) {
        book.chapters.splice(index, 1);
      } else {
        throw '参数错误';
      }
      ctx.body = await ctx.model.Book.update({ aid }, { '$set': book });
    } catch (e) {
      ctx.body = e;
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
      ctx.body = await ctx.model.Book.updateOne({ aid }, { '$set': book });
      // ctx.body = 'ok';
    } catch (e) {
      ctx.body = e;
    }
  }
}

module.exports = BookController;

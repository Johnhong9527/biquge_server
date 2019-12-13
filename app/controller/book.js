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
      console.log(e);
      ctx.body = e;
    }
  }

  async getBookInfo() {
    const { ctx } = this;
    const { index, aid } = ctx.query;
    try {
      if (!index) {
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

      ctx.body = await ctx.model.Book.find({ index, aid });
    } catch (e) {
      ctx.body = e;
    }
  }

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
      const createBook = await ctx.model.Book.create({
        length: books.length,
        aid, title, author
      });
      ctx.body = createBook;
    } catch (e) {
      ctx.body = e;
    }
  }

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

  async editChapters() {
    const { ctx } = this;
    try {
      /*
      title: { type: String },
      aid: { type: Number },
      cid: { type: Number },
      href: { type: String },
      * */
      const { title, aid, cid, href } = ctx.query;
      if (!title || title === '' || !aid || aid === '' || !cid || cid === '' || !href || href === '') {
        throw '参数不为空';
      }
      // const find = await ctx.model.Book.find({
      //   'chapters.aid': Number.parseInt(aid),
      //   'chapters.cid': cid
      // });
      // console.log(137);
      // console.log('length', find.chapters.length);
      const book = await ctx.model.Book.update({
        'chapters.aid': Number.parseInt(aid),
        'chapters.cid': cid,
      }, { '$set': { 'chapters.$.title': title, 'chapters.$.href': href } });
      ctx.body = book;
    } catch (e) {
      ctx.body = e;
    }
  }

  async setCidType() {
    const { ctx } = this;
    try {
      const book = await ctx.model.Book.find({ aid: 10 });
      console.log(book);
      ctx.bodu = 'ok';
    } catch (e) {
      ctx.body = e;
    }
  }
}

module.exports = BookController;

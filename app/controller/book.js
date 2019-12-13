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
      let books = await ctx.model.Book.find({ index: { $gt: currentPage } }).sort({ 'index': 1 }).limit(Number.parseInt(pageSize));
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
}

module.exports = BookController;

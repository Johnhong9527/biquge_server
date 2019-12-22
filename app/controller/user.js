'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
}

module.exports = HomeController;


// exports.index = function* (ctx) {
//   ctx.body = yield ctx.model.User.find({});
// };
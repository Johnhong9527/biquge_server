'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');

class HomeController extends Controller {
	async index() {
		const { ctx } = this;
		ctx.body = 'hi, egg';
	}
	async render() {
		const { ctx } = this;
		ctx.response.type = 'html';
		ctx.body = fs.readFileSync(path.resolve(__dirname, '../public/index.html'));
	}
}

module.exports = HomeController;

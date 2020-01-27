'use strict';

const Controller = require('egg').Controller;
const puppeteer = require('puppeteer');
const util = require('../util/index');
class ReptileController extends Controller {
	// 创建来源网站爬虫规则
	async getBookInfo() {
		const { ctx } = this;
		try {
			const params = ctx.request.body;
			console.log(params);
			ctx.body = params;
		} catch (e) {
			ctx.body = e.message;
		}
	}
}

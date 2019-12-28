'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
	const { router, controller } = app;
	router.get('/', controller.home.render);
	require('./router/book')(app);
	require('./router/chapter')(app);
};

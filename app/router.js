'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
	const { router, controller } = app;
	router.get('/', controller.home.render);
	router.get('/test', controller.user.index);
	require('./router/book')(app);
	require('./router/chapter')(app);
};

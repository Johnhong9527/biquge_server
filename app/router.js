'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/test', controller.user.index);
  router.get('/books', controller.book.index);
  router.get('/book-info', controller.book.getBookInfo);
  router.get('/get-chapter', controller.chapter.index);
  router.put('/set-chapter', controller.chapter.setChapter);
};

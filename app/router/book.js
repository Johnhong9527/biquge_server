module.exports = (app) => {
  app.router.get('/books', app.controller.book.index);
  app.router.get('/book', app.controller.book.getBook);
  app.router.get('/next-book', app.controller.book.nextBook);
  app.router.post('/create-book', app.controller.book.create);
  app.router.post('/delete-book', app.controller.book.delete);
  app.router.post('/edit-chapters', app.controller.book.editChapters);
  app.router.post('/insert-chapters', app.controller.book.insertChapters);
  app.router.post('/del-chapters', app.controller.book.delChapters);
  app.router.post('/set-cid-type', app.controller.book.setCidType);
};
/*
*
* {
    "href" : "http://www.xinyushuwu.com/10/10806/318858.html",
    "aid" : 10,
    "cid" : 318858,
    "title" : "眼睁睁看着女友每天被人轮"
}
href: "http://www.xinyushuwu.com/10/10806/318858.html",
aid: 10806,
cid: 318858,
title: "眼睁睁看着女友每天被人轮"
* */

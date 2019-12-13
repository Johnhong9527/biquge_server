module.exports = app => {
  app.router.get('/get-chapter', app.controller.chapter.index);
  app.router.post('/set-chapter', app.controller.chapter.setChapter);
  app.router.post('/cre-chapter', app.controller.chapter.createChapter);
  app.router.post('/del-chapter', app.controller.chapter.delChapter);
};

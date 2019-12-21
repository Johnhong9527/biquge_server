module.exports = app => {
  app.router.post('/get-chapter', app.controller.chapter.index);
  app.router.post('/next-chapter', app.controller.chapter.nextChapter);
  app.router.post('/set-chapter', app.controller.chapter.setChapter);
  app.router.post('/cre-chapter', app.controller.chapter.createChapter);
  app.router.post('/del-chapter', app.controller.chapter.delChapter);
};

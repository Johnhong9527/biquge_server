module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  /**
   * 书名 --> title str
   * 作者 --> author str
   * 书籍ID --> aid num
   * 最后更新时间 --> latest update str
   * 最新章节 --> latest chapter num
   * 状态 --> status 0:连载 1:完结
   * 介绍 --> intro str
   * 排序 --> index num
   * 章节列表 --> chapters Arr
   *   章节 -->
   *     章节id
   *     章节名title
   * @type {module:mongoose.Schema<any>}
   */
  const BookSchema = new Schema({
    title: { type: String },
    author: { type: String },
    aid: { type: Number },
    lastUpdate: { type: Number },
    status: { type: Number },
    intro: { type: String },
    index: { type: Number },
    chapters: {
      type: Array,
      title: { type: String },
      path: { type: String },
      aid: { type: Number },
      cid: { type: Number },
      href: { type: String },
    },
  });

  return mongoose.model('Book', BookSchema);
};

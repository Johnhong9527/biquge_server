module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ReptileSchema = new Schema({
    title: { type: String }, // 书名（不同书籍不可重复）
    source: { type: String }, // 来源(各大小说网站)
    author: { type: String }, //作者
    avatar: { type: String }, // 封面
    tag: { type: String }, // 标签
    tag_url: { type: String }, // 标签链接
    // aid: { type: Number }, // 书籍原bookID（不同书籍不可重复）
    lastUpdate: { type: String }, // 书籍最后更新时间
    status: { type: String }, // 书籍更新进度
    intro: { type: String }, // 书籍简介
    // index: { type: Number }, // 书籍排序
    href: { type: String }, // 书籍原链接
    // open_id: { type: String }, // 书籍唯一ID（不同书籍不可重复）
    chapters: {
      type: Array,
      title: { type: String }, // 章节名（不同书籍可重复）
      // cid: { type: Number }, // 章节ID（不同书籍可重复）
      href: { type: String }, // 章节原地址
    },
    chapter: {
      title: { type: String },
      // book_id: { type: String },
      // cid: { type: Number },
      href: { type: String },
      content: { type: String },
    },
  });

  return mongoose.model('Reptile', ReptileSchema);
};

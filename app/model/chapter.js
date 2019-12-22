// eslint-disable-next-line strict
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ChapterSchema = new Schema({
    title: { type: String },
    path: { type: String },
    aid: { type: Number },
    cid: { type: Number },
    href: { type: String },
    index: { type: Number },
    content: { type: String },
  });
  return mongoose.model('Chapter', ChapterSchema);
};
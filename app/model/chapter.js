// eslint-disable-next-line strict
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ChapterSchema = new Schema({
    title: { type: String },
    book_id: { type: String },
    cid: { type: Number },
    href: { type: String },
    content: { type: String },
  });
  return mongoose.model('Chapter', ChapterSchema);
};

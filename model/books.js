'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BooksSchema = new Schema({
  title: {type: String, default: ''},
  author: {type: String, default: ''},
  aid: {type: Number, default: ''},
  list: {
    type: Array,
    default: [],
    title: {type: String,},
    path: {type: String,},
    aid: {type: Number,},
    cid: {type: Number,},
    href: {type: String,},
    chapters: {type: Object, default: {}}
  }

});
BooksSchema.add({
  index: {type: Number}
});
const Books = mongoose.model('Books', BooksSchema);
module.exports = Books;
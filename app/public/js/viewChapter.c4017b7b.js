(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["viewChapter"],{"40c5":function(t,e,r){"use strict";var n=r("ee19"),c=r.n(n);c.a},a60f:function(t,e,r){"use strict";r.r(e);var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return t.chapter&&t.chapter.title?r("el-row",[r("el-col",{attrs:{span:24}},[r("h1",{staticClass:"title"},[t._v(t._s(t.chapter.title))])]),r("el-col",{attrs:{span:24}},[r("div",{key:t.tinymceKey,staticClass:"content",domProps:{innerHTML:t._s(t.chapter.content)}}),r("br"),r("el-button",{on:{click:function(e){return t.next(0)}}},[t._v("上一章")]),r("el-button",{on:{click:t.back}},[t._v("后退")]),r("el-button",{on:{click:t.edit}},[t._v("编辑")]),r("el-button",{on:{click:function(e){return t.next(1)}}},[t._v("下一章")])],1)],1):t._e()},c=[],a=(r("a4d3"),r("99af"),r("4de4"),r("e439"),r("dbb4"),r("b64b"),r("159b"),r("ade3")),o=r("2f62");function i(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function s(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?i(Object(r),!0).forEach((function(e){Object(a["a"])(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}var p={name:"view-chapter",data:function(){return{tinymceKey:""}},created:function(){this.getChapter(this.$route.params)},mounted:function(){this.tinymceKey=Date.parse(new Date)},watch:{$route:function(t,e){t.path!==e.path&&this.getChapter(this.$route.params)}},methods:s({},Object(o["b"])("mChapter",["getChapter","nextChapter"]),{edit:function(){this.$router.push("/edit-chapter/".concat(this.$route.params.index,"/").concat(this.$route.params.aid,"/").concat(this.$route.params.cid))},back:function(){this.$router.go(-1)},next:function(t){this.nextChapter(s({},this.$route.params,{next:t,page:this,path:"view-chapter"}))}}),computed:s({},Object(o["c"])("mChapter",{chapter:function(t){return t.chapter}}))},u=p,h=(r("40c5"),r("2877")),l=Object(h["a"])(u,n,c,!1,null,null,null);e["default"]=l.exports},ee19:function(t,e,r){}}]);
//# sourceMappingURL=viewChapter.c4017b7b.js.map
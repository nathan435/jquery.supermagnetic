'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* ---------- CONFIGURATION FOR DEFAULT VALUES ---------- */
/* NOT TO BE MISTAKEN WITH INITIALIZATION OPTIONS */

var config = {
  pluginName: "SupermagneticFeed",
  baseUrl: 'https://supermagnetic.herokuapp.com/api/v1/items',
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NzYsImlhdCI6MTQ4Mzc5ODU2Mn0.vEkb4yPCZAg4GIBb5CDgpRyWnOUi-ahA6-zE0JpxtXw',
  feedId: 124,
  responseLimit: 5,
  facebookSource: true,
  instagramSource: true,
  twitterSource: true,
  youtubeSource: true,
  gridCols: 3,
  gridRandomWidth: false,
  gridColGap: 5,
  filter: true,
  videoFilter: true,
  textFilter: true,
  imageFilter: true,
  facebookFilter: true,
  instagramFilter: true,
  twitterFilter: true,
  youtubeFilter: true
};

/* ---------- TEMPLATES ---------- */

var filterTemplate = function filterTemplate() {
  return '\n\t\t<div class="smgt-filter clearfix">\n      <div class="smgt-filter-types">\n      </div>\n      <div class="smgt-filter-sources">\n      </div>\n\t\t</div>\n\t';
};

var videoFilterOptionTemplate = function videoFilterOptionTemplate() {
  return '\n  <a class="smgt-filter-video" data-feed-filter-type="type" data-feed-filter-value="video"><i class="fa fa-video-camera"></i> <span>Video</span></a>\n  ';
};

var textFilterOptionTemplate = function textFilterOptionTemplate() {
  return '\n  <a class="smgt-filter-text" data-feed-filter-type="type" data-feed-filter-value="text"><i class="fa fa-align-left"></i> <span>Text</span></a>\n';
};

var imageFilterOptionTemplate = function imageFilterOptionTemplate() {
  return '\n  <a class="smgt-filter-text" data-feed-filter-type="type" data-feed-filter-value="image"><i class="fa fa-picture-o"></i> <span>Bild</span></a>\n';
};

var youtubeFilterOptionTemplate = function youtubeFilterOptionTemplate() {
  return '\n  <a class="smgt-filter-youtube" data-feed-filter-type="source" data-feed-filter-value="youtube"><i class="fa fa-youtube-play"></i> <span>Youtube</span></a>\n';
};

var twitterFilterOptionTemplate = function twitterFilterOptionTemplate() {
  return '\n  <a class="smgt-filter-twitter" data-feed-filter-type="source" data-feed-filter-value="twitter"><i class="fa fa-twitter"></i> <span>Twitter</span></a>\n';
};

var facebookFilterOptionTemplate = function facebookFilterOptionTemplate() {
  return '\n  <a class="smgt-filter-facebook" data-feed-filter-type="source" data-feed-filter-value="facebook"><i class="fa fa-facebook"></i> <span>Facebook</span></a>\n';
};

var instagramFilterOptionTemplate = function instagramFilterOptionTemplate() {
  return '\n  <a class="smgt-filter-instagram" data-feed-filter-type="source" data-feed-filter-value="instagram"><i class="fa fa-instagram"></i> <span>Instagram</span></a>\n';
};

var gridTemplate = function gridTemplate() {
  return '\n\t\t\t<div class="grid"></div>\n\t\t';
};

var imageTileTemplate = function imageTileTemplate(tileData, options) {
  return '\n\t<div class="grid-item grid-item-' + options.gridCols + '-col" style="padding:' + options.gridColGap + 'px">\n\t\t\t<div class="smgt-tile">\n\t\t\t\t<img src="' + tileData.imageSource + '"/>\n\t\t\t\t<footer>\n\t\t\t\t\t<div class="smgt-media-icon">\n\t\t\t\t\t\t<i class="fa fa-' + tileData.socialMedia + '" aria-hidden="true"></i>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="smgt-meta">\n\t\t\t\t\t\t<p>' + tileData.date + '</p>\n\t\t\t\t\t\t<p>' + tileData.author + '</p>\n\t\t\t\t\t</div>\n\t\t\t\t</footer>\n\t\t\t</div>\n\t</div>\n';
};

var textTileTemplate = function textTileTemplate(tileData, options) {
  return '\n\t<div class="grid-item grid-item-' + options.gridCols + '-col" style="padding:' + options.gridColGap + 'px">\n\t\t\t<div class="smgt-tile">\n\t\t\t\t<p class="smgt-text ' + tileData.socialMedia + '">\n\t\t\t\t\t' + tileData.text + '\n\t\t\t\t</p>\n\t\t\t\t<footer>\n\t\t\t\t\t<div class="smgt-media-icon">\n\t\t\t\t\t\t<i class="fa fa-' + tileData.socialMedia + '" aria-hidden="true"></i>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="smgt-meta">\n\t\t\t\t\t\t<p>' + tileData.date + '</p>\n\t\t\t\t\t\t<p>' + tileData.author + '</p>\n\t\t\t\t\t</div>\n\t\t\t\t</footer>\n\t\t\t</div>\n\t</div>\n';
};

var detailViewTemplate = function detailViewTemplate() {
  return '\n  <div class="smgt-detail-view">\n    <div class="smgt-detail-view-content">\n      <a class="smgt-detail-close">Schlie\xDFen</a>\n      <div class="smgt-detail-image">\n      </div>\n      <div class="smgt-detail-text">\n      </div>\n      <div class="smgt-detail-meta">\n        <a target="_blank">BEITRAG ANSEHEN</a>\n      </div>\n    </div>\n  </div>\n';
}

/* ---------- PLUGIN CODE ---------- */

;(function ($, doc, win) {

  var name = config.name;

  var SupermagneticFeed = function () {
    function SupermagneticFeed(el, opts) {
      _classCallCheck(this, SupermagneticFeed);

      this.$el = $(el);
      this.$el.data(name, this);

      this.defaults = config;

      var meta = this.$el.data(name + '-opts');
      this.opts = $.extend(this.defaults, opts, meta);
      this.isloading = false;
      this.dataitems = {};

      this.init();
    }

    _createClass(SupermagneticFeed, [{
      key: 'init',
      value: function init() {
        // initialize grid
        this.filterInit();
        this.$grid = $(gridTemplate());
        this.$el.append(this.$grid);
        this.detailViewInit();
        // init Masonry
        this.$grid.masonry({
          itemSelector: '.grid-item'
        });

        this.getFeedData({
          limit: this.opts.responseLimit,
          type: '',
          service: ''
        });
      }
    }, {
      key: 'detailViewInit',
      value: function detailViewInit() {
        var _this = this;

        var self = this;
        this.detailView = $(detailViewTemplate());
        $('body').append(this.detailView);

        this.detailView.on('click', function () {
          _this.detailView.fadeOut('fast');
        });

        this.$grid.on('click', '.grid-item', function (e) {
          // get item information
          var griditem = $(e.target).closest('.grid-item');
          var itemid = griditem.data('itemid');

          var item = self.dataitems[itemid];
          self.showDetailView(item);
        });
      }
    }, {
      key: 'showDetailView',
      value: function showDetailView(item) {
        // change detailview element
        console.log(item);
        $('.smgt-detail-image').css('background-image', '');
        if (item.image) {
          $('.smgt-detail-image').css('background-image', 'url(' + item.image + ')');
        } else if (item.type = 'text') {
          var color = '#fff';
          if (item.service === 'twitter') {
            color = '#55ACEE';
          };
          $('.smgt-detail-image').css('background-color', color);
        }

        $('.smgt-detail-text').text(item.text);
        $('.smgt-detail-meta a').prop("href", item.url);

        // show detail view
        this.detailView.fadeIn();
      }
    }, {
      key: 'filterInit',
      value: function filterInit() {
        var _this2 = this;

        var self = this;
        if (this.opts.filter && (this.opts.videoFilter || this.opts.textFilter || this.opts.imageFilter || this.opts.youtubeFilter || this.opts.twitterFilter || this.opts.facebookFilter || this.opts.instagramFilter)) {
          // atleast one filter selected
          // build filter
          var filter = $(filterTemplate());
          this.$el.append(filter);

          // add anchor tag for each filter button
          if (this.opts.videoFilter) $('.smgt-filter-types').append(videoFilterOptionTemplate());
          if (this.opts.textFilter) $('.smgt-filter-types').append(textFilterOptionTemplate());
          if (this.opts.imageFilter) $('.smgt-filter-types').append(imageFilterOptionTemplate());

          if (this.opts.youtubeFilter) $('.smgt-filter-sources').append(youtubeFilterOptionTemplate());
          if (this.opts.twitterFilter) $('.smgt-filter-sources').append(twitterFilterOptionTemplate());
          if (this.opts.facebookFilter) $('.smgt-filter-sources').append(facebookFilterOptionTemplate());
          if (this.opts.instagramFilter) $('.smgt-filter-sources').append(instagramFilterOptionTemplate());

          // handle filter clicks
          $('.smgt-filter a').on('click', function (e) {
            // empty grid
            if (!self.isloading) {

              $('.grid-item').remove();
              $('.grid').masonry('layout');
              $('.smgt-filter a').removeClass('smgt-filter-selected');
              var target = void 0;
              var type = void 0;
              if ($(e.target).is('a')) {
                $(e.target).addClass('smgt-filter-selected');
                target = $(e.target).data('feed-filter-value');
                type = $(e.target).data('feed-filter-type');
              } else {
                $(e.target).parent().addClass('smgt-filter-selected');
                target = $(e.target).parent().data('feed-filter-value');
                type = $(e.target).parent().data('feed-filter-type');
              }

              var requestType = void 0;
              var requestService = void 0;

              switch (type) {
                case 'type':
                  requestType = target;
                  requestService = '';
                  break;
                case 'source':
                  requestType = '';
                  requestService = target;
                  break;
                default:
                  requestType = '';
              }

              _this2.getFeedData({
                limit: _this2.opts.responseLimit,
                type: requestType,
                service: requestService
              });
            }
          });
        }
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this.$el.off('.' + name);
        this.$el.find('*').off('.' + name);
        this.$el.removeData(name);
        this.$el = null;
      }
    }, {
      key: 'getFeedData',
      value: function getFeedData(options) {
        this.$grid.addClass('loading');
        this.isloading = true;
        var self = this;

        function makeRequest(options, second) {
          var limit = options.limit !== '' ? '&limit=' + options.limit : 9;
          var type = options.type !== '' ? '&type=' + options.type : '';
          if (second === 'image') {
            type = '&type=photo';
          }
          var service = options.service !== '' ? '&service=' + options.service : '';

          var url = self.opts.baseUrl + '?feed_id=' + self.opts.feedId + '&access_token=' + self.opts.token + limit + type + service;
          return $.ajax({
            type: 'GET',
            dataType: 'jsonp',
            url: url
          });
        }

        if (options.type === 'image') {
          $.when(makeRequest(options), makeRequest(options, 'image')).done(function (r1, r2) {
            var items = r1[0].items;
            if (r2[0].items.length > 0) {
              items = items.concat(r2[0].items);
              items.sort(function (a, b) {
                a = new Date(a.published_at);
                b = new Date(b.published_at);
                return a > b ? -1 : a < b ? 1 : 0;
              });
            }

            self.generateFeed(items);
          });
        } else {
          $.when(makeRequest(options)).done(function (r1) {
            var items = r1.items;
            self.generateFeed(items);
          });
        }
      }
    }, {
      key: 'generateTile',
      value: function generateTile(item) {
        var date = new Date(item.published_at).toLocaleDateString();
        var tileData = {
          imageSource: item.image,
          socialMedia: item.service,
          date: date,
          author: item.profile_name,
          text: item.text
        };

        var tile = void 0;
        if (item.type === 'text') {
          tile = $(textTileTemplate(tileData, this.opts));
          tile.data('itemid', item.id);
        } else if (item.type === 'image' || item.type === 'photo') {
          tile = $(imageTileTemplate(tileData, this.opts));
          tile.data('itemid', item.id);
        }
        this.$grid.append(tile).masonry('appended', tile);
      }
    }, {
      key: 'generateFeed',
      value: function generateFeed(items) {
        var _this3 = this;

        // self.$grid.masonry('remove', $('.grid .grid-item'));
        var self = this;
        // build tiles for each feed item
        items.forEach(function (item) {
          _this3.generateTile(item);
          _this3.dataitems[item.id] = item;
        });

        var imgCount = 0;

        for (var i = 0; i < items.length; i++) {
          if (items[i].type === 'photo' || items[i].type === 'image') {
            imgCount++;
          }
        }

        if (imgCount > 0) {
          var loaded = 0;
          var errors = 0;
          $('.grid img').on('load', function () {
            loaded++;
            if (loaded + errors >= imgCount) {
              self.$grid.removeClass('loading');
              self.updateFeed();
            }
          }).on('error', function () {
            // change image to default social media color background
            var griditem = $(this).parent().parent();
            griditem.remove();
            errors++;
            if (loaded + errors >= imgCount) {
              self.$grid.removeClass('loading');
              self.updateFeed();
            }
          });
        } else {
          self.$grid.removeClass('loading');
          self.updateFeed();
        }
      }
    }, {
      key: 'updateFeed',
      value: function updateFeed() {
        this.isloading = false;
        this.$grid.masonry('reloadItems');
        this.$grid.masonry('layout');
      }
    }]);

    return SupermagneticFeed;
  }();

  $.fn.SupermagneticFeed = function (opts) {
    return this.each(function () {
      new SupermagneticFeed(this, opts);
    });
  };

  $(doc).on('dom_loaded ajax_loaded', function (e, nodes) {
    var $nodes = $(nodes);
    var $elements = $nodes.find('.' + name);
    $elements = $elements.add($nodes.filter('.' + name));

    $elements.SupermagneticFeed();
  });
})(jQuery, document, window);
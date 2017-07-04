/* ---------- CONFIGURATION FOR DEFAULT VALUES ---------- */
/* NOT TO BE MISTAKEN WITH INITIALIZATION OPTIONS */

const config = {

    pluginName: "SupermagneticFeed",
    baseUrl: 'https://supermagnetic.herokuapp.com/api/v1/items',
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NjEsImlhdCI6MTQ4MDUxOTcxMn0._hAjjlIecUCyKfyn-oikWo_pXoUEt-cJQ4iZ0tEgvz4',
		feedId: 4,
    responseLimit: 30,
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
    youtubeFilter: true,
    liveUpdate: false,
    liveUpdateInterval: 30
}


/* ---------- TEMPLATES ---------- */

const filterTemplate = () =>
	`
		<div class="smgt-filter clearfix">
      <div class="smgt-filter-types">
      </div>
      <div class="smgt-filter-sources">
      </div>
		</div>
	`;

const videoFilterOptionTemplate = () => `
  <a class="smgt-filter-video" data-feed-filter-type="type" data-feed-filter-value="video"><i class="fa fa-video-camera"></i> <span>Video</span></a>
  `

const textFilterOptionTemplate = () => `
  <a class="smgt-filter-text" data-feed-filter-type="type" data-feed-filter-value="text"><i class="fa fa-align-left"></i> <span>Text</span></a>
`

const imageFilterOptionTemplate = () => `
  <a class="smgt-filter-text" data-feed-filter-type="type" data-feed-filter-value="image"><i class="fa fa-picture-o"></i> <span>Bild</span></a>
`

const youtubeFilterOptionTemplate = () => `
  <a class="smgt-filter-youtube" data-feed-filter-type="source" data-feed-filter-value="youtube"><i class="fa fa-youtube-play"></i> <span>Youtube</span></a>
`

const twitterFilterOptionTemplate = () => `
  <a class="smgt-filter-twitter" data-feed-filter-type="source" data-feed-filter-value="twitter"><i class="fa fa-twitter"></i> <span>Twitter</span></a>
`

const facebookFilterOptionTemplate = () => `
  <a class="smgt-filter-facebook" data-feed-filter-type="source" data-feed-filter-value="facebook"><i class="fa fa-facebook"></i> <span>Facebook</span></a>
`

const instagramFilterOptionTemplate = () => `
  <a class="smgt-filter-instagram" data-feed-filter-type="source" data-feed-filter-value="instagram"><i class="fa fa-instagram"></i> <span>Instagram</span></a>
`

const gridTemplate = () =>
		`
			<div class="grid"></div>
		`;

const imageTileTemplate = (tileData, options) => `
	<div class="grid-item grid-item-${options.gridCols}-col" style="padding:${options.gridColGap}px">
			<div class="smgt-tile">
				<img src="${tileData.imageSource}"/>
				<footer>
					<div class="smgt-media-icon">
						<i class="fa fa-${tileData.socialMedia}" aria-hidden="true"></i>
					</div>
					<div class="smgt-meta">
						<p>${tileData.date}</p>
						<p>${tileData.author}</p>
					</div>
				</footer>
			</div>
	</div>
`;

const textTileTemplate = (tileData, options) => `
	<div class="grid-item grid-item-${options.gridCols}-col" style="padding:${options.gridColGap}px">
			<div class="smgt-tile">
				<p class="smgt-text ${tileData.socialMedia}">
					${tileData.text}
				</p>
				<footer>
					<div class="smgt-media-icon">
						<i class="fa fa-${tileData.socialMedia}" aria-hidden="true"></i>
					</div>
					<div class="smgt-meta">
						<p>${tileData.date}</p>
						<p>${tileData.author}</p>
					</div>
				</footer>
			</div>
	</div>
`;

const videoTileTemplate = (tileData, options) => `
  <div class="grid-item grid-item-${options.gridCols}-col" style="padding:${options.gridColGap}px">
      <div class="smgt-tile">
        <img src="${tileData.imageSource}"/>
        <span class="fa-stack fa-lg">
          <i class="fa fa-circle fa-stack-2x"></i>
          <i class="fa fa-play fa-stack-1x"></i>
        </span>
        <footer>
          <div class="smgt-media-icon">
            <i class="fa fa-${tileData.socialMedia}" aria-hidden="true"></i>
          </div>
          <div class="smgt-meta">
            <p>${tileData.date}</p>
            <p>${tileData.author}</p>
          </div>
        </footer>
      </div>
  </div>
`;

const detailViewTemplate = () => `
  <div class="smgt-detail-view">
    <div class="smgt-detail-view-content">
      <a class="smgt-detail-close">Schließen</a>
      <div class="smgt-detail-image">
        <span class="fa-stack fa-lg">
          <i class="fa fa-circle fa-stack-2x"></i>
          <i class="fa fa-play fa-stack-1x"></i>
        </span>
      </div>
      <div class="smgt-detail-video">
        <iframe class="smgt-video" src="" frameborder="0" />
      </div>
      <div class="smgt-detail-description">
      </div>
      <div class="smgt-detail-meta">
        <a target="_blank">BEITRAG ANSEHEN</a>
      </div>
    </div>
  </div>
`



/* ---------- PLUGIN CODE ---------- */

;(function($, doc, win) {

	const name = config.name;

	class SupermagneticFeed {

		constructor(el, opts){
			this.$el      = $(el);
			this.$el.data(name, this);

      this.lastData = [];

			this.defaults = config;

			const meta    = this.$el.data(name + '-opts');
			this.opts     = $.extend(true, {}, this.defaults, meta, opts);

      this.isloading = false;
      this.dataitems = {};

			this.init();

      window.supermagnetic = this;
		}

		init()  {
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
      // live update
      if(this.opts.liveUpdate) this.liveUpdate();
		}

    liveUpdate() {
      var self = this;
      setInterval(() => {
        $.when(this.makeRequest({
          limit: this.opts.responseLimit,
          type: '',
          service: ''
        })).then(function(items) {
          var newItems = items.items.filter(item => {
            return self.lastData.filter(da => da.id == item.id).length == 0;
          });

          self.$grid.addClass('loading');
          self.isloading = true;
          self.generateFeed(newItems, true);
          self.lastData = self.lastData.concat(newItems);
        })
      }, this.opts.liveUpdateInterval * 1000);
    }

    detailViewInit() {
      var self = this;
      this.detailView = $(detailViewTemplate());
      $('body').append(this.detailView);

      this.detailView.on('click', () => {
        $('.smgt-detail-video .video-yt').attr('src', '');
        this.detailView.fadeOut('fast');
      })

      this.$grid.on('click', '.grid-item', (e) => {
        // get item information
        let griditem = $(e.target).closest('.grid-item');
        let itemid = griditem.data('itemid');

        let item = self.dataitems[itemid];
        self.showDetailView(item);
      })
    }

    showDetailView(item) {
      // change detailview element
      $('.smgt-detail-image').unbind('click');
      if (item.type == 'video' && item.service == 'youtube') {
        $('.smgt-detail-image').css('display', 'none');
        $('.smgt-detail-video').css('display', 'block');
        $('.smgt-detail-video .smgt-video').css('display', 'block');
        $('.smgt-detail-video .smgt-video').attr('src', 'http://www.youtube.com/embed/' + item.external_id);
      }
      if (item.service == 'instagram') {
        $('.smgt-detail-video').css('display', 'none');
        $('.smgt-detail-image').addClass('video-preview');
        $('.smgt-detail-image').css('display', 'block');
        $('.smgt-detail-image').on('click', function() {
          window.open(item.url, '_blank');
        })
      }
      if (item.type == 'image' || item.type == 'photo' ) {
        $('.smgt-detail-video').css('display', 'none');
        $('.smgt-detail-image').css('display', 'block');
      }
      $('.smgt-detail-image').css('background-image', '');
      if (item.image) {
        $('.smgt-detail-image').css('background-image', `url(${item.image})`);
      } else if (item.type = 'text') {
        let color = '#fff';
        if (item.service === 'twitter') { color = '#55ACEE'};
        $('.smgt-detail-image').css('background-color', color);
      }

      $('.smgt-detail-description').text(item.text);
      $('.smgt-detail-meta a').prop("href", item.url);


      // show detail view
      this.detailView.fadeIn();
    }

		filterInit() {
      var self = this;
			if (this.opts.filter && (this.opts.videoFilter || this.opts.textFilter || this.opts.imageFilter
         || this.opts.youtubeFilter || this.opts.twitterFilter || this.opts.facebookFilter || this.opts.instagramFilter)) {
        // atleast one filter selected
        // build filter
        let filter = $(filterTemplate());
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
        $('.smgt-filter a').on('click', (e) => {
            // empty grid
            if (!self.isloading) {

            $('.grid-item').remove();
            $('.grid').masonry('layout');
            $('.smgt-filter a').removeClass('smgt-filter-selected');
            let target;
            let type;
            if ($(e.target).is('a')) {
              $(e.target).addClass('smgt-filter-selected');
              target = $(e.target).data('feed-filter-value');
              type = $(e.target).data('feed-filter-type');
            } else {
              $(e.target).parent().addClass('smgt-filter-selected');
              target = $(e.target).parent().data('feed-filter-value');
              type = $(e.target).parent().data('feed-filter-type');
            }

            let requestType;
            let requestService;

            switch(type){
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


            this.getFeedData({
              limit: this.opts.responseLimit,
              type: requestType,
              requestService
            });
          }
        });
		}
  }

		destroy() {
			this.$el.off('.' + name);
			this.$el.find('*').off('.' + name);
			this.$el.removeData(name);
			this.$el = null;
		}

    makeRequest(options, second) {
      var self = this;
      const limit = options.limit !== '' ? '&limit=' + options.limit : 9;
      let type = options.type !== '' ? '&type=' + options.type : '';
      if (second === 'image') {
        type = '&type=photo';
      }
      const service = options.service !== '' ? '&service=' + options.service : '';

      const url = `${self.opts.baseUrl}?feed_id=${self.opts.feedId}&access_token=${self.opts.token}${limit}${type}${service}`;
      return $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        url: url
      })
    }

		getFeedData(options) {
			this.$grid.addClass('loading');
      this.isloading = true;
			var self = this;

      if (options.type === 'image') {
        $.when(
          this.makeRequest(options), this.makeRequest(options, 'image')).done(function(r1, r2){
          let items = r1[0].items;
          if (r2[0].items.length > 0) {
            items = items.concat(r2[0].items);
            items.sort(function(a, b) {
                a = new Date(a.published_at);
                b = new Date(b.published_at);
                return a>b ? -1 : a<b ? 1 : 0;
            });
          }

          self.generateFeed(items);

        });
      } else {
        $.when(this.makeRequest(options)).done(function(r1){
          let items = r1.items;
          self.lastData = items;
          self.generateFeed(items);
        });
      }
		}


		generateTile(item, prepend) {
			let date = new Date(item.published_at).toLocaleDateString();
			let tileData = {
					imageSource: item.image,
					socialMedia: item.service,
					date: date,
					author: item.profile_name,
					text: item.text,
          url: item.url
			}

      let tile;
			if (item.type === 'text') {
				tile = $(textTileTemplate(tileData, this.opts));
        tile.data('itemid', item.id);
			} else if (item.type === 'image' || item.type === 'photo') {
				tile = $(imageTileTemplate(tileData, this.opts));
        tile.data('itemid', item.id);
			} else if (item.type === 'video') {
        tile = $(videoTileTemplate(tileData, this.opts));
        tile.data('itemid', item.id);
      }

      if(prepend) {
        this.$grid.prepend(tile).masonry('prepended', tile);
      } else {
        this.$grid.append(tile).masonry('appended', tile);
      }
		}

		generateFeed(items, prepend) {
			// self.$grid.masonry('remove', $('.grid .grid-item'));
      var self = this;
			// build tiles for each feed item
			items.forEach((item) => {
				this.generateTile(item, prepend);
        this.dataitems[item.id] = item;
			})

      let imgCount = 0;

      for (let i=0; i < items.length; i++) {
        if (items[i].type === 'photo' || items[i].type === 'image' || items[i].type === 'video') {
          imgCount++;
        }
      }

      if (imgCount > 0) {
        var loaded = 0;
        var errors = 0;
          $('.grid img')
            .on('load', function() {
             loaded++;
             if(loaded + errors >= imgCount){
                self.$grid.removeClass('loading');
                self.updateFeed();
             }
            })
            .on('error', function() {
              // change image to default social media color background
              let griditem = $(this).parent().parent();
              griditem.remove();
              errors++;
              if(loaded + errors >= imgCount){
                 self.$grid.removeClass('loading');
                 self.updateFeed();
              }
            })

      } else {
        self.$grid.removeClass('loading');
        self.updateFeed();
      }

		}

		updateFeed() {
      this.isloading = false;
      this.$grid.masonry('reloadItems');
      this.$grid.masonry('layout');
		}
	}





  $.fn.SupermagneticFeed = function(opts) {
    return this.each(function() {
      new SupermagneticFeed(this, opts);
    });
  };

  $(doc).on('dom_loaded ajax_loaded', function(e, nodes) {
    let $nodes = $(nodes);
    let $elements = $nodes.find('.' + name);
    $elements = $elements.add($nodes.filter('.' + name));

    $elements.SupermagneticFeed();


  });
})(jQuery, document, window);

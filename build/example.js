'use strict';

$('.container').SupermagneticFeed({
	feedId: 124,
	responseLimit: 20,
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
});
# jQuery Plugin for Supermagnetic by Rheinschafe GmbH #

Easily integrate Supermagnetic feeds into jQuery based frontends.

## What ist Supermagnetic? ##
Supermagnetic is a great solution to agregate and manage content from different social media channels. It bases on node.js and offers a great API: https://supermagnetic.io/apidoc
More Infos at https://www.supermagnetic.io

## Why a jquery plugin? ##
Every frontend developer can easely connect supermagnetic to their website, app or any other channel through the REST API. https://supermagnetic.io/apidoc
So you can do that on your on, can you?

Truth to be told: You have to invest some time or ask professionals like the webagency rheinschafe (https://www.rheinschafe.de) to help you with it.

But with this jquery plugin you can get started within 5 minutes. It offers a basic configurable implementation to use supermagnetic on your website instantly. You can adapt it and getting things done in no time.

## Requirements ##

 - jQuery
 - Masonry, http://masonry.desandro.com/, for the magic grid stuff

You need to include them on your own, but can have look at the example.html: https://htmlpreview.github.io/?https://github.com/huersch/jquery.supermagnetic/blob/master/build/example.html

## How to use ##

Using the plugin is very straight forward:

 - Include the js libraries and example css. 
 - Call the SupermagneticFeed()-Function on the container you like to display
 - configure output
 
### Parameters ###

You can call SupermagneticFeed without any paramater just like this: $('.container').SupermagneticFeed()
It will generate a marketing feed of our own. To use it with your own feeds you have to at least specify 'feedId' and 'token'

#### Example ####

Basic:

$('.container').SupermagneticFeed({
  feedId: 124,
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NzYsImlhdCI6MTQ4Mzc5ODU2Mn0.vEkb4yPCZAg4GIBb5CDgpRyWnOUi-ahA6-zE0JpxtXw',
  pluginName: "SupermagneticFeed",
  facebookSource: true,
  instagramSource: true,
  twitterSource: true,
  youtubeSource: true,
  gridCols: 3,
)};

All Options:

$('.container').SupermagneticFeed({
  pluginName: "SupermagneticFeed",
  baseUrl: 'https://supermagnetic.herokuapp.com/api/v1/items',
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NjEsImlhdCI6MTQ4MDUxOTcxMn0._hAjjlIecUCyKfyn-oikWo_pXoUEt-cJQ4iZ0tEgvz4',
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
)};
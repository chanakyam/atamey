var app = angular.module('wildridgeApp', ['ui.bootstrap']);

app.factory('wildridgeHomePageService', function ($http) {
	return {
		getVideosCount: function () {
			return $http.get('/api/videos/count').then(function (result) {
				return result.data.total_rows;
			});
		},
		getAllVideos: function (videosPerPage, skipValue) {
			return $http.get('/api/videos/get_all?limit=' + videosPerPage + '&skip=' + skipValue).then(function (result) {
				return result.data.rows;
			});
		},
		getLatestVideos: function () {
			//since $http.get returns a promise,
			//and promise.then() also returns a promise
			//that resolves to whatever value is returned in it's
			//callback argument, we can return that.
			return $http.get('/api/videos/latest').then(function (result) {
				return result.data.rows;
			});
		},
		getPopularVideos: function (count) {
			return $http.get('/api/videos/popular?n='+ count).then(function (result) {
				return result.data.rows;
			});
		},
		getLatestOneVideo: function () {
			return $http.get('/api/videos/latest_one').then(function (result) {
				return result.data.rows[0];
			});
		},
		getHomePageVideo: function () {
	      return $http.get('/api/news/homevideo').then(function (result) {
	        return result.data.articles;
	      });
	    },
		getTopWorldNews: function (count) {
			return $http.get('/api/news/topnews?c=World&n=' + count).then(function (result) {
				return result.data.articles;
			});
		},
		getTopUsNews: function (count) {
			return $http.get('/api/news/topnews?c=US&n=' + count).then(function (result) {
				return result.data.articles;
			});
		},
		getTopEntertainmentNews: function (count) {
			return $http.get('/api/news/topnews?c=Entertainment&n=' + count).then(function (result) {
				return result.data.rows;
			});
		},
		getTopPoliticsNews: function (count) {
			return $http.get('/api/news/topnews?c=Politics&n=' + count).then(function (result) {
				return result.data.articles;
			});
		},
		getTopMarketNews: function (count) {
			return $http.get('/api/news/topnews?c=Markets&n=' + count).then(function (result) {
				return result.data.articles;
			});
		},
		getTopMoneyNews: function (count) {
			return $http.get('/api/news/topnews?c=Money&n=' + count).then(function (result) {
				return result.data.rows;
			});
		},

		getTopNewsWithImages: function (count) {
			return $http.get('/api/news/topnews_with_images?n=' + count).then(function (result) {
				return result.data.articles;
			});
		},
		getFeaturedVideo: function () {
			return $http.get('/api/videos/home_video').then(function (result) {
				var randVideoCount = Math.floor((Math.random() * 15) + 1);
				return result.data.rows[randVideoCount];
			});
		},
		getNewsCount: function (category) {
			return $http.get('/api/news/count?c=' + category).then(function (result) {
				return result.data.total_rows;
			});
		},
		getAllCategoryNews: function (newsPerPage, skipValue, category) {
			return $http.get('/api/news/get_all?c=' + category + '&skip=' + skipValue + '&perpage=' + newsPerPage).then(function (result) {
				return result.data.rows;
			});

		}


	};
});

app.controller('WildridgeHome', function ($scope, wildridgeHomePageService) {
	//the clean and simple way
	$scope.homePageVideo = wildridgeHomePageService.getHomePageVideo();
	$scope.topWorldNews = wildridgeHomePageService.getTopWorldNews(10);
	$scope.topUsNews = wildridgeHomePageService.getTopUsNews(10);
	$scope.topPoliticsNews = wildridgeHomePageService.getTopPoliticsNews(5);
	$scope.topMarketNews = wildridgeHomePageService.getTopMarketNews(5);
	$scope.topNewsAndGraphics = wildridgeHomePageService.getTopNewsWithImages(5);
	$scope.$watch('featuredVideo', function(featuredVideoObj) {
		if (featuredVideoObj !== undefined) {
			$scope.featuredVideoEmbedPath = "http://video.contentapi.ws/" + featuredVideoObj.value.video_path;
			$scope.featuredVideoTitle = featuredVideoObj.value.title;
			$scope.featuredVideoDuration = featuredVideoObj.value.duration;
		}
	});

	$scope.$watch('homePageVideo', function(homePageVideo) {		
	    if (homePageVideo !== undefined) {
	      $scope.videoName = homePageVideo[0].video;
	      $scope.videoTitle = homePageVideo[0].title;
	      $scope.videoDate = homePageVideo[0].upload_date;
	      //for video
	// var video = "http://video.contentapi.ws/"+$("#video_name").val();
	var video = "http://video.contentapi.ws/"+$scope.videoName;
	$(document).ready(function() {    
                  var vastURI = 'http://vast.optimatic.com/vast/getVast.aspx?id=p0ck37s1id35h0w&zone=vpaidtag&pageURL=[INSERT_PAGE_URL]&pageTitle=[INSERT_PAGE_TITLE]&cb=[CACHE_BUSTER]';
                  function updateURL(vastURI){
                  // Generate a huge random number
                  var ord=Math.random(), protocol, host, port, path, pageUrl, updatedURI;
                  var parsedFragments = parseUri(vastURI);
                  ord = ord * 10000000000000000000;
                  // Protocol of VAST URI
                  protocol = parsedFragments.protocol;
                  // VAST URI hostname
                  host = parsedFragments.host;
                  // VAST URI Path
                  path = parsedFragments.path;
                  //VAST Page Url
                  pageUrl = parsedFragments.queryKey.pageUrl
                  var fragmentString ='';
                  //Updated URI
                  for(var key in parsedFragments.queryKey){//console.log("abhii");console.log();
                    // For Cache buster add a large random number
                    if(key == 'cb'){
                      fragmentString = fragmentString + key + '=' + ord + '&';  
                    }
                    // for referring Page URL, get the current document URL and encode the URI
                    else if(key == 'pageURL'){
                      var currentUrl = document.URL;
                      //var currentUrl = "http://test.com";
                      fragmentString = fragmentString + key + '=' + currentUrl + '&'; 
                    }else if(key == 'pageTitle'){
                      //var currentTit = document.title;
                      //var currentUrl = "http://test.com";
                      var page_title=document.title;
                      fragmentString = fragmentString + key + '=' + page_title + '&'; 
                    }
                    else{
                      fragmentString = fragmentString + key + '=' + parsedFragments.queryKey[key] + '&';
                    }
                    
                  }

                  updatedURI = protocol + '://' + host + path + '?' + fragmentString ;
                  
                  // Remove the trailing & and return the updated URL
                  return updatedURI.slice(0,-1);
                  //return encodeURI(updatedURI.slice(0,-1)); 

                  }

                  // Parse URI to get qeury string like cb for cache buster and pageurl
                function parseUri (str) {
                  var o   = parseUri.options,
                    m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
                    uri = {},
                    i   = 14;

                  while (i--) uri[o.key[i]] = m[i] || "";

                  uri[o.q.name] = {};
                  uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
                    if ($1) uri[o.q.name][$1] = $2;
                  });

                  return uri;
                };

                parseUri.options = {
                  strictMode: false,
                  key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
                  q:   {
                    name:   "queryKey",
                    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
                  },
                  parser: {
                    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                    loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
                  }
                };
                // end of code for generating cb,pagetit,pageurl


              jwplayer('myElement').setup({
                "flashplayer": "http://player.longtailvideo.com/player.swf",
                "playlist": [
                  {
                    // "file": "http://video.contentapi.ws/{{videoParam.video}}"
                    "file": video
                  }
                ],  
                "width": '100%',
                "height": 350,
                stretching: "exactfit",
                autostart: true,
                "controlbar": {
                  "position": "bottom"
                },
                "plugins": {
                  "ova-jw": {
                    "ads": {
                      "companions": {
                        "regions": [
                          {
                            "id": "companion",
                            "width": 80,
                            "height": 300
                          }
                        ]
                      },
                      "schedule": [
                        {
                          "position": "pre-roll",
                          //"tag": "http://vast.optimatic.com/vast/getVast.aspx?id=s93akgl0y&zone=vpaidtag&pageURL=[INSERT_PAGE_URL]&pageTitle=[INSERT_PAGE_TITLE]&cb=[CACHE_BUSTER]"
                          // "tag": updateURL(vastURI)
                        }
                      ]
                    },
                    "debug": {
                      "levels": "none"
                    }
                  }
                }
              });

				// for individual video play start
				var playvideo = "http://video.contentapi.ws/"+$("#play_video_name").val();
				jwplayer('playVideo').setup({
                "flashplayer": "http://player.longtailvideo.com/player.swf",
                "playlist": [
                  {
                    // "file": "http://video.contentapi.ws/{{newsParam.video}}"
                    "file": playvideo
                    
                  }
                ],  
                "width": '100%',
                "height": 350,
                stretching: "exactfit",
                autostart: false,
                "controlbar": {
                  "position": "bottom"
                },
                "plugins": {
                  "ova-jw": {
                    "ads": {
                      "companions": {
                        "regions": [
                          {
                            "id": "companion",
                            "width": 80,
                            "height": 300
                          }
                        ]
                      },
                      "schedule": [
                        {
                          "position": "pre-roll",
                          //"tag": "http://vast.optimatic.com/vast/getVast.aspx?id=s93akgl0y&zone=vpaidtag&pageURL=[INSERT_PAGE_URL]&pageTitle=[INSERT_PAGE_TITLE]&cb=[CACHE_BUSTER]"
                          // "tag": updateURL(vastURI)
                        }
                      ]
                    },
                    "debug": {
                      "levels": "none"
                    }
                  }
                }
              });
				// end

            });
	    }
	 });

	$scope.$watch('latestVideo', function (videoObj) {
		if (videoObj !== undefined) {
			$scope.homeVideoEmbedPath = 'http://video.contentapi.ws/' + videoObj.value.video_path;
		}
	});
	$scope.currentYear = (new Date).getFullYear();



	
 });

app.controller('WildridgeVideoPage', function ($scope, wildridgeHomePageService) {
	$scope.latestVideo = wildridgeHomePageService.getLatestOneVideo();

	// Non Featured Videos i.e all Videos
	$scope.videosPerPage = 42;

	// Javascript Custom Function to get teh URL params, decode them
	function getURLParameter (name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	}

	// Get all Video's Count
	$scope.videoCount = wildridgeHomePageService.getVideosCount();
	// Generate the numberOfPages and pages content based on the videoCount
	$scope.$watch('videoCount', function (videoCountObj) {
		if (videoCountObj !== undefined) {
			// Sample Output: {"rows":[{"key":null,"value":650}]}
			$scope.numberOfPages = (Math.ceil(videoCountObj/$scope.videosPerPage)).toString();

			// Pagination plugin
			$scope.bigTotalItems = videoCountObj;
		}
	});

	// Get noneFeaturedVideos list based on the page(number) we are hitting from.
	$scope.currentPageNumber = parseInt(getURLParameter('p'), 10);
	if (isNaN($scope.currentPageNumber)) {
		skipValue = 0;
		$scope.currentPageNumber = 1;
	} else {
		skipValue = parseInt(($scope.currentPageNumber - 1) * $scope.videosPerPage, 10);
	}

	// Pagination plugin
	$scope.bigCurrentPage = $scope.currentPageNumber;
	$scope.maxSize = 6; // Max number of pages to be displayed at a time


	// Pagination plugin
	// This function is triggred when user tends to change the page using the plugin.
	$scope.pageChanged = function (page) {
		location.replace('/videos?p=' + page);
	};

	$scope.topNewsAndGraphics = wildridgeHomePageService.getTopNewsWithImages(10);
	$scope.currentYear = (new Date).getFullYear();

});


app.controller('WildridgeNewsPagination', function ($scope, wildridgeHomePageService) {

	// Non Featured Videos i.e all Videos
	$scope.newsPerPage = 15;
	// Get the Pathname for last segment
	var url = window.location.pathname;
	// Get the category from segment
	var category = url.substring(url.indexOf("/")+3);

	// Javascript Custom Function to get teh URL params, decode them
	function getURLParameter (name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	}

	// Get all Video's Count
	$scope.newsCount = 150;
	// Generate the numberOfPages and pages content based on the newsCount
	$scope.$watch('newsCount', function (newsCountObj) {
		if (newsCountObj !== undefined) {
			// Sample Output: {"rows":[{"key":null,"value":650}]}
			$scope.numberOfPages = (Math.ceil(newsCountObj/$scope.newsPerPage)).toString();

			// Pagination plugin
			$scope.bigTotalItems = newsCountObj;
		}
	});

	// Get noneFeaturedVideos list based on the page(number) we are hitting from.
	$scope.currentPageNumber = parseInt(getURLParameter('page'), 10);
	if (isNaN($scope.currentPageNumber)) {
		skipValue = 0;
		$scope.currentPageNumber = 1;
	} else {
		skipValue = parseInt(($scope.currentPageNumber - 1) * $scope.newsPerPage, 10);
	}
	// Pagination plugin
	$scope.bigCurrentPage = $scope.currentPageNumber;
	$scope.maxSize = 6; // Max number of pages to be displayed at a time


	// Pagination plugin
	// This function is triggred when user tends to change the page using the plugin.
	$scope.pageChanged = function (page) {
		location.replace('/p/' + category + '?page=' + page);
	};

	$scope.topNewsAndGraphics = wildridgeHomePageService.getTopNewsWithImages(10);
	$scope.currentYear = (new Date).getFullYear();

});

// added more world videos

app.controller('Atameyworldvideos', function ($scope, wildridgeHomePageService) {

	// Non Featured Videos i.e all Videos
	$scope.newsPerPage = 15;
	// Get the Pathname for last segment
	var url = window.location.pathname;
	// Get the category from segment
	var category = url.substring(url.indexOf("/")+3);

	// Javascript Custom Function to get teh URL params, decode them
	function getURLParameter (name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	}

	// Get all Video's Count
	$scope.newsCount = 150;
	// Generate the numberOfPages and pages content based on the newsCount
	$scope.$watch('newsCount', function (newsCountObj) {
		if (newsCountObj !== undefined) {
			// Sample Output: {"rows":[{"key":null,"value":650}]}
			$scope.numberOfPages = (Math.ceil(newsCountObj/$scope.newsPerPage)).toString();

			// Pagination plugin
			$scope.bigTotalItems = newsCountObj;
		}
	});

	// Get noneFeaturedVideos list based on the page(number) we are hitting from.
	$scope.currentPageNumber = parseInt(getURLParameter('page'), 10);
	if (isNaN($scope.currentPageNumber)) {
		skipValue = 0;
		$scope.currentPageNumber = 1;
	} else {
		skipValue = parseInt(($scope.currentPageNumber - 1) * $scope.newsPerPage, 10);
	}
	// Pagination plugin
	$scope.bigCurrentPage = $scope.currentPageNumber;
	$scope.maxSize = 6; // Max number of pages to be displayed at a time


	// Pagination plugin
	// This function is triggred when user tends to change the page using the plugin.
	$scope.pageChanged = function (page) {
		location.replace('/morevideos/?page=' + page);
	};

	$scope.topNewsAndGraphics = wildridgeHomePageService.getTopNewsWithImages(10);
	$scope.currentYear = (new Date).getFullYear();

});

app.directive("videoJs", function(wildridgeHomePageService){
	return {
		restrict: "E",
		scope: {
			
		},
		template: 
			'<video id="banner_video" class="video-js vjs-default-skin" controls preload="auto" width="99%" height="235px" poster="" data-setup=\'{}\'>' +
 				'<source src="" type=\'video/mp4\'>' + 
			'</video>',
		replace: true,
		transclude: false,
		link: function ($scope, element, attrs) {
			$scope.latestVideoPath = wildridgeHomePageService.getLatestOneVideo();
			$scope.$watch('latestVideoPath', function (videoObj) {
				if (videoObj !== undefined) {
					$scope.hVideoEmbedPath = 'http://video.contentapi.ws/' + videoObj.value.video_path;					
					_V_("banner_video").ready(function(){
		      			var myPlayer = this;
      					myPlayer.src($scope.hVideoEmbedPath);      					
					});
				}
			});

		}
	}
});

app.directive("featuredVideoJs", function(wildridgeHomePageService){
	return {
		restrict: "E",
		scope: {
			
		},
		template: 
			'<video id="feature_video" class="video-js vjs-default-skin" controls preload="auto" width="650px" height="359px" poster="" data-setup=\'{}\'>' +
 				'<source src="" type=\'video/mp4\'>' + 
			'</video>',
		replace: true,
		transclude: false,
		link: function ($scope, element, attrs) {
			$scope.featuredVideoPath = wildridgeHomePageService.getFeaturedVideo();
			
			$scope.$watch('featuredVideoPath', function(featuredVideoObj) {
				if (featuredVideoObj !== undefined) {
					$scope.fVideoEmbedPath = "http://video.contentapi.ws/" + featuredVideoObj.value.video_path;
					$scope.featuredVideoPathTitle = featuredVideoObj.value.title;
					$scope.featuredVideoPathDuration = featuredVideoObj.value.duration;
					_V_("feature_video").ready(function(){
		      			var myPlayer = this;
      					myPlayer.src($scope.fVideoEmbedPath);      					
					});
				}
			});
		}
	}
});



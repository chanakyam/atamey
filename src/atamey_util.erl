%% An utility module to create and return the required URLs

-module(atamey_util).
-author("shree@ybrantdigital.com").
-include("includes.hrl").
-export([video_db_url/0, 
		 video_db_url/1, 
		 video_view_counter_bump/1,
		 videos_latest/0,
		 videos_popular/1,
		 videos_latest_one/0,
		 videos_home_video/0,
		 video_count/0,
		 videos_get_all/2,
		 news_db_url/0, 
		 news_db_url/1,
		 news_top_text_news_with_limit/3,
		 news_top_text_graphics_news_with_limit/1,
		 news_category_url/3,
		 news_count/2,
		 news_by_category_limit_skip/4
		]).


video_db_url() ->
	%%http://localhost:5984/speakglobally/
	string:concat(?COUCHDB_URL, ?COUCHDB_VIDEO)
. 

video_db_url(VideoId) ->
	%%http://localhost:5984/speakglobally/<ID>
	string:concat(?MODULE:video_db_url(), VideoId)
. 

video_view_counter_bump(VideoId) ->
	%%http://localhost:5984/speakglobally/_design/bump/_update/views_counter/
	Url1 = string:concat(?MODULE:video_db_url(),"_design/bump/_update/views_counter/"),
	string:concat(Url1, VideoId)
.

videos_latest() ->
	%%http://localhost:5984/speakglobally/_design/get_videos/_view/by_id_title_thumbs_duration?descending=true&limit=5
	string:concat(?MODULE:video_db_url(), "_design/get_videos/_view/by_id_title_thumbs_duration?descending=true&limit=5")
.

videos_popular(Count) ->
	%%http://localhost:5984/speakglobally/_design/popular_videos/_view/by_id_title_thumb_duration?descending=true&limit=10
	Url = string:concat(?MODULE:video_db_url(), "_design/popular_videos/_view/by_id_title_thumb_duration?descending=true&limit="),
	string:concat(Url, Count)
.

videos_latest_one() ->
	%%http://localhost:5984/speakglobally/_design/get_videos/_view/latest_one?descending=true&limit=1
	string:concat(?MODULE:video_db_url(), "_design/get_videos/_view/latest_one?descending=true&limit=1")
.

videos_home_video() ->
	%%http://localhost:5984/speakglobally/_design/home_video/_view/by_id_title_video_path?descending=true&limit=15
	string:concat(?MODULE:video_db_url(), "_design/home_video/_view/by_id_title_video_path?descending=true&limit=15") 
.
video_count() ->
	%%http://localhost:5984/speakglobally/_design/get_count/_view/all_docs
	string:concat(?MODULE:video_db_url(),"_design/get_count/_view/all_docs")
.

videos_get_all(Limit, Skip) ->
	Url1 = string:concat(?MODULE:video_db_url(), "_design/get_videos/_view/by_id_title_thumbs_duration?descending=true&limit="),
	Url2 = string:concat(Url1, Limit),
	Url3 = string:concat(Url2, "&skip="),
	string:concat(Url3, Skip)
.

news_db_url() ->
	string:concat(?COUCHDB_URL, ?COUCHDB_TEXT_GRAPHICS)
.

news_db_url(NewsId) ->
	string:concat(?MODULE:news_db_url(), NewsId)
.

news_top_text_news_with_limit(Design,Category,Limit) ->
	Url1 = string:concat(?MODULE:news_db_url(), "_design/"),
	Url2 = string:concat(Url1,Design),
	Url3 = string:concat(Url2,"/_view/"),
	Url4 = string:concat(Url3, Category),
	Url5 = string:concat(Url4, "?descending=true&limit="),
	string:concat(Url5, Limit)
.

news_top_text_graphics_news_with_limit(Limit) ->
	Url1 = string:concat(?MODULE:news_db_url(), "_design/text_us_politics/_view/by_id_title_desc_thumb_date?descending=true&limit="),
	string:concat(Url1,Limit)
.

news_category_url(Design,Category, PageNumber) ->
	Skip = (PageNumber  -  1)  * 15,
	Url1 = string:concat(?MODULE:news_db_url(), "_design/"),
	Url2 = string:concat(Url1,Design),
	Url3 = string:concat(Url2,"/_view/"),
	Url4 = string:concat(Url3, Category),
	Url5 = string:concat(Url4, "?descending=true&limit=15&skip="),
	string:concat(Url5, integer_to_list(Skip))
.

news_count(Design,Category) ->
	Url1 = string:concat(?MODULE:news_db_url(), "_design/"),
	Url2 = string:concat(Url1,Design),
	Url3 = string:concat(Url2,"/_view/"),
	Url4 = string:concat(Url3, Category),
	string:concat(Url4, "?descending=true&limit=1")
.

news_by_category_limit_skip(Design,Category, Skip, Limit) ->
	Url1 = string:concat(?MODULE:news_db_url(), "_design/"),
	Url2 = string:concat(Url1,Design),
	Url3 = string:concat(Url2,"/_view/"),
	Url4 = string:concat(Url3, Category),
	Url5 = string:concat(Url4, "?limit="),
	Url6 = string:concat(Url5, Limit),
	Url7 = string:concat(Url6, "&descending=true&skip="),
	string:concat(Url7, Skip)	

.
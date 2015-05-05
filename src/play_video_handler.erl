-module(play_video_handler).
-author("chanakyam@koderoom.com").

-export([init/3]).

-export([content_types_provided/2]).
-export([welcome/2]).
-export([terminate/3]).

%% Init
init(_Transport, _Req, []) ->
	{upgrade, protocol, cowboy_rest}.

%% Callbacks
content_types_provided(Req, State) ->
	{[		
		{<<"text/html">>, welcome}	
	], Req, State}.

terminate(_Reason, _Req, _State) ->
	ok.

%% API
welcome(Req, State) ->
	{[{_,Value}], Req2} = cowboy_req:bindings(Req),	

	Url = "http://api.contentapi.ws/videos?channel=world_news&limit=1&skip=8&format=long",
	% io:format("movies url: ~p~n",[Url]), 
	{ok, "200", _, Response_mlb} = ibrowse:send_req(Url,[],get,[],[]),
	ResponseParams_mlb = jsx:decode(list_to_binary(Response_mlb)),	
	[Params] = proplists:get_value(<<"articles">>, ResponseParams_mlb),

	World_News_Url = "http://api.contentapi.ws/news?channel=us_world&limit=10&skip=0&format=short",
	{ok, "200", _, Response_World_News} = ibrowse:send_req(World_News_Url,[],get,[],[]),
	ResponseParams_World_News = jsx:decode(list_to_binary(Response_World_News)),	
	WorldNewsParams = proplists:get_value(<<"articles">>, ResponseParams_World_News),

	US_News_Url = "http://api.contentapi.ws/news?channel=us_domestic&limit=10&skip=0&format=short",
	{ok, "200", _, Response_US_News} = ibrowse:send_req(US_News_Url,[],get,[],[]),
	ResponseParams_US_News = jsx:decode(list_to_binary(Response_US_News)),	
	USNewsParams = proplists:get_value(<<"articles">>, ResponseParams_US_News),

	Money_News_Url = "http://api.contentapi.ws/news?channel=us_money&limit=5&skip=0&format=short",
	{ok, "200", _, Response_Money_News} = ibrowse:send_req(Money_News_Url,[],get,[],[]),
	ResponseParams_Money_News = jsx:decode(list_to_binary(Response_Money_News)),	
	MoneyNewsParams = proplists:get_value(<<"articles">>, ResponseParams_Money_News),

	Url_news = string:concat("http://api.contentapi.ws/v?id=",binary_to_list(Value) ), 
	{ok, "200", _, ResponseNews} = ibrowse:send_req(Url_news,[],get,[],[]),
	ResNews = string:sub_string(ResponseNews, 1, string:len(ResponseNews) -1 ),
	ParamsNews = jsx:decode(list_to_binary(ResNews)),
	%io:format("params ~p ~n ",[ParamsNews]),

	Politics_News_Url = "http://api.contentapi.ws/news?channel=us_politics&limit=5&skip=0&format=short",
	{ok, "200", _, Response_Politics_News} = ibrowse:send_req(Politics_News_Url,[],get,[],[]),
	ResponseParams_Politics_News = jsx:decode(list_to_binary(Response_Politics_News)),	
	PoliticsNewsParams = proplists:get_value(<<"articles">>, ResponseParams_Politics_News),

	{ok, Body} = playvideo_dtl:render([{<<"videoParam">>,Params},{<<"newsParam">>,ParamsNews},{<<"worldnews">>,WorldNewsParams},{<<"usnews">>,USNewsParams},{<<"moneynews">>,MoneyNewsParams},{<<"politicsnews">>,PoliticsNewsParams}]),
    {Body, Req2, State}.



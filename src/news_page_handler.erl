-module(news_page_handler).
-author("shree@ybrantdigital.com").

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
	{[{Name,Value}], Req2} = cowboy_req:bindings(Req),
	Url = string:concat("http://api.contentapi.ws/t?id=",binary_to_list(Value) ),
	{ok, "200", _, Response} = ibrowse:send_req(Url,[],get,[],[]),
	Res = string:sub_string(Response, 1, string:len(Response) -1 ),
	Params = jsx:decode(list_to_binary(Res)),

	Video_Url = "http://api.contentapi.ws/videos?channel=world_news&limit=1&skip=9&format=long",
	% io:format("movies url: ~p~n",[Url]),
	{ok, "200", _, Response_Video} = ibrowse:send_req(Video_Url,[],get,[],[]),
	ResponseParams_Video = jsx:decode(list_to_binary(Response_Video)),	
	[VideoParams] = proplists:get_value(<<"articles">>, ResponseParams_Video),

	World_News_Url = "http://api.contentapi.ws/news?channel=us_world&limit=10&skip=0&format=short",
	{ok, "200", _, Response_World_News} = ibrowse:send_req(World_News_Url,[],get,[],[]),
	ResponseParams_World_News = jsx:decode(list_to_binary(Response_World_News)),	
	WorldNewsParams = proplists:get_value(<<"articles">>, ResponseParams_World_News),

	US_News_Url = "http://api.contentapi.ws/news?channel=us_domestic&limit=10&skip=0&format=short",
	{ok, "200", _, Response_US_News} = ibrowse:send_req(US_News_Url,[],get,[],[]),
	ResponseParams_US_News = jsx:decode(list_to_binary(Response_US_News)),	
	USNewsParams = proplists:get_value(<<"articles">>, ResponseParams_US_News),

	Politics_News_Url = "http://api.contentapi.ws/news?channel=us_politics&limit=5&skip=0&format=short",
	{ok, "200", _, Response_Politics_News} = ibrowse:send_req(Politics_News_Url,[],get,[],[]),
	ResponseParams_Politics_News = jsx:decode(list_to_binary(Response_Politics_News)),	
	PoliticsNewsParams = proplists:get_value(<<"articles">>, ResponseParams_Politics_News),

	Market_News_Url = "http://api.contentapi.ws/news?channel=us_markets&limit=5&skip=0&format=short",
	{ok, "200", _, Response_Market_News} = ibrowse:send_req(Market_News_Url,[],get,[],[]),
	ResponseParams_Market_News = jsx:decode(list_to_binary(Response_Market_News)),	
	MarketNewsParams = proplists:get_value(<<"articles">>, ResponseParams_Market_News),

	% {ok, Body} = news_page_dtl:render(Params),
	{ok, Body} = news_page_dtl:render([{<<"news">>, Params},{<<"videoParam">>,VideoParams}, {<<"worldnews">>,WorldNewsParams},{<<"usnews">>,USNewsParams},{<<"politicsnews">>,PoliticsNewsParams},{<<"marketnews">>,MarketNewsParams}]),
    {Body, Req2, State}.



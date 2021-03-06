-module(home_video_handler).
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
		{<<"application/json">>, welcome}	
	], Req, State}.

terminate(_Reason, _Req, _State) ->
	ok.

%% API
welcome(Req, State) ->
	% {Count, _ } = cowboy_req:qs_val(<<"n">>, Req),
	% {Category, _ } = cowboy_req:qs_val(<<"c">>, Req),
	% lager:info("Top 10 News items requested"),
	Url = "http://api.contentapi.ws/videos?channel=world_news&limit=1&skip=0&format=long",
	{ok, "200", _, Response_mlb} = ibrowse:send_req(Url,[],get,[],[]),
	Body = list_to_binary(Response_mlb),
	{Body, Req, State}.


-module(video_page_handler).
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
	{[{Id,VideoId}], Req2} = cowboy_req:bindings(Req),
	lager:info("Video with Id ~p requested ",[binary_to_list(VideoId)]),
	Url = atamey_util:video_db_url(binary_to_list(VideoId)),
	Url2 = atamey_util:video_view_counter_bump(binary_to_list(VideoId)),  
	{ok, "200", _, Response} = ibrowse:send_req(Url,[],get,[],[]),
	{ok, "201",_,_} = ibrowse:send_req(Url2,[],put, [],[]),
	Res = string:sub_string(Response, 1, string:len(Response) -1 ),
	Params = jsx:decode(list_to_binary(Res)),
	{ok, Body} = video_page_dtl:render(Params),
    {Body, Req2, State}.


 
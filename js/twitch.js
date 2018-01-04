var twitch_streams = ['freecodecamp', 'Calebhart42', 'Iateyourpie', 'Distortion2', 'puwexil', 'essentiafour', 'gamesdonequick', 'speedgaming', 'Zfg1', 'Spikevegeta', 'GameJ06', 'Mitchflowerpower'];

var stream_status = {};

var types = {
    "vodcast": "<span class='fa fa-circle vodcast'></span> Vodcast",
    "live": "<span class='fa fa-circle live'></span> Live",
    "offline": "<span class='fa fa-circle offline'></span> Offline",
    "watch_party": "<span class='fa fa-circle live'></span> Watch Party"
}

$("document").ready(function () {
    twitch_streams.forEach(function (loginId) {
        GetUserInfo(loginId);
    });
    $('.status').click(function(){
        var id = $(this).attr("id");
        if(id == "all"){
            for(var key in stream_status){
                $("#" + key).show();
            }
        } else if(id == "online"){
            for(var key in stream_status){
                if(stream_status[key] === "online"){
                    $("#" + key).show();
                } else {
                    $("#" + key).hide();
                }
            }
        } else {
            for(var key in stream_status){
                if(stream_status[key] === "offline"){
                    $("#" + key).show();
                } else {
                    $("#" + key).hide();
                }
            }
        }
    });
});

function GetUserInfo(loginId) {
    $.ajax({
        type: 'GET',
        url: 'https://api.twitch.tv/helix/users?login=' + loginId,
        headers: {
            'Client-ID': '23h374kjoblxghdndrovueuh47ixzm'
        },
        success: AddStreamBlock,
    });
}

function GetStreamStatus(userInfo) {
    var channelData;
    $.ajax({
        type: 'GET',
        url: 'https://api.twitch.tv/kraken/streams/' + userInfo['displayName'],
        headers: {
            'Client-ID': '23h374kjoblxghdndrovueuh47ixzm'
        },
        success: function (data) {
            var streamInfo = data.stream;
            console.log(streamInfo);
            if (streamInfo === null) {
                SetOffline(userInfo);
            } else {
                channelData = userInfo;
                channelData.game = streamInfo.channel['game'];
                channelData.gameStatus = streamInfo.channel['status'];
                channelData.url = streamInfo.channel['url'];
                channelData.type = streamInfo['stream_type'];
                if(channelData.type === "watch_party"){
                    SetWatchParty(channelData)
                } else {
                    SetOnline(channelData);
                }
            }
        }
    });
}

function AddStreamBlock(data) {
    $.each(data, function (key, value) {
        var profileImageURL = "<img src='" + value[0]['profile_image_url'] + "' class='profile-img' alt='profile image' width='95' height='95'>";
        var displayName = value[0]['display_name'];
        var description = GetDescriptionSnip(value[0]['description']);
        var userInfo = { displayName: displayName, profileImageURL: profileImageURL, description: description };
        var streamInfo = GetStreamStatus(userInfo);
    });
}

function GetDescriptionSnip(desc) {
    if (desc.length > 137) {
        return desc.substr(0, 137) + "...";
    } else {
        return desc;
    }
}

function SetWatchParty(channelData) {
    $(".streams").append("<div id='" + channelData['displayName'] + "' class='stream'><table class='stream-info'><tr><td class='profile-image' rowspan='4'>" + channelData['profileImageURL'] + "</td><td class='stream-name' rowspan='4'>" + channelData['displayName'] + "</td></tr><tr><td class='stream-status'>" + types['watch_party'] + "</td></tr><tr><td class='stream-game'><b>Playing: </b>" + channelData['game'] + "</td></tr><tr><td class='stream-title'>" + channelData['gameStatus'] + "</td></tr></table></div>");
    var name = channelData['displayName'];
    stream_status[name] = 'online';
    $("#" + channelData['displayName']).click(function(){
        window.open('https://go.twitch.tv/' + channelData['displayName']);
    });
}

function SetOffline(channelData) {
    $(".streams").append("<div id='" + channelData['displayName'] + "' class='stream'><table class='stream-info'><tr><td class='profile-image' rowspan='4'>" + channelData['profileImageURL'] + "</td><td class='stream-name' rowspan='4'>" + channelData['displayName'] + "</td></tr><tr><td class='stream-status'>" + types['offline'] + "</td></tr><tr><td class='stream-game'>" + channelData['description'] + "</td></tr><tr><td class='stream-title'></td></tr></table></div>");
    var name = channelData['displayName'];
    stream_status[name] = 'offline';
    $("#" + channelData['displayName']).click(function(){
        window.open('https://go.twitch.tv/' + channelData['displayName']);
    });
}

function SetOnline(channelData) {
    $(".streams").append("<div id='" + channelData['displayName'] + "' class='stream'><table class='stream-info'><tr><td class='profile-image' rowspan='4'>" + channelData['profileImageURL'] + "</td><td class='stream-name' rowspan='4'>" + channelData['displayName'] + "</td></tr><tr><td class='stream-status'>" + types[channelData['type']] + "</td></tr><tr><td class='stream-game'><b>Playing: </b>" + channelData['game'] + "</td></tr><tr><td class='stream-title'>" + channelData['gameStatus'] + "</td></tr></table></div>");
    var name = channelData['displayName'];
    stream_status[name] = 'online';
    $("#" + channelData['displayName']).click(function(){
        window.open('https://go.twitch.tv/' + channelData['displayName']);
    });
}
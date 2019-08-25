function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

let Spotify = {};

Spotify.update = function(SongInfo){
    if(!SongInfo.playing){
        Spotify.hide();
    }else{
        Spotify.show();
    }
    //$("#spotify").html(JSON.stringify(SongInfo));
    $("#spotify-track-img").attr("src", SongInfo.images[2].url);
    $("#spotify-track-name").html(SongInfo.name);
    let artistName = "";
    
    for(let i = 0; i < SongInfo.artists.length; i++){
        if(i == 0){
            artistName += SongInfo.artists[i];
        }else{
            artistName += ", " + SongInfo.artists[i];
        }
    }
    $("#spotify-track-artist").html(artistName);
    $("#spotify-time-display").html(millisToMinutesAndSeconds(SongInfo.progress));
    let progress = ((SongInfo.progress / SongInfo.length) * 100).toPrecision(3);
    $(".spotify-time-content").css("width", progress + "%");
}

Spotify.hide = function(){
    $("#spotify").removeClass("fadeInRight");
    $("#spotify").addClass("fadeOutLeft");
    spotifyTimeout = setTimeout(function(){
        $("#spotify").hide();
    }, 1000);
}

Spotify.show = function(){
    $("#spotify").show();
    $("#spotify").removeClass("fadeOutLeft");
    $("#spotify").addClass("fadeInRight");
}
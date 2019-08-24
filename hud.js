const skins = require('./skins');

let hud = {};
let $;
let csgo = {
    map: "de_test",
    round: {
        phase: null
    },
    score: {
        ct: 0,
        t: 0
    },
    player: {
        state: {
            health: 0,
            armor: 0,
            helmet: false,
            money: 0,
            round_kills: 0,
            round_killhs: 0,
            equip_value: 0
        },
        weapons: {}
    }
};

hud.show = {
    weapon: true,
    game: true,
    player: true,
    spectate: true,
    multiKill: true,
    money: true
}

hud.$ = function(jQuery){
    $ = jQuery;
}

hud.getShow = function(){
    return hud.show;
}

let Timeouts = [];

hud.paused = false;

hud.resume = function(){
    hud.showWeapon();
    hud.showGame();
    hud.showPlayer();
    hud.showSpectate();
    hud.showMoney();
    /*
        if(hud.show.weapon){
            hud.showWeapon();
        }

        if(hud.show.game){
            hud.showGame();
        }

        if(hud.show.player){
            hud.showPlayer();
        }

        if(hud.show.Spectate){
            hud.showSpectate();
        }

        if(hud.show.money){
            hud.showMoney();
        }
    */
}

hud.pause = function(){
    hud.hideWeapon();
    hud.hideGame();
    hud.hideMoney();
    hud.hidePlayer();
    hud.hideSpectate();
}

let pauseTimer;

hud.showWeapon = function(){
    hud.show.weapon = true;
    clearTimeout(Timeouts["weapon"]);
    $("#WeaponSlot").show().removeClass("fadeOutLeft").addClass("fadeInRight");
}

hud.hideWeapon = function(){
    hud.show.weapon = false;

    $("#WeaponSlot").removeClass("fadeInRight").addClass("fadeOutLeft");
    Timeouts["weapon"] = setTimeout(function(){
        $("#WeaponSlot").hide();
    }, 1000);
}

hud.showGame = function(){
    hud.show.game = true;
    clearTimeout(Timeouts["game"]);
    $("#gameState").show().removeClass("fadeOutRight").addClass("fadeInLeft");
}

hud.hideGame = function(){
    hud.show.game = false;

    $("#gameState").removeClass("fadeInLeft").addClass("fadeOutRight");
    Timeouts["game"] = setTimeout(function(){
        $("#gameState").hide();
    }, 1000);
}

hud.showPlayer = function(){
    hud.show.player = true;
    clearTimeout(Timeouts["player"]);
    $("#playerState").show().removeClass("fadeOutRight").addClass("fadeInLeft");
}

hud.hidePlayer = function(){
    hud.show.player = false;

    $("#playerState").removeClass("fadeInLeft").addClass("fadeOutRight");
    Timeouts["player"] = setTimeout(function(){
        $("#playerState").hide();
    }, 1000);
}

hud.showSpectate = function(){
    hud.show.spectate = true;
    clearTimeout(Timeouts["spectate"]);
    $("#spectating").show().removeClass("fadeOutRight").addClass("fadeInLeft");
}

hud.hideSpectate = function(){
    hud.show.spectate = false;

    $("#spectating").removeClass("fadeInLeft").addClass("fadeOutRight");
    Timeouts["spectate"] = setTimeout(function(){
        $("#spectating").hide();
    }, 1000);
}

hud.showMoney = function(){
    hud.show.money = true;
    clearTimeout(Timeouts["money"]);
    $("#money").show().removeClass("fadeOutRight").addClass("fadeInLeft");
}

hud.hideMoney = function(){
    hud.show.money = false;

    $("#money").removeClass("fadeInLeft").addClass("fadeOutRight");
    Timeouts["money"] = setTimeout(function(){
        $("#money").hide();
    }, 1000);
}

hud.autoPause = setInterval(function(){
    hud.autoPauseInteval = setTimeout(function(){
        hud.paused = true;
        pauseTimer = setTimeout(function(){
            hud.pause();
        }, 0);
    }, 10000);
}, 10000);

hud.updateData = function(data){
    csgo.map = data.map;
    csgo.round.phase = data.map.phase;
    csgo.round.round = data.map.round;
    csgo.score.ct = data.map.team_ct.score;
    csgo.score.t = data.map.team_t.score;
    csgo.player = data.player;
    csgo.weapons = data.player.weapons;
    csgo.provider = data.provider; 

    clearInterval(hud.autoPauseInteval);

    if(csgo.player.activity == "playing" || csgo.player.activity == "textinput"){
        if(hud.paused){
            hud.paused = false;
            clearTimeout(pauseTimer);
            setTimeout(function(){
                hud.resume();
            }, 0);
        }
    }else{
        hud.paused = true;
        pauseTimer = setTimeout(function(){
            hud.pause();
        }, 0);
    }

    if(hud.show.multiKill){
        multiKill(csgo.player.state.round_kills);
    }

    if(hud.show.weapon){
        hud.drawWeapon();
    }

    if(hud.show.game){
        hud.drawGameState();
    }

    if (hud.show.player) {
        hud.drawPlayerState()
    }

    if (hud.show.spectate) {
        hud.drawSpectatingState();     
    }

    if(hud.show.money){
        hud.drawMoney();
    }
}

hud.drawWeapon = function(){
    let weapons = Object.values(csgo.weapons);
    weapons.forEach(function(weapon, i){
        if(weapon.state == "active"){
            $("#weapon").attr("class", "csgo-icon-lg-2 csgo-icon-" + weapon.name.substring(7, weapon.name.length));
            $("#weapon").css("text-shadow", "0 0 15px " + skins.getGradeColor(skins.getSkinGrade(weapon.name, weapon.paintkit)));
            if(weapon.ammo_clip_max != null){
                $("#clip").html(weapon.ammo_clip);
                $("#divider").html('/');
                $("#ammo").html(weapon.ammo_reserve);
            }else{
                $("#clip").html("");
                $("#divider").html("");
                $("#ammo").html("");
            }
        }
    });
}

hud.drawGameState = function(){
    $("#map").html(mapName(csgo.map.name));
    if(csgo.map.phase == "warmup"){
        $("#phase").html("Warmup");
    }else{
        $("#phase").html("Round " + (csgo.map.round + 1));
    }

    if(csgo.player.team == "CT"){
        $("#wins-1").html('CT ' + csgo.score.ct);
        $("#wins-1").attr("class", "ct");
        $("#wins-2").html(csgo.score.t + ' T');
        $("#wins-2").attr("class", "t");
    }else{
        $("#wins-1").html('T ' + csgo.score.t);
        $("#wins-1").attr("class", "t");
        $("#wins-2").html(csgo.score.ct + ' CT');
        $("#wins-2").attr("class", "ct");
    }
}

hud.drawMoney = function(){
    $("#money").html("$" + csgo.player.state.money);
}

hud.drawPlayerState = function(){
    $("#hp").html(csgo.player.state.health);
    $("#hp-bar").css("width", csgo.player.state.health + "%");
    if(csgo.player.state.health <= 20){
        $("#hp-bar").css("background-color", "red");
    }else if(csgo.player.state.health <= 50){
        $("#hp-bar").css("background-color", "yellow");
    }else{
        $("#hp-bar").css("background-color", "#037ffc");
    }
    
    if(csgo.player.state.helmet){
        $("#helmet").attr("src", "./helmet.png");
    }else{
        $("#helmet").attr("src", "./armor.png");
    }
    
    $("#armor").html(csgo.player.state.armor);
    $("#armor-bar").css("width", csgo.player.state.armor + "%");
    if(csgo.player.state.armor <= 20){
        $("#armor-bar").css("background-color", "red");
    }else if(csgo.player.state.armor <= 50){
        $("#armor-bar").css("background-color", "yellow");
    }else{
        $("#armor-bar").css("background-color", "#037ffc");
    }
    
    if(csgo.player.state.round_kills == 0){
        $("#kills").html("");
    }else if(csgo.player.state.round_kills <= 5){
        let output = "";
        for(let i = 0; i < csgo.player.state.round_kills; i++){
            output += '<i class="fas fa-skull"></i> ';
        }
        $("#kills").html(output);
    }else{
        $("#kills").html('<i class="fas fa-skull"></i> ' + csgo.player.state.round_kills);
    }

    $("#k").html(csgo.player.match_stats.kills);
    $("#a").html(csgo.player.match_stats.assists);
    $("#d").html(csgo.player.match_stats.deaths);
}

hud.drawSpectatingState = function(){
    let spectatingTimeout;
    if(csgo.player.steamid != csgo.provider.steamid){
        clearTimeout(spectatingTimeout);
        $("#spectating").show().removeClass("fadeOutRight").addClass("fadeInLeft");
    }else{
        $("#spectating").removeClass("fadeInLeft").addClass("fadeOutRight");
        spectatingTimeout = setTimeout(function(){
            $("#spectating").hide();
        }, 1000);
    }
}

function mapName(str){
    str = str.trim().toLowerCase();
    switch(str) {
        case "de_dust2":
            return "Dust 2";
            break;
        case "de_inferno":
            return "Inferno";
            break;
        case "de_cache":
            return "Cache";
            break;
        case "de_overpass":
            return "Overpass";
            break;
        case "de_cbble":
            return "Cobblestone";
            break;
        case "de_mirage":
            return "Mirage";
            break;
        case "de_train":
            return "Train";
            break;
        case "de_vertigo":
            return "Vertigo";
            break;
        default:
            if(str.length > 12){
                return str.substr(-12) + '...';
            }else{
                return str.substring();
            }
            break;
    }
}

var lastKill = 0;
var comboStarted = false;
var timeout;
var timeout2;
function multiKill(num){
    if(lastKill == num){
        return false;
    }
    lastKill = num;
    comboStarted = true;
    clearTimeout(timeout);
    clearTimeout(timeout2);
    var killMessage = "";
    if(comboStarted) {
        switch(lastKill){
            case 0:
            case 1:
                timeout = setTimeout(function(){
                    comboStarted = false;
                    $("#multikill").removeClass("fadeInLeft");
                    $("#multikill").addClass("fadeOutRight");
                    timeout2 = setTimeout(function(){
                        $("#multikill").hide();
                    }, 1000);
                }, 5000);
                return;
                break;
            case 2:
                killMessage = "Double Kill!";
                break;
            case 3:
                killMessage = "Triple Kill!";
                break;
            case 4:
                killMessage = "Quadra kill!";
                break;
            case 5:
                killMessage = "Penta kill!";
                break;
            default:
                killMessage = "Multi Kill!";
                break;
        }
        $("#multikill").show();
        $("#multikill").removeClass("fadeOutRight");
        $("#multikill").addClass("fadeInLeft");
        $("#multikill").html(killMessage);
        timeout = setTimeout(function(){
            comboStarted = false;
            $("#multikill").removeClass("fadeInLeft");
            $("#multikill").addClass("fadeOutRight");
            timeout2 = setTimeout(function(){
                $("#multikill").hide();
            }, 1000);
        }, 5000);
    }
}

module.exports = hud;
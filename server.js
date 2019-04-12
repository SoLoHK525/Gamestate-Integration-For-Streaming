gui = require('nw.gui'),
http = require('http');
debug = true;
fs = require('fs');

port = 1025;
host = '127.0.0.1';

var csgo = {
    map: "de_",
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
}

server = http.createServer(function (req, res) {
	if (req.method == 'POST') {
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});

		var body = '';
		req.on('data', function (data) {
			body += data;
		});
		req.on('end', function () {
			if (!!debug) {
				console.debug("POST payload: " + body);
			}
			execute(JSON.parse(body));
			res.end('');
		});

	} else {
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});
		res.end("Nothing to see here!");
	}

});

function execute(obj){
    csgo.map = obj.map.name;
    csgo.round.phase = obj.map.phase;
    csgo.round.round = obj.map.round;
    csgo.score.ct = obj.map.team_ct.score;
    csgo.score.t = obj.map.team_t.score;
    csgo.player.match_stats = obj.player.match_stats;
    csgo.player.state = obj.player.state;
    csgo.weapons = obj.player.weapons;
    print();
}

function print(){
    let weapons = Object.values(csgo.weapons);
    
    //Weapon Related
    weapons.forEach(function(weapon, i){
        if(weapon.state == "active"){
            $("#weapon").attr("class", "csgo-icon-lg-2 csgo-icon-" + weapon.name.substring(7, weapon.name.length));
            if(weapon.ammo_clip_max != null){
                $("#ammo").html(weapon.ammo_clip + " / " + weapon.ammo_reserve);
            }else{
                $("#ammo").html("");
            }
        }
    });
    
    //Round State Related 
    $("#t-wins").html(csgo.score.t);
    $("#ct-wins").html(csgo.score.ct);
    
    
    //Player Round State Related
    $("#kills").html(csgo.player.state.round_kills);
    $("#killhs").html(csgo.player.state.round_killhs);
    
    //Player State Related
    $("#k").html(csgo.player.match_stats.kills);
    $("#a").html(csgo.player.match_stats.assists);
    $("#d").html(csgo.player.match_stats.deaths);
}

server.listen(port);
console.log('Listening at http://' + host + ':' + port);
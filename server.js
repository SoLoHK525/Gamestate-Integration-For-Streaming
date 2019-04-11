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
    /*
    csgo.map = obj.map.name;
    csgo.round.phase = obj.map.phase;
    csgo.round.round = obj.map.round;
    csgo.score.ct = obj.map.team_ct.score;
    csgo.score.t = obj.map.team_t.score;
    csgo.player.state.health = obj.player.state.health;
    csgo.player.state.armor = obj.player.state.armor;
    csgo.player.state.helmet = obj.player.state.helmet;
    csgo.player.state.money = obj.player.state.money;
    csgo.player.state.round_kills = obj.player.state.round_kills;
    csgo.player.state.round_killhs = obj.player.state.round_killhs;
    */
    csgo.weapons = obj.player.weapons;
    print();
}

function print(){
    let weapons = Object.values(csgo.weapons);
    weapons.forEach(function(weapon, i){
        if(weapon.state == "active"){
            $("#weapon").html(weapon.name);
            $("#clip").html(weapon.ammo_clip);
            $("#ammo").html(weapon.ammo_reserve);
        }
    });
}

server.listen(port);
console.log('Listening at http://' + host + ':' + port);
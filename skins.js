const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./skins.json', "utf8"));
let skins = {}

skins.getSkinGrade = function (name, paintkit){
    switch(name){
        case "weapon_bayonet":
        case "weapon_knife_flip":
        case "weapon_knife_gut":
        case "weapon_knife_karambit":
        case "weapon_knife_m9_bayonet":
        case "weapon_knife_tactical":
        case "weapon_knife_butterfly":
        case "weapon_knife_falchion":
        case "weapon_knife_push":
        case "weapon_knife_survival_bowie":
        case "weapon_knife_ursus":
        case "weapon_knife_gypsy_jackknife":
        case "weapon_knife_stiletto":
        case "weapon_knife_widowmaker":
            return 6;
        default:
            if(name == "weapon_glock" || name == "weapon_hkp2000" || name == "weapon_usp_silencer" || name == "weapon_awp"){
                let num = data.paintkit_rarities[data.paintkit_names.indexOf(paintkit)];
                return num + 1;
            }
            return data.paintkit_rarities[data.paintkit_names.indexOf(paintkit)];
    }
}

skins.getGradeColor = function(grade){
    grade -= 1;
    switch(grade){
        case 0:
            return '#FFFFFF';
        case 1:
            return '#99CCFF';
        case 2:
            return '#0000FF';
        case 3:
            return '#800080';
        case 4:
            return '#FF00FF';
        case 5:
            return '#FF0000';
        case 6:
            return '#FFCC00';
        case 7:
            return '#FFCC99';
        default:
            return '#FFFFFF';
    }
}


module.exports = skins;
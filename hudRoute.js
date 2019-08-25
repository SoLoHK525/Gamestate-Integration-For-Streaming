const express = require('express');
let router = express.Router();

let show = {
    weapon: true,
    game: true,
    player: true,
    spectate: true,
    multiKill: true,
    money: true
}

io.on('showState', function(data){
    show = data;
});

router.get('/', (req, res, next) => {
    res.status(200).json(show);
})

router.put('/weapon/show', (req, res, next) => {
    io.emit('show', 'weapon');
    res.status(200).json({
        success: true
    });
});
router.put('/weapon/hide', (req, res, next) => {
    io.emit('hide', 'weapon');
    res.status(200).json({
        success: true
    });
});
router.put('/game/show', (req, res, next) => {
    io.emit('show', 'game');
    res.status(200).json({
        success: true
    });
});
router.put('/game/hide', (req, res, next) => {
    io.emit('hide', 'game');
    res.status(200).json({
        success: true
    });
});
router.put('/player/show', (req, res, next) => {
    io.emit('show', 'player');
    res.status(200).json({
        success: true
    });
});
router.put('/player/hide', (req, res, next) => {
    io.emit('hide', 'player');
    res.status(200).json({
        success: true
    });
});
router.put('/spectate/show', (req, res, next) => {
    io.emit('show', 'spectate');
    res.status(200).json({
        success: true
    });
});
router.put('/spectate/hide', (req, res, next) => {
    io.emit('hide', 'spectate');
    res.status(200).json({
        success: true
    });
});
router.put('/multikill/show', (req, res, next) => {
    io.emit('show', 'multikill');
    res.status(200).json({
        success: true
    });
});
router.put('/multikill/hide', (req, res, next) => {
    io.emit('hide', 'multikill');
    res.status(200).json({
        success: true
    });
});
router.put('/money/show', (req, res, next) => {
    io.emit('show', 'money');
    res.status(200).json({
        success: true
    });
});
router.put('/money/hide', (req, res, next) => {
    io.emit('hide', 'money');
    res.status(200).json({
        success: true
    });
});

router.put('/opacity/:value', (req, res, next) => {
    console.log(req.params.value);
    io.emit('opacity', req.params.value);
    res.status(200).json({
        success: true
    });
});


router.put('/color/:r/:g/:b', (req, res, next) => {
    let t = req.params;
    let color = [t.r, t.g, t.b];
    io.emit('color', color);
    res.status(200).json({
        success: true
    });
});

router.put('*', (req, res, next) => {
    res.status(404).json({
        success: false
    });
});
module.exports = router;
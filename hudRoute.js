let hud = require('./hud');
const express = require('express');
let router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json(hud.getShow());
})

router.put('/weapon/show', (req, res, next) => {
    hud.showWeapon();
    res.status(200).json({
        success: true
    });
});
router.put('/weapon/hide', (req, res, next) => {
    hud.hideWeapon();
    res.status(200).json({
        success: true
    });
});
router.put('/game/show', (req, res, next) => {
    hud.showGame();
    res.status(200).json({
        success: true
    });
});
router.put('/game/hide', (req, res, next) => {
    hud.hideGame();
    res.status(200).json({
        success: true
    });
});
router.put('/player/show', (req, res, next) => {
    hud.showPlayer();
    res.status(200).json({
        success: true
    });
});
router.put('/player/hide', (req, res, next) => {
    hud.hidePlayer();
    res.status(200).json({
        success: true
    });
});
router.put('/spectate/show', (req, res, next) => {
    hud.showSpectate();
    res.status(200).json({
        success: true
    });
});
router.put('/spectate/hide', (req, res, next) => {
    hud.hideSpectate();
    res.status(200).json({
        success: true
    });
});
router.put('/multikill/show', (req, res, next) => {
    hud.show.multiKill = true;
    res.status(200).json({
        success: true
    });
});
router.put('/multikill/hide', (req, res, next) => {
    hud.show.multiKill = false;
    res.status(200).json({
        success: true
    });
});
router.put('/money/show', (req, res, next) => {
    hud.showMoney();
    res.status(200).json({
        success: true
    });
});
router.put('/money/hide', (req, res, next) => {
    hud.hideMoney();
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
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // Render file views/partials/index.hbs lồng vào layouts/main.hbs mặc định
    res.render('partials/index'); 
});

module.exports = router;
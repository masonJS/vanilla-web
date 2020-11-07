(async () => {
    const express = require('express');
    const app = global.app = express();
    const loaders = require('./loaders')
    const scheduler = require('./jobs/scheduler');

    loaders(app)

    app.use((req, res, next) => {
        __ = res.__.bind(res);
        res.send = res.send.bind(res);
        res.json = res.json.bind(res);
        next();
    });

    require('./routers');
    require('./routers');
    scheduler();

    /**
     * Error handling middle ware
     */
    app.use((req, res, next) => {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use((err, req, res, next) => {
        if(err.message === 'Not authenticate') return res.redirect('/common/signin')

        if (!req.url.match('/api')) return res.redirect('/');

        res.status(err.status || 500);
        res.send(err.message);
    });

    const server = app.listen(3000, () => log('local app listening on port ' + server.address().port));
})();

app.get('/influencer/inf_campaign_apply', (req, res) => {
    // if (req.session.user.auth !== 'influencer') return res.redirect('/');

    res.send(TMPL.layout.hnmf({
        css: ``,
        header: ``,
        nav: ``,
        main: `
            캠페인 신청
        `,
        footer: ``,
        script: ``
    }));
});
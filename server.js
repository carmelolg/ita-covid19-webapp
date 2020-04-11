const express = require('express');

const app = express();

app.use(express.static('./dist'));


app.get('/.well-known/assetlinks.json', function(req, res, next) {
    res.set('Content-Type', 'application/json');
    res.status(200).send('./.well-known/assetlinks.json');
});

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/'}),
);

app.listen(process.env.PORT || 8080);

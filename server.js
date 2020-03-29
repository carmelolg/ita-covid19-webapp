const express = require('express');

const app = express();

app.use(express.static('./dist/ita-covid19-webapp'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/ita-covid19-webapp/'}),
);

app.listen(process.env.PORT || 8080);

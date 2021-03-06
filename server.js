let http = require('http');
let path = require('path');
let request = require('request');
let cors = require('cors');

let express = require('express');

let app = express();
let server = http.createServer(app);
const {PubgAPI, PubgAPIErrors, REGION, SEASON, MATCH} = require('pubg-api-redis');

app.use(express.static(path.resolve(__dirname, 'public')));
app.use('/comparator', express.static(path.join(__dirname + '/public/comparator.html')));
app.use(cors());

const api = new PubgAPI({
    apikey: process.env.APIKEY
});


app.get("/stats/:pubgname", (request, response, error) => {
    let name = request.params.pubgname;
    console.log("GET /stats/" + name);
    api.getProfileByNickname(name)
        .then((profile) => {
            const data = profile.content;
            /*
            const stats = profile.getStats({
              region: REGION.ALL, // defaults to profile.content.selectedRegion
              season: SEASON.EA2017pre3, // defaults to profile.content.defaultSeason
              match: MATCH.SOLO // defaults to SOLO
            });
            */
            response.send(data);
        })
        .catch((err) => {
            console.log("Error for " + name + ": " + err);
            response.status(404).send({
                msg: err
            });
        });
});

server.listen(process.env.PORT || 3000, function () {
    console.log("App started");
});

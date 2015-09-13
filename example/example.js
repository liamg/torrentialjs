
var TorrentFileParser = require('../lib/torrentFileParser.js');

var parser = new TorrentFileParser();

parser.parseFile('/home/liam/Downloads/sample.torrent', function(x){
    console.log(x);
});



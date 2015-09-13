var TorrentFileParser = function () {

};

TorrentFileParser.prototype.parseFile = function (path, callback) {

    var fs = require('fs');
    fs.readFile(path, function (err, data) {

        if (err) {
            throw new Error('Failed to read file');
        }

        this.parseData(data, callback);

    }.bind(this));

};

TorrentFileParser.prototype.parseData = function (data, callback) {

    var bencoding = require('./bencoding');

    var dict = bencoding.decode(data);

    var Torrent = require('./torrent');

    var torrent = new Torrent();

    torrent.addTracker(dict.announce);
    torrent.setCreationDate(dict['creation date']);
    torrent.setLength(dict.info.length);
    torrent.setName(dict.info.name);
    torrent.setPieceLength(dict.info['piece length']);
    torrent.setPieceHashes(dict.info.pieces);
    torrent.setPrivate(dict.info.private == 1);

    callback(Torrent);

};

module.exports = TorrentFileParser;
var Torrent = function () {
    this.name = '';
    this.trackers = [];
    this.creationDate = 0;
    this.length = 0;
    this.pieceLength = 65536;
    this.pieceHashes = [];
    this.private = false;
};


Torrent.prototype.addTracker = function (tracker) {
    this.trackers.push(tracker);
};
Torrent.prototype.setCreationDate = function (creationDate) {
    this.creationDate = creationDate;
};
Torrent.prototype.setLength = function (length) {
    this.length = length;
};
Torrent.prototype.setName = function (name) {
    this.name = name;
};
Torrent.prototype.setPieceLength = function (pieceLength) {
    this.pieceLength = pieceLength;
};
Torrent.prototype.setPieceHashes = function (pieceHashes) {
    // @todo split up and shiz
    this.pieceHashes = pieceHashes;
};
Torrent.prototype.setPrivate = function (isPrivate) {
    this.private = isPrivate;
};

module.exports = Torrent;

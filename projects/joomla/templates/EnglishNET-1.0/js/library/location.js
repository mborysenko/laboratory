function History() {
    this.hashes = [];

    this.hashes.push(location.hash)
}

History.prototype.compare = function (hash) {
    return (location.hash != this.hashes[this.hashes.length - 1]);
};

History.prototype.set = function (hash) {
    this.hashes.push(hash);
};

History.prototype.get = function () {
    return this.hashes[this.hashes.length - 1];
};

History.prototype.back = function () {
    var len = this.hashes.length;
    if (len > 1) {
        var h = this.hashes[len - 2].substring(1);
        this.hashes.splice(len - 1, 1);
        location.hash = h;
    }
    return false;
};

History.prototype.parseHash = function () {
    return location.hash.substring(1);
};

History.prototype.setHash = function (hash) {
    if (typeof hash != 'undefined') {
        return location.hash = '#' + hash;
    } else {
        return false;
    }
};

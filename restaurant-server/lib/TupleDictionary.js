function TupleDictionary() {
  this.dict = {};
}

TupleDictionary.prototype = {
  tupleToString: function (tuple) {
    return tuple.join(",");
  },

  add: function (tuple, val) {
    this.dict[this.tupleToString(tuple)] = [val];
  },

  put: function (tuple, val) {
    this.dict[this.tupleToString(tuple)] = [...this.dict[this.tupleToString(tuple)], val];
  },

  exists: function (tuple) {
    if (this.tupleToString(tuple) in this.dict) return true;
    return false;
  },

  getByKey: function (tuple) {
    return this.dict[this.tupleToString(tuple)];
  },

  get: function () {
    return this.dict;
  },
};

module.exports = TupleDictionary;

module.exports = function() {
    this.rootdir = __dirname;
};

require(__filename)();
require("./system/")();
require("./server/")();

//SIGINT = ctrl + c
process.on('SIGINT', () => {
    quit();
});
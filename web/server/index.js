module.exports = function() {
    //Custom config files
    require("./config/")();

    //Routing System
    require("./routes/")();
};
module.exports = function() {
    debug.detail(" - functions");
    
    this.isDefined = function(data)
    {
      if(typeof(data) == 'number' || typeof(data) == 'boolean')
      {
        return true;
      }
      if(typeof(data) == 'undefined' || data === null)
      {
        return false;
      }
      if(typeof(data.length) != 'undefined')
      {
        return data.length != 0;
      }
      var count = 0;
      for(var i in data)
      {
        if(data.hasOwnProperty(i))
        {
          count ++;
        }
      }
      return count != 0;
    }

    this.isAlphaNumeric = function(str) {
        var code, i, len;
      
        for (i = 0, len = str.length; i < len; i++) {
          code = str.charCodeAt(i);
          if (!(code > 47 && code < 58) && // numeric (0-9)
              !(code > 64 && code < 91) && // upper alpha (A-Z)
              !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
          }
        }
        return true;
    };

    this.sleep = require('util').promisify(setTimeout); //ASYNC
}
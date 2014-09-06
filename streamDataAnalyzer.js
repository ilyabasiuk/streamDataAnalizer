

var streamDataAnalizer = function(settings) {
      var cache = {},
          defaultOptions = {expiredTime : 60000},
          isKeyTooOld = function(timestamp, key) {
              var deltaTime = timestamp - key;
              return deltaTime >  defaultOptions.expiredTime;
          },
          getActualData = function(timestamp) {
              var isActual =  function(key) {
                    return timestamp -key <=defaultOptions.expiredTime;
              }, data;
              data =  Object.keys(cache).filter(function(key) {
                    if (isKeyTooOld(timestamp, key)) {
                        delete cache[key];
                        return false;
                    } else {
                         return true;
                    }})
                  .filter(isActual)
                  .reduce(function(actualData, currentKey) {
                     return  actualData.concat(cache[currentKey]);
                  },[]);

               return data;
          },
          getValue =  function(timestamp) {
              var data = getActualData(timestamp);
              return data.length;
          };
      return {
          add: function(timestamp, value) {
             !cache[timestamp] && (cache[timestamp] = []);
             cache[timestamp].push(value);
          },
          get: function(timestamp) {
              !timestamp && (timestamp = Date.now());
              return getValue(timestamp);
          }
      }
};

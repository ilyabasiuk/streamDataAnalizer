var streamDataAnalizer = function(settings) {
      var cache = {},
          defaultOptions = {
              expiredTime : 60000,
              defaultValue : 10
          },
          options = Object.keys(defaultOptions).reduce(function(cache, optionName) {
              cache[optionName] = settings[optionName] || defaultOptions[optionName];
              return cache;
          }, {}),
          isKeyTooOld = function(timestamp, key) {
              var deltaTime = timestamp - key;
              return deltaTime >  options.expiredTime;
          },
          getActualData = function(timestamp) {
              var isActual =  function(key) {
                    return timestamp -key <= options.expiredTime;
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
          getAvgValue = function(data) {
              var avg = data.reduce(function(prevVal, curVal){
                return prevVal + curVal;
              },0)/data.length;

              return avg;
          },
          getValue =  function(timestamp) {
              var data = getActualData(timestamp);
              if (data.length < 3) {
                  return options.defaultValue;
              } else {
                  return getAvgValue(data)
              };
          };
      return {
          add: function(value, timestamp) {
             !timestamp && (timestamp = Date.now());
             !cache[timestamp] && (cache[timestamp] = []);
             cache[timestamp].push(value);
          },
          get: function(timestamp) {
              !timestamp && (timestamp = Date.now());
              return getValue(timestamp);
          },
          getMed: function(timestamp) {
              !timestamp && (timestamp = Date.now());
              var data = getActualData(timestamp),
                  avgVal =  getAvgValue(data);

                  data = data.filter(function(value) {
                      return  2* avgVal > value;
                  });

              if (data.length < 3) {
                 return options.defaultValue;
              } else {
                data.sort(function(a,b) {return a-b});
                return data[(data.length >> 1) +1] * 1.5;
              }
          }
      }
};

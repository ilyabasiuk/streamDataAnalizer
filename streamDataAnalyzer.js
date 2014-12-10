var streamDataAnalizer = function(settings) {
      var activeCache = function() {
              var cache = {},
                  isKeyTooOld = function(timestamp, key) {
                      var deltaTime = timestamp - key;
                      if (deltaTime >  options.expiredTime){
                          return true;
                      } else {
                          return false;
                      }
                  };
              return {
                  add: function(value, timestamp) {
                      !cache[timestamp] && (cache[timestamp] = []);
                      cache[timestamp].push(value);
                  },
                  getActual: function(timestamp) {
                      var isActual = function(key) {
                          return !isKeyTooOld(timestamp, key);
                      };

                      return Object.keys(cache).filter(isActual).reduce(function(actualData, currentKey) {
                            return  actualData.concat(cache[currentKey]);
                      },[]);
                  }
              }
          }(),
          defaultOptions = {
              expiredTime : 60000,
              defaultValue : 10,
              minCount : 3
          },
          options = Object.keys(defaultOptions).reduce(function(cache, optionName) {
              cache[optionName] = settings[optionName] || defaultOptions[optionName];
              return cache;
          }, {}),
          getAvgValue = function(data) {
              var avg = data.reduce(function(prevVal, curVal){
                return prevVal + curVal;
              },0)/data.length;

              return avg;
          },
          getValue =  function(timestamp) {
              var data = activeCache.getActual(timestamp);
              if (data.length < options.minCount) {
                  return options.defaultValue;
              } else {
                  return getAvgValue(data)
              };
          };
      return {
          add: function(value, timestamp) {
             !timestamp && (timestamp = Date.now());
             activeCache.add(value, timestamp);
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

              if (data.length < options.minCount) {
                 return options.defaultValue;
              } else {
                data.sort(function(a,b) {return a-b});
                return data[(data.length >> 1) +1] * 1.5;
              }
          }
      }
};

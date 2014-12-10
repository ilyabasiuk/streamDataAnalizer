
var defaultStrategies = {
        avg : function(data) {
           return data.reduce(function(sum, value) {
                   return sum+=value;
                },0)/data.length;
        },
        getMed : function(data) {
        var avgVal =  data.reduce(function(sum, value) {
               return sum+=value;
            },0)/data.length;

            data = data.filter(function(value) {
                return  2* avgVal > value;
            });

        if (data.length < options.minCount) {
           return options.defaultValue;
        } else {
          data.sort(function(a,b) {return a-b});
          return data[(data.length >> 1) +1] * 1.5;
        }
    };
}

const moment = require('moment');
module.exports = {
    select:function(params, options){
        return options.fn(this).replace(new RegExp(' value=\"' + params + '\"' ), '$&selected="selected"');
    },
    dateFormat:function(date, format){

        return moment(date).format(format);

    }
}
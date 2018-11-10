module.exports = {
    select:function(params, options){
        return options.fn(this).replace(new RegExp(' value=\"' + params + '\"' ), '$&selected="selected"');
    }
}
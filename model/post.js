const mongoose = require('mongoose');

let postSchema = mongoose.Schema({

    title:  {type:String,required:true},
    

    image: {type:String},

});

module.exports = mongoose.model('Post', postSchema);
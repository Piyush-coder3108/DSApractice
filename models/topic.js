const mongoose=require('mongoose');

const topicSchema=new mongoose.Schema({

   name:{
       type: String,
       required: true
   },
   questions: [
       {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
       }
   ]

});

const Topic=new mongoose.model('Topic',topicSchema);
module.exports=Topic;
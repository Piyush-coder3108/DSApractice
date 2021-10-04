const mongoose=require('mongoose');
const questionSchema=new mongoose.Schema({

  name:{
      type: String,
      required: true
  },
  link:{
      type: String,
      required: true
  },
  approaches:[
      {
          content:{
              type: String,
          },
          by:{
              type: String
          }
      }
  ],
  postedby:{
      type: String
  }

});

const Question=new mongoose.model('Question',questionSchema);
module.exports=Question;
const express = require('express');
const app = express();
require('dotenv').config();

// Database setting

const mongoose = require('mongoose');

const connectDB = async () => {

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB connected  :)`);
    }
    catch (err) {
        console.log(err);
        process.exit(1);

    }
}

connectDB();

const Topic = require('./models/topic');
const Question = require('./models/question');


//body parser
app.use(express.urlencoded({ extended: true }));

// Setting view Engine
app.set('view engine', 'ejs');



// Routes
app.get('/', (req, res) => {
    Topic.find({})
    .then(topics=>{
        return res.render('index',{
            topics
        });
    })
    .catch(err=>{
        console.log(err);
        return;
    })
});

app.post('/add/topic', (req, res) => {
    var topicname = req.body.topic;
    var newname = "";
    for (var i = 0; i < topicname.length; i++) {
        if (topicname[i] == " ") {
            newname += '&';
        }
        else {
            newname += topicname[i];
        }
    }
    topicname=newname;
    Topic.findOne({ name: topicname })
        .then(t => {
            if (t) {
                return res.redirect('/');
            }
            else {

              
                const newtopic = new Topic({
                    name: topicname
                });
                newtopic.save();
                setTimeout(()=>{
                    return res.redirect('/');
                },300);
                
            }
        })
        .catch(err => {
            console.log(err);
            return res.redirect('/');
        })

});

app.get('/:tpname',(req,res)=>{
    const {tpname}=req.params;
    Topic.findOne({name:tpname})
    .populate({
        path:'questions'
    })
    .exec((err,result)=>{
        if(err){
            console.log(err);
            return res.redirect('/');
        }
        return res.render('topic',{
            topic: result
        })
    })
   
});

app.post('/add/question',(req,res)=>{
    const{topic,questionname,questionlink,postedby}=req.body;
    const newques=new Question({
        name: questionname,
        link: questionlink,
        postedby: postedby
    });
    newques.save();
    Topic.findOne({name:topic})
    .then(t=>{
        t.questions.push(newques);
        t.save();
        setTimeout(()=>{
           return res.redirect(`/${topic}`);
        },300);
        
    })
    .catch(err=>{
        console.log(err);
        res.redirect('/');
    })
});


app.get('/questions/:id',(req,res)=>{
    Question.findById(req.params.id)
    .then((q)=>{
        res.render('question',{
            question: q
        })
    })
    .catch(err=>{
        console.log(err);
        res.redirect('/');
    })
});

app.post('/add/approach',(req,res)=>{
    
    Question.findById(req.body.questionid)
    .then(q=>{
        const ap={
            content: req.body.approach,
            by: req.body.postedby
        }
        q.approaches.push(ap);
        q.save();
        setTimeout(()=>{
            return res.redirect(`/questions/${req.body.questionid}`);
        },300);
        
    })
    .catch(err=>{
        console.log(err);
        res.redirect('/');
    })
    
})




// Listening server
const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
    console.log(`Server running at PORT: ${PORT}`);
})
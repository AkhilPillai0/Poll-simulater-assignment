const express = require("express");
const path = require('path');
const hbs  = require('hbs');

let candidates = [];  // to store all the candidates
let result = [];         // store result of winner and second up
let votes = new Set();      //to store votes and also validate no duplicate entry
let totalcandidate = 0;   // store total number of candidates
let first=0,second=0,i=0,j=0;  // it stores the index of winner , second up/looser


const app = express();

// PORT
const PORT = process.env.PORT || 3000;

// setup path for view 
app.set('views', path.join(__dirname, '/view'));
app.set('view engine', 'hbs');   // used hbs/handlebars 

app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.get('/',function(req,res){
  res.render('homepage');
});

app.get('/addCandidates',function(req,res){
  res.render('addCandidates',{cans: candidates});
});

app.post('/add',function(req,res){
    candidates.push({name:req.body.name, votes:0});
    totalcandidate++;
    
});

app.get('/vote',function(req,res){
  res.render('vote',{cans: candidates, msg:""});  
});

app.post('/votec', function(req,res){

    if(votes.has(req.body.id)){
        res.render('vote',{cans: candidates, msg: "you have already voted!"});
    }
    else {
        votes.add(req.body.id);
        for(let i = 0; i< totalcandidate; i++){
            if(candidates[i].name == req.body.vote){
                candidates[i].votes++;
            }
        }
        res.render('vote',{cans: candidates, msg: "your vote has been recorded successfully"});
        
    }
    res.render('pollresult',{voteres: result});
});

app.get('/pollresult',function(req,res){

    if(candidates.length == 0){
    res.redirect("/");
    }

 for(let i=0;i<totalcandidate;i++){
     if(candidates[i].votes > i){
         j = i;second = first;
         i = candidates[i].votes;
         first = i;
     } else if(candidates[i].votes < i && candidates[i].votes > j){
        j = candidates[i].votes;
        second = i;
     }
 }

 result.push({name: candidates[first].name, votes: candidates[first].votes});
 result.push({name: candidates[second].name, votes: candidates[second].votes});
 res.render('pollresult',{voteres: result});
});

app.get('/votingsummary', function(req,res){
   res.render('votingsummary',{cans: candidates});
});

(async function runServer(){
    //connecting to the node server
    await app.listen(PORT);
    console.log(`Server starting at PORT ${PORT}`);
})();
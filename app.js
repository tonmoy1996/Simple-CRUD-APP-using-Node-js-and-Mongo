const express=require('express')
const path=require('path')
const bodyParser= require('body-parser')
const port=3000
const mongoose= require('mongoose')

let Article=require('./models/article')


mongoose.connect('mongodb://localhost/nodedb',{ useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log("database connect successfully"))
.catch(err=>console.error("Error occurs",err))

let db=mongoose.connection;

// db.once('open',function(){
//     console.log('connected')
// })

const app=express();

//bring in models

app.set('views', path.join(__dirname,'views'));

app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));

//bodyparser
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

//routes

app.get('/',(req,res)=>{

    Article.find({},function(err,articles){
        if(err)
        {
            console.log(err)
        }
        else{
        res.render('index.ejs',{
        title:'Article',
        articles: articles,
       
       });  
        }
    });
 
});


app.get('/articles/add',function(req,res){
    res.render('add_article');
})

app.post('/articles/add',function(req,res){

   let article=new Article();
   article.title= req.body.title;
   article.author=req.body.author;
   article.body=req.body.body;
   article.save((err)=>{

    if (err){console.log(err)
    }
    else{
  
         res.redirect('/')
  }
   })
})

//detail

app.get('/articles/detail/:id',function(req,res){
  
     Article.findById(req.params.id, function(err,article){
     
        if(err){console.log(err)}  
        else{

            res.render('detail',{
                article: article
            });
        }
    })

});

//update 

app.get('/articles/edit/:id',(req,res)=>{

    Article.findById(req.params.id,function(err,article){

        if (err){return }
        else{
             res.render('edit',{
                 article:article
             });
        }
    })
});

//update post 
app.post('/articles/edit/:id',function(req,res){

    let article={};

    article.title= req.body.title;
    article.author=req.body.author;
    article.body=req.body.body;

    let query={_id: req.params.id}
    

    Article.update(query,article,(err)=>{

     if (err){console.log(err);  return;}
     else{
   
          res.redirect('/')
         }
    })
 })

 //delete
 app.use('/articles/delete/:id',(req,res)=>{
    Article.findById(req.params.id,function(err,article){
        if (err){return }
        else{
             res.render('delete',{
                 article:article
             });
        }
    })
 })

//delete post

app.get('/delete/:id',(req,res)=>{
 

   let query= {_id: req.params.id}
   Article.remove(query,(err)=>{

    if(err){console.log(err)}
    else{
        console.log("successfully deleted")
        res.redirect('/')
    }
   })
   

});




app.listen(port,()=>{
    console.log(`server start at ${port}`)
})
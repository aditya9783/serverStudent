let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
    res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  next();
});
const port =process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));
let {studentsData}=require("./std");
let fs=require("fs");
let fname="std1.json";

app.get("/svr/resetData",function(req,res){
    let data=JSON.stringify(studentsData);
    fs.writeFile(fname,data,function(err){
        if(err) res.status(404).send(err);
        else res.send("Data in file is Reset")
    })
});
app.get("/svr/students",function(req,res){
    fs.readFile(fname,"utf8",function(err,data){
        if(err) console.log(err);
        else{
            let studentArray=JSON.parse(data);
            res.send(studentArray);
        }
       

    })
})
app.get("/svr/students/:id",function(req,res){
    let id= +req.params.id
    fs.readFile(fname,"utf8",function(err,data){
        if(err) console.log(err);
        else{
            let studentArray=JSON.parse(data);
            let std=studentArray.find(st=>st.id===id)
            if(std) res.send(std);
            else res.status(404).send("No Student Found");
        }
       

    })
})
app.get("/svr/students/course/:name",function(req,res){
    let name= req.params.name
    fs.readFile(fname,"utf8",function(err,data){
        if(err) console.log(err);
        else{
            let studentArray=JSON.parse(data);
            let std=studentArray.filter(st=>st.course===name)
            if(std) res.send(std);
            
        }
       

    })
})

app.post("/svr/students",function(req,res){
    let body=req.body;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) console.log(err);
        else{
            let studentArray=JSON.parse(data);
            let maxId=studentArray.reduce((acc,curr)=>(curr.id>acc ? curr.id : acc),0);
            let newId=maxId + 1;
            let newStudent= {...body,id:newId};
            studentArray.push(newStudent);
            let data1=JSON.stringify(studentArray)
            fs.writeFile(fname,data1,function(err){
                if(err) res.status(404).send(err)
                else{
                    res.send(newStudent);
                }
            })
        }
    })
})

app.put("/svr/students/:id",function(req,res){
    let body=req.body;
    let id= +req.params.id
    fs.readFile(fname,"utf8",function(err,data){
        if(err) console.log(err);
        else{
            let studentArray=JSON.parse(data);
            let index=studentArray.findIndex(st=>st.id===id);
            if(index>0){
                let updatedStd={...studentArray[index],...body};
                studentArray[index]=updatedStd;
                let data1=JSON.stringify(studentArray);
                fs.writeFile(fname,data1,function(err){
                    if(err) res.status(404).send(err);
                    else res.send(updatedStd);
                })
            }
            else{
                res.status(404).send("No Student Found");
            }
        }
    })
})

app.delete("/svr/students/:id",function(req,res){
    let id= +req.params.id
    fs.readFile(fname,"utf8",function(err,data){
        if(err) console.log(err);
        else{
            let studentArray=JSON.parse(data);
            let index=studentArray.findIndex(st=>st.id===id);
            console.log(index);
           
            if(index>0){
               let deletedStd=studentArray.splice(index,1);
               let data1=JSON.stringify(studentArray)
               console.log(deletedStd);
                fs.writeFile(fname,data1,function(err){
                    if(err) res.status(404).send(err);
                    else res.send(deletedStd);
                })
            }
            else{
                res.status(404).send("No Student Found");
            }
        }
    })
})
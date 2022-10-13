const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const fetch = require("node-fetch");

const app = express();

const Token = "5021449964549308/";
const APIURL = "https://www.superheroapi.com/api/"+Token;
const options = {
    "method": "GET"
};

app.set('view engine', 'ejs');
app.set('views', __dirname + '/Views');

app.use(express.static("Public"));

app.use(express.urlencoded({
    extended: true
}))

app.set('port', process.env.PORT || 5000);

const PORT = 5000;

var recents = [];

app.get('/', (req,res)=>{
    res.redirect("index");
})

app.get('/ViewAll', async (req,res)=>{
    const page = (req.query["page"]);
    if(page>0 && page<123){
        const id = [];
        for(var i=(6*(page-1)+1);i<((6*page)+1);i++){
            if(i>731){
                break;
            }else{
                id.push(i);
            }
        };
        biography=[];
        image=[];
        names=[];
        isError = false;
        for(var i=0;i<id.length;i++){
            const data = await fetch(APIURL+id[i], options)
                .then(res => res.json())
                .catch(err =>{
                    console.log(APIURL+id[i]);
                    isError = true;
                });
            if(!isError){
                biography.push(data.biography);
                image.push(data.image);
                names.push(data.name);
            }
        }
        if(isError){
            res.redirect("/error");
        }else{
            res.render("viewallpage",{page: page, name: names, biography: biography, image: image, id: id});
        }
    }else{
        res.sendFile(__dirname + "/Public/error.html");
    }
})

app.get('/ViewOne', async (req,res)=>{
    const cid = (req.query["id"]);
    if(cid>0 && cid<732){
        const id = [];
        if(cid==1){
            id.push(731);
        }else{
            id.push(cid-1);
        }
        id.push(parseInt(cid));
        if(cid==731){
            id.push(1);
        }else{
            id.push( (+cid + +1) );
        }
        powerstats=[];
        biography=[];
        appearance=[];
        work=[];
        connections=[];
        image=[];
        names=[];
        isError = false;
        for(var i=0;i<id.length;i++){
            const data = await fetch(APIURL+id[i], options)
                .then(res => res.json())
                .catch(err =>{
                    isError = true;
                });
            if(!isError){
                powerstats.push(data.powerstats);
                biography.push(data.biography);
                appearance.push(data.appearance);
                work.push(data.work);
                connections.push(data.connections);
                image.push(data.image);
                names.push(data.name);
            }
        }
        
        if(recents.length>=6 && recents.indexOf(id[1])==-1){
            recents.splice(0,1);
        }
        if(recents.length<6 && recents.indexOf(id[1])==-1){
            recents.push(id[1]);
        }
        if(isError){
            res.redirect("/error");
        }else{
            res.render("viewone",{stats: powerstats, appearance: appearance, work: work, connections: connections,name: names, biography: biography, image: image, id: id});
        }
    }else{
        res.sendFile(__dirname + "/Public/error.html");
    }
})

app.get('/RecentViews', async (req,res)=>{
    biography=[];
    image=[];
    names=[];
    isError = false;
    for(var i=0;i<recents.length;i++){
        const data = await fetch(APIURL+recents[i], options)
            .then(res => res.json())
            .catch(err =>{
                isError = true;
            });
        if(!isError){
            biography.push(data.biography);
            image.push(data.image);
            names.push(data.name);
        }
    }
    if(isError){
        res.redirect("/error");
    }else{
        res.render("recentviews",{name: names, biography: biography, image: image, id: recents});
    }
})

app.get('/Search', (req,res)=>{
    res.render("search");
})

app.post('/ViewSearch', async (req,res)=>{
    sname = req.body.searchPar;
    id = [];
    biography=[];
    image=[];
    names=[];
    isError = false;
    if(sname){
        const data = await fetch(APIURL+"/search/"+sname, options)
            .then(res => res.json())
            .catch(err =>{
                isError = true;
            });
        if(!isError){
            for(var i=0;i<data.results.length;i++){
                id.push(data.results[i].id);
                biography.push(data.results[i].biography);
                image.push(data.results[i].image);
                names.push(data.results[i].name);
            }
        }
    }
    if(sname){
        sname=sname;
    }else{
        sname = "None";
    }
    if(isError){
        res.redirect("/error");
    }else{
        res.render("viewsearch", {sname: sname, id: id, name: names, biography: biography, image: image});
    }
})

app.get('/error', (req,res)=>{
    res.sendFile(__dirname + "/Public/error2.html");
})

app.get('*', function(req, res){
    res.sendFile(__dirname + "/Public/error.html");
});

app.listen(process.env.PORT || 5000, ()=>{
    console.log("Server in port", PORT);
})


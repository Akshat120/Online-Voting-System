const votesCollection = require('../db').db().collection("vote")
const ObjectId = require('mongodb').ObjectId;
const validator = require('validator');
const keygen = require('keygenerator');
let Vote = function(data){
    this.data = data;
    this.errors = [];
}


Vote.prototype.cleanUp = function(){
    if(typeof(this.data.title)!="string") this.data.title="";
    if(typeof(this.data.desc)!="string") this.data.title="";
    if(typeof(this.data.noofcandidate)!="string") this.data.noofcandidate=0;
    if(typeof(this.data.voters)!="string") this.data.voters=0;
    if(typeof(this.data.candidate)!="object") this.data.candidate = []; 
    this.data = {
        title:this.data.title,
        desc:this.data.desc,
        noofcandidate: Number(this.data.noofcandidate),
        voters: Number(this.data.voters),
        candidate:this.data.candidate
    }
}
Vote.prototype.isRepeated = function() {
   let candidate = this.data.candidate;
   for(let i=0;i<candidate.length;i++)
   {
       for(let j=i+1;j<candidate.length;j++)
       {
           if(candidate[i] == candidate[j]) return true;
       }
   }
   return false;
}

Vote.prototype.areEmail = function(){

    let candidate = this.data.candidate;
    for(let i=0;i<candidate.length;i++)
    {
        if(!validator.isEmail(candidate[i])) return false; 
    }  
    return true;
}

Vote.prototype.validate = function(){
    if(this.data.title == "") this.errors.push("Title is Required")
    if(this.data.desc == "") this.errors.push("Desciption is Required")
    console.log(this.data.noofcandidate,this.data.candidate.length);
    if(this.data.noofcandidate <= 1 || this.data.candidate.length <= 1) this.errors.push("Minimum 2 candidates required.")
    if(this.data.voters < this.data.noofcandidate+1) this.errors.push("Voters cannot be less than candidates.")
    if(!this.areEmail()) this.errors.push("Emails required for candidates.")
    if(this.isRepeated()) this.errors.push("Candidates are repeated.")
}

Vote.prototype.createprocess = function(id){
    return new Promise(async (resolve,reject)=>{
        console.log(this.data);
        this.cleanUp();
        this.validate();
    
        if(!this.errors.length)
        {
            let votecode = keygen._();
            let candcode = keygen._(); 
            console.log(this.data);
            let vote_count = [];
            for(let i=0;i<this.data.noofcandidate;i++) {vote_count.push(0);}
            await votesCollection.insertOne({
                conductor_id:ObjectId(id),
                title:this.data.title,
                desc:this.data.desc,
                voters:this.data.voters,
                noofcandidate:this.data.noofcandidate,
                vote_count:vote_count,
                candidate:this.data.candidate,
                vote_code:votecode,
                candidate_code:candcode,
                voted:0,
                voter:[],
            }).then((data)=>{
                resolve(data); 
            }).catch((err)=>{
                reject([err]); 
            })            
        } else {
            reject(this.errors);
        }
    })
}

Vote.getallprocess = function(id) {
    return new Promise(async (resolve,reject)=>{
        id = ObjectId(id);
        await votesCollection.find({conductor_id:id}).toArray().then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject(err);
        })      
    })

}
Vote.find = function(id){
    return new Promise(async (resolve,reject)=>{
        id = ObjectId(id);
        await votesCollection.findOne({_id:id}).then((data)=>{
            if(data)
            {
                resolve(data);                
            }
            else
            {
                reject('No Vote_Process Found.')
            }
        }).catch((err)=>{
            reject(err);
        })
    })
}
module.exports = Vote;















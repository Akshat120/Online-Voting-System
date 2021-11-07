const usersCollection = require('../db').db().collection("vote")
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
            let code = keygen._();
            console.log(this.data);
            await usersCollection.insertOne({
                title:this.data.title,
                desc:this.data.desc,
                noofcandidate:this.data.noofcandidate,
                voters:this.data.voters,
                candidate:this.data.candidate,
                vote_code:code,
                conductor_id:ObjectId(id)
            }).then((data)=>{
                resolve(code);
            }).catch((err)=>{
                reject([err]); 
            })            
        } else {
            reject(this.errors);
        }
    })
}

module.exports = Vote;















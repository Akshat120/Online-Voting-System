const noofcandidate = document.getElementById("noofcandidate")
const candidates = document.getElementById("candidates")
noofcandidate.addEventListener("change",(event)=>{
    let n = event.target.value;
    n = (n<2)?2:n;
    n = (n>10)?10:n;
    let innerHTML = "";
    for(let i=1;i<=n;i++)
    {     
        innerHTML += `<div class="form-group">
        <label for="candidate${i}">Candidate ${i}: </label>
        <input type="email" class="form-control" id="candidate${i}" name="candidate" >
        </div>  `
    }    
    candidates.innerHTML = innerHTML
})


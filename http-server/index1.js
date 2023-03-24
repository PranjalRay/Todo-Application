let users=[];
function displayUsers()
  {
   let html1="";
     users.forEach((user)=>{
     if(user.name&&user.email&&user.password&&user.dob&&user.terms)
     {
        html1+="<tr>";
        html1+=`<td>${user.name}</td>`;
        html1+=`<td>${user.email}</td>`;
        html1+=`<td>${user.password}</td>`;
        html1+=`<td>${user.dob}</td>`;
        html1+=`<td>${user.terms}</td>`;
        html1+="</tr>";
     }
     });
      console.log(html1);
      document.querySelector("#userTableBody").innerHTML=html1;
  }
function calAge(date1)
  {
      const dob1=new Date(date1);
      const diff1=Date.now()-dob1.getTime();
      const age1=new Date(diff1);
      return Math.abs(age1.getUTCFullYear()-1970);
  }
function handleSubmit(event)
  {
    event.preventDefault();
    const name=document.querySelector("#name").value;
    const email=document.querySelector("#email").value;
    const password=document.querySelector("#password").value;
    const dob=document.querySelector("#dob").value;
    const terms=document.querySelector("#terms").checked;
    const age1=calAge(dob);
    if(age1<18||age1>55)
      {
        alert("You must be between 18 and 55 years old to register.");
        return;
      }
    const emailR=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailR.test(email)) 
      {
        alert("Invalid email address format.");
        return;
      }
    if (!terms)
      {
        users.push({ name, email, password, dob, terms: "false" });
      } 
      else
      {
        users.push({ name, email, password, dob, terms: "true" });
      }
    console.log(users);
    localStorage.setItem("users", JSON.stringify(users));
    document.querySelector("#registrationForm").reset();
    displayUsers();
  }
document.addEventListener("DOMContentLoaded",()=>{
  const storedUsers1=localStorage.getItem("users");
  if(storedUsers1)
    {
      users = JSON.parse(storedUsers1);
      displayUsers();
    }
  });
document.querySelector("#registrationForm").addEventListener("submit", handleSubmit);
document.querySelector("#clearTableBtn").addEventListener("click", () => {
  users = [];
  localStorage.removeItem("users");
  displayUsers();
  })
let name;
let age;
let Weight;
let height;
let password;
let data;
let Repassword;

function uploadData(){

    name=document.getElementsByClassName("name");
    email=document.getElementsByClassName("email");
    age=document.getElementsByClassName("age");
    height=document.getElementsByClassName("height");
    Weight=document.getElementsByClassName("weight");
    password=document.getElementsByClassName("password");
    Repassword=document.getElementsByClassName("Re-password");

    var atposition=email[0].value.indexOf("@");  
    var dotposition=email[0].value.lastIndexOf(".");  

    if(password==Repassword && atposition<1 || dotposition<atposition+2 || dotposition+2>=name[0].value.length)
    {
       $.ajax({
        url: 'http://localhost:8000/add',
        type: 'POST',
        dataType: 'json',
        data: { 
         'name': name[0].value, 
         'email':email[0].value,
         'age' : age[0].value,
         'height' : height[0].value,
         'Weight' : Weight[0].value,
         'password':password[0].value
        } ,
        success: function (response) {
            alert(response.status);
        }
    }); 
    }

}

function checkLogin()
{
    name=document.getElementsByClassName("name");
    password=document.getElementsByClassName("password");

    console.log(name[0].value);
    console.log(password[0].value);
 
    var atposition=name[0].value.indexOf("@");  
    var dotposition=name[0].value.lastIndexOf(".");  

    if (atposition<1 || dotposition<atposition+2 || dotposition+2>=name[0].value.length){  

        alert("Please enter a valid e-mail address");  
      
    }
    else
    {
          $.ajax({
            url: 'http://localhost:8000/',
            type: 'POST',
            dataType: 'json',
            data: { 
            'name': name[0].value, 
            'password' : password[0].value,
            }
        });
    }
        

   
    
}


$(document).ready(function(){
    $.ajax({ 
        url:'http://localhost:8000/'
       }).done(function(dataNew) {
        data=dataNew; 
        console.log(data);
 });


})
//Declaring the global variables
let name;
let age;
let Weight;
let height;
let password;
let data;
let Repassword;
let desiredWeight;
let perDayMenu
let eggQuantity
let numberOfTimeUserTookMenu = 0;
let we;


// getting the profile data from user and storing those data in global variable
function uploadData(){
    name=document.getElementsByClassName("name");
    email=document.getElementsByClassName("email");
    age=document.getElementsByClassName("age");
    height=document.getElementsByClassName("height");
    Weight=document.getElementsByClassName("weight");
    desiredWeight=document.getElementsByClassName("desiredWeight");
    password=document.getElementsByClassName("password");
    Repassword=document.getElementsByClassName("Re-password");
    let atposition=email[0].value.indexOf("@");  
    let dotposition=email[0].value.lastIndexOf(".");  
    console.log(desiredWeight[0].value);
    if(Weight > desiredWeight){
        a = Weight
        b = desiredWeight;
    }
    else{
        b = Weight
        a = desiredWeight;
    } 

    //setting the condition for all the user input fields
    if((name[0].value=="" && email[0].value=="" && age[0].value=="" && height[0].value=="" && Weight[0].value==""
    && password[0].value==""))
    {
        alert("Fill the data..");    
    }

    else if (atposition<1 || dotposition<atposition+2 || dotposition+2>=email[0].value.length){  
        alert("Please enter a valid Email"); 
    }

    else if(!(password[0].value === Repassword[0].value)){
        alert("Password does not matchs"); 
    }

    else if ( ((a - b) < 0 ) && ((a -b) >= 10 ) ){
        alert("Enter valid Desired Weight.."); 
    }

    //Passing the user details to the server using the ajax call
    else{   
        $.ajax({
            // url: 'https://myshapetime.herokuapp.com/add',
            url: 'http://localhost:8000/add',
            type: 'POST',
            dataType: 'json',
            data: { 
                'name': name[0].value, 
                'email':email[0].value,
                'age' : age[0].value,
                'height' : height[0].value,
                'Weight' : Weight[0].value,
                'desiredWeight' : desiredWeight[0].value,
                'password':password[0].value
            }
        })
        // if ajax call is success then relocating the page to index page
        .done(function(data){
            if(data.msg=="success")
            {
                location.replace("/index.html");
            }
            else if(data.msg=="Email Id already present")
            {
                alert("Email ID Already Present")
            }
        }); 
    }
}

//creating the function to check login condition
function checkLogin(){
    email=document.getElementsByClassName("email");
    password=document.getElementsByClassName("password");
    let atposition=email[0].value.indexOf("@");  
    let dotposition=email[0].value.lastIndexOf(".");  
    if (atposition<1 || dotposition<atposition+2 || dotposition+2>=email[0].value.length){  
        alert("Please enter a valid e-mail address");  
    }
    else
    {
        $.ajax({
            // url: 'https://myshapetime.herokuapp.com/',
            url: 'http://localhost:8000/',
            type: 'POST',
            dataType: 'json',
            data: { 
                'email': email[0].value, 
                'password' : password[0].value,
            }
        })
        .done(function(data){
            perDayMenu = data.perDayMenu;
            if(data.msg=="User Exist")
            {
                sessionStorage.setItem("email",email[0].value);

                location.replace("/Frontend/Dashboard.html");

                perDayMenu=data;
                console.log(perDayMenu);
                displayingMenuData(perDayMenu);

                
                // localStorage.setItem("perDayMenu",JSON.stringify(data));
                // perDayMenu = data.perDayMenu
                // eggQuantity = data.eggQuantity 
            }
            else if(data.msg=="User Does Not Exist")
            {
                location.replace("/index.html");
                alert("User Does Not Exist");
            }
            else
            {
                alert("User Does Not Exist");
            }
        }); 
    }  
}



function display(){
    numberOfTimeUserTookMenu++;
    let email=sessionStorage.getItem("email");
    console.log(numberOfTimeUserTookMenu);

    //if user took menu for 7 days then different route 
    if( (numberOfTimeUserTookMenu % 7 ) === 0 ){
        console.log("me" + numberOfTimeUserTookMenu);
        $.ajax({
            // url: 'https://myshapetime.herokuapp.com/oneweek',
            url: 'http://localhost:8000/oneweek',
            type: 'POST',
            dataType: 'json',
            data: {
                'message' :'oneWeek'
            }
        })
        .done(function(data){
            perDayMenu = data.perDayMenu;
            eggQuantity = data.eggQuantity
            let we = data.updatedWeight
            console.log(perDayMenu);
            console.log(eggQuantity);    
            console.log(we)
            displayingMenuData(perDayMenu);
            $.ajax({
                // url: 'https://myshapetime.herokuapp.com/updateWeight',
                url: 'http://localhost:8000/updateWeight',
                type: 'POST',
                dataType: 'json',
                data: {
                    'email': email,
                    'Weight' :we
                }
            })
        });
    }       
    else{
        console.log("else block");
        $.ajax({
            // url: 'https://myshapetime.herokuapp.com/oneweek',
            url: 'http://localhost:8000/tookmenu',
            type: 'POST',
            dataType: 'json',
            data: {
                'message' :'tookmenu' 
            }
        })
        .done(function(data){
            perDayMenu = data.perDayMenu;                
            eggQuantity = data.eggQuantity
            let we = data.updatedWeight
            console.log(perDayMenu);
            console.log(eggQuantity);
            displayingMenuData(perDayMenu)
            // getting the details with the help of Api and sending those data to client side 

        });
    }
}


function skippingMenu(){
    $(".displaying-menu").hide();
    $(".exercise-task").show();
    displayingExerciseData();
}

function displayingMenuData(perDayMenu){
    perDayMenu = perDayMenu
    document.getElementById("breakfastData").innerHTML=perDayMenu.breakfast[0].Name+" ";
    let para = document.createElement("breakfastData"); 
    let t = document.createTextNode(perDayMenu.breakfast[1].Name);
    para.appendChild(t);                                          // Append the text to <p>
    document.getElementById("breakfastData").appendChild(para);  
    document.getElementById("lunchData").innerHTML=perDayMenu.lunch[0].Name+" ";
    para = document.createElement("lunchData"); 
    t = document.createTextNode(perDayMenu.lunch[1].Name);
    para.appendChild(t);                                          // Append the text to <p>
    document.getElementById("lunchData").appendChild(para);  
    document.getElementById("dinnerData").innerHTML=perDayMenu.dinner[0].Name+" ";
    para = document.createElement("dinnerData"); 
    t = document.createTextNode(perDayMenu.dinner[1].Name);
    para.appendChild(t);                                          // Append the text to <p>
    document.getElementById("dinnerData").appendChild(para);  
    document.getElementById("snacksData").innerHTML=perDayMenu.snacks[0].Name+" ";
    para = document.createElement("snacksData"); 
    t = document.createTextNode(perDayMenu.snacks[1].Name);
    para.appendChild(t);                                          // Append the text to <p>
    document.getElementById("snacksData").appendChild(para);  
    document.getElementById("EggCount").innerHTML=eggQuantity;
}


function displayingExerciseData(){
    document.getElementById("running").innerHTML = "3 Km " 
    document.getElementById("cycling").innerHTML = "5 Km " 
    document.getElementById("squats").innerHTML = " 15 X 3 Sets " 
}


function logout(){
    location.replace("/index.html");
    localStorage.clear();
    sessionStorage.clear();
}
//importing all the required middlewares, packages and class
const express = require('express');
const router = express.Router();
const {Menu} = require("../../controller/controller");
const {Exercise} = require("../../controller/controller");
const menu = require('../../menudata.js')

// declaring the global variables
let email;
let userData;
let eggCount = 0;
let updatedWeight = 0;
let numberOfDayMenuTook = 0;
let dayCount=0;
let UserWeight = 0
let menuPerDay={
	breakfast: [],
	lunch: [],
	dinner:[],
	snacks: []   
}


//Getting user profile details and storing the details to mongodb
module.exports = (app, db) => {   
    app.post("/add", (req, res) => {
	console.log(req.body);
	email= req.body.email;
        const note = { name: req.body.name, email:req.body.email, age: req.body.age,
			height: req.body.height,Weight: req.body.Weight, desiredWeight : req.body.desiredWeight,
			password:req.body.password
        };
        
	//If user name already present in mongodb display the error message to the user
        db.collection('UserData').findOne({email: req.body.email}).then(function(result){
            if(!(result==null)){
                res.status(200).json({msg:"Email Id already present"});
            }
            else
            {
		// if user not present then store the new data to mongodb
                db.collection('UserData').insertOne(note, (err, result) => {
                    if (err)
                    {
                        console.log(err + " this error has occured");
                    }
                    else
                    {
                        res.status(200).json({msg:"success"});
                    }
                });
             }
          });
       });

    //Getting the next day menu for the user
    app.post("/", (req, res) => {
        const note = { email: req.body.email, password: req.body.password };
        db.collection('UserData').findOne({email: req.body.email, password: req.body.password}).then(function(result){
            if(!(result==null)){
                db.collection('UserData').findOne(note, (err, result) => {
                    if (err)
                    {
                        console.log(err + " this error has occured");   
                    }
                    else
                    {
			userData=result;
			console.log("hello");
                        console.log("printing from userdata " + userData.Weight);
                        
			// creating the object and with the help of object calling the class methods 
                        let userMenu = new Menu(userData, menu , menuPerDay);
                        userMenu.calculatingBmi();
			userMenu.calculatingCaloriesPerDay(); 
			menuPerDay = userMenu.calculateMenuPerDay();
			eggCount = userMenu.calculatingTheRequiredCalories();
			res.status(200).json({msg:"User Exist", perDayMenu: menuPerDay,eggQuantity : eggCount}); 
                    } 
		});
             }
           else
           {
              res.status(200).json({msg:"User Does Not Exist"});
           }
        });
     });

    // If user take oneweek menu then the weight is updated in mongodb 
    app.post("/oneweek", (req, res) => {
        console.log("message from ajax call " + req.body.message);
	console.log(" message one week ");
	let userUpdatedWeight = userData.Weight
        let userMenu = new Menu(userData, menu , menuPerDay);

        //Calling the method to update the user weight
        updatedWeight = userMenu.ifUserTookTheMenu(numberOfDayMenuTook, userUpdatedWeight);
        userMenu.calculatingBmi();
        userMenu.calculatingCaloriesPerDay();
        menuPerDay =  userMenu.calculateMenuPerDay();
        eggCount = userMenu.calculatingTheRequiredCalories();
        console.log(" messages one week ");
	res.status(200).json({msg:"one week", perDayMenu: menuPerDay, 
	updatedWeight: updatedWeight,eggQuantity : eggCount});
    });    

    //If user took menu for 7 days then updated the user weight in mongodb
    app.post("/updateWeight", (req, res) => {
	let  myquery = { email: req.body.email };
	console.log(myquery);
	let newvalues = { $set: { Weight: req.body.Weight } };
	// console.log("updated weight " + newvalues.value);
	db.collection("UserData").updateOne(myquery,newvalues,function(err,result){
	    if(err){
		throw err;
	    }
	    else
	    {
		console.log("1 document updated");
	    }
	});
   }); 
   
    //if user take the menu then that menu is stored in mongodb and next day menu is show to user
    app.post("/tookmenu", (req, res) => {
        console.log("message from ajax call " + req.body.message);
        console.log(" message tookmenu ");
        let userMenu = new Menu(userData, menu , menuPerDay);
        userMenu.calculatingBmi();
        userMenu.calculatingCaloriesPerDay();
        menuPerDay =  userMenu.calculateMenuPerDay();
        eggCount = userMenu.calculatingTheRequiredCalories();
        console.log(" message tookmenu ");
	let myquery = { email: req.body.email };
	let newvalues = { $push: { menu : menuPerDay} };
        db.collection("PerDayMenuData").updateOne(myquery,newvalues,function(err,result){
            if(err){
                throw err;
            }
            else
            {
	     	console.log("1 document updated");
            }
        });
        res.status(200).json({msg:"tookmenu", perDayMenu: menuPerDay,eggQuantity : eggCount});
    });

    //If user skipped the menu then call  the class (exercise) methods
    app.post("/skipping/menu", (req, res) => {
        console.log(" message skipping the menu ");
        //Calling the class menu methods to find the bmi
        let userMenu = new Menu(userData, menu , menuPerDay);
        let bmi =userMenu.calculatingBmi();

        //Calling the class exercise and passing the bmi value as the parameter to that class
        let userExercise = new Exercise(bmi);
        let running = userExercise.running()
        let cycling = userExercise.cycling()
        let walking = userExercise.walking()
        let swimming = userExercise.swimming()
        console.log(running + " cyc" + cycling + " wal " + walking + " swi" + swimming +"mt");
        res.status(200).json({runningKm: running, cyclingKm: cycling, walkingKm : walking, swimmingMeter:swimming});
    });
}

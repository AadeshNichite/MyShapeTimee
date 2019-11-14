//importing all the documents
const express = require('express');
const router = express.Router();
const {Menu} = require("../../controller/controller");


// declaring the global variables
let userData;
let eggCount = 0;
let updatedWeight = 0;
let numberOfDayMenuTook = 0;
let dayCount=0;
let menuPerDay={
	breakfast: [],
	lunch: [],
	dinner:[],
	snacks: []   
}

let menu = {
	"breakfast": [{
			"Name": "Egg",
			"Protein": 5,
			"Calorie": 78
		},
		{
			"Name": "Milk",
			"Protein": 8,
			"Calorie": 42
		},
		{
			"Name": "Banana",
			"Protein": 1.3,
			"Calorie": 100
		},
		{
			"Name": "OatMmeals",
			"Protein": 17,
			"Calorie": 75
		},
		{
			"Name": "Wheat Bread",
			"Protein": 3.6,
			"Calorie": 75
		}
	],
	
	"snacks" :[{
			"Name": "Egg",
			"Protein": 5,
			"Calorie": 78
		},
		{
			"Name": "Apple",
			"Protein": 5,
			"Calorie": 150
		},
		{
			"Name": "Turkey with cheese ",
			"Protein": 5,
			"Calorie": 140
		},
		{
			"Name": "Cereal",
			"Protein": 5,
			"Calorie": 180
		},
		{
			"Name": "Nuts",
			"Protein": 7,
			"Calorie": 160
		}
	],

	"lunch" :[{
			"Name": "Chicken Breast",
			"Protein": 20,
			"Calorie": 165
		},
		{
			"Name": "Brown Rice",
			"Protein": 3,
			"Calorie": 111
		},
		{
			"Name": "Spinach",
			"Protein": 2.9,
			"Calorie": 100
		},
		{
			"Name": "Salmon",
			"Protein": 20,
			"Calorie": 185
		},
		{
			"Name": "Tuna",
			"Protein": 20,
			"Calorie": 180
		}
	],
	
	"dinner" :[{
			"Name": "Nuts",
			"Protein": 7,
			"Calorie": 160
		},
		{
			"Name": "Beans",
			"Protein": 8,
			"Calorie": 347
		},
		
		
		{
			"Name": "Avacados",
			"Protein": 2.5,
			"Calorie": 160
		},
		{
			"Name": "Potato",
			"Protein": 2.5,
			"Calorie": 77
		},
		
		{
			"Name": "Chapathi",
			"Protein": 3.5,
			"Calorie": 200
		}
	]
}


// getting user details and storing the details to mongodb
module.exports = (app, db) => {    
    app.post("/add", (req, res) => {
        console.log(req.body);
        const note = { name: req.body.name, email:req.body.email, age: req.body.age,
                     height: req.body.height,Weight: req.body.Weight, desiredWeight : req.body.desiredWeight,
                     password:req.body.password
		};
		//if user name already present in mongodb alerting the user 
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

	app.post("/updateWeight", (req, res) => {
        console.log(req.body);

		var myquery = { email: req.body.email };
		console.log(myquery);
		var newvalues = { $set: { Weight: req.body.Weight } };
		console.log(newvalues);
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
						// creating the object and with the help of object calling the class methods 
                        let userMenu = new Menu(userData, menu , menuPerDay);
                        userMenu.calculatingBmi();
						userMenu.calculatingCaloriesPerDay();
						menuPerDay = userMenu.calculateMenuPerDay();
						eggCount = userMenu.calculatingTheRequiredCalories();
						console.log("printing from route");
						console.log(menuPerDay);
						console.log(eggCount);
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

//  if user take oneweek menu then the weight is updated in mongodb
    app.post("/oneweek", (req, res) => {
        console.log("message from ajax call " + req.body.message);
        console.log(" message one week ");
        let userMenu = new Menu(userData, menu , menuPerDay);
        updatedWeight = userMenu.ifUserTookTheMenu(numberOfDayMenuTook);
        userMenu.calculatingBmi();
        userMenu.calculatingCaloriesPerDay();
        menuPerDay =  userMenu.calculateMenuPerDay();
        eggCount = userMenu.calculatingTheRequiredCalories();
        console.log(" messages one week ");
        console.log(menuPerDay);
        res.status(200).json({msg:"one week", perDayMenu: menuPerDay, updatedWeight: updatedWeight,eggQuantity : eggCount});
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
        console.log(menuPerDay);
        res.status(200).json({msg:"tookmenu", perDayMenu: menuPerDay,eggQuantity : eggCount});
    });
}

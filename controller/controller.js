// Creating the class Menu 
class Menu{
    constructor(userData, menu , menuPerDay){
        this.menu = menu;
        this.menuPerDay = menuPerDay;
        this.compensation = menu;
        this.userData = userData;
        this.userData.height = userData.height;
        this.userData.weight = userData.Weight;
        this.userData.desiredWeight = userData.desiredWeight
        this.userData.age = userData.age;
        this.caloriesPerDay = 0;
        this.quantityOfEgg = 0;
    }

    //calculating the bmi
    calculatingBmi(){
        console.log("Weight " + this.userData.weight + " height " + this.userData.height);
        let bmi = Math.round(this.userData.weight/((this.userData.height/100)*(this.userData.height/100)));
        console.log("bmi is " + bmi);
        //categorizing
        if(bmi >= 25){
            console.log("over weight");   
        }
        if(bmi < 19){
            console.log("under weight");        
        }
        if((bmi > 19)&&( bmi < 25)){
            console.log("Normal weight ");   
        }
        //Returning the calculated bmi to the route folder
        return bmi
    }

    //calculating the calories needed per day 
    calculatingCaloriesPerDay(){

        //calories need for weight loss
        if(this.userData.weight > this.userData.desiredWeight ){
            let bmr = ( 655.1 + ( 9.563 * this.userData.weight ) + ( 1.85 * this.userData.height ) - ( 4.676 * this.userData.age ));
            this.caloriesPerDay = Math.round( bmr * 1.1 );
            console.log("Weight loss " + this.caloriesPerDay);
        }    

        //calories need for weight gain 
        else
        {
            let bmr = ( 655.1 + ( 9.563 * this.userData.weight ) + ( 1.85 * this.userData.height ) - ( 4.676 * this.userData.age ));
            this.caloriesPerDay = Math.round( bmr * 1.4 );
            console.log("Weight gain " + this.caloriesPerDay);     
        }
    }

    //calculating the menu
    calculateMenuPerDay() {
        let previousRandom = []
        let max = 4;
        let totalCalorie = 0;
        let breakfastCalories = 0;
        let snacksCalories = 0;
        let lunchCalories = 0;
        let dinnerCalories = 0;
        for(let i = 0; i <= max; i++){
            previousRandom.push(i)
        }

        //Picking only two dish using for loop 
        for(let i=0;i<2;i++){
            let currentRandom = Math.floor( Math.random() * previousRandom.length );
            currentRandom = previousRandom[currentRandom];
            previousRandom.splice(currentRandom , 1);
            this.menuPerDay.breakfast[i] = this.menu.breakfast[currentRandom]
            this.menuPerDay.snacks[i] = this.menu.snacks[currentRandom]
            this.menuPerDay.lunch[i]  = this.menu.lunch[currentRandom]
            this.menuPerDay.dinner[i] = this.menu.dinner[currentRandom]
        }

        //Getting the calorie value for the dishes  which are picked 
        for(let i=0; i<2; i++){
            breakfastCalories = breakfastCalories + this.menuPerDay.breakfast[i].Calorie;
            snacksCalories = snacksCalories + this.menuPerDay.snacks[i].Calorie;
            lunchCalories = lunchCalories + this.menuPerDay.lunch[i].Calorie;
            dinnerCalories = dinnerCalories + this.menuPerDay.dinner[i].Calorie;
        }

        //storing all the calorie value in single variable 
        totalCalorie = breakfastCalories + snacksCalories + lunchCalories + dinnerCalories;
        console.log("total calories " + totalCalorie);

        //calling  the method to find the required calories 
        if( this.caloriesPerDay > totalCalorie ){
            //if obtained calories is less than required calories call the method again untill it satisfy the condition
            this.calculatingTheRequiredCalories( totalCalorie );        
        }
        //returning the menu chart to route
        return this.menuPerDay
    }

    //compensation method where incrementing the egg count untill it satisfy the required calories
    calculatingTheRequiredCalories( totalCalorie ){
        let difference = 0;
        this.totalCalorie = totalCalorie
        difference = this.caloriesPerDay - this.totalCalorie;
        // console.log("total calorie" + this.totalCalorie);

        if(this.caloriesPerDay > this.totalCalorie){
            this.quantityOfEgg++;            
            totalCalorie = totalCalorie + this.compensation.snacks[0].Calorie;
            this.calculatingTheRequiredCalories(totalCalorie)
        }
        else{
            console.log("count of the egg  " + this.quantityOfEgg);
        }
        //returning the quantity of the egg
        return this.quantityOfEgg
    }

    // once the user took menu for 7 day then the user weight is updated
    ifUserTookTheMenu(numberOfDayMenuTook, userUpdatedWeight){
        this.userUpdatedWeight = userUpdatedWeight;
        this.numberOfDayMenuTook = numberOfDayMenuTook;
        this.numberOfDayMenuTook++;
        console.log("ifusertook");
        console.log(this.numberOfDayMenuTook);
        this.userUpdatedWeight = Math.round(this.userUpdatedWeight - 1.2);
        console.log("updated user weight " + this.userUpdatedWeight);
        return this.userUpdatedWeight
    }
}

//Creating the new Class for Exercise
class Exercise {
    constructor(bmi){
        this.bmi = bmi;
    }

    //Calculating the number of km for running 
    running(){
        let runningKm = Math.round(this.bmi * 0.2)
        return runningKm
    }

    //Calculating the number of km for cycling
    cycling(){
        let cycling = Math.round(this.bmi * 0.3)
        return cycling
    }

    //Calculating the number of km for walking
    walking(){
        let walking = Math.round(this.bmi * 0.1)
        return walking
    }

    //Calculating the number of meter for swimming
    swimming(){
        let swimming = Math.round(this.bmi * 0.1)
        let swimmingMeter = (swimming * 100)
        return swimmingMeter
    }
}


//exporting the class Menu to route.js file
const external = {Menu,Exercise};
module.exports = external;
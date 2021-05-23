/* age is easy. It is >, <, >=, or <= some number */

function main(){
// hard code some stuff
//age = 79;
//age = 80;
age = 81;

//ageString = "<80";
ageString = ">=80";

	var result = evaluateAgeCriteria(age, ageString);
// echo it for now. Eventually we'll want to pass it back to a calling function.
console.log(result);
}

/*
Evalutes whether the patient meets the age criteria.
If the patient's age meets the criteria returns true, else returns false.
If ageString is empty returns true.
If age is unknown returns false.
*/
function evaluateAgeCriteria(age, ageString) {
	if(ageString == null){return true;}
	if(age == null){return false;}
	var ageInString = ageString.match(/\d+/g);
	if(ageString.substr(0,1) === "<"){
		return age < ageInString;
	}
	if(ageString.substr(0,1) === ">"){
		return age > ageInString;
	}
	if(ageString.substr(0,2) === "<="){
		return age <= ageInString;
	}
	if(ageString.substr(0,2) === ">="){
		return age >= ageInString;
	}
}

main();
/*
Condition_drug checks one of three things:
* the presence of one or more other drugs in the patient's file (not the selector, but doesn't hurt if the selector is also checked)
* the absence of one or more other drugs in the patient's file (not the selector, but doesn't hurt if the selector is also checked)
* the start date of the drug from the selector
  The latter is the only case in the system where the conditions should be combined with AND.

Below is an exhaustive list of all of the criteria that are currently in the database.

J02AB02,J02AC04,J02AC03,J02AC02,J01FA09,V03AX03,J05AE03,J05AE01,J05AR10
&(medication.startDate >= now-6-months | !medication.startDate)
&(medication.startDate < now-6-months)
!C09A &!C09B
A03AA07,A03AB05,A03BA01,A03BA03,A03BB01,G04BD02,G04BD04,G04BD05,G04BD06,G04BD07,G04BD08,G04BD09,G04BD10,G04BD11,M03BA03,M03BC01,N04AA01,N04AA02,N04AA04,N04AB02,N04AC01,N05AA01,N05AA03,N05AB03,N05AB06,N05AC02,N05AH03,N05AH04,N05BB01,N05CM05,N06AA,N06AB05,R06AA02,R06AA04,R06AA08,R06AA09,R06AA52,R06AB01,R06AB04,R06AD02,R06AE05
*/

function main(){
// hard code some stuff
var drugList = ["J02AB02","C09AA01","C07AA01"];
//var drugString = "J02AB02,J02AC04,J02AC03,J02AC02,J01FA09,V03AX03,J05AE03,J05AE01,J05AR10";
var drugString = "&(medication.startDate >= now-6-months | !medication.startDate)";
//var drugString = "&(medication.startDate < now-6-months)";
var selectorStartDate = new Date();

	var result = evaluateDrugCriteria(drugList, drugString, selectorStartDate);
// echo it for now. Eventually we'll want to pass it back to a calling function.
console.log(result);
}

/*
Evaluates whether the patient meets the criteria.
Returns true if the patient does meet the criteria, false if they don't.
If drugString is empty, returns true.
*/
function evaluateDrugCriteria(drugList, drugString, selectorStartDate) {
	// TODO check what happens if you call this function without a selectorStartDate
	if(drugString == null){return true;}
	// figure out what kind of string we have
	if(drugString.includes("startDate")){
		return evaluateStartDate(drugString, selectorStartDate);
		} else {
			return evaluateDrugList(drugList, drugString);
		}
}

function evaluateStartDate(drugString, selectorStartDate){
	if(drugString.includes("!medication.startDate") && selectorStartDate == null){
		return true;
	} else if (selectorStartDate == null) {return false;}
	// capture the operator
	var regExp = /startDate ([^a-z0-9]*)/;
	var regExpResult = regExp.exec(drugString);
	var drugStringOperator = regExpResult[1].trim();
console.log(drugStringOperator);
	// capture the expression after the operator
	regExp = /[<>=]+ (.*)(?:\)| \| !medication.startDate)/;
	regExpResult = regExp.exec(drugString);
	var drugStringDateCriteria = regExpResult[1].trim();
console.log(drugStringDateCriteria);

//	&(medication.startDate >= now-6-months | !medication.startDate)
// medication.startDate < now-6-months
return false;
}

function evaluateDrugList(drugList, drugString){
return false;
}

main();
//const util = require("util");

/*
// problem_criteria can contain items in the following formats:
jicht
!hypertensie
!atriumfibrilleren &!angina-pectoris &!myocardinfarct
hypertensie &!hartfalen
parkinson | lewy-bodies-dementia | multiple-system-atrophy | progressive-supranuclear-palsy
(parkinson | lewy-bodies-dementia | multiple-system-atrophy | progressive-supranuclear-palsy ) & orthostatische-hypotensie
// note that there is only ever one set of parentheses. We could create a more general boolean parser (and there are examples of them on the internetz) but this covers the cases that actually exist
*/


function main(){
	// for now let's hard code some stuff
	// this is the patient's list of problems. It will come out of the table patient_problems, and will always match to something in Problems
	// const problemList = [];
	// const problemList = ["diabetes"];
	// const problemList = ["angststoornis"];
	// const problemList = ["epilepsy"];
	 const problemList = ["parkinson","orthostatische-hypotensie"];

	// this is the string that comes from the med_rules.condition_problem field. This field can have parentheses and boolean operators ( | , &! )
	// const problemString = null;
	// const problemString = "epilepsy";
	// const problemString = "!angststoornis &!epilepsy";
	// const problemString = "angststoornis &!epilepsy";
	 const problemString = "(parkinson | lewy-bodies-dementia | multiple-system-atrophy | progressive-supranuclear-palsy ) & orthostatische-hypotensie";

	var result = evaluateProblemCriteria(problemList, problemString);
// for now just echo the result, eventually this should be sent somewhere to determine if the patient meets the problem criteria (if true = rule stays on list, if false = rule removed from list (patient does not meet criteria)
console.log(result);
}

function evaluateProblemCriteria(problemList, problemString){
	if(problemString == null || problemList.length == 0){return true;}
	if(problemString.includes("(")){
		var parentheticalMap = parentheticalProblem(problemString);
		var insideProblemMap = splitProblems(parentheticalMap.get("problemStringInside"));
		var afterProblemMap = splitProblems(parentheticalMap.get("problemStringAfter"));
		var operator = parentheticalMap.get("problemStringOperator");
		if(operator == "&"){
			if(evaluateCriteria(problemList, insideProblemMap) && evaluateCriteria(problemList, afterProblemMap)){
				return true;
			} else {return false;}
		}
		// there actually are no criteria like this, but it's trivial to have the functionality
		if(operator == "|"){
			if(evaluateCriteria(problemList, insideProblemMap) || evaluateCriteria(problemList, afterProblemMap)){
				return true;
			} else {return false;}
		}
	} else {
		var problemMap = splitProblems(problemString);
		return evaluateCriteria(problemList, problemMap);
	}
}

function parentheticalProblem (problemString){
		var parentheticalMap = new Map();
		// capture the part before parentheses
		var regExp = /^(.*?)\(/;
		var regExpResult = regExp.exec(problemString);
		if(regExpResult != null){
			var problemStringBefore = regExpResult[1];
		}
		// capture the part in the parentheses
		regExp = /\(([^)]+)\)/;
		var problemStringInside = regExp.exec(problemString)[1];
		// capture the operator after the parentheses
		regExp = /\)([^a-z]*)/;
		regExpResult = regExp.exec(problemString);
		if(regExpResult != null){
			var problemStringOperator = regExpResult[1].trim();
		}
		// capture the part after the parentheses
		regExp = /\) [&|](.*)/;
		regExpResult = regExp.exec(problemString);
		if(regExpResult != null){
			var problemStringAfter = regExpResult[1].trim();
		}
		parentheticalMap.set("problemStringBefore",problemStringBefore || "");
		parentheticalMap.set("problemStringInside",problemStringInside || "");
		parentheticalMap.set("problemStringOperator",problemStringOperator || "");
		parentheticalMap.set("problemStringAfter",problemStringAfter || "");
		return parentheticalMap;
}

function splitProblems (problemString){
	var problemMap = new Map();
	var problem = new Array();
	var problemNot = new Array();
	var criteriaArray = problemString.split(" ");
	criteriaArray.forEach((problemExpression, index) => {
		if(problemExpression.substr(0,1) === "!"){
			problemNot.push(problemExpression.substr(1,problemExpression.length));
		} else if(problemExpression.substr(0,2) === "&!"){
			problemNot.push(problemExpression.substr(2,problemExpression.length));
		} else if(problemExpression === "|"){ /*do nothing*/
		} else{
			problem.push(problemExpression);
		}
	});
	problemMap.set("problem",problem);
	problemMap.set("problemNot",problemNot);
	return problemMap;
}

function evaluateCriteria(problemList, problemMap){
	var hasRequiredProblem = false;
	var hasForbiddenProblem = false;
	problemMap.get("problemNot").forEach((notProblem, index) => {
		if(problemList.includes(notProblem)){
			hasForbiddenProblem = true;
		}
	});
	if(!hasForbiddenProblem){
		problemMap.get("problem").forEach((problem, index) => {
			if(problemList.includes(problem)){
				hasRequiredProblem = true;
			}
		});
	}
	if(hasRequiredProblem == true && hasForbiddenProblem == false){
		return true;
	} else {return false;}
}

main();
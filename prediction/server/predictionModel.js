//
//  Created by Tsvetan Yordanov
//

"use strict";
const calculateAndSetPatientVariablesForFallRisk = (patient) => {
    const pm = patient.measurements;
    const bmiMissing = pm.BMI === null;
    const bmiCalculable = pm.weight_kg !== null && pm.height_cm !== null;
    let calculatedBmi = null;

    if(bmiCalculable)
        calculatedBmi = pm.weight_kg / (pm.height_cm*pm.height_cm*0.0001);
    if(bmiMissing)
        pm.BMI = calculatedBmi;
    if(!bmiMissing && bmiCalculable && Math.abs(pm.BMI - calculatedBmi) > 0.005)
        console.warn("BMI provided does not match with patient weight and height provided! Using BMI shown on table");

    patient.funct_beperk = calcFunctBeperk(pm);

    //Gebruik van anti-epileptica? If the patient has any medication with ATC code N03 then this should be 1; else 0.
    patient.medications = patient.medications === null ? [] : patient.medications;
    patient.antiepileptica = patient.medications.filter( x => x.ATC_code.startsWith("N03") ).length == 0 ? 0 : 1;

    //Gebruik van calciumblokkers? If the patient has any medication with ATC code in: (C08, C09BB, C09DB, C07FB, C10BX03, C10BX07, C10BX09, C10BX11, C10BX14, C09BX03, C09BX01, C09BX02, C09DX01, C09DX03 C09DX06, C09XA53, C09XA54) then 1, else 0.
    patient.ca_blocker = patient.medications.filter( x => (x.ATC_code.startsWith("C08") || x.ATC_code.startsWith("C09BB") || x.ATC_code.startsWith("C09DB") || x.ATC_code.startsWith("C07FB")
    || x.ATC_code.startsWith("C10BX03") || x.ATC_code.startsWith("C10BX07") || x.ATC_code.startsWith("C10BX09") || x.ATC_code.startsWith("C10BX11")
    || x.ATC_code.startsWith("C10BX14") || x.ATC_code.startsWith("C09BX03") || x.ATC_code.startsWith("C09BX01") || x.ATC_code.startsWith("C09BX02")
    || x.ATC_code.startsWith("C09DX01") || x.ATC_code.startsWith("C09DX03") || x.ATC_code.startsWith("C09DX06") || x.ATC_code.startsWith("C09XA53")
    || x.ATC_code.startsWith("C09XA54") ) ).length == 0 ? 0 : 1;

    //Gebruik van incontinentie medicijnen? If the patient has any medicatio with ATC code in: (G04BD, G04CA53) then 1, else 0.
    patient.incont_med = patient.medications.filter( x => ( x.ATC_code.startsWith("G04BD") || x.ATC_code.startsWith("G04CA53") ) ).length == 0 ? 0 : 1;
    return patient;
}

const calculatePatientFallRisk = (patient) => {
    const pm = patient.measurements;

    //todo: move all that is not the actual formula calculation into calculateAndSetPatientVariablesForFallRisk
    const valgeschiedenis1 = pm.nr_falls_12m >= 1 ? 1 : 0;
    const valgeschiedenis2 = pm.nr_falls_12m >= 2 ? 1 : 0;

    // For LASA & ActiFE Ulm it was chosen to code fearfall=0 when all activities are rated as notconcerned, fearfall=1 when at least one of the activities is rated as a little/fairly concerned (and none of the other activities as >fairly concerned), fearfall=2 when at least one of the activities is rated as very concerned.
    var coeff_education = 0;
        if (pm.education_evel_code === 2) {coeff_education = 0.1972;}
        if (pm.education_evel_code === 3) {coeff_education = 0.3687;}
    var valangst = 0;
    if (pm.FES_kleding === "Een beetje bezorgd" || pm.FES_bad === "Een beetje bezorgd" || pm.FES_stoel === "Een beetje bezorgd"
    || pm.FES_trap === "Een beetje bezorgd" || pm.FES_reiken === "Een beetje bezorgd" || pm.FES_helling === "Een beetje bezorgd"
    || pm.FES_sociale === "Een beetje bezorgd")
        valangst = 1;
    if (pm.FES_kleding === "redelijk bezorgd" || pm.FES_bad === "redelijk bezorgd" || pm.FES_stoel === "redelijk bezorgd"
    || pm.FES_trap === "redelijk bezorgd" || pm.FES_reiken === "redelijk bezorgd" || pm.FES_helling === "redelijk bezorgd"
    || pm.FES_sociale === "redelijk bezorgd")
        valangst = 1;
    if (pm.FES_kleding === "Erg bezorgd" || pm.FES_bad === "Erg bezorgd" || pm.FES_stoel === "Erg bezorgd" || pm.FES_trap === "Erg bezorgd"
    || pm.FES_reiken === "Erg bezorgd" || pm.FES_helling === "Erg bezorgd" || pm.FES_sociale === "Erg bezorgd")
        valangst = 2;

    var coeff_valangst = 0;
        if (valangst === 1){coeff_valangst = 0.2268;}
        if (valangst === 2){coeff_valangst = 0.2222;}

    var p1 = -0.2047 +
    0.0778  * (pm.GDS_score - 1.4401) / 1.9419 +
    -0.1678  * (pm.grip_kg  - 32.4838) / 10.8414 +
    0.0997 * (pm.walking_speed_m_per_s - 0.9417) / 0.2760 +
    -0.0204 * pm.BMI +
    -0.0039 * pm.systolic_bp_mmHg +
    0.1419 * (patient.funct_beperk - 1.2088) / 1.5286 +
    valgeschiedenis1 * 0.4841 + valgeschiedenis2 * 0.6791 +
    pm.smoking * -0.2870 +
    patient.antiepileptica * 0.4962 +
    patient.ca_blocker * -0.1866 +
    patient.incont_med * 0.7459 +
    coeff_education  +
    coeff_valangst ;
    return (Math.exp(p1) / (1+ Math.exp(p1)));
}

const isPatientFallRiskCalculable = (patient) => {
    return reportMissingVariables(patient).length === 0;
}

const reportMissingVariables = (patient) => {
    const pm = patient.measurements;
    var missCounter = 0;
    var missVars = [];
    if (pm === null || pm === undefined)  { missVars[missCounter] = "measurements"; missCounter+=1; }
    if (pm.functional_limit_trap === null || pm.functional_limit_trap === undefined)  { missVars[missCounter] = "functional_limit_trap"; missCounter+=1; }
    if (pm.functional_limit_kleding === null || pm.functional_limit_kleding === undefined)  { missVars[missCounter] = "functional_limit_kleding"; missCounter+=1; }
    if (pm.functional_limit_stoel === null || pm.functional_limit_stoel === undefined)  { missVars[missCounter] = "functional_limit_stoel"; missCounter+=1; }
    if (pm.functional_limit_nagels === null || pm.functional_limit_nagels === undefined)  { missVars[missCounter] = "functional_limit_nagels"; missCounter+=1; }
    if (pm.functional_limit_lopen === null || pm.functional_limit_lopen === undefined)  { missVars[missCounter] = "functional_limit_lopen"; missCounter+=1; }
    if (pm.nr_falls_12m === null || pm.nr_falls_12m === undefined)  { missVars[missCounter] = "nr_falls_12m"; missCounter+=1; }
    if (pm.education_evel_code === null || pm.education_evel_code === undefined)  { missVars[missCounter] = "education_evel_code"; missCounter+=1; }
    if (pm.FES_kleding === null || pm.FES_kleding === undefined)  { missVars[missCounter] = "FES_kleding"; missCounter+=1; }
    if (pm.FES_bad === null || pm.FES_bad === undefined)  { missVars[missCounter] = "FES_bad"; missCounter+=1; }
    if (pm.FES_stoel === null || pm.FES_stoel === undefined)  { missVars[missCounter] = "FES_stoel"; missCounter+=1; }
    if (pm.FES_trap === null || pm.FES_trap === undefined)  { missVars[missCounter] = "FES_trap"; missCounter+=1; }
    if (pm.FES_reiken === null || pm.FES_reiken === undefined)  { missVars[missCounter] = "FES_reiken"; missCounter+=1; }
    if (pm.FES_helling === null || pm.FES_helling === undefined)  { missVars[missCounter] = "FES_helling"; missCounter+=1; }
    if (pm.FES_sociale === null || pm.FES_sociale === undefined)  { missVars[missCounter] = "FES_sociale"; missCounter+=1; }
    if (pm.GDS_score === null || pm.GDS_score === undefined)  { missVars[missCounter] = "GDS_score"; missCounter+=1; }
    if (pm.grip_kg === null || pm.grip_kg === undefined)  { missVars[missCounter] = "grip_kg"; missCounter+=1; }
    if (pm.walking_speed_m_per_s === null || pm.walking_speed_m_per_s === undefined)  { missVars[missCounter] = "walking_speed_m_per_s"; missCounter+=1; }
    if (pm.BMI === null || pm.BMI === undefined && (pm.weight_kg === null || pm.height_cm === null) )  { missVars[missCounter] = "BMI"; missCounter+=1; }
    if (pm.systolic_bp_mmHg === null || pm.systolic_bp_mmHg === undefined)  { missVars[missCounter] = "systolic_bp_mmHg"; missCounter+=1; }
    if (pm.smoking === null || pm.smoking === undefined || (pm.smoking !== 0 && pm.smoking !== 1))  { missVars[missCounter] = "smoking"; missCounter+=1; }
    return missVars;
}

const calcFunctBeperk = (pm) => {
    var funct_beperk = 0;
    if(!(pm.functional_limit_trap === null || pm.functional_limit_kleding === null || pm.functional_limit_stoel === null || pm.functional_limit_nagels === null || pm.functional_limit_lopen === null))
    {
        if(pm.functional_limit_trap === "ja, met enige moeite" || pm.functional_limit_trap === "ja, met veel moeite" || pm.functional_limit_trap === "alleen met hulp / nee, dat kan ik niet"){funct_beperk++;}
        if(pm.functional_limit_kleding === "ja, met enige moeite" || pm.functional_limit_trap === "ja, met veel moeite" || pm.functional_limit_trap === "alleen met hulp / nee, dat kan ik niet"){funct_beperk++;}
        if(pm.functional_limit_stoel === "ja, met enige moeite" || pm.functional_limit_trap === "ja, met veel moeite" || pm.functional_limit_trap === "alleen met hulp / nee, dat kan ik niet"){funct_beperk++;}
        if(pm.functional_limit_nagels === "ja, met enige moeite" || pm.functional_limit_trap === "ja, met veel moeite" || pm.functional_limit_trap === "alleen met hulp / nee, dat kan ik niet"){funct_beperk++;}
        if(pm.functional_limit_lopen === "ja, met enige moeite" || pm.functional_limit_trap === "ja, met veel moeite" || pm.functional_limit_trap === "alleen met hulp / nee, dat kan ik niet"){funct_beperk++;}
    }
    return funct_beperk;
}

exports.calculatePatientFallRisk = calculatePatientFallRisk;
exports.isPatientFallRiskCalculable = isPatientFallRiskCalculable;
exports.reportMissingVariables = reportMissingVariables;
exports.calcFunctBeperk = calcFunctBeperk;
exports.calculateAndSetPatientVariablesForFallRisk = calculateAndSetPatientVariablesForFallRisk;

// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021-2024 Stichting Open Electronics Lab
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const adfice_factory = require('./adfice')
const util = require("util");

let adfice = adfice_factory.adfice_init();

afterAll(async () => {
    return await adfice.shutdown();
});

jest.setTimeout(10000); //seems to be needed on the desk dinosaur

test('verification1: conforms to spec', async () => {
    let patient_id = "00000000-0000-4000-8000-100000000004";
    let patientAdvice = await adfice.get_advice_for_patient(patient_id);
    let fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6b,6e,7,11");

});


/*
// get the list of rules that have been fired by validation patients
test('validatation1: fake patients for clinicians to check', async () => {
let patient_id = "00000000-0000-4000-8000-100000000131";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
let fired0 = patientAdvice.medication_advice[0].fired.toString();
let fired1 = patientAdvice.medication_advice[1].fired.toString();
console.log(131);
console.dir(fired0 + "," + fired1);
fired0=null; fired1= null; patientAdvice=null;

patient_id = "00000000-0000-4000-8000-100000000132";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
fired0 = patientAdvice.medication_advice[0].fired.toString();
fired1 = patientAdvice.medication_advice[1].fired.toString();
let fired2 = patientAdvice.medication_advice[2].fired.toString();
console.log(132);
console.dir(fired0 + "," + fired1 + "," + fired2);
fired0=null; fired1= null; fired2= null; patientAdvice=null;

patient_id = "00000000-0000-4000-8000-100000000133";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
fired0 = patientAdvice.medication_advice[0].fired.toString();
console.log(133);
console.dir(fired0);
fired0=null; patientAdvice=null;

patient_id = "00000000-0000-4000-8000-100000000134";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
fired0 = patientAdvice.medication_advice[0].fired.toString();
fired1 = patientAdvice.medication_advice[1].fired.toString();
console.log(134);
console.dir(fired0 + "," + fired1);
fired0=null; fired1= null; patientAdvice=null;

patient_id = "00000000-0000-4000-8000-100000000135";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
fired0 = patientAdvice.medication_advice[0].fired.toString();
fired1 = patientAdvice.medication_advice[1].fired.toString();
console.log(135);
console.dir(fired0 + "," + fired1);
fired0=null; fired1= null; patientAdvice=null;

patient_id = "00000000-0000-4000-8000-100000000136";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
fired0 = patientAdvice.medication_advice[0].fired.toString();
console.log(136);
console.dir(fired0);
fired0=null; patientAdvice=null;

patient_id = "00000000-0000-4000-8000-100000000137";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
fired0 = patientAdvice.medication_advice[0].fired.toString();
fired1 = patientAdvice.medication_advice[1].fired.toString();
console.log(137);
console.dir(fired0 + "," + fired1);
fired0=null; fired1= null; patientAdvice=null;

patient_id = "00000000-0000-4000-8000-100000000138";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
fired0 = patientAdvice.medication_advice[0].fired.toString();
console.log(138);
console.dir(fired0);
fired0=null; patientAdvice=null;

patient_id = "00000000-0000-4000-8000-100000000139";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
fired0 = patientAdvice.medication_advice[0].fired.toString();
console.log(139);
console.dir(fired0);
fired0=null; patientAdvice=null;

patient_id = "00000000-0000-4000-8000-100000000140";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
fired0 = patientAdvice.medication_advice[0].fired.toString();
console.log(140);
console.dir(fired0);
fired0=null; patientAdvice=null;

patient_id = "00000000-0000-4000-8000-100000000141";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
fired0 = patientAdvice.medication_advice[0].fired.toString();
console.log(141);
console.dir(fired0);
fired0=null; patientAdvice=null;

patient_id = "00000000-0000-4000-8000-100000000142";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
fired0 = patientAdvice.medication_advice[0].fired.toString();
console.log(142);
console.dir(fired0);
});
// rules covered:
// "6","6b","6e","7","11","19a","19b","19c","19d","19f","20","21","22","23","24","25a","35","36","38","41","42","44","45","50","50b","51a","53","56","58","61","63","63b","64","66","67","76","78","80b","84","105"
*/

/*
Deliberately excluded:
"8","13b","17","27a","30a","43","47","50a","54a","60","63a","65","75","83a","93","96","103","105b","107","111","114","119","127","130","133","136"
"Allergy" rules are not implemented. The allergy data looks to be free text; if it isn't free text then I'm not sure what it is. Can't implement it until we know what we're getting.
They are currently set to "not active" in the DB.

"6a": N/A: Same as 6 and 6b, only with additioanl text indicting patient has epilepsy.
"12": Just says that no indication was found
"19": Same text as 19a, with use <6 mos instead of > 6 months
"37": Adds option to change to furosemide if patient is on a different loop diuretic
"122": Same as 123, but phrased for the patient NOT taking the preferred drug
"40","40a","40b","40c": Add warnings about hyponatremia, hypokalemia, hypercalcemia, and jicht if present.

*/

test('validatation2: fake patients for clinicians to check', async () => {
    /*
    144
    N05CD01  Flurazepam
    Morbus Parkinson
    "9"

    "haloperidol","N05AD01"
    "15","16","18"

    "levodopa","N04BA01"
    "26","27","27b"
    orthostatische hypotensie
    "26a"

    145 - NOT park
    "zolpidem","N05CF02"
    "cobicistat","V03AX03"
    "10"

    delier
    "quetiapine","N05AH04"
    "14","14a"

    "levodopa","N04BA01"
    "26b","27","27b"

    146 - NOT park
    N05BC01 : Meprobamate
    "13","13a"

    dementie
    "haloperidol","N05AD01"
    "14","14b","16","18"

    "sotalol","C07AA07"
    "57"
    diabetes
    "57a"
    atriumfibrilleren
    "59"

    147 -- no eGFR
    schizofrenie
    "haloperidol","N05AD01"
    "14c","16","18"

    "nicorandil","C01DX16"
    "54","55"

    "indometacin","M01AB01"
    "80a","81"
    "paracetamol, combinations excluding psycholeptics","N02BE51"
    "83"
    "pancuronium","M03AC01"
    "91","94"

    148 - no delier, dement, of schizo; no hypert
    "haloperidol","N05AD01"
    "14d","16","18"

    "prazosin","C02CA01"
    "51","53"

    149
    fluoxetine N06AB03
    "19e"
    orthostatische hypotensie
    "25"

    "reserpine","C02AA02"
    "49"

    150
    "carbamazepine","N03AF01"
    "28","29","29a","30","31"

    "amlodipine","C08CA01"
    "46","48a"
    Morbus Parkinson
    orthostatische hypotensie
    "48"
    hypertensie
    "52"

    151
    "rosuvastatin, amlodipine en lisinopril","C10BX07"
    "64a","66"

    152
    eGFR = 40
    "tramadol","N02AX02"
    "68","73"

    "diclofenac","M01AB05"
    "79","80a"

    "pancuronium","M03AC01"
    "86","87","88","89"

    "omeprazol","A02BC01"
    "117","118","120",

    153
    eGFR = 20
    "morfine","N02AA01"
    "69"

    "indometacin","M01AB01"
    "80"

    "methocarbamol","M03BA03"
    "86","87","88","90"

    154
    "gabapentin","N03AX12"
    "95","97"

    "gliclazide","A10BB09"
    "121","121a","123","128"

    155
    "promethazine","R06AD02"
    "99","100","101","102","104"

    "dicyclomine","A03AA07"
    "105a","105c"

    "flavoxaat","G04BD02"
    "110","112"

    156
    "butylscopolamine","A03BB01"
    "106","108"

    "tamsulosin","G04CA02"
    "113","115",

    "sildenafil","G04BE03"
    "113","113a","115",

    "fentolamine","G04BE05"
    "113","113a","113b","115",

    157
    "sitagliptin","A10BH01"
    "124"

    "rivastigmine","N06DA03"
    "129","131"

    158
    "lixisenatide","A10BJ03"
    "125"

    "piracetam","N06BX03"
    "132","132a","134"

    159
    "dapagliflozin","A10BK01"
    "126"

    "salmeterol","R03AC12"
    "135","137"

    */

});

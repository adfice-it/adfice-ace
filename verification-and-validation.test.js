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

    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000005";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6,6e,7,11");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000006";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6a,6e,7,11");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000007";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6b,6e,7,11");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000008";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6b,6e,7,9,11");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000009";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6b,6e,7,10,11");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000010";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6,6e,7,9,11");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000011";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6,6e,7,11,105");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000012";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("12,13,13a");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000013";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("12,13,13a");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000014";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14d,16,18");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000015";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14,14a,16,18,105");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000016";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14,14b,16,18");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000017";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14c,16,18");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000018";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14d,15,16,18");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000019";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14d,16,18");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000020";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14d,16,18");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000021";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14,15,16,18,105");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000022";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14,14b,14c,16,18");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000023";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14,16,18");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000024";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14,16,18");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000025";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19c,19d,19f,20,21,23,25a,105");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000026";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19,19d,19f,20,22,23,25a,105");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000027";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19a,19d,19f,20,22,25a,105");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000028";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19b,19d,19f,23,25a");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000029";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19c,19d,19e,19f,20,22,23,25a");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000030";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19c,19d,19f,20,22,24,25a");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000031";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19c,19d,19f,20,22,25,25a");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000032";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19c,19d,19f,20,22,23,25,25a");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000033";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("26b,27,27b,105");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000034";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("26,27,27b");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000035";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("26,27,27b");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000036";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("26,26a,27,27b");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000037";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("28,29,29a,30,31");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000038";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("28,30,31");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000039";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("28,29,31");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000040";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("28,29,31");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000041";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,42,42b,44,45");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000042";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,36,42,42b,44,45");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000043";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,36,37,42,42b,44,45");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000044";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,38,42,42b,44,45");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000045";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,40,41,42,42b,44,45");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000046";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,40a,41,42,42b,44,45");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000047";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,40b,41,42,42b,44,45");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000048";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,40c,41,42,42b,44,45");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000049";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,42,42b,44,45");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000050";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48a,49");
});

test('verification2: conforms to spec', async () => {
    let patient_id = "00000000-0000-4000-8000-100000000051";
    let patientAdvice = await adfice.get_advice_for_patient(patient_id);
    let fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48,48a,49");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000052";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48a,49");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000053";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,50,51a,53");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000054";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,50,51a,53");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000055";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48a,51,52");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000056";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48a,51,53");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000057";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("51a,53,54,55");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000058";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("51a,53,54,55");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000059";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,56,57,58,61,62");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000060";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,56,57,57a,58,61,62");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000061";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,56,58,61,62");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000062";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,56,61,62");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000063";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,56,58,61,62");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000064";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,63,63b");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000065";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,63,63b");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000066";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("64,66");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000067";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("64,66");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000068";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("41,42,42b,44,45");
    let fired1 = patientAdvice.medication_advice[1].fired.toString();
    expect(fired1).toBe("45,63,63b");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000681";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("41,42,42b,44,45");
    fired1 = patientAdvice.medication_advice[1].fired.toString();
    expect(fired1).toBe("45,46,48a,51a,53");
    let fired2 = patientAdvice.medication_advice[2].fired.toString();
    expect(fired2).toBe("45,63,63b");
    fired0 = null;
    fired1 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000069";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48a,51a,53");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000070";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,41,42,42b,44,45,48");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000071";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48a,51a,53");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000072";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,41,42,42a,44,45,62");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000073";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,41,42,42a,44,45,62");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000074";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,51a,53,64a,66");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000075";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,51a,53,64a,66");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000076";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("67,70,76");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000077";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("67,70,73,76");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000078";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("67,68,76");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000079";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("67,69,76");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000080";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("67,70,76");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000081";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("67,70,73,76");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000082";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("67,70,76");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000083";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80b,81,84");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000084";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80b,81,83,84");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000085";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,79,80b,84");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000086";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80,84");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000087";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80b,81,84");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000088";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80b,81,84");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000089";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80a,80b,81,84");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000090";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("87,88,91,94");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000091";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("86,88,91,94");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000092";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("87,88,89,94");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000093";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("87,88,90,94");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000094";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("87,88,91,94");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000095";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("87,88,91,94");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000096";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("86,88,91,94,105");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000097";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("95,97");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000098";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("95,97");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000099";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("100,104");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000100";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("99,100,101,104,105");
});

test('verification3: conforms to spec', async () => {
    let patient_id = "00000000-0000-4000-8000-100000000101";
    let patientAdvice = await adfice.get_advice_for_patient(patient_id);
    let fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("100,101,104");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000102";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("100,101,102,104");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000103";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("100,104");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000104";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("105,105a,105c");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000105";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("105,105a,105c");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000106";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("105,106,108");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000107";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("105,106,108");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000108";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("105,110,112");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000109";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("105,110,112");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000110";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("113,113c,115");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000111";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("113,113c,115");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000112";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("117,117a,118,120");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000113";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("117,117a,120");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000114";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("117,117a,118,120");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000115";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("121,121a,123,128");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000116";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("121,121a,122,128");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000117";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("121,124,128");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000118";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("121,125,128");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000119";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("121,126,128");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000120";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("121,121a,123,128");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000121";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("129,131");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000122";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("129,131");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000123";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("132,132a,134");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000124";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("99,100,101,104,132,134");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000125";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("135,137");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000126";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("41,42,42b,44,45");
    fired0 = null;
    patientAdvice = null;
    patient_id = "00000000-0000-4000-8000-100000000127";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,41,42,42a,44,45,62");
    fired0 = null;
    patientAdvice = null;
/*    patient_id = "00000000-0000-4000-8000-100000000128";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80a,80b,81,84");
    fired0 = null;
    patientAdvice = null;
*/	/* removed topical NSAIDs */

    // TODO check for other combi drugs that aren't handled correctly,
    // as well as ATCs that appear in >1 vervolg rule
    patient_id = "00000000-0000-4000-8000-100000000129";
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80a,81,84,117,118");


});

test('verification4: check duplicate criteria', async () => {
	let date_retrieved = "2024-07-08";
	let start_date = "2024-01-01";
	let patient_id = "00000000-0000-4000-8000-100000000004";

// med-only rule
	//cleanup if there was a failure last run
	let sql_delete_med = "DELETE FROM patient_medication where patient_id = ? and start_date = ?;";
	let params_delete_med = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	
	let sql_add_med = "INSERT INTO patient_medication (patient_id, date_retrieved, medication_name, generic_name, ATC_code, start_date) VALUES (?,?,?,?,?,?)"
	let params_med = [patient_id, date_retrieved, "test6", "test6", 'N05BA02', start_date];
	await adfice.db.sql_query(sql_add_med,params_med);
	let patientAdvice = await adfice.get_advice_for_patient(patient_id);
    let fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6b,6e,7,11");
	fired0 = null;
    patientAdvice = null;
	//cleanup
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
		
	
// sql criteria
	//6
	patient_id = "00000000-0000-4000-8000-100000000005";

	let sql_delete_prob = 'DELETE FROM patient_problem where patient_id = ? and start_date = ?;';
	let params_delete_prob = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	let sql_add_prob = "INSERT INTO patient_problem (patient_id, date_retrieved, start_date, name) VALUES (?,?,?,?);";
	let params_prob = [patient_id, date_retrieved, start_date, "angststoornis"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6,6e,7,11");
    fired0 = null;
    patientAdvice = null;	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//6a
	patient_id = "00000000-0000-4000-8000-100000000006";
	params_delete_prob = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "epilepsy"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6a,6e,7,11");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);

	//6b
    patient_id = "00000000-0000-4000-8000-100000000008";
	params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "lewy-bodies-dementie"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6b,6e,7,9,11");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);

	//10
    patient_id = "00000000-0000-4000-8000-100000000009";
	params_delete_med = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	params_med = [patient_id, date_retrieved, "test9", "test9", 'J05AE01', start_date];
	await adfice.db.sql_query(sql_add_med,params_med);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6b,6e,7,10,11");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	
	//14, 14a
	patient_id = "00000000-0000-4000-8000-100000000015";
	params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "delier"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14,14a,16,18,105");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);

	//14b
    patient_id = "00000000-0000-4000-8000-100000000016";
	params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "dementie"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14,14b,16,18");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//14c
    patient_id = "00000000-0000-4000-8000-100000000017";
	params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "schizofrenie"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14c,16,18");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	// I don't think 14d can have duplicate entries
	
	//15
	patient_id = "00000000-0000-4000-8000-100000000018";
	params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "lewy-bodies-dementie"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14d,15,16,18");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//19
	patient_id = "00000000-0000-4000-8000-100000000026";
	let date = new Date();			
	let year = date.getFullYear();
	let m = (date.getMonth() + 1); //javascript 0-offset months
	let month = m -2;
	if(month < 0){month = 11};
	let recent_start_date = year + '-' + month + '-01';
	params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "depressie"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19,19d,19f,20,22,23,25a,105");
	fired0 = null;
    patientAdvice = null;
	params_delete_med = [patient_id, recent_start_date];
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	params_med = [patient_id, date_retrieved, "test19", "test19", 'N06AA02', recent_start_date];
	await adfice.db.sql_query(sql_add_med,params_med);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("19,19d,19f,20,22,23,25a,105");
	fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	
	//19a
    patient_id = "00000000-0000-4000-8000-100000000027";
	params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "depressie"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19a,19d,19f,20,22,25a,105");
	fired0 = null;
    patientAdvice = null;
	params_delete_med = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	params_med = [patient_id, date_retrieved, "test19aa", "test19", 'N06AA02', start_date];
	await adfice.db.sql_query(sql_add_med,params_med);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19a,19d,19f,20,22,25a,105");
	fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	
	//19b
	patient_id = "00000000-0000-4000-8000-100000000028";
    params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "angststoornis"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19b,19d,19f,23,25a");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);

	//I think 19c, 21, 22 cannot have duplicate problems
	
// first labs
	//23
	patient_id = "00000000-0000-4000-8000-100000000025";
	let sql_delete_lab = "DELETE FROM patient_lab where patient_id = ? and date_measured = ?";
	let params_delete_lab = [patient_id,start_date];
	await adfice.db.sql_query(sql_delete_lab,params_delete_lab);
	
	let sql_add_lab = "INSERT INTO patient_lab (patient_id, date_retrieved, date_measured, lab_test_name, lab_test_result, lab_test_units) VALUES (?,?,?,?,?,?);"
	let params_lab = [patient_id, date_retrieved, start_date, "kalium",2.4,"mmol/l"];
	await adfice.db.sql_query(sql_add_lab,params_lab);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();    
    expect(fired0).toBe("19c,19d,19f,20,21,23,25a,105");
	fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_lab,params_delete_lab);

	//24 is OK: labs table does not permit 2 labs with the same name

	//25
	patient_id = "00000000-0000-4000-8000-100000000031";
	params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "orthostatische-hypotensie"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
	params_prob = [patient_id, date_retrieved, start_date, "tachycardia"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19c,19d,19f,20,22,25,25a");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//26
	patient_id = "00000000-0000-4000-8000-100000000034";
    params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "progressive-supranuclear-palsy"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("26,27,27b");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);

	//26a
	patient_id = "00000000-0000-4000-8000-100000000036";
    params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "progressive-supranuclear-palsy"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
	params_prob = [patient_id, date_retrieved, start_date, "orthostatische-hypotensie"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("26,26a,27,27b");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);

	//26b
	patient_id = "00000000-0000-4000-8000-100000000033";
	params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("26b,27,27b,105");
    fired0 = null;
    patientAdvice = null;
	params_prob = [patient_id, date_retrieved, start_date, "progressive-supranuclear-palsy"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
	patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("26,27,27b,105");
	fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);

	//35 - confirm that rule does not fire if 2nd med is present
	patient_id = "00000000-0000-4000-8000-100000000134";
	params_delete_med = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("35,38,42,42b,44,45");
	params_med = [patient_id, date_retrieved, "test35", "test35", 'C09AA01', start_date];
	await adfice.db.sql_query(sql_add_med,params_med);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("38,42,42b,44,45");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
    
	
	//36
	patient_id = "00000000-0000-4000-8000-100000000042";
	params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "hartfalen"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,36,42,42b,44,45");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//37
	patient_id = "00000000-0000-4000-8000-100000000043";
    params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "hartfalen"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,36,37,42,42b,44,45");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//38
	patient_id = "00000000-0000-4000-8000-100000000044";
    params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "hypertensie"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,38,42,42b,44,45");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//40
	patient_id = "00000000-0000-4000-8000-100000000045";
	params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "hypokalemia"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("35,40,41,42,42b,44,45");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);

	//40a
	patient_id = "00000000-0000-4000-8000-100000000046";
    params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "hyponatremia"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("35,40a,41,42,42b,44,45");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//40b
	patient_id = "00000000-0000-4000-8000-100000000047";
    params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "hypercalcemia"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,40b,41,42,42b,44,45");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);

	//40c
	patient_id = "00000000-0000-4000-8000-100000000048";
    params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "jicht"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,40c,41,42,42b,44,45");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);

	//48
	patient_id = "00000000-0000-4000-8000-100000000051";
    params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "progressive-supranuclear-palsy"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
	params_prob = [patient_id, date_retrieved, start_date, "orthostatische-hypotensie"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48,48a,49");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);

    //52
	patient_id = "00000000-0000-4000-8000-100000000055";
	params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "hypertensie"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48a,51,52");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//53
	patient_id = "00000000-0000-4000-8000-100000000053";
	params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "schizofrenie"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,50,51a,53");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//57a
	patient_id = "00000000-0000-4000-8000-100000000060";
	params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "diabetes"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,56,57,57a,58,61,62");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);

	//58
	patient_id = "00000000-0000-4000-8000-100000000059";
	params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "angststoornis"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
	params_prob = [patient_id, date_retrieved, start_date, "schizofrenie"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,56,57,58,61,62");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//59
	patient_id = "00000000-0000-4000-8000-100000000146";
	params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,56,57,57a,59,61,62"); // test the normal state first
    fired0 = null;
    patientAdvice = null;
	params_prob = [patient_id, date_retrieved, start_date, "angina-pectoris"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,56,57,57a,59,61,62");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//68, 69, 70, 79, 80, 80a, 80b, 81 OK: patient_labs does not allow two labs of the same name
	
	//83
	patient_id = "00000000-0000-4000-8000-100000000084";
    params_delete_med = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	params_med = [patient_id, date_retrieved, "test83", "test83", 'N02AJ06', start_date];
	await adfice.db.sql_query(sql_add_med,params_med);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80b,81,83,84");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_med,params_delete_med);

	//86
	patient_id = "00000000-0000-4000-8000-100000000091";
    params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "paraplegia"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("86,88,91,94");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//87
	patient_id = "00000000-0000-4000-8000-100000000092";
	params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "angststoornis"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
	params_prob = [patient_id, date_retrieved, start_date, "schizofrenie"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("87,88,89,94");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);

	//89, 90, 91  OK, patient_labs does not allow 2 labs of the same name
	
	//102
	patient_id = "00000000-0000-4000-8000-100000000102";
    params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "progressive-supranuclear-palsy"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("100,101,102,104");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
    
	//12
	patient_id = "00000000-0000-4000-8000-100000000012";
    params_delete_prob = [patient_id, start_date];	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "diabetes"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
	params_prob = [patient_id, date_retrieved, start_date, "schizofrenie"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
    patientAdvice = await adfice.get_advice_for_patient(patient_id);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("12,13,13a");
    fired0 = null;
    patientAdvice = null;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
    
});

test('verification5: eGFR with no date should fire rule 81', async () => {
	let date_retrieved = "2024-07-30";
	let start_date = "2024-01-01";
	let patient_id = "00000000-0000-4000-8000-100000000004";

	//cleanup if there was a failure last run
	let sql_delete_med = "DELETE FROM patient_medication where patient_id = ? and start_date = ?;";
	let params_delete_med = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	let sql_delete_lab = "DELETE FROM patient_lab where patient_id = ? and date_measured IS NULL";
	let params_delete_lab = [patient_id];
	await adfice.db.sql_query(sql_delete_lab,params_delete_lab);
	
	let sql_add_med = "INSERT INTO patient_medication (patient_id, date_retrieved, medication_name, generic_name, ATC_code, start_date) VALUES (?,?,?,?,?,?)"
	let params_med = [patient_id, date_retrieved, "naproxen 02", "naproxen 02", 'M01AE02', start_date];
	await adfice.db.sql_query(sql_add_med,params_med);
	let sql_add_lab = "INSERT INTO patient_lab (patient_id, date_retrieved, date_measured, lab_test_name, lab_test_result, lab_test_units) VALUES (?,?,?,?,?,?);"
	let params_lab = [patient_id, date_retrieved, null, "eGFR",50,"mL/min/1.73 m²"];
	await adfice.db.sql_query(sql_add_lab,params_lab);
	let patientAdvice = await adfice.get_advice_for_patient(patient_id);
    let fired0 = patientAdvice.medication_advice[0].fired.toString();
    // this test will fail; an eGFR with no date_measured does not fire any of the advice rules
	expect(fired0).toBe("78,80a,81,84");
	// expect(fired0).toBe("78,79,80a,81,84");
	fired0 = null;
    patientAdvice = null;
	//cleanup
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
		
});

test('verification6: pre-check checkboxes', async () => {
	let patient_id = "00000000-0000-4000-8000-100000000004";
	let date_retrieved = "2024-07-08";
	let start_date = "2024-01-01";
	let fired = [];
	let atc_code = '';
	
	let sql_delete_prob = 'DELETE FROM patient_problem where patient_id = ? and start_date = ?;';
	let params_delete_prob = [];
	
	let sql_add_prob = "INSERT INTO patient_problem (patient_id, date_retrieved, start_date, name) VALUES (?,?,?,?);";
	let params_prob = [];
	
	fired = ['6e'];
	atc_code = 'N05BA01';
	//checkbox 1 rule 1
	let checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_N05BA01_6e_1).toBe("checked");
	
	//checkbox 2 rule 1
	patient_id = "00000000-0000-4000-8000-100000000007";
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_N05BA01_6e_2).toBe("checked");
	
	//checkbox 1 rule 2
	patient_id = "00000000-0000-4000-8000-100000000004";
	params_delete_prob = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "angststoornis"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_N05BA01_6e_1).toBeDefined;
	params_prob = [patient_id, date_retrieved, start_date, "parkinson"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_N05BA01_6e_1).toBe("checked");
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//checkbox 2 rule 2
	patient_id = "00000000-0000-4000-8000-100000000008";
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_N05BA01_6e_2).toBe("checked");

/*
let patientAdvice = await adfice.get_advice_for_patient(patient_id);	
console.log(patientAdvice.medications);
*/
	
});

test('verification7: pre-check checkbox rules should tolerate duplicate criteria', async () => {
	let date_retrieved = "2024-07-08";
	let start_date = "2024-01-01";
	let sql_delete_prob = 'DELETE FROM patient_problem where patient_id = ? and start_date = ?;';
	let params_delete_prob = [];
	
	let sql_add_prob = "INSERT INTO patient_problem (patient_id, date_retrieved, start_date, name) VALUES (?,?,?,?);";
	let params_prob = [];

	let date = new Date();			
	let year = date.getFullYear();
	let m = (date.getMonth() + 1); //javascript 0-offset months
	let day = date.getDate() - 2;
	if (day <= 0) {
		m = m -1;
		day = 28;
	}
	if (m == 0){m = 12;}
	let just_started = year + '-' + m + '-' + day;
	
	let sql_add_med = "INSERT INTO patient_medication (patient_id, date_retrieved, medication_name, generic_name, ATC_code, start_date) VALUES (?,?,?,?,?,?)";
	let sql_delete_med = "DELETE FROM patient_medication where patient_id = ? and start_date = ?;";
	let params_med = [];
	let params_delete_med = [];
	let fired = [];
	let atc_code = '';
	
	let patient_id = "00000000-0000-4000-8000-100000000004";
	
	//6e checkbox 1 rule 1
	//cleanup if there was a failure last run
	params_delete_med = [patient_id, just_started];
	await adfice.db.sql_query(sql_delete_med,params_delete_med);

	params_med = [patient_id, date_retrieved, "test6e1", "test6e1", 'N05CA02', just_started];
	await adfice.db.sql_query(sql_add_med,params_med);
	
	fired = ['6e'];
	atc_code = 'N05CA02';
	let checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	
	expect(checkboxes.cb_N05CA02_6e_1).toBe("checked");

	//cleanup
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	
	//checkbox 1 rule 2
	patient_id = "00000000-0000-4000-8000-100000000004";
	params_delete_prob = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_delete_med = [patient_id, just_started];
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	params_prob = [patient_id, date_retrieved, start_date, "angststoornis"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
	params_prob = [patient_id, date_retrieved, start_date, "parkinson"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
	params_prob = [patient_id, date_retrieved, start_date, "progressive-supranuclear-palsy"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, 'N05BA01');
	expect(checkboxes.cb_N05BA01_6e_1).toBe("checked");
	params_med = [patient_id, date_retrieved, "test6e1", "test6e1", 'N05CA02', just_started];
	await adfice.db.sql_query(sql_add_med,params_med);
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_N05CA02_6e_1).toBe("checked");
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	
	//6e checkbox 2 rule 1
	patient_id = "00000000-0000-4000-8000-100000000008";
	params_delete_med = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	params_med = [patient_id, date_retrieved, "test6e2", "test6e2", 'N05CA02', start_date];
	await adfice.db.sql_query(sql_add_med,params_med);
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_N05CA02_6e_2).toBe("checked");
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
		
	//6e checkbox 2 rule 2
	patient_id = "00000000-0000-4000-8000-100000000008"; // has Parkinson, N05BA01
	atc_code = 'N05BA02';
	params_delete_prob = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_delete_med = [patient_id, just_started];
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	params_prob = [patient_id, date_retrieved, start_date, "progressive-supranuclear-palsy"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
	params_med = [patient_id, date_retrieved, "test6e2", "test6e2", 'N05BA02', just_started];
	await adfice.db.sql_query(sql_add_med,params_med);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_N05BA02_6e_2).toBe("checked");
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	
	//6e checkbox 2 rule 3: check if ATC N05CM05 
	patient_id = "00000000-0000-4000-8000-100000000011";
	atc_code = 'N05CM05';
	// should be checked for this patient
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_N05CM05_6e_2).toBe("checked");
	
	//13 checkbox 1 rule 1: check if ATC = N05BB01
	patient_id = "00000000-0000-4000-8000-100000000012";
	params_delete_med = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	atc_code = 'N05BE01';
	fired = ['13'];
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_N05BE01_13_1).toBeFalsy;
	atc_code = 'N05BB01';
	params_med = [patient_id, date_retrieved, "test13", "test13", 'N05BB01', start_date];
	await adfice.db.sql_query(sql_add_med,params_med);
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_N05BB01_13_1).toBe("checked");
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	
	//16 checkbox 2 rule 1: check if ATC in N05AA01,N05AA03,N05AB03,N05AB06,N05AC02,N05AH03,N05AH04
	patient_id = "00000000-0000-4000-8000-100000000014";
	params_delete_med = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	atc_code = 'N05AD01';
	fired = ['16'];
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_N05AD01_16_2).toBeFalsy;
	atc_code = 'N05AH04';
	params_med = [patient_id, date_retrieved, "test16", "test16", 'N05AH04', start_date];
	await adfice.db.sql_query(sql_add_med,params_med);
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_N05AH04_16_2).toBe("checked");
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	
	//19f box 1 rule 1: not depressie, not angststoornis
	fired = ['19f'];
	patient_id = "00000000-0000-4000-8000-100000000029"; // has no probs
	params_delete_prob = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	atc_code = 'N06AB03';
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_N06AB03_19f_1).toBe("checked"); //default should be checked
	params_prob = [patient_id, date_retrieved, start_date, "depressie"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_N06AB03_19f_1).toBeFalsy;
	params_prob = [patient_id, date_retrieved, start_date, "angststoornis"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_N06AB03_19f_1).toBeFalsy;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//19f box 1 rule 2: check if ATC in N06AA, N06AB05
	patient_id = "00000000-0000-4000-8000-100000000027"; // has depressie, N06AA09
	atc_code = 'N06AA09';
	// should be checked for this patient
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_N06AA09_19f_1).toBe("checked");
	
	//27 box 2 rule 1: check if ATC in N04AA01,N04AA02,N04AA04,N04AB02,N04AC01
	fired = ['27'];
	patient_id = "00000000-0000-4000-8000-100000000033"; // has N04AA02
	atc_code = 'N04AA02';
	// should be checked for this patient
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_N04AA02_27_2).toBe("checked");
	// should be not checked for this patient
	patient_id = "00000000-0000-4000-8000-100000000034"; // has N04BA01
	atc_code = 'N04BA01';
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_N04AA02_27_2).toBeFalsy;
	
	//36 box 1 rule 1: always checked (box says to check if symptoms are still present)
	fired = ['36'];
	patient_id = "00000000-0000-4000-8000-100000000042";
	atc_code = 'C03CA01';
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C03CA01_36_1).toBe("checked");
	//36 box 2 rule 1: always checked (box says to consult cardiologist)
	expect(checkboxes.cb_C03CA01_36_2).toBe("checked");
	
	//42a checkbox 2 rule 1: defunct

	//42a checkbox 2 rule 2: diuretics + beta-blockers: any diuretic and NOT hypertensie and NOT hartfalen
	patient_id = "00000000-0000-4000-8000-100000000072"; // C07BB02 Metoprolol and thiazides; 
	atc_code = 'C07BB02';
	fired = ['42a'];
	params_delete_prob = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	// should be checked if there is no dx; i.e. no indication
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C07BB02_42a_2).toBe("checked");
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "hypertensie"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C07BB02_42a_2).toBeFalsy;
	params_prob = [patient_id, date_retrieved, start_date, "hartfalen"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C07BB02_42a_2).toBeFalsy;
	params_delete_prob = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//42a checkbox 2 rule 3: if thiazide + jicht or hyponatremia, hypokalemia, or hypocalcemia, should be checked
	patient_id = "00000000-0000-4000-8000-100000000072"; // C07BB02 Metoprolol and thiazides; 
	atc_code = 'C07BB02';
	params_delete_prob = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	let sql_delete_lab = "DELETE FROM patient_lab where patient_id = ? and date_measured = ?";
	let params_delete_lab = [patient_id,start_date];
	await adfice.db.sql_query(sql_delete_lab,params_delete_lab);
	// start with it unchecked due to hartfalen
	params_prob = [patient_id, date_retrieved, start_date, "hartfalen"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C07BB02_42a_2).toBeFalsy;
	// check it due to labs
	let sql_add_lab = "INSERT INTO patient_lab (patient_id, date_retrieved, date_measured, lab_test_name, lab_test_result, lab_test_units) VALUES (?,?,?,?,?,?);"
	let params_lab = [patient_id, date_retrieved, start_date, "natrium",100,"mmol/l"];
	await adfice.db.sql_query(sql_add_lab,params_lab);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C07BB02_42a_2).toBe("checked");
	params_lab = [patient_id, date_retrieved, start_date, "kalium",2.5,"mmol/l"];
	await adfice.db.sql_query(sql_add_lab,params_lab);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C07BB02_42a_2).toBe("checked");
	params_prob = [patient_id, date_retrieved, start_date, "hyponatremia"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C07BB02_42a_2).toBe("checked");
	params_prob = [patient_id, date_retrieved, start_date, "hypokalemia"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C07BB02_42a_2).toBe("checked");
	await adfice.db.sql_query(sql_delete_lab,params_delete_lab);
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);

	//42a checkbox 2 rule 4: check with parkinson-like conditions and orthostatic hypotension
	params_delete_prob = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "hartfalen"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	params_prob = [patient_id, date_retrieved, start_date, "lewy-bodies-dementie"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	params_prob = [patient_id, date_retrieved, start_date, "orthostatische-hypotensie"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C07BB02_42a_2).toBe("checked");
	params_prob = [patient_id, date_retrieved, start_date, "multiple-system-atrophy"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C07BB02_42a_2).toBe("checked");
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//42b checkbox 2 rule 5: check if ATC = C07DA
	patient_id = "00000000-0000-4000-8000-100000000127";
	params_delete_med = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	atc_code = 'C07DB01';
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C07DB01_42a_2).toBeFalsy;
	atc_code = 'C07DA06';
	params_med = [patient_id, date_retrieved, "test42b", "test42b", 'C07DA06', start_date];
	await adfice.db.sql_query(sql_add_med,params_med);
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C07DA06_42a_2).toBe("checked");
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	
	//42b checkbox 2 rule 1: check if lisdiuretic and no hartfalen
	patient_id = "00000000-0000-4000-8000-100000000041";
	params_delete_prob = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	atc_code = 'C03CA01';
	fired = ['42b'];
	// default patient has no heart failure, box should be checked
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C03CA01_42b_2).toBe("checked");
	params_prob = [patient_id, date_retrieved, start_date, "hypertensie"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C03CA01_42b_2).toBe("checked");
	params_prob = [patient_id, date_retrieved, start_date, "hartfalen"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C03CA01_42b_2).toBeFalsy;
	
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//42b checkbox 2 rule 2: check if any diuretic and no hypertensie or hartfalen
	patient_id = "00000000-0000-4000-8000-100000000045"; //C03AA03 and no probs
	params_delete_prob = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	atc_code = 'C03AA03';
	fired = ['42b'];
	// default patient has no hypertension or heart failure, box should be checked
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C03AA03_42b_2).toBe("checked");
	params_prob = [patient_id, date_retrieved, start_date, "hypertensie"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C03AA03_42b_2).toBeFalsy;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//42b checkbox 2 rule 4: check if any diuretic and parkinson-like condition and orthostatic hypotension
	params_delete_prob = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "hypertensie"];
	await adfice.db.sql_query(sql_add_prob,params_prob);
	params_prob = [patient_id, date_retrieved, start_date, "lewy-bodies-dementie"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	params_prob = [patient_id, date_retrieved, start_date, "orthostatische-hypotensie"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C03AA03_42b_2).toBe("checked");
	params_prob = [patient_id, date_retrieved, start_date, "multiple-system-atrophy"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C03AA03_42b_2).toBe("checked");
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	

	
	//46 checkbox 1 rule 1: check if parkinson-like condition and orthostatic hypotension
	patient_id = "00000000-0000-4000-8000-100000000050";
	params_delete_prob = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	atc_code = 'C03AA03';
	fired = ['46'];
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C03AA03_46_1).toBeFalsy;
	params_prob = [patient_id, date_retrieved, start_date, "lewy-bodies-dementie"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	params_prob = [patient_id, date_retrieved, start_date, "orthostatische-hypotensie"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C03AA03_46_1).toBe("checked");
	params_prob = [patient_id, date_retrieved, start_date, "multiple-system-atrophy"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C03AA03_46_1).toBe("checked");
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//46 checkbox 1 rule 2: check if ATC in C02A,C04,C08,C02CA,C02DA,C02DB,C02DC,C02DG01,C02DD01
	patient_id = "00000000-0000-4000-8000-100000000071";
	atc_code = 'C04AA02';
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C04AA02_46_1).toBe("checked");
	
	//50 checkbox 1 rule 1: check if parkinson-like condition and orthostatic hypotension
	patient_id = "00000000-0000-4000-8000-100000000053";
	params_delete_prob = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	atc_code = 'C08DA01';
	fired = ['50'];
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C08DA01_50_1).toBeFalsy;
	params_prob = [patient_id, date_retrieved, start_date, "lewy-bodies-dementie"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	params_prob = [patient_id, date_retrieved, start_date, "orthostatische-hypotensie"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C08DA01_50_1).toBe("checked");
	params_prob = [patient_id, date_retrieved, start_date, "multiple-system-atrophy"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C08DA01_50_1).toBe("checked");
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//54 checkbox 1 rule 1: always checked (drugs which fall under this rule are generally contraindicated)
	fired = ['54'];
	patient_id = "00000000-0000-4000-8000-100000000057";
	atc_code = 'C01DX16';
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C01DX16_54_1).toBe("checked");
	
	//56 checkbox 1 rule 1: check if in C07AA,C07AG,C07BA,C07BG,C07CA,C07CG,C07EA,C07FX01,C07FX02,C07FX06,C07FA05,S01ED01,S01ED03,S01ED04,S01ED05
	fired = ['56'];
	patient_id = "00000000-0000-4000-8000-100000000059";
	atc_code = 'C07AA07';
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C07AA07_56_1).toBe("checked");
	// add atriumfibrilleren and confirm that it stays checked
	params_delete_prob = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "atriumfibrilleren"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C07AA07_56_1).toBe("checked");
	//add myocardinfarct as well
	params_prob = [patient_id, date_retrieved, start_date, "myocardinfarct"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C07AA07_56_1).toBe("checked");
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//56 checkbox 1 rule 2: check if parkinson or parkinson-like dz and orthostatic hypotension
	patient_id = "00000000-0000-4000-8000-100000000062"; // C07AB02 and atriumfibrilleren
	atc_code = 'C07AB02';
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C07AB02_56_1).toBeFalsy;
	params_delete_prob = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "lewy-bodies-dementie"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	params_prob = [patient_id, date_retrieved, start_date, "orthostatische-hypotensie"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C07AB02_56_1).toBe("checked");
	params_prob = [patient_id, date_retrieved, start_date, "multiple-system-atrophy"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C07AB02_56_1).toBe("checked");
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//56 checkbox 1 rule 3: check if not atriumfibrilleren, angina-pectoris, or myocardinfarct
	patient_id = "00000000-0000-4000-8000-100000000061"; // C07AB02 and not atriumfibrilleren
	atc_code = 'C07AB02';
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C07AB02_56_1).toBe("checked");
	//negative case already demonstrated as part of checking rule 1
	
	//63 checkbox 1 rule 1: check if parkinson or parkinson-like dz and orthostatic hypotension
	fired = ['63'];
	patient_id = "00000000-0000-4000-8000-100000000064"; // C09AA06, no probs
	atc_code = 'C09AA06';
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C09AA06_63_1).toBeFalsy;
	params_delete_prob = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "lewy-bodies-dementie"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	params_prob = [patient_id, date_retrieved, start_date, "orthostatische-hypotensie"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C09AA06_63_1).toBe("checked");
	params_prob = [patient_id, date_retrieved, start_date, "multiple-system-atrophy"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C09AA06_63_1).toBe("checked");
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//64 checkbox 1 rule 1: check if in C10BX03,C10BX07,C10BX09,C10BX11,C10BX14
	fired = ['64'];
	patient_id = "00000000-0000-4000-8000-100000000066"; // C10AA01, no probs
	atc_code = 'C10AA01';
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C10AA01_64_1).toBeFalsy;
	atc_code = 'C10BX11';
	params_delete_med = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	params_med = [patient_id, date_retrieved, "test64", "test64", 'C10BX11', start_date];
	await adfice.db.sql_query(sql_add_med,params_med);
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_C10BX11_64_1).toBe("checked");
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	
	//67 checkbox 2 rule 1: check if NOT in N02AA01,N02AA05,N02AB03
	fired = ['67'];
	patient_id = "00000000-0000-4000-8000-100000000081"; // N02AX02, no probs
	atc_code = 'N02AX02';
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_N02AX02_67_2).toBe("checked");
	// should be checked for this patient
	patient_id = "00000000-0000-4000-8000-100000000076"; // N02AA01, no probs
	atc_code = 'N02AA01';
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_N02AA01_67_2).toBeFalsy;
	
	//78 checkbox 2 rule 1:  measurement.eGFR.value <= 30
	fired = ['78'];
	patient_id = "00000000-0000-4000-8000-100000000085"; // M01AB05, eGFR OK
	atc_code = 'M01AB05';
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_M01AB05_78_2).toBeFalsy;
	patient_id = "00000000-0000-4000-8000-100000000086"; // M01AB05, eGFR low
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_M01AB05_78_2).toBe("checked");
	
	//78 checkbox 2 rule 2: combedication with N02BE01,N02BE51,N02BE71,N02AJ01,N02AJ06,N02AJ13,N02AJ17
	patient_id = "00000000-0000-4000-8000-100000000084"; // M01AB05, comedication with N02BE51
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_M01AB05_78_2).toBe("checked");
	
	//88 checkbox 2 rule 1: check if !paraplegia &!dwarslesie
	fired = ['88'];
	patient_id = "00000000-0000-4000-8000-100000000090"; // M03AC01, no probs
	atc_code = 'M03AC01';
	// should be checked if no probs
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_M03AC01_88_2).toBe("checked");
	patient_id = "00000000-0000-4000-8000-100000000091"; // M03AC01, dwarslesie
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_M03AC01_88_2).toBeFalsy;
	params_delete_prob = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	params_prob = [patient_id, date_retrieved, start_date, "paraplegia"]; 
	await adfice.db.sql_query(sql_add_prob,params_prob);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_M03AC01_88_2).toBeFalsy;
	await adfice.db.sql_query(sql_delete_prob,params_delete_prob);
	
	//88 checkbox 2 rule 2: check if M03BA03,M03BC01
	patient_id = "00000000-0000-4000-8000-100000000091"; // M03BA03, dwarslesie
	atc_code = 'M03BA03';
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_M03BA03_88_2).toBe("checked");
	
	//100 checkbox 3 rule 1: not R06AX29,R06AE07,R06AE09,R06AX13,R06AX27,R06AX22,R06AX26,R06AX25,R06AX28
	fired=['100'];
	patient_id = "00000000-0000-4000-8000-100000000099"; // R06AX13
	atc_code = 'R06AX13';
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_R06AX13_100_3).toBeFalsy;
	patient_id = "00000000-0000-4000-8000-100000000100"; // R06AD02
	atc_code = 'R06AD02';
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_R06AD02_100_3).toBe("checked");
	
	//105a checkbox 1 rule 1: always checked	
	fired=['105a'];
	patient_id = "00000000-0000-4000-8000-100000000104";
	atc_code = 'A03AA07';
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_A03AA07_105a_1).toBe("checked");
	
	//106 checkbox 1 rule 1: always checked
	fired=['106'];
	patient_id = "00000000-0000-4000-8000-100000000106";
	atc_code = 'A03BB01';
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_A03BB01_106_1).toBe("checked");
	
	//113 checkbox 1 rule 1: always checked
	fired=['113'];
	patient_id = "00000000-0000-4000-8000-100000000111";
	atc_code = 'G04CA03';
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_G04CA03_113_1).toBe("checked");
	
	//121 checkbox 1 rule 1: check if A10BH,A10BJ,A10BK,A10BB and not A10BB03,A10BB09
	fired = ['121'];
	patient_id = "00000000-0000-4000-8000-100000000001"; // no meds, no probs
	atc_code = 'A10AA01';
	params_delete_med = [patient_id, start_date];
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	params_med = [patient_id, date_retrieved, "test121", "test121", 'A10AA01', start_date];
	await adfice.db.sql_query(sql_add_med,params_med);
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_A10AA01_121_1).toBeFalsy;
	await adfice.db.sql_query(sql_delete_med,params_delete_med);
	
	patient_id = "00000000-0000-4000-8000-100000000116"; // A10BB07
	atc_code = 'A10BB07';
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_A10BB07_121_1).toBe("checked");
	
	patient_id = "00000000-0000-4000-8000-100000000115"; // A10BB09
	atc_code = 'A10BB09';
	checkboxes = null;
	checkboxes = await adfice.determine_preselected_checkboxes(fired, patient_id, atc_code);
	expect(checkboxes.cb_A10BB09_121_1).toBeFalsy;
	
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

// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
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
    let patientAdvice = await adfice.get_advice_for_patient(4);
    let fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6b,6e,7,11");

    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(5);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6,6e,7,11");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(6);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6a,6e,7,11");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(7);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6b,6e,7,11");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(8);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6b,6e,7,9,11");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(9);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6b,6e,7,10,11");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(10);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6,6e,7,9,11");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(11);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6,6e,7,11,105");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(12);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("12,13,13a");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(13);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("12,13,13a");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(14);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14d,16,18");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(15);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14,14a,16,18,105");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(16);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14,14b,16,18");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(17);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14c,16,18");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(18);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14d,15,16,18");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(19);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14d,16,18");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(20);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14d,16,18");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(21);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14,15,16,18,105");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(22);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14,14b,14c,16,18");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(23);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14,16,18");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(24);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14,16,18");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(25);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19c,19d,19f,20,21,23,25a,105");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(26);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19,19d,19f,20,22,23,25a,105");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(27);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19a,19d,19f,20,22,25a,105");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(28);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19b,19d,19f,23,25a");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(29);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19c,19d,19e,19f,20,22,23,25a");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(30);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19c,19d,19f,20,22,24,25a");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(31);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19c,19d,19f,20,22,25,25a");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(32);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19c,19d,19f,20,22,23,25,25a");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(33);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("26b,27,27b,105");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(34);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("26,27,27b");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(35);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("26,27,27b");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(36);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("26,26a,27,27b");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(37);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("28,29,29a,30,31");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(38);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("28,30,31");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(39);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("28,29,31");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(40);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("28,29,31");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(41);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(42);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,36,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(43);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,36,37,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(44);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,38,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(45);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,40,41,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(46);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,40a,41,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(47);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,40b,41,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(48);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,40c,41,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(49);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(50);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48a,49");
});

test('verification2: conforms to spec', async () => {
    let patientAdvice = await adfice.get_advice_for_patient(51);
    let fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48,48a,49");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(52);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48a,49");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(53);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,50,51a,53");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(54);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,50,51a,53");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(55);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48a,51,52");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(56);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48a,51,53");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(57);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("51a,53,54,55");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(58);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("51a,53,54,55");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(59);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,56,57,58,61");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(60);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,56,57,57a,58,61");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(61);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,56,58,61");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(62);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,56,61");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(63);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,56,58,61");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(64);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,63,63b");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(65);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,63,63b");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(66);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("64,66");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(67);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("64,66");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(68);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("41,42,44,45");
    let fired1 = patientAdvice.medication_advice[1].fired.toString();
    expect(fired1).toBe("45,63,63b");
    fired0 = null;
    fired1 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(69);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48a,51a,53");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(70);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,41,42,44,45,48");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(71);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48a,51a,53");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(72);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,41,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(73);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,41,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(74);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,51a,53,64a,66");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(75);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,51a,53,64a,66");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(76);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("67,70,76");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(77);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("67,70,73,76");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(78);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("67,68,76");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(79);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("67,69,76");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(80);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("67,70,76");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(81);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("67,70,73,76");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(82);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("67,70,76");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(83);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80b,81,84");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(84);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80b,81,83,84");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(85);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,79,80b,84");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(86);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80,84");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(87);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80b,81,84");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(88);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80b,81,84");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(89);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80a,80b,81,84");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(90);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("87,88,91,94");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(91);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("86,88,91,94");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(92);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("87,88,89,94");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(93);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("87,88,90,94");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(94);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("87,88,91,94");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(95);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("87,88,91,94");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(96);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("86,88,91,94,105");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(97);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("95,97");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(98);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("95,97");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(99);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("100,104");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(100);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("99,100,101,104,105");
});

test('verification3: conforms to spec', async () => {
    let patientAdvice = await adfice.get_advice_for_patient(101);
    let fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("100,101,104");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(102);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("100,101,102,104");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(103);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("100,104");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(104);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("105,105a,105c");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(105);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("105,105a,105c");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(106);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("105,106,108");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(107);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("105,106,108");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(108);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("105,110,112");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(109);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("105,110,112");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(110);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("113,113c,115");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(111);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("113,113c,115");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(112);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("117,117a,118,120");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(113);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("117,117a,120");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(114);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("117,117a,118,120");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(115);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("121,121a,123,128");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(116);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("121,121a,122,128");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(117);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("121,124,128");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(118);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("121,125,128");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(119);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("121,126,128");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(120);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("121,121a,123,128");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(121);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("129,131");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(122);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("129,131");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(123);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("132,132a,134");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(124);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("99,100,101,104,132,134");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(125);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("135,137");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(126);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("41,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(127);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,41,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.get_advice_for_patient(128);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80a,80b,81,84");
    fired0 = null;
    patientAdvice = null;

    // TODO check for other combi drugs that aren't handled correctly,
    // as well as ATCs that appear in >1 vervolg rule
    patientAdvice = await adfice.get_advice_for_patient(129);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80a,81,84,117,118");
});

/*
// get the list of rules that have been fired by validation patients
test('validatation1: fake patients for clinicians to check', async () => {
let patientAdvice = await adfice.get_advice_for_patient(131);
let fired0 = patientAdvice.medication_advice[0].fired.toString();
let fired1 = patientAdvice.medication_advice[1].fired.toString();
console.log(131);
console.dir(fired0 + "," + fired1);
fired0=null; fired1= null; patientAdvice=null;

patientAdvice = await adfice.get_advice_for_patient(132);
fired0 = patientAdvice.medication_advice[0].fired.toString();
fired1 = patientAdvice.medication_advice[1].fired.toString();
let fired2 = patientAdvice.medication_advice[2].fired.toString();
console.log(132);
console.dir(fired0 + "," + fired1 + "," + fired2);
fired0=null; fired1= null; fired2= null; patientAdvice=null;

patientAdvice = await adfice.get_advice_for_patient(133);
fired0 = patientAdvice.medication_advice[0].fired.toString();
console.log(133);
console.dir(fired0);
fired0=null; patientAdvice=null;

patientAdvice = await adfice.get_advice_for_patient(134);
fired0 = patientAdvice.medication_advice[0].fired.toString();
fired1 = patientAdvice.medication_advice[1].fired.toString();
console.log(134);
console.dir(fired0 + "," + fired1);
fired0=null; fired1= null; patientAdvice=null;

patientAdvice = await adfice.get_advice_for_patient(135);
fired0 = patientAdvice.medication_advice[0].fired.toString();
fired1 = patientAdvice.medication_advice[1].fired.toString();
console.log(135);
console.dir(fired0 + "," + fired1);
fired0=null; fired1= null; patientAdvice=null;

patientAdvice = await adfice.get_advice_for_patient(136);
fired0 = patientAdvice.medication_advice[0].fired.toString();
console.log(136);
console.dir(fired0);
fired0=null; patientAdvice=null;

patientAdvice = await adfice.get_advice_for_patient(137);
fired0 = patientAdvice.medication_advice[0].fired.toString();
fired1 = patientAdvice.medication_advice[1].fired.toString();
console.log(137);
console.dir(fired0 + "," + fired1);
fired0=null; fired1= null; patientAdvice=null;

patientAdvice = await adfice.get_advice_for_patient(138);
fired0 = patientAdvice.medication_advice[0].fired.toString();
console.log(138);
console.dir(fired0);
fired0=null; patientAdvice=null;

patientAdvice = await adfice.get_advice_for_patient(139);
fired0 = patientAdvice.medication_advice[0].fired.toString();
console.log(139);
console.dir(fired0);
fired0=null; patientAdvice=null;

patientAdvice = await adfice.get_advice_for_patient(140);
fired0 = patientAdvice.medication_advice[0].fired.toString();
console.log(140);
console.dir(fired0);
fired0=null; patientAdvice=null;

patientAdvice = await adfice.get_advice_for_patient(141);
fired0 = patientAdvice.medication_advice[0].fired.toString();
console.log(141);
console.dir(fired0);
fired0=null; patientAdvice=null;

patientAdvice = await adfice.get_advice_for_patient(142);
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

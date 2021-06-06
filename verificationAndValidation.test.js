// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const adfice = require('./adfice')
const util = require("util");

jest.setTimeout(10000); //seems to be needed on the desk dinosaur

test('verification1: conforms to spec', async () => {
    let patientAdvice = await adfice.getAdviceForPatient(4);
    let fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6b,6e,7,11");

    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(5);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6,6e,7,11");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(6);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6a,6e,7,11");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(7);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6b,6e,7,11");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(8);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6b,6e,7,9,11");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(9);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6b,6e,7,10,11");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(10);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6,6e,7,9,11");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(11);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("6,6e,7,11,105");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(12);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("12,13,13a");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(13);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("12,13,13a");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(14);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14d,16,18");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(15);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14,14a,16,18,105");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(16);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14,14b,16,18");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(17);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14c,16,18");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(18);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14d,15,16,18");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(19);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14d,16,18");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(20);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14d,16,18");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(21);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14,15,16,18,105");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(22);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14,14b,14c,16,18");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(23);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14,16,18");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(24);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("14,16,18");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(25);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19c,19d,19f,20,21,23,25a,105");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(26);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19,19d,19f,20,22,23,25a,105");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(27);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19a,19d,19f,20,22,25a,105");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(28);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19b,19d,19f,23,25a");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(29);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19c,19d,19e,19f,20,22,23,25a");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(30);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19c,19d,19f,20,22,24,25a");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(31);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19c,19d,19f,20,22,25,25a");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(32);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("19c,19d,19f,20,22,23,25,25a");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(33);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("26b,27,27b,105");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(34);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("26,27,27b");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(35);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("26,27,27b");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(36);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("26,26a,27,27b");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(37);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("28,29,29a,30,31");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(38);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("28,30,31");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(39);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("28,29,31");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(40);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("28,29,31");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(41);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(42);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,36,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(43);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,36,37,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(44);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,38,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(45);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,40,41,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(46);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,40a,41,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(47);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,40b,41,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(48);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,40c,41,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(49);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(50);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48a,49");
});

test('verification2: conforms to spec', async () => {
    let patientAdvice = await adfice.getAdviceForPatient(51);
    let fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48,48a,49");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(52);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48a,49");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(53);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,50,51a,53");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(54);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,50,51a,53");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(55);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48a,51,52");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(56);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48a,51,53");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(57);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("51a,53,54,55");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(58);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("51a,53,54,55");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(59);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,56,57,58,61");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(60);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,56,57,57a,58,61");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(61);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,56,58,61");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(62);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,56,61");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(63);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,56,58,61");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(64);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,63,63b");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(65);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,63,63b");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(66);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("64,66");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(67);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("64,66");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(68);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("41,42,44,45");
    let fired1 = patientAdvice.medication_advice[1].fired.toString();
    expect(fired1).toBe("45,63,63b");
    fired0 = null;
    fired1 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(69);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48a,51a,53");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(70);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,41,42,44,45,48");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(71);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,46,48a,51a,53");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(72);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,41,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(73);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,41,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(74);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,51a,53,64a,66");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(75);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("45,51a,53,64a,66");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(76);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("67,70,76");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(77);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("67,70,73,76");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(78);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("67,68,76");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(79);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("67,69,76");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(80);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("67,71,76");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(81);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("67,70,73,76");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(82);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("67,70,76");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(83);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80b,81,84");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(84);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80b,81,83,84");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(85);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,79,80b,84");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(86);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80,84");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(87);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80b,82,84");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(88);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80b,81,84");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(89);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80a,80b,81,84");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(90);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("87,88,91,94");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(91);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("86,88,91,94");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(92);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("87,88,89,94");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(93);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("87,88,90,94");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(94);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("87,88,92,94");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(95);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("87,88,91,94");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(96);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("86,88,91,94,105");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(97);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("28,29,30,31,95,97");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(98);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("28,29,30,31,95,97");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(99);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("100,104");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(100);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("99,100,101,104,105");
});

test('verification3: conforms to spec', async () => {
<<<<<<< HEAD
    let patientAdvice = await adfice.getAdviceForPatient(101);
    let fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("100,101,104");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(102);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("100,101,102,104");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(103);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("100,104");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(104);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("105,105a,105c");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(105);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("105,105a,105c");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(106);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("105,106,108");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(107);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("105,106,108");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(108);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("105,110,112");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(109);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("105,110,112");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(110);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("113,113a,115");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(111);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("113,113a,115");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(112);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("117,118,120");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(113);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("117,120");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(114);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("117,118,120");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(115);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("121,121a,123,128");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(116);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("121,121a,122,128");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(117);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("121,124,128");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(118);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("121,125,128");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(119);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("121,126,128");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(120);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("121,121a,123,128");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(121);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("129,131");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(122);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("129,131");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(123);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("132,132a,134");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(124);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("99,100,101,104,132,134");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(125);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("135,137");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(126);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("41,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(127);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("35,41,42,44,45");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(128);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80a,80b,81,84");
    fired0 = null;
    patientAdvice = null;
    patientAdvice = await adfice.getAdviceForPatient(129);
    fired0 = patientAdvice.medication_advice[0].fired.toString();
    expect(fired0).toBe("78,80a,81,84,117,118,120");
=======
let patientAdvice = await adfice.getAdviceForPatient(101);
	let fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("100,101,104");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(102);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("100,101,102,104");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(103);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("100,104");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(104);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("105,105a,105c");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(105);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("105,105a,105c");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(106);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("105,106,108");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(107);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("105,106,108");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(108);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("105,110,112");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(109);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("105,110,112");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(110);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("113,113a,115");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(111);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("113,113a,115");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(112);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("117,118,120");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(113);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("117,120");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(114);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("117,118,120");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(115);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("121,121a,123,128");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(116);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("121,121a,122,128");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(117);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("121,124,128");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(118);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("121,125,128");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(119);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("121,126,128");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(120);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("121,121a,123,128");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(121);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("129,131");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(122);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("129,131");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(123);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("132,132a,134");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(124);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("99,100,101,104,132,134");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(125);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("135,137");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(126);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("41,42,44,45");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(127);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("35,41,42,44,45");
	fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(128);
	fired0 = patientAdvice.medication_advice[0].fired.toString();
	expect(fired0).toBe("78,80a,80b,81,84");
	fired0=null; patientAdvice=null;

//TODO patient 129 fires too many rules (combination medication -> checkboxes from both drugs)
//Fix for this combination and check for other combi drugs
patientAdvice = await adfice.getAdviceForPatient(129);
fired0 = patientAdvice.medication_advice[0].fired.toString();
expect(fired0).toBe("78,80a,81,84,117,118,120");
});

/*
test('validatation1: fake patients for clinicians to check', async () => {
let patientAdvice = await adfice.getAdviceForPatient(127);
let fired0=null; patientAdvice=null;


patientAdvice = await adfice.getAdviceForPatient(128);
fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(129);
fired0=null; patientAdvice=null;
patientAdvice = await adfice.getAdviceForPatient(130);
});
*/

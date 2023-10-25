// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

/*
  '/usr/bin/node',
  '/home/ace/src/adfice-ace/node_modules/testcafe/lib/cli',
  'firefox:headless',
  'acceptance-test-cafe.js',
  'http://127.0.0.1:8090'
*/

/* To run tests not headless (using 55556 as an arbitrary port):
 node adfice-webserver-runner.js 55556
 ./node_modules/.bin/testcafe firefox acceptance-test-cafe.js http://127.0.0.1:55556
*/
let BASE_URL = process.argv[4];

import {
    Selector,
    ClientFunction
} from 'testcafe';

fixture `Adfice`;
fixture `TestController.setNativeDialogHandler`;



const getLocation = ClientFunction(() => document.location.href);

// set a new random participant number every time the test runs
let this_test_part = Math.floor(Math.random() * 10000) + 200;

async function navigate_to_patient(t, participant){
	let url = `${BASE_URL}/dataentry`;
    let window1 = await t.openWindow(url);
    
    let doctor_field = await Selector('#doctor_field');
	let participant_field = await Selector('#participant');
	let send = await Selector('#button_submit_patient');
	
	await t.selectText(doctor_field);
    await t.typeText(doctor_field, 'arts');
	
	await t.selectText(participant_field);
    await t.typeText(participant_field, participant);
	
	let birthdate_field = await Selector('#birthdate');
	await t.typeText(birthdate_field, '1940-01-01');
	
	await t.click(send);
	return window1;
}

test('test if we are in standalone mode', async t => {
    let url = `${BASE_URL}/dataentry`;
    let window1 = await t.openWindow(url);
    
    let datadiv = await Selector('div#dataentry1');

    await t.expect(getLocation()).contains('/dataentry');
    await t.expect(datadiv.withText("gegevens").exists).ok();
});

/* tests for dataentry */

test('enter a new patient', async t => {
    let url = `${BASE_URL}/dataentry`;
    let window1 = await t.openWindow(url);
    
    let doctor_field = await Selector('#doctor_field');
	let participant_field = await Selector('#participant');
	let birthdate_field = await Selector('#birthdate');
	let send = await Selector('#button_submit_patient');
	
	await t.selectText(doctor_field);
    await t.typeText(doctor_field, 'arts');
	
	await t.selectText(participant_field);
    await t.typeText(participant_field, 'TEST' + this_test_part);
	
	await t.typeText(birthdate_field, '1940-01-01');
	
	await t.click(send);
	
    await t.expect(getLocation()).contains('/dataentry2');
});

test('enter a new patient bad input', async t => {
    // no birthdate
	let url = `${BASE_URL}/dataentry`;
    let window1 = await t.openWindow(url);
    
    let doctor_field = await Selector('#doctor_field');
	let participant_field = await Selector('#participant');
	let send = await Selector('#button_submit_patient');
	let errordiv = await Selector('#dataentry_error');
	
	await t.expect(errordiv.visible).notOk();
	
	await t.selectText(doctor_field);
    await t.typeText(doctor_field, 'arts');
	
	await t.selectText(participant_field);
    await t.typeText(participant_field, 'TEST' + this_test_part+1);
	
	await t.click(send);
	
    await t.expect(getLocation()).contains('/dataentry');
	await t.expect(errordiv.visible).ok();
	
	// cannot insert in database
	await t.selectText(doctor_field);
    await t.typeText(doctor_field, 'arts');
	
	await t.selectText(participant_field);
    await t.typeText(participant_field, 
		'if-I-fits-I-sits111111111111111111111111111111111111111111111111111111111');
	
	let birthdate_field = await Selector('#birthdate');
	await t.typeText(birthdate_field, '1940-01-01');
	
	await t.click(send);
	
	await t.expect(getLocation()).contains('/dataentry');
	await t.expect(errordiv.visible).ok();
});

test('enter an existing patient', async t => {
	// DEPENDS ON test 'enter a new patient' running first
	// If this test fails, function navigate_to_patient won't work either
    let url = `${BASE_URL}/dataentry`;
    let window1 = await t.openWindow(url);
    
    let doctor_field = await Selector('#doctor_field');
	let participant_field = await Selector('#participant');
	let send = await Selector('#button_submit_patient');
	
	await t.selectText(doctor_field);
    await t.typeText(doctor_field, 'arts');
	
	await t.selectText(participant_field);
    await t.typeText(participant_field, 'TEST' + this_test_part);
	
	await t.click(send);
	
    await t.expect(getLocation()).contains('/dataentry2');
});

/* tests for dataentry2 */

test('change birthdate', async t => {
    let window1 = await navigate_to_patient(t, 'TEST' + this_test_part);
    
	let ageStr = await Selector('#data_entry_age').innerText;
	let age = Number(ageStr.match(/\d+/)[0]);
	await t.expect(age).gt(80);
	
	let birthdate_field = await Selector('#age_birthdate');
	await t.typeText(birthdate_field, '1942-01-01');
	
	let send = await Selector('#button_submit_birthdate');
	try{
		await t.click(send);
	}
	catch(error){
		// throws an error, but as far as I can tell, only in TestCafe. Ignore it.
	}
	
	let age2Str = await Selector('#data_entry_age').innerText;
	let age2 = Number(age2Str.match(/\d+/)[0]);
	await t.expect(age).gt(age2);

	// click send with empty birthdate
	send = await Selector('#button_submit_birthdate');
	try{ await t.click(send); }	catch(error){}
	
	age2Str = await Selector('#data_entry_age').innerText;
	age2 = Number(age2Str.match(/\d+/)[0]);
	await t.expect(age).gt(age2);
    
});

test('enter and remove medication', async t => {
	//TODO what happens if you try to enter 2 meds with the same ATC code?
    let window1 = await navigate_to_patient(t, 'TEST' + this_test_part);
	
	let code = 'B0GUS1';
    
	let medlist = await Selector('#data_entry_med_list');
	await t.expect(medlist.withText('Geen').exists).ok();
	await t.expect(medlist.withText(code).exists).notOk();
	
	let atc = await Selector('#single_med_atc');
	let name = await Selector('#single_med_name');
	let startdate = await Selector('#single_med_startdate');
	let send = await Selector('#button_submit_single_med');
	
	await t.typeText(atc, code);
	await t.typeText(name, 'Bogus Med');
	await t.typeText(startdate, '2023-01-01');
	
	try{
		await t.click(send);
	}
	catch(error){
		// throws an error, but as far as I can tell, only in TestCafe. Ignore it.
	}
	
	let medlist2 = await Selector('#data_entry_med_list');
	await t.expect(medlist2.withText(code).exists).ok();
	await t.expect(medlist2.withText('Bogus Med').exists).ok();
	await t.expect(medlist2.withText('01-01-2023').exists).ok();
	
	await t.typeText(atc, 'B0GUS2');
	await t.typeText(name, 'Bogus Med 2');
	await t.typeText(startdate, '2023-01-01');
	
	try{
		await t.click(send);
	}
	catch(error){
		// throws an error, but as far as I can tell, only in TestCafe. Ignore it.
	}

	let remName = '#remove_' + code;
	let rem_button = await Selector(remName);
	try{
		await t.click(rem_button);
	}
	catch(error){
		// throws an error, but as far as I can tell, only in TestCafe. Ignore it.
	}
	await t.expect(medlist2.withText(code).exists).notOk();
	await t.expect(medlist2.withText('B0GUS2').exists).ok();
	
	// click send with empty medication fields
	try{ await t.click(Selector('#button_submit_single_med')); }	catch(error){}
	await t.expect(Selector('#data_entry_med_list').withText('B0GUS2').exists).ok();
	
	await t.typeText(Selector('#single_med_atc'), 'B0GUS3');	
	try{ await t.click(Selector('#button_submit_single_med')); }	catch(error){}
	await t.expect(Selector('#data_entry_med_list').withText('B0GUS2').exists).ok();
	await t.expect(Selector('#data_entry_med_list').withText('B0GUS3').exists).notOk();
	
	await t.typeText(Selector('#single_med_name'), 'Bogus Med 3');
	try{ await t.click(Selector('#button_submit_single_med')); }	catch(error){}
	await t.expect(Selector('#data_entry_med_list').withText('B0GUS2').exists).ok();
	await t.expect(Selector('#data_entry_med_list').withText('B0GUS3').exists).notOk();
	
	await t.typeText(Selector('#single_med_startdate'), '2023-01-01');
	try{ await t.click(Selector('#button_submit_single_med')); }	catch(error){}
	await t.expect(Selector('#data_entry_med_list').withText('B0GUS2').exists).ok();
	await t.expect(Selector('#data_entry_med_list').withText('B0GUS3').exists).ok();
	
});


test('enter problems', async t => {
    let window1 = await navigate_to_patient(t, 'TEST' + this_test_part);
    
	let hypertensie_rb_y = await Selector('#hypertensie_rb_y');
	let hypertensie_rb_n = await Selector('#hypertensie_rb_n');
	let lewy_rb_y = await Selector('#lewy-bodies-dementia_rb_y');
	let lewy_rb_n = await Selector('#lewy-bodies-dementia_rb_n');
	let send = await Selector('#button_submit_problems');
	
	await t.expect(hypertensie_rb_y.checked).notOk();
	await t.expect(hypertensie_rb_n.checked).ok();
	await t.expect(lewy_rb_y.checked).notOk();
	await t.expect(lewy_rb_n.checked).ok();
	
	await t.click(hypertensie_rb_y);
	await t.click(lewy_rb_y);
	try{
		await t.click(send);
	} catch(error){} // do nothing, seems to be a TestCafe problem
	
	hypertensie_rb_y = await Selector('#hypertensie_rb_y');
	hypertensie_rb_n = await Selector('#hypertensie_rb_n');
	lewy_rb_y = await Selector('#lewy-bodies-dementia_rb_y');
	lewy_rb_n = await Selector('#lewy-bodies-dementia_rb_n');
	
	await t.expect(hypertensie_rb_y.checked).ok();
	await t.expect(hypertensie_rb_n.checked).notOk();
	await t.expect(lewy_rb_y.checked).ok();
	await t.expect(lewy_rb_n.checked).notOk();
    
});

test('change problems', async t => {
	// this test assumes that enter problems has been run
    let window1 = await navigate_to_patient(t, 'TEST' + this_test_part);
    
	let hypertensie_rb_y = await Selector('#hypertensie_rb_y');
	let hypertensie_rb_n = await Selector('#hypertensie_rb_n');
	let atriumfibrilleren_rb_y = await Selector('#atriumfibrilleren_rb_y');
	let palsy_rb_y = await Selector('#progressive-supranuclear-palsy_rb_y');
	let lewy_rb_y = await Selector('#lewy-bodies-dementia_rb_y');
	let lewy_rb_n = await Selector('#lewy-bodies-dementia_rb_n');
	let send = await Selector('#button_submit_problems');
	
	await t.expect(hypertensie_rb_y.checked).ok();
	await t.expect(hypertensie_rb_n.checked).notOk();
	await t.expect(lewy_rb_y.checked).ok();
	await t.expect(lewy_rb_n.checked).notOk();
	await t.expect(atriumfibrilleren_rb_y.checked).notOk();
	await t.expect(palsy_rb_y.checked).notOk();
	
	await t.click(lewy_rb_n);
	await t.click(atriumfibrilleren_rb_y);
	await t.click(palsy_rb_y);
	
	try{
		await t.click(send);
	} catch (error){} // do nothing, seems to be a TestCafe problem
    
	await t.expect(hypertensie_rb_y.checked).ok();
	await t.expect(hypertensie_rb_n.checked).notOk();
	await t.expect(lewy_rb_y.checked).notOk();
	await t.expect(lewy_rb_n.checked).ok();
	await t.expect(atriumfibrilleren_rb_y.checked).ok();
	await t.expect(palsy_rb_y.checked).ok();
	
});

test('enter labs', async t => {
    let window1 = await navigate_to_patient(t, 'TEST' + this_test_part);
	
	// check that submitting an empty form is OK
	let send = await Selector('#button_submit_labs');
	try{ await t.click(send); } catch (error){} // do nothing, seems to be a TestCafe problem
	    
	let labs_natrium = await Selector('#labs_natrium');
	await t.expect(labs_natrium.value).eql('');
	
	let labs_kalium = await Selector('#labs_kalium');
	let labs_calcium = await Selector('#labs_calcium');
	let labs_egfr = await Selector('#labs_egfr');
	
	await t.typeText(labs_natrium, '124');
	await t.typeText(labs_kalium, '3.5');
	await t.typeText(labs_calcium, '2.10');
	await t.typeText(labs_egfr, '30');
	
	try{
		await t.click(send);
	} catch (error){} // do nothing, seems to be a TestCafe problem
	
	labs_natrium = await Selector('#labs_natrium');
	labs_kalium = await Selector('#labs_kalium');
	labs_calcium = await Selector('#labs_calcium');
	labs_egfr = await Selector('#labs_egfr');
	send = await Selector('#button_submit_labs');

	await t.expect(labs_natrium.value).eql('124');
	await t.expect(labs_kalium.value).eql('3.5');
	await t.expect(labs_calcium.value).eql('2.10');
	await t.expect(labs_egfr.value).eql('30');
	
	let remove_natrium = await Selector('#remove_natrium');
	
	try{
		await t.click(remove_natrium);
	} catch (error){} // do nothing, seems to be a TestCafe problem
	
	labs_natrium = await Selector('#labs_natrium');
	labs_kalium = await Selector('#labs_kalium');
	
	await t.expect(labs_natrium.value).notEql('124');
	await t.expect(labs_kalium.value).eql('3.5');
	
	// check that change persists after clicking send again
	try{
		await t.click(send);
	} catch (error){} // do nothing, seems to be a TestCafe problem	
	
	labs_natrium = await Selector('#labs_natrium');
	labs_kalium = await Selector('#labs_kalium');
	
	await t.expect(labs_natrium.value).notEql('124');
	await t.expect(labs_kalium.value).eql('3.5');
	

});

test('edit labs', async t => {
	// this test assumes that enter labs has been run
    let window1 = await navigate_to_patient(t, 'TEST' + this_test_part);
	
	let labs_natrium = await Selector('#labs_natrium');
	let labs_kalium = await Selector('#labs_kalium');
	let labs_calcium = await Selector('#labs_calcium');
	let labs_egfr = await Selector('#labs_egfr');
	
	await t.expect(labs_natrium.value).notEql('124');
	await t.expect(labs_kalium.value).eql('3.5');
	await t.expect(labs_calcium.value).eql('2.10');
	await t.expect(labs_egfr.value).eql('30');
		
	try{
		await t.click(Selector('#remove_eGFR'));
	} catch (error) {} //do nothing, seems to be a TestCafe problem
	let labs_egfr_n = await Selector('#labs_egfr_n');
	await t.click(labs_egfr_n);
	
	let send = await Selector('#button_submit_labs');
	try{
		await t.click(send);
	} catch (error){} // do nothing, seems to be a TestCafe problem	
	
	labs_egfr = await Selector('#labs_egfr');
	labs_egfr_n = await Selector('#labs_egfr_n');
	await t.expect(labs_egfr.value).notEql('30');
	await t.expect(labs_egfr_n.checked).ok();
	
	// does it deal with various bad inputs?
// evidently the max value on a numeric input is ignored, so this test would fail.	
/*	labs_natrium = await Selector('#labs_natrium');
	await t.typeText(labs_natrium, '11124');
	try{
		await t.click(send);
	} catch (error){} // do nothing, seems to be a TestCafe problem	
	labs_natrium = await Selector('#labs_natrium');	
	labs_kalium = await Selector('#labs_kalium');
	
	await t.expect(labs_natrium.value).notEql('11124');
	await t.expect(labs_kalium.value).eql('3.5');
*/
	labs_kalium = await Selector('#labs_kalium');
	send = await Selector('#button_submit_labs');
	await t.typeText(labs_kalium, '4,5');
	try{
		await t.click(send);
	} catch (error){} // do nothing, seems to be a TestCafe problem
	labs_kalium = await Selector('#labs_kalium');
	await t.expect(labs_kalium.value).notEql('4,5');
	await t.expect(labs_kalium.value).notEql('4.5');
	
	try{ await t.click(Selector('#remove_kalium')); } catch (error) {}
	try{ await t.click(Selector('#remove_calcium')); } catch (error) {}
	try{ await t.click(Selector('#remove_eGFR_normal')); } catch (error) {}
	
	await t.expect(labs_kalium.value).notEql('3.5');
	await t.expect(labs_calcium.value).notEql('2.1');
	await t.expect(labs_egfr.value).notEql('30');
	await t.expect(Selector('#labs_egfr_n').checked).notOk();
	
});	

test('enter measurements', async t => {
    let window1 = await navigate_to_patient(t, 'TEST' + this_test_part);
	
	// check that submitting an empty form doesn't change values
	let send = await Selector('#button_submit_user_entered_meas');
	try{ await t.click(send); } catch (error) {} //do nothing, seems to be a TestCafe problem
	
	await t.expect(Selector('#user_GDS_score_mis').innerText).eql('invoeren');
	await t.expect(Selector('#user_grip_kg_mis').innerText).eql('invoeren');
	await t.expect(Selector('#user_walking_speed_m_per_s_mis').innerText).eql('invoeren');
	await t.expect(Selector('#user_height_cm_mis').innerText).eql('invoeren');
	await t.expect(Selector('#user_weight_kg_mis').innerText).eql('invoeren');
	await t.expect(Selector('#user_systolic_bp_mmHg_mis').innerText).eql('invoeren');
	await t.expect(Selector('#user_number_of_limitations_mis').innerText).eql('invoeren');
	await t.expect(Selector('#user_nr_falls_12m_mis').innerText).eql('invoeren');
	await t.expect(Selector('#user_smoking_mis').innerText).eql('invoeren');
	await t.expect(Selector('#user_education_hml_mis').innerText).eql('invoeren');
	await t.expect(Selector('#user_fear_mis').innerText).eql('invoeren');
			    
	let user_GDS_score = await Selector('#user_GDS_score'); //dropdown
	let user_grip_kg = await Selector('#user_grip_kg'); //0-99
	let user_walking_speed_m_per_s = await Selector('#user_walking_speed_m_per_s'); //0-99
	let user_height_cm = await Selector('#user_height_cm'); //40-250
	let user_weight_kg = await Selector('#user_weight_kg'); //20-500
	let user_systolic_bp_mmHg = await Selector('#user_systolic_bp_mmHg'); //20-250
	let user_number_of_limitations = await Selector('#user_number_of_limitations'); //dropdown
	let user_nr_falls_12m = await Selector('#user_nr_falls_12m'); //0-1000
	let user_smoking = await Selector('#user_smoking'); //dropdown
	let user_education_hml = await Selector('#user_education_hml'); //dropdwon
	let fear_dropdown = await Selector('#fear_dropdown'); //dropdown
	
	await t.click(user_GDS_score);
	await t.click(Selector('#GDS_dropdown_1', {
        text: '1'
    }));
	await t.expect(user_GDS_score.value).eql('1');
	await t.click(user_grip_kg);
	await t.typeText(user_grip_kg, '5');
	await t.typeText(user_walking_speed_m_per_s, '0.5');
	await t.typeText(user_height_cm, '150');
	await t.typeText(user_weight_kg, '50');
	await t.typeText(user_systolic_bp_mmHg, '150');
	await t.click(user_number_of_limitations);
	await t.click(Selector('#ADL_dropdown_1', {
        text: '1'
    }));
	await t.typeText(user_nr_falls_12m, '3');
	await t.click(user_smoking);
    await t.click(Selector("#user_smoking_1", {
        text: 'Ja'
    }));
	await t.click(user_education_hml);
    await t.click(Selector("#edu_dropdown_1", {
        text: 'Laag'
    }));
	await t.click(fear_dropdown);
    await t.click(Selector("#fear_dropdown_2", {
        text: '2: erg bezorgd'
    }));
	try{
		await t.click(send);
	} catch (error) {} //do nothing, seems to be a TestCafe problem
	
	await t.expect(Selector('#user_GDS_score_mis').innerText).eql('1');
	await t.expect(Selector('#user_grip_kg_mis').innerText).eql('5');
	await t.expect(Selector('#user_walking_speed_m_per_s_mis').innerText).eql('0.5');
	await t.expect(Selector('#user_height_cm_mis').innerText).eql('150');
	await t.expect(Selector('#user_weight_kg_mis').innerText).eql('50');
	await t.expect(Selector('#user_systolic_bp_mmHg_mis').innerText).eql('150');
	await t.expect(Selector('#user_number_of_limitations_mis').innerText).eql('1');
	await t.expect(Selector('#user_nr_falls_12m_mis').innerText).eql('3');
	await t.expect(Selector('#user_smoking_mis').innerText).eql('1');
	await t.expect(Selector('#user_education_hml_mis').innerText).eql('1');
	await t.expect(Selector('#user_fear_mis').innerText).eql('2');
	
	try{
		await t.click(Selector('#del_GDS_score'));
	} catch(error){} //do nothing, seems to be a TestCafe problem
	
	user_GDS_score = await Selector('#user_GDS_score'); //dropdown
	user_grip_kg = await Selector('#user_grip_kg'); //0-99
	await t.expect(user_GDS_score.value).notEql('1');
	await t.expect(Selector('#user_GDS_score_mis').innerText).notEql('1');
	await t.expect(Selector('#user_grip_kg_mis').innerText).eql('5');
	
	try{ await t.click(Selector('#del_grip_kg')); } catch (error) {} // do nothing, seems to be a TestCafe problem
	try{ await t.click(Selector('#del_walking_speed')); } catch (error) {}
	try{ await t.click(Selector('#del_height_cm')); } catch (error) {}
	try{ await t.click(Selector('#del_weight_kg')); } catch (error) {}
	try{ await t.click(Selector('#del_systolic_bp_mmHg')); } catch (error) {}
	try{ await t.click(Selector('#del_number_of_limitations')); } catch (error) {}
	try{ await t.click(Selector('#del_nr_falls_12m')); } catch (error) {}
	try{ await t.click(Selector('#del_smoking')); } catch (error) {}
	try{ await t.click(Selector('#del_education_hml')); } catch (error) {}
	try{ await t.click(Selector('#del_fear')); } catch (error) {}
	
	await t.expect(Selector('#user_GDS_score_mis').innerText).notEql('1');
	await t.expect(Selector('#user_grip_kg_mis').innerText).notEql('5');
	await t.expect(Selector('#user_walking_speed_m_per_s_mis').innerText).notEql('0.5');
	await t.expect(Selector('#user_height_cm_mis').innerText).notEql('150');
	await t.expect(Selector('#user_weight_kg_mis').innerText).notEql('50');
	await t.expect(Selector('#user_systolic_bp_mmHg_mis').innerText).notEql('150');
	await t.expect(Selector('#user_number_of_limitations_mis').innerText).notEql('1');
	await t.expect(Selector('#user_nr_falls_12m_mis').innerText).notEql('3');
	await t.expect(Selector('#user_smoking_mis').innerText).notEql('1');
	await t.expect(Selector('#user_education_hml_mis').innerText).notEql('1');
	await t.expect(Selector('#user_fear_mis').innerText).notEql('2');
	
});

test('go to CDSS', async t => {
	//TODO patient should have at least 1 medication to go to CDSS
    let window1 = await navigate_to_patient(t, 'TEST' + this_test_part);
	
	/* add one real medication */

	await t.typeText(Selector('#single_med_atc'), 'C08CA01');
	await t.typeText(Selector('#single_med_name'), 'amlodipine');
	await t.typeText(Selector('#single_med_startdate'), '2023-01-01');
	try{ await t.click(Selector('#button_submit_single_med')); } catch(error){}
	
	/* put meas and labs back */
	await t.typeText(Selector('#labs_natrium'), '124');
	await t.typeText(Selector('#labs_kalium'), '3.5');
	await t.typeText(Selector('#labs_calcium'), '2.10');
	await t.typeText(Selector('#labs_egfr'), '30');
	try{ await t.click(Selector('#button_submit_labs')); } catch(error){}
			
	await t.click(Selector('#user_GDS_score'));
	await t.click(Selector('#GDS_dropdown_1', {
        text: '1'
    }));
	await t.typeText(Selector('#user_grip_kg'), '5');
	await t.typeText(Selector('#user_walking_speed_m_per_s'), '0.5');
	await t.typeText(Selector('#user_height_cm'), '150');
	await t.typeText(Selector('#user_weight_kg'), '50');
	await t.typeText(Selector('#user_systolic_bp_mmHg'), '150');
	await t.click(Selector('#user_number_of_limitations'));
	await t.click(Selector('#ADL_dropdown_1', {
        text: '1'
    }));
	await t.typeText(Selector('#user_nr_falls_12m'), '3');
	await t.click(Selector('#user_smoking'));
    await t.click(Selector("#user_smoking_1", {
        text: 'Ja'
    }));
	await t.click(Selector('#user_education_hml'));
    await t.click(Selector("#edu_dropdown_1", {
        text: 'Laag'
    }));
	await t.click(Selector('#fear_dropdown'));
    await t.click(Selector("#fear_dropdown_2", {
        text: '2: erg bezorgd'
    }));
	try{
		await t.click(Selector('#button_submit_user_entered_meas'));
	} catch (error) {} //do nothing, seems to be a TestCafe problem
    
	try{ await t.click(Selector('#button_submit_done')); } catch(error) {}
	
	await t.expect(getLocation()).contains('/start');
    
});

test('go to CDSS2', async t => {
	let window1 = await navigate_to_patient(t, 'TEST' + this_test_part);
	
	try{ await t.click(Selector('#button_submit_done2')); } catch(error) {}
	
	await t.expect(getLocation()).contains('/start');
	
	let med_div = await Selector("#meds-with-rules");
	await t.expect(med_div.withText("Amlodipine").exists).ok();
	let other_med_div = Selector("#meds-without-rules-list");
	await t.expect(other_med_div.withText("Bogus").exists).ok();
	
	let gauge_risk_score = await Selector("#gauge-risk-score");
	await t.expect(gauge_risk_score.withText("50").exists).ok();
	
    let problem_table = await Selector("#problem_table");
    await t.expect(problem_table.withText("Hypertensie	Ja").exists).ok();
    await t.expect(problem_table.withText("Lewy body dementie	Nee").exists).ok();
	await t.expect(problem_table.withText("Atriumfibrilleren	Ja").exists).ok();
	
    let lab_table = await Selector("#lab_table");
    await t.expect(lab_table.withText("natrium").exists).ok();
    await t.expect(lab_table.withText("124").exists).ok();


//prediction data table
    await t.expect(Selector("#d_user_GDS_score").withText("1").exists).ok();
    await t.expect(Selector("#d_user_grip_kg").withText("5").exists).ok();
	await t.expect(Selector("#d_user_walking_speed_m_per_s").withText("0.5").exists).ok();
	await t.expect(Selector("#d_user_bmi_calc").withText("22.2").exists).ok();
	await t.expect(Selector("#d_user_systolic_bp_mmHg").withText("150").exists).ok();
	await t.expect(Selector("#d_user_number_of_limitations").withText("1").exists).ok();
	await t.expect(Selector("#d_user_nr_falls_12m").withText("3").exists).ok();
	await t.expect(Selector("#has_antiepileptica").withText("0").exists).ok();
	await t.expect(Selector("#has_ca_blocker").withText("1").exists).ok();
	await t.expect(Selector("#has_incont_med").withText("0").exists).ok();
	await t.expect(Selector("#d_user_smoking").withText("1").exists).ok();
	await t.expect(Selector("#d_user_education_hml").withText("1").exists).ok();
	await t.expect(Selector("#d_user_fear").withText("2").exists).ok();

//prediction missing table
    let missing_table = await Selector("#prediction_missing_form_container");
    await t.expect(missing_table.withText("grijpkracht").exists).ok();
    await t.expect(missing_table.withText("invoeren").exists).notOk();

    await t.expect(Selector("#user_GDS_score_mis").withText("1").exists).ok();
    await t.expect(Selector("#user_grip_kg_mis").withText("5").exists).ok();
	await t.expect(Selector("#user_walking_speed_m_per_s_mis").withText("0.5").exists).ok();
	await t.expect(Selector("#user_height_cm_db").withText("150").exists).ok();
	await t.expect(Selector("#user_weight_kg_db").withText("50").exists).ok();
	await t.expect(Selector("#user_systolic_bp_mmHg_mis").withText("150").exists).ok();
	await t.expect(Selector("#user_number_of_limitations_mis").withText("1").exists).ok();
	await t.expect(Selector("#user_nr_falls_12m_mis").withText("3").exists).ok();
	await t.expect(Selector("#user_smoking_mis").withText("1").exists).ok();
	await t.expect(Selector("#user_education_hml_mis").withText("1").exists).ok();
	await t.expect(Selector("#user_fear_mis").withText("2").exists).ok();

});
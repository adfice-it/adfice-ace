// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021-2024 Stichting Open Electronics Lab
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

/* global data used by these functions */
var message_globals = {
    patient_id: null,
    viewer_id: null,
    is_final: null,
    ws: null,
    freetexts_entered: null,
    weirdness: 0,
    messages_received: 0,
    reset_session_timeout: false,
    debug: 0,
    logger: console
};

function send_message(message_type, apply) {
    let message = {};
    message.viewer_id = message_globals.viewer_id;

    message.patient_id = message_globals.patient_id;
    message.type = message_type;
    message.reset_session_timeout = message_globals.reset_session_timeout;

    if (apply) {
        apply(message);
    }

    let msg_str = JSON.stringify(message, null, 4);
    if (message_globals.debug > 0) {
        message_globals.logger.log('sending:', msg_str);
    }
    try {
        message_globals.ws.send(msg_str);
        message_globals.reset_session_timeout = false;
    } catch (err) {
        message_globals.logger.log(err, 'could not send:', msg_str);
        ++message_globals.weirdness;
        message_globals.ws = null;
    }
}

function boxclicked(checkbox) {

    if (!message_globals.ws) {
        checkbox.checked = !checkbox.checked;
        message_globals.logger.error('got a check event for', checkbox,
            'but websocket is null');
        ++message_globals.weirdness;
        return;
    }
    if (message_globals.debug > 0) {
        message_globals.logger.log('Checkbox ' + checkbox.id + ' clicked' +
            ' and is now ' + checkbox.checked);
    }

    send_message('checkboxes', function(message) {
        message.checkbox_id = checkbox.id;
        message.checkbox_checked = checkbox.checked;

        message['box_states'] = {};
        let elementList = document.querySelectorAll("input[type='checkbox']");
        for (let i = 0; i < elementList.length; ++i) {
            let checkbox = elementList[i];
            message['box_states'][checkbox.id] = checkbox.checked;
        }
    });
}

function freetextentered(textfield) {
    if (message_globals.freetexts_entered != null &&
        message_globals.freetexts_entered != textfield.id) {
        send_freetext(textfield.id);
    }
    message_globals.freetexts_entered = textfield.id;
}

function freetextAutoSelectCheckbox(textfield) {
    // the checkbox id is always = the textfield id, but with cb instead of ft and without the _1 at the end.
    let checkbox_id = textfield.id.replace("ft", "cb");
    checkbox_id = checkbox_id.slice(0, checkbox_id.length - 2);
    let tf_checkbox = document.getElementById(checkbox_id);
    if (!tf_checkbox.checked) {
        tf_checkbox.checked = true;
    }
}

function update_meas() {
    if (!message_globals.ws) {
        message_globals.logger.error(
            'got a submit_missings event but websocket is null');
        ++message_globals.weirdness;
        return;
    }

    send_message('submit_missings', function(message) {
        message.patient_id = message_globals.patient_id;

        message['submit_missings'] = {};
        let form = document.getElementById('prediction_missing_form');
        for (let i = 0; i < form.elements.length; ++i) {
            if (form.elements[i].id != "button_submit_prediction_missing") {
                let val = form.elements[i].value;
                message['submit_missings'][form.elements[i].id] = val;
            }
        }
        console.log(message);
    });
    localStorage.clear();
    window.location.reload(true);
}

function data_entry_submit_button(){
	if (!message_globals.ws) {
        message_globals.logger.error(
            'got a dataenry submit request but websocket is null');
        ++message_globals.weirdness;
        return;
    }
	//clear the error message div
	document.getElementById('single_med_error').innerHTML = '';
	let birthdate_function = user_entered_birthdate(document.getElementById('edit_birthdate_form'));
	let single_med_function = user_entered_single_med(document.getElementById('single_med_form'));
	let multi_med_function = user_entered_multi_med(document.getElementById('multi_med_form'));
	let problem_function = user_entered_problems(document.getElementById('problems_form'));
	let lab_function = user_entered_labs(document.getElementById('labs_form'));
	let meas_function = user_entered_meas(document.getElementById('user_entered_meas_form'));
	let assess_function = user_entered_assessed(document.getElementById('data_assess_form'));
	
	if (birthdate_function){
		send_message('submit_birthdate', birthdate_function);
	}
	if (single_med_function){
		send_message('submit_single_med', single_med_function);
	}
	if (multi_med_function){
		send_message('submit_multi_med', multi_med_function);
	}
	if (problem_function){
	    send_message('submit_problems', problem_function);
	}
	if (lab_function){
	    send_message('submit_labs', lab_function);
	}
	if (meas_function){
		send_message('submit_meas', meas_function);
	}
	if (assess_function){
		send_message('submit_assess', assess_function);
	}
/* var start = new Date().getTime();
var end = start;
while(end < start + 10000) { end = new Date().getTime(); }
*/
	localStorage.clear();
	window.location.reload(true);
}

function data_entry_med_submit_button(){
	let form = document.getElementById('single_med_form');
	// first check if the med form is complete.
	for (let i = 0; i < form.elements.length; ++i) {
		if (form.elements[i].value == '') {
			localStorage.clear();
			return;
		}
	}
	// if the function did not return early, roll through to regular data entry submission
	data_entry_submit_button();
}

function user_entered_birthdate(form){
	let id = '';
	let val = '';
	for (let i = 0; i < form.elements.length; ++i) {
		if (form.elements[i].id == "age_birthdate") {
			id = form.elements[i].id;
			val = form.elements[i].value;
		}
	}
	// if value is empty, ignore the button press
	if (val == ''){
		return null;
	} else {
		return function(message) {
			message.patient_id = message_globals.patient_id;

			message['submit_birthdate'] = {};
			message['submit_birthdate'][id] = val;

			console.log(message);
		};
	}
}

function user_entered_single_med(form) {
	for (let i = 0; i < form.elements.length; ++i) {
		if (form.elements[i].value == '') {
			return null;
		}
	}
    return function(message) {
        message.patient_id = message_globals.patient_id;

        message['submit_single_med'] = {};
        
        for (let i = 0; i < form.elements.length; ++i) {
            if (form.elements[i].id != "button_submit_single_med" 
				&& !form.elements[i].id.includes('remove')) {
                let val = form.elements[i].value;
                message['submit_single_med'][form.elements[i].id] = val;
            }
        }
        console.log(message);
    };
}

function remove_med(atc_code) {
    if (!message_globals.ws) {
        message_globals.logger.error(
            'got a remove_med request but websocket is null');
        ++message_globals.weirdness;
        return;
    }

    send_message('remove_med', function(message) {
        message.patient_id = message_globals.patient_id;
        message['remove_med'] = {};
		message['remove_med']['atc_code'] = atc_code;
        
        console.log(message);
    });
    localStorage.clear();
    window.location.reload(true);
}

function user_entered_multi_med(form){
	let id = 'multi_med';
	let val = form.elements[0].value;
	
	// if value is empty, ignore the button press
	if (val == ''){
		return null;
	} else {
		let strings = val.split("\t");
		let messages = [];
		let counter = 0;
		let count_to_4 = 0;
		let atc_regex = /[a-zA-Z]\d\d./;

		while(counter < strings.length){
			let med_msg = {};
			let single_med_name, single_med_atc, single_med_startdate;
			while(count_to_4 < 4){
				if(strings[counter]) {single_med_name = strings[counter].trim();}
				counter++; count_to_4++; // do nothing with generic name
				counter++; count_to_4++;
				if (strings[counter] && atc_regex.test(strings[counter])) {
					single_med_atc = strings[counter].trim();
					}
				counter++; count_to_4++;
				if(strings[counter]) {single_med_startdate = strings[counter].trim();}
				count_to_4++;
			}
			if(single_med_name && single_med_atc && single_med_startdate){
				let is_duplicate = 0;
				for (let i = 0; i < messages.length; ++i) {
					//if name = an existing name, drop this entry
					if(messages[i]['single_med_name'] == single_med_name){
						is_duplicate = 1;
					  //if atc = an existing atc, concatenate the name and stop further processing
					} else if (messages[i]['single_med_atc'] == single_med_atc){
						messages[i]['single_med_name'] = messages[i]['single_med_name'] + "/" + single_med_name;
						is_duplicate = 1;
					}
				}
				if(!is_duplicate){
					med_msg['single_med_name'] = single_med_name;
					med_msg['single_med_atc'] = single_med_atc;
					med_msg['single_med_startdate'] = single_med_startdate;
					messages.push(med_msg)
				}
			}
			single_med_name = null;
			single_med_atc = null;
			single_med_startdate = null;
			count_to_4 = 0;
			counter++; 
		}
		
 		return function(message) {
			message.patient_id = message_globals.patient_id;

			message['submit_multi_med'] = {};
			message['submit_multi_med']['med_array'] = messages;
			console.log(message);
		};
	}
}

function user_entered_problems(form) {
	let empty = 1;
	for (let i = 0; i < form.elements.length; ++i) {
		if (form.elements[i].value == 'Ja'){
			empty = 0;
		}
	}
	if (empty) {
		return null;
	} else {
		return function(message) {
			message.patient_id = message_globals.patient_id;
			message['submit_problems'] = {};
			for (let i = 0; i < form.elements.length; ++i) {
				if (form.elements[i].id != "button_submit_problems") {
					let val = form.elements[i].value;
					if (val == 'Ja') {
						let radio_button = document.getElementById(form.elements[i].id);
						if (radio_button.checked) {
							message['submit_problems'][form.elements[i].id] = val;
						}
					}
				}
			}
			console.log(message);
		};
	}
}

function user_entered_labs(form) {
	let empty = 1;
	let egfr = null;
	let radio_button = document.getElementById("labs_egfr_n");
	for (let i = 0; i < form.elements.length -1; ++i) { //not the submit button
		if (form.elements[i].value > 0){
			empty = 0;
		}
		if(form.elements[i].id == "labs_egfr"){
			egfr = form.elements[i].value;
		}
	}
	if(!egfr){
		if(radio_button.checked){
			egfr = true;
			empty = 0;
console.log("detected checked radio");
		}
	}
	if (empty){
		return null;
console.log("was empty");		
	} else {
		return function(message) {
			message.patient_id = message_globals.patient_id;
			message['submit_labs'] = {};
			let form = document.getElementById('labs_form');
			let numeric_egfr = false;
			for (let i = 0; i < form.elements.length; ++i) {
				if (form.elements[i].id != "button_submit_labs" &&
					form.elements[i].id != "labs_egfr_n") {
					if(form.elements[i].id == "labs_date_egfr"
						&& !egfr){
							console.log("skipped date with no egfr");
					} else {
						let val = form.elements[i].value;
						if (val) {
							message['submit_labs'][form.elements[i].name] = val;
console.log("sent " + form.elements[i].name);							
							if (form.elements[i].name == 'eGFR') {
								numeric_egfr = true;
							}
						}
					}
				}
			}
			if (radio_button.checked && !numeric_egfr) { // if there is a numeric eGFR then the radio button is overridden
				message['submit_labs']["eGFR"] = radio_button.value;
			}
			console.log(message);
		};
	}
}

function user_entered_meas(form) {
//TODO deal with empty form
console.log(form);
    return function(message) {
        message.patient_id = message_globals.patient_id;

        message['submit_meas'] = {};
        let form = document.getElementById('user_entered_meas_form');
        for (let i = 0; i < form.elements.length; ++i) {
            if (form.elements[i].id != "button_submit_user_entered_meas") {
                let val = form.elements[i].value;
                message['submit_meas'][form.elements[i].id] = val;
            }
        }
        console.log(message);
    };
}

function user_entered_assessed(form) {
	// [0] is the Ja button, [1] is the Nee button, and [2] is the submit button
	let ja_checked = document.getElementById(form.elements[0].id).checked;
	let nee_checked = document.getElementById(form.elements[1].id).checked;
	if (!ja_checked && !nee_checked) {
		// form is empty
		return null;
	} else {
		return function(message) {
			message.patient_id = message_globals.patient_id;
			message['submit_assess'] = {};
			message['submit_assess']['data_assessed'] = ja_checked;
			console.log(message);
		};
	}
	

/*
	} else {
		return function(message) {
			message.patient_id = message_globals.patient_id;
			message['submit_assess'] = {};
			for (let i = 0; i < form.elements.length; ++i) {
				if (form.elements[i].id != "button_submit_assess") {
					let val = form.elements[i].value;
					if (val == 'Ja') {
						let radio_button = document.getElementById(form.elements[i].id);
						if (radio_button.checked) {
							message['submit_assess'][form.elements[i].id] = val;
						}
					}
				}
			}
			console.log(message);
		};
	}
*/	
}

function delete_user_entered(to_be_deleted) {
    if (!message_globals.ws) {
        message_globals.logger.error(
            'got a submit_missings (delete_user_entered) event but websocket is null');
        ++message_globals.weirdness;
        return;
    }

    send_message('submit_missings', function(message) {
        message.patient_id = message_globals.patient_id;

        message['submit_missings'] = {};
        message['submit_missings'][to_be_deleted] = null;
        console.log(message);
    });
    localStorage.clear();
    window.location.reload(true);
}

function remove_lab(lab_name) {
    if (!message_globals.ws) {
        message_globals.logger.error(
            'got a remove_lab request but websocket is null');
        ++message_globals.weirdness;
        return;
    }

    send_message('remove_lab', function(message) {
        message.patient_id = message_globals.patient_id;
        message['remove_lab'] = {};
		message['remove_lab']['lab_test_name'] = lab_name;
        
        console.log(message);
    });
    localStorage.clear();
    window.location.reload(true);
}

function send_freetext(textfield_id) {
    if (!message_globals.ws) {
        message_globals.logger.error('got a freetext event for ', textfield,
            'but websocket is null');
        ++message_globals.weirdness;
        return;
    }

    send_message('freetexts', function(message) {
        message.textfield = textfield_id;

        message['field_entries'] = {};
        let elementList = document.querySelectorAll("textarea");
        for (let i = 0; i < elementList.length; ++i) {
            let field = elementList[i];
            message['field_entries'][field.id] = field.value;
        }
    });
}

function process_checkbox(checkbox_id, checked) {
    var checkbox = document.getElementById(checkbox_id);
    if (checkbox) {
        checkbox.checked = checked;
    }

	// for all checkboxes
    let tr_row_id = checkbox_id.replace(/^cb_/, 'tr_');
    let tr_row = document.getElementById(tr_row_id);
    if (tr_row) {
        if (checked) {
            tr_row.classList.add("checkbox-checked");
            tr_row.classList.remove("checkbox-unchecked");
        } else {
            tr_row.classList.add("checkbox-unchecked");
            tr_row.classList.remove("checkbox-checked");
        }
    }

// probably should be using patient_advice object for this when the final page loads, rather htan changing it here.
	// for text to be pasted into the EHR
    let ehr_row_id = checkbox_id.replace(/^cb_/, 'et_');
    let ehr_row = document.getElementById(ehr_row_id);
    if (ehr_row) {
        if (checked) {
            // ehr_row.classList.add("checkbox-checked");
            // ehr_row.classList.remove("checkbox-unchecked");
            ehr_row.style.display = 'block';
        } else {
            // ehr_row.classList.add("checkbox-unchecked");
            // ehr_row.classList.remove("checkbox-checked");
            ehr_row.style.display = 'none';
        }
    }

	// probably should be using patient_advice object for this when the advice page loads, rather htan changing it here.
    // "patient row" is the advice for patients; only exists on the Advice page
    let patient_row_id = checkbox_id.replace(/^cb_/, 'pt_');
    let patient_row = document.getElementById(patient_row_id);
    let cat_id = '';
    if (checkbox_id.lastIndexOf("cb_NONMED_", 0) === 0) {
        cat_id = checkbox_id.replace(/^cb_NONMED_/, 'patient_nm_cat_');
    }
    if (message_globals.debug > 0) {
        message_globals.logger.log(JSON.stringify({
            checkbox_id: checkbox_id,
            checked: checked,
            patient_row_id: patient_row_id,
            patient_row: patient_row,
            cat_id: cat_id
        }));
    }

    if (patient_row) {
        if (checked) {
            // patient_row.classList.add("checkbox-checked");
            // patient_row.classList.remove("checkbox-unchecked");
            patient_row.style.display = 'block';
        } else {
            // patient_row.classList.add("checkbox-unchecked");
            // patient_row.classList.remove("checkbox-checked");
            patient_row.style.display = 'none';
        }
    }
}

function process_checkboxes(message) {
    if (!('box_states' in message)) {
        return;
    }
    let box_states = message['box_states'];
    const checkbox_ids = Object.keys(box_states);
    let atcs = {};
    for (let i = 0; i < checkbox_ids.length; ++i) {
        let checkbox_id = checkbox_ids[i];
        let atc = checkbox_id.split('_')[1];
        if (atcs[atc] === undefined) {
            atcs[atc] = 0;
        }
        let checked = box_states[checkbox_id];
        if (checked) {
            atcs[atc] += 1;
        }
        process_checkbox(checkbox_id, checked);
    }

    let atcs_keys = Object.keys(atcs);
    for (let i = 0; i < atcs_keys.length; ++i) {
        let atc = atcs_keys[i];
        let num_checked = atcs[atc];
        let geen_advies_id = 'geen_advies_' + atc;
        let geen_advies_div = document.getElementById(geen_advies_id);
        if (geen_advies_div) {
            if (num_checked > 0) {
                // geen_advies_div.classList.add('no-advice-some-checked');
                // geen_advies_div.classList.remove('no-advice-none-checked');
                geen_advies_div.style.display = 'none';
            } else {
                // geen_advies_div.classList.add('no-advice-none-checked');
                // geen_advies_div.classList.remove('no-advice-some-checked');
                geen_advies_div.style.display = 'block';
            }
        }
    }
}

function process_freetexts(message) {
    if (!('field_entries' in message)) {
        return;
    }
    let debounce_guard_allow = 1;
    let our_id = message_globals.viewer_id;
    if (message.type != 'init' && message.viewer_id == our_id) {
        debounce_guard_allow = 0;
    }
    let fields = message['field_entries'];
    // TODO? save cursor position of box we are currently typing in?
    const field_ids = Object.keys(fields);
    for (let i = 0; i < field_ids.length; ++i) {
        let field_id = field_ids[i];
        let value = fields[field_id];
        var field = document.getElementById(field_id);
        // only what changed AND from some other source
        if (field && field.value != value && debounce_guard_allow) {
            field.value = value;
        }

        let ehr_text_id = field_id.replace(/^ft_/, 'eft_');
        var ehr_field = document.getElementById(ehr_text_id);
        if (ehr_field) {
            ehr_field.innerText = value;
        }

        let patient_text_id = field_id.replace(/^ft_/, 'pft_');
        var patient_field = document.getElementById(patient_text_id);
        if (patient_field) {
            patient_field.innerText = value;
        }
    };
}

function process_viewer_count(message) {
    let element = document.getElementById("viewer-count");
    if (!element) {
        return;
    }
    element.style.visibility = 'visible';
    element.style.color = 'black';

    if (!('viewers' in message)) {
        return;
    }

    element.innerHTML = 'Viewers: ' + message.viewers;
    if (message.viewers > 1) {
        element.style.visibility = 'visible';
    } else {
        element.style.visibility = 'hidden'
    }
}

function first_incoming_message(event) {
    if (message_globals.debug > 0) {
        message_globals.logger.log('first_incoming_message');
    }
    let elementList = document.querySelectorAll("input[type='checkbox']");
    for (let i = 0; i < elementList.length; ++i) {
        var checkbox = elementList[i];
        checkbox.style.visibility = "visible";
        checkbox.onclick = function() {
            boxclicked(checkbox)
        };
        process_checkbox(checkbox.id, false)
    }

    elementList = document.querySelectorAll("textarea");
    for (let i = 0; i < elementList.length; ++i) {
        let textfield = elementList[i];
        textfield.style.visibility = "visible";
        textfield.onkeyup = function() {
            freetextentered(textfield);
            freetextAutoSelectCheckbox(textfield);
        };
    }
}

function ws_on_message(event) {
    if (message_globals.messages_received == 0) {
        first_incoming_message(event);
    }
    ++message_globals.messages_received;
    if (message_globals.debug > 0) {
        message_globals.logger.log('received: ', event.data);
    }

    const message = JSON.parse(event.data);

    if (message.type == 'init' && !message_globals.viewer_id) {
        /* viewer_id should come from the session */
        message_globals.viewer_id = message.viewer_id;
    }

    if ((!('patient_id' in message)) ||
        (message.patient_id != message_globals.patient_id)) {
        message_globals.logger.log('expected patient_id of:',
            message_globals.patient_id);
        message_globals.logger.log('               but was:',
            message.patient_id);
        message_globals.logger.log(JSON.stringify({
            message: message
        }, null, 4));
        ++message_globals.weirdness;
        return;
    }

    process_checkboxes(message);

    process_freetexts(message);

    process_viewer_count(message);

    if ('is_final' in message) {
        message_globals.is_final = message['is_final'];
    }

    let elementList = document.querySelectorAll("input");
    for (let i = 0; i < elementList.length; ++i) {
        let input = elementList[i];
        input.disabled = message_globals.is_final;
    }

    let textAreaList = document.querySelectorAll("textarea");
    for (let i = 0; i < textAreaList.length; ++i) {
        let ta = textAreaList[i];
        ta.disabled = message_globals.is_final;
    }

    if (message_globals.is_final) {
        document.body.style.opacity = 0.5;
    }

    if ('debug_info' in message) {
        message_globals.logger.log(JSON.stringify({
            debug_info: message.debug_info
        }, null, 4));
    }

    if (message.type == 'error_message') {
        message_globals.logger.log(JSON.stringify(message, null, 4));
        if (message.text.includes("Portal write error")) {
            alert("Er was een probleem optreden met het verzending naar het Valportaal. Print het advies a.u.b. uit vanuit het Advies pagina, en geef het aan de patiënt op papier. U kunt het versturen naar het Valportaal later opnieuw proberen.");
        } else if (message.text.includes("etl_renew")) {
            alert("Er was een fout optreden met het vernieuwen van data uit het EPD. Als u wil het nogmaals proberen, probeer de connectie met het EPD te verversen door sluiten van dit browser window, klikken opnieuw het link in het EPD, en daarna nogmaals het Vernieuwen knop te klikken.")
        } else {
            let url = "/load-error";
            if (message.text == 'No doctor_id in session') {
                url += "?err=Verbinding met server is verloren."
            }
            window.location = url;
        }
    }

    if ('timeout_ms_remaining' in message) {
        const two_minutes = (2 * 60 * 1000);
        const ten_seconds = (10 * 1000);
        let remaining = message.timeout_ms_remaining;

        if (remaining < ten_seconds) {
            let url = "/load-error";
            url += "?err=Session expired."
            window.location = url;
        } else if (remaining < two_minutes) {
            let expiration_div = document.getElementById("expiration");
            expiration_div.style.display = 'block';
            let timeout_div = document.getElementById("timeout-time");
            let currentDate = new Date();
            let expire_time = currentDate.getHours() + ":" + (currentDate.getMinutes() + 2);
            console.log(expire_time);
            timeout_div.innerHTML = "Sessie gaat verlopen om " + expire_time;
        } else {
            let expiration_div = document.getElementById("expiration");
            expiration_div.style.display = 'none';
        }
    }
}

function ws_on_close(event) {
    let element = document.getElementById("viewer-count");
    element.innerHTML = 'Connecting ...';
    element.style.visibility = 'visible';
    element.style.color = 'red';

    let elementList = document.querySelectorAll("input");
    for (let i = 0; i < elementList.length; ++i) {
        let input = elementList[i];
        input.disabled = true;
    };

    let textAreaList = document.querySelectorAll("textarea");
    for (let i = 0; i < textAreaList.length; ++i) {
        let ta = textAreaList[i];
        ta.disabled = true;
    }

    message_globals.ws = null;
    message_globals.messages_received = 0;

    let one_second = 1000;
    message_globals.logger.log('Socket closed:', event.reason,
        ' will try to reconnect');
    setTimeout(function() {
        message_globals.logger.log('Reconnecting....');
        connect_web_socket();
    }, one_second);
}

function ws_on_error(err) {
    message_globals.logger.error('Socket error: ', err.message);
    message_globals.ws.close();
};

function connect_web_socket() {

    let ws_protocol = 'wss:';

    // URL.protocol is not safe in older Internet Explorers

    const url_regex = /^([^:]*):\/\/([^:/]*)(:([0-9]+))?/
    let matches = document.URL.match(url_regex);
    let url_protocol = matches[1];
    let url_hostname = matches[2];
    let url_port = matches[4];

    if (url_protocol === 'http') {
        ws_protocol = 'ws:';
        if (!url_port) {
            url_port = 80;
        }
    } else {
        if (!url_port) {
            url_port = 443;
        }
    }

    // URLSearchParams does not work in IE
    // let params = new URLSearchParams(window.location.search);
    message_globals.patient_id = url_param('id');

    let base_url = ws_protocol + '//' + url_hostname + ':' + url_port;
    let ws_url = base_url + '/patient/' + message_globals.patient_id;
    message_globals.ws = new WebSocket(ws_url);
    message_globals.ws.onmessage = ws_on_message;
    message_globals.ws.onclose = ws_on_close;
    message_globals.ws.onerror = ws_on_error;

    if (message_globals.debug > 0) {
        message_globals.logger.log('creating websocket with url:', ws_url);
    }

    return message_globals.ws;
}

function url_param(par_name) {
    var results = new RegExp('[\?&]' + par_name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return decodeURIComponent(results[1]) || 0;
    }
}

function send_ping() {
    send_message("ping", function(msg) {
        msg.sent = Date.now();
    });
}

function connect_web_socket_and_keep_alive() {
    connect_web_socket();

    let one_second = 1000;
    let ping_interval = 4 * one_second;
    setInterval(function() {
        if (message_globals.ws) {
            send_ping();
        }
    }, ping_interval);

    let freetext_interval = (one_second / 4);
    setInterval(function() {
        if (message_globals.ws) {
            let textfield_id = message_globals.freetexts_entered;
            if (textfield_id != null) {
                send_freetext(textfield_id);
                message_globals.freetexts_entered = null;
            }
        }
    }, freetext_interval);
}

function copy_text_to_clipboard(text, type) {
    if (navigator.clipboard != undefined) {
        navigator.clipboard.writeText(text);
    } else if (window.clipboardData) {
        // Internet Explorer
        window.clipboardData.setData("Text", text);
    } else {
        alert("browser does not support copy");
    }

    send_message(type);

    return true;
}

function innerTextVisibleOnly(element) {
    var result = "";
    var i = 0;
    for (i = 0; i < element.children.length; ++i) {
        if (element.children[i].style.visibility != 'hidden' &&
            element.children[i].style.display != 'none'
        ) {
            console.log("shown: " + element.children[i].id + "-------------\n");
            result += element.children[i].innerText + '\n';
        } else {
            console.log("hidden: " + element.children[i].id + "-------------\n");
        }
    }
    return result;
}

function copy_ehr_text_to_clipboard() {
    var allEHRText = document.getElementById("div_all_ehr_text");
    var displayed_inner_text = innerTextVisibleOnly(allEHRText);
    //get rid of extra CR and LF
    displayed_inner_text = displayed_inner_text.replace(/\r\n?/g, "");
    return copy_text_to_clipboard(displayed_inner_text, 'was_copied_ehr');
}

function copy_patient_text_to_clipboard() {
    var patient_medication_advice_list = document.getElementById("patient-medication-advice-list");
    var div_other_med_advice = document.getElementById("div_other_med_advice");
    var patient_non_med_advice_list = document.getElementById("patient-non-med-advice-list");
    var all_text = document.getElementById("patient_med_advice_header").innerText + "\n";
    all_text = all_text + innerTextVisibleOnly(patient_medication_advice_list) + "\n";
    all_text = all_text + innerTextVisibleOnly(div_other_med_advice) + "\n";
    all_text = all_text + document.getElementById("patient_warning").innerText + "\n\n";
    all_text = all_text + document.getElementById("header_overige_advies").innerText + "\n";
    all_text = all_text + innerTextVisibleOnly(patient_non_med_advice_list);
    return copy_text_to_clipboard(all_text, 'was_copied_patient');
}

function make_definitive() {
    send_message('definitive');
    return true;
}

function patient_renew() {
    send_message('patient_renew');
    let patient_id = five_pages.patient_id;
    let url = "/loading?id=" + patient_id;
    window.location = url;
    return true;
}

function window_print() {
    window.print();
    send_message('was_printed');
    return true;
}

function reset_session_timeout() {
    message_globals.reset_session_timeout = true;
    send_ping();
}

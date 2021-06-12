// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

function calculatePredictionDB(GDS_score, grip_kg, walking_speed_m_per_s, BMI,
systolic_bp_mmHg, number_of_limitations, nr_falls_12m, smoking,
has_antiepileptica, has_ca_blocker, has_incont_med, education_hml, fear1, fear2){

	if(GDS_score==null || grip_kg==null ||  walking_speed_m_per_s==null ||  BMI==null ||
		systolic_bp_mmHg==null ||  number_of_limitations==null ||  nr_falls_12m==null ||  smoking==null ||
		has_antiepileptica==null ||  has_ca_blocker==null ||  has_incont_med==null ||  education_hml==null ||
		fear1==null ||  fear2==null){
		return null;
	}
	var edu2 = 0;
	var edu3 = 0;
	if(education_hml >= 2){edu2 = 1;}
	if(education_hml >= 3){edu3 = 1;}
	var nrFall1 = 0;
	var nrFall2 = 0;
	if(nr_falls_12m >= 1){nrFall1 = 1;}
	if(nr_falls_12m >= 2){nrFall2 = 1;}
	return calculatePrediction(GDS_score, grip_kg, walking_speed_m_per_s, BMI,
	systolic_bp_mmHg, number_of_limitations, nrFall1, nrFall2, smoking,
	has_antiepileptica, has_ca_blocker, has_incont_med, edu2, edu3, fear1, fear2);
}

function calculatePrediction(GDS_score, grip_kg, walking_speed_m_per_s, BMI,
systolic_bp_mmHg, number_of_limitations, nrFall1, nrFall2, smoking,
has_antiepileptica, has_ca_blocker, has_incont_med, edu2, edu3, fear1, fear2){
	var p = -0.2047 +
	0.0778  * (GDS_score - 1.4401) / 1.9419 +
	-0.1678  * (grip_kg  - 32.4838) / 10.8414 +
	0.0997 * (walking_speed_m_per_s - 0.9417) / 0.2760 +
	-0.0204 * BMI +
	-0.0039 * systolic_bp_mmHg +
	0.1419 * (number_of_limitations - 1.2088) / 1.5286 +
	nrFall1 * 0.4841 +
	nrFall2 * 0.6791 +
	smoking * -0.2870 +
	has_antiepileptica * 0.4962 +
	has_ca_blocker * -0.1866 +
	has_incont_med * 0.7459 +
	edu2 * 0.1972 +
	edu3 * 0.3687 +
	fear1 * 0.2268 +
	fear2 * 0.2222;
	var prediction = Math.round(100*(Math.exp(p) / (1+ Math.exp(p))));

	return prediction;
}

module.exports = {
    calculatePrediction: calculatePrediction,
    calculatePredictionDB: calculatePredictionDB
}
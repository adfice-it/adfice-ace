// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

function calculate_prediction_db(GDS_score, grip_kg, walking_speed_m_per_s, BMI,
    systolic_bp_mmHg, number_of_limitations, nr_falls_12m, smoking,
    has_antiepileptica, has_ca_blocker, has_incont_med, education_hml, fear1,
    fear2) {

    if (GDS_score == null ||
        grip_kg == null ||
        walking_speed_m_per_s == null ||
        BMI == null ||
        systolic_bp_mmHg == null ||
        number_of_limitations == null ||
        nr_falls_12m == null ||
        smoking == null ||
        has_antiepileptica == null ||
        has_ca_blocker == null ||
        has_incont_med == null ||
        education_hml == null ||
        fear1 == null ||
        fear2 == null) {
        return null;
    }
    // Education was included as a categorical variable that denotes the
    // highest educational attainment. R automatically applies dummy coding
    // when modelling categorical variables so that only one of the
    // coefficients can be "turned on" and be multiplied with 1.
    var edu2 = 0;
    var edu3 = 0;
    if (education_hml == 2) {
        edu2 = 1;
    }
    if (education_hml == 3) {
        edu3 = 1;
    }
    // Note that fall history was not modelled as a categorical variable but
    // as two distinct dichotomous variables (i.e., any fall in past year
    // (= 1 fall) and recurrent falls (= 2 falls) in past year).
    var nrFall1 = 0;
    var nrFall2 = 0;
    if (nr_falls_12m >= 1) {
        nrFall1 = 1;
    }
    if (nr_falls_12m >= 2) {
        nrFall2 = 1;
    }
    // fear of falls (FES score) is categorical, thus fear0, fear1, *or*
    // fear2 should = 1; the other two should be 0.
    return calculate_prediction(
        GDS_score,
        grip_kg,
        walking_speed_m_per_s,
        BMI,
        systolic_bp_mmHg,
        number_of_limitations,
        nrFall1,
        nrFall2,
        smoking,
        has_antiepileptica,
        has_ca_blocker,
        has_incont_med,
        edu2,
        edu3,
        fear1,
        fear2);
}

function calculate_prediction(GDS_score, grip_kg, walking_speed_m_per_s, BMI,
    systolic_bp_mmHg, number_of_limitations, nrFall1, nrFall2, smoking,
    has_antiepileptica, has_ca_blocker, has_incont_med, edu2, edu3, fear1,
    fear2) {
    var p = -0.043 +
        0.068 * (GDS_score - 1.4401) / 1.9419 +
        -0.148 * (grip_kg - 32.4838) / 10.8414 +
        0.088 * (walking_speed_m_per_s - 0.9417) / 0.2760 +
        -0.018 * BMI +
        -0.003 * systolic_bp_mmHg +
        0.125 * (number_of_limitations - 1.2088) / 1.5286 +
        nrFall1 * 0.426 +
        nrFall2 * 0.597 +
        smoking * -0.252 +
        has_antiepileptica * 0.436 +
        has_ca_blocker * -0.164 +
        has_incont_med * 0.656 +
        edu2 * 0.173 +
        edu3 * 0.324 +
        fear1 * 0.199 +
        fear2 * 0.195;
    var prediction = Math.round(100 * (Math.exp(p) / (1 + Math.exp(p))));
// console.log(prediction);// console.log('GDS_score: ' + GDS_score + '\ngrip_kg: ' + grip_kg + '\nwalking_speed_m_per_s: ' + walking_speed_m_per_s + '\nBMI: ' + BMI + '\nsystolic_bp_mmHg: ' + systolic_bp_mmHg + '\nnumber_of_limitations: ' + number_of_limitations + '\nnrFall1: ' + nrFall1 + '\nnrFall2: ' + nrFall2 + '\nsmoking: ' + smoking + '\nhas_antiepileptica: ' + has_antiepileptica + '\nhas_ca_blocker: ' + has_ca_blocker + '\nhas_incont_med: ' + has_incont_med + '\nedu2: ' + edu2 + '\nedu3: ' + edu3 + '\nfear1: ' + fear1 + '\nfear2: ' + fear2);
    return prediction;
}

module.exports = {
    calculate_prediction: calculate_prediction,
    calculate_prediction_db: calculate_prediction_db
}

// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
// vim: set sts=4 shiftwidth=4 expandtab :
"use strict";

const cp = require('./calculate-prediction')

test('calculate_prediction', () => {
    let GDS_score = 1;
    let grip_kg = 21.5;
    let walking_speed_m_per_s = 0.6;
    let BMI = 21.5;
    let systolic_bp_mmHg = 140;
    let number_of_limitations = 1;
    let nrFall1 = 1; //3 falls
    let nrFall2 = 1;
    let smoking = 1;
    let has_antiepileptica = 0;
    let has_ca_blocker = 0;
    let has_incont_med = 1;
    let edu2 = 1;
    let edu3 = 0;
    let fear1 = 0;
    let fear2 = 1;
    let prediction = cp.calculate_prediction(
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
    expect(prediction).toBe(72);
})

test('calculate_prediction_db good data', () => {
    let GDS_score = 1;
    let grip_kg = 21.5;
    let walking_speed_m_per_s = 0.6;
    let BMI = 21.5;
    let systolic_bp_mmHg = 140;
    let number_of_limitations = 1;
    let nr_falls_12m = 3;
    let smoking = 1;
    let has_antiepileptica = 0;
    let has_ca_blocker = 0;
    let has_incont_med = 1;
    let education_hml = 3;
    let fear1 = 0;
    let fear2 = 1;
    let prediction = cp.calculate_prediction_db(
        GDS_score,
        grip_kg,
        walking_speed_m_per_s,
        BMI,
        systolic_bp_mmHg,
        number_of_limitations,
        nr_falls_12m,
        smoking,
        has_antiepileptica,
        has_ca_blocker,
        has_incont_med,
        education_hml,
        fear1,
        fear2);
    expect(prediction).toBe(75);

    nr_falls_12m = 0;
    education_hml = 1;
    prediction = cp.calculate_prediction_db(
        GDS_score,
        grip_kg,
        walking_speed_m_per_s,
        BMI,
        systolic_bp_mmHg,
        number_of_limitations,
        nr_falls_12m,
        smoking,
        has_antiepileptica,
        has_ca_blocker,
        has_incont_med,
        education_hml,
        fear1,
        fear2);
    expect(prediction).toBe(44);

    nr_falls_12m = 1;
    education_hml = 2;
    prediction = cp.calculate_prediction_db(
        GDS_score,
        grip_kg,
        walking_speed_m_per_s,
        BMI,
        systolic_bp_mmHg,
        number_of_limitations,
        nr_falls_12m,
        smoking,
        has_antiepileptica,
        has_ca_blocker,
        has_incont_med,
        education_hml,
        fear1,
        fear2);
    expect(prediction).toBe(59);
})

test('calculate_prediction_db bad data', () => {
    let GDS_score = 1;
    let grip_kg = null;
    let walking_speed_m_per_s = 0.6;
    let BMI = 21.5;
    let systolic_bp_mmHg = 140;
    let number_of_limitations = 1;
    let nr_falls_12m = 3;
    let smoking = 1;
    let has_antiepileptica = 0;
    let has_ca_blocker = 0;
    let has_incont_med = 1;
    let education_hml = 3;
    let fear1 = 0;
    let fear2 = 1;
    let prediction = cp.calculate_prediction_db(
        GDS_score,
        grip_kg,
        walking_speed_m_per_s,
        BMI,
        systolic_bp_mmHg,
        number_of_limitations,
        nr_falls_12m,
        smoking,
        has_antiepileptica,
        has_ca_blocker,
        has_incont_med,
        education_hml,
        fear1,
        fear2);
    expect(prediction).toBe(null);
})

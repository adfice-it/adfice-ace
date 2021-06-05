-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
INSERT INTO patient_measurements
(patient_id, date_retrieved, height_cm, height_date_measured, weight_kg,
weight_date_measured, GDS_score, GDS_date_measured, grip_kg,
grip_date_measured, walking_speed_m_per_s, walking_date_measured,
systolic_bp_mmHg, bp_date_measured, functional_limit_trap,
functional_limit_kleding, functional_limit_stoel,
functional_limit_nagels, functional_limit_lopen,
functional_limit_date_measured, FES_kleding, FES_bad, FES_stoel,
FES_trap, FES_reiken, FES_helling, FES_sociale,
fear_of_falls_date_measured, nr_falls_12m, nr_falls_date_measured,
smoking, smoking_date_measured) VALUES
(2, (select NOW()), 160, (select NOW()), 55, (select NOW()), 1, (select NOW()),
21.5, (select NOW()), 0.6, (select NOW()), 140, (select NOW()), 3, 1, 1, 1, 1,
(select NOW()), "Helemaal niet bezorgd" , "Erg bezorgd" , "Helemaal niet
bezorgd" , "Helemaal niet bezorgd" , "Helemaal niet bezorgd" , "Erg
bezorgd" , "Helemaal niet bezorgd" , (select NOW()), 3, (select NOW()), 1,
(select NOW())),
(3, (select NOW()), 180, (select NOW()), 70, (select NOW()), 3, (select NOW()),
30, (select NOW()), 1, (select NOW()), 130, (select NOW()), 3, 1, 2, 1, 3,
(select NOW()), "Helemaal niet bezorgd" , "Een beetje bezorgd", "Helemaal
niet bezorgd" , "Een beetje bezorgd", "Een beetje bezorgd", "Een beetje
bezorgd", "Helemaal niet bezorgd" , (select NOW()), 5, (select NOW()), 1,
(select NOW()));

-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021-2026 Stichting Open Electronics Lab
SET CHARACTER SET 'utf8'; -- enable unicode support in older clients
INSERT INTO med_other_text (
medication_criteria_id,
select_box_num,
select_box_category,
select_box_designator,
cdss,
ehr,
patient) VALUES
("other",1,"free_text","","Ander medicatie-gerelateerde advies: {{free text}}","Ander medicatie-gerelateerde advies: {{free text}}","Uw arts heeft nog de volgende advies voor u over uw medicatie: {{free text}}");

-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2023-2026 Stichting Open Electronics Lab

insert into pid
(select id, patient_id from patient where participant_number = "WITHDRAWN" and row_updated < DATE_SUB(NOW(), INTERVAL 1 DAY)); -- if the WITHDRAWN status was just added, don't delete them (yet)

insert into pid
(select id, patient_id from patient where (participant_number is null or participant_number = '') and id > 179 and row_created < DATE_SUB(NOW(), INTERVAL 2 MONTH)); -- patients 1 to 179 are test patients
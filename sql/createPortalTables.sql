-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021-2024 Stichting Open Electronics Lab

CREATE TABLE `patient_advice` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` varchar(36) NOT NULL,
  `bsn` varchar(15) NOT NULL,
  `json_advice` JSON NOT NULL,
  `row_created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `row_updated` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `patient_id` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

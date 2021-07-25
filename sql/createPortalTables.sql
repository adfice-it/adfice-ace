-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw

CREATE TABLE `patient_advice` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int(10) unsigned NOT NULL,
  `json_advice` JSON NOT NULL,
  `row_created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `row_updated` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `patient_id` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

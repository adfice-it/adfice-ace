-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
-- Note that collation gives a warning. Not sure why this collation is used but we should probably use a different one.

CREATE TABLE `problem` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `problem_name` varchar(100) NOT NULL,
  `display_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `lab` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `lab_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `problem_map` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `amc_icd_id` int unsigned,
  `adfice_nr` smallint unsigned,
  `problem_name` varchar(100),
  `icd_10` varchar(10),
  `icd_name` varchar(256),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `education_level` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `coded_level` tinyint NOT NULL DEFAULT '0',
  `level` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coded_level` (`coded_level`,`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

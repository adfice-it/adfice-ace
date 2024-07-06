-- SPDX-License-Identifier: GPL-3.0-or-later
-- Copyright (C) 2021-2024 Stichting Open Electronics Lab
CREATE TABLE `select_box_category_priority` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `priority` int(10) unsigned NOT NULL,
  `select_box_category` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO select_box_category_priority (priority, select_box_category) VALUES
(100, 'stop'),
(200, 'taper-stop'),
(300, 'taper-reduce'),
(400, 'switch'),
(500, 'continue'),
(600, 'consult'),
(700, 'refer'),
(800, 'discuss'),
(900, 'measure'),
(1000, 'examine'),
(1100, 'inform'),
(1200, 'non-med'),
(1300, ''),
(1400, NULL),
(1500, 'follow-up'),
(1600, 'free_text');

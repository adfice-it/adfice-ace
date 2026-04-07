#/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021-2026 Stichting Open Electronics Lab
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem

#!/bin/bash

# install vagrant and kvm
sudo apt install vagrant

# add the current user to the libvirt group
sudo adduser $USER libvirt

# update the chached list of group
newgrp libvirt
newgrp

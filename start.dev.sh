#!/bin/bash
# Setup
# Remove the -beta suffix if you use the non-beta distribution of
# the atom
dir=atom-tree-view-filter
apm=$(apm-beta)
atom=$(atom-beta)

# Navigate to the working directory
cd ~/Projects/Atom/$dir/

# Relink the project for the sake of surefiring the package being
# available and flagged as dev pkg
$apm unlink .
$apm unlink . --dev
$apm link . --dev

$atom --dev .

#!/bin/bash

# Simple testing script, that generates add-ons using all possible paths

set -e

CWD=`pwd`
SCRIPT_FOLDER=`dirname "${BASH_SOURCE[0]}"`
TEST_FOLDER=$CWD/sample-addon
CACHE_FOLDER=$CWD/cache
TEST_ADDON_NAME="Sample Add-on"
TEST_CASES=$SCRIPT_FOLDER/tests/**/*.json

function cleanup() {
    cd $CWD
    rm -rf $TEST_FOLDER
    rm -rf $CACHE_FOLDER
}

# Cleanup test folder in case of error
trap cleanup ERR

mkdir -p $CACHE_FOLDER

for file in $TEST_CASES
do

    mkdir -p $TEST_FOLDER
    cd $TEST_FOLDER

    if [ -d $CACHE_FOLDER/node_modules ]; then
        mv $CACHE_FOLDER/node_modules .
    fi

    echo
    echo -------------------------------------------------------------
    echo Testing generator with $file
    echo -------------------------------------------------------------
    echo

    yo ngx-rocket-addon --no-analytics --automate "$CWD/$file" TEST_ADDON_NAME

    npm run test

    mv node_modules $CACHE_FOLDER

    cd $CWD
    rm -rf $TEST_FOLDER

done

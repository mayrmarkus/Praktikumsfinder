#!/usr/bin/env bash
ERRORS=""
for f in $(find ./ -name '*php*'); 
do
    php -l $f >> /tmp/err.log;
done
HASERR=false
while read p; do
    if [[ $p == *"Errors parsing"* ]]; then
        echo $p
        HASERR=true
    fi
done </tmp/err.log
if $HASERR; then
    echo ERROR: please check the PIPELINE OUTPUT
    exit 1
fi
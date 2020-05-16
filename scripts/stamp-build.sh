#!/bin/bash

set -o errexit
set -o pipefail

if [ -z "$GITHUB_SHA" ]
then
   version=`git rev-parse --short HEAD`
else
   version=`echo $GITHUB_SHA | cut -c1-8`
fi

## replease _BUILD_HASH_ with the current build number
perl -i -pe "s/_BUILD_HASH_/$version/g" dist/hue-action-app/index.html

status=$?
if [ $status -eq 0 ];then
   echo ">> Build was stamped: $sha"
else
   echo ">> Could not stamp this build!"
fi

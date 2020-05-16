#!/bin/bash

set -o errexit
set -o pipefail

if [ -z "$GITHUB_SHA" ]
then
   b=`git rev-parse --abbrev-ref HEAD`
   v=`git rev-parse --short HEAD`
   sha="$b+sha.$v"
else
   v=`echo $GITHUB_SHA | cut -c1-8`
   sha="#$v"
fi

version="<a href='https:\/\/github.com\/manekinekko\/hue-action-app\/tree\/$sha'>$sha<\/a>"

## replease _BUILD_HASH_ with the current build number
perl -i -pe "s/_BUILD_HASH_/$version/g" dist/hue-action-app/index.html

status=$?
if [ $status -eq 0 ];then
   echo ">> Build was stamped: $sha"
else
   echo ">> Could not stamp this build!"
fi

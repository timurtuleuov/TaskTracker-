#!/bin/bash
git pull origin master
git add .
last_commit_message=$(git log -1 --pretty=%B)

git commit -m "${last_commit_message}"
git push -u origin master
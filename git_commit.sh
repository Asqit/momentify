#!/usr/bin/bash

cd ./server

echo "Making an archive of uploaded images..."
tar -cf public.tar.gz ./public


echo "Removing unarchived images..."
rm -rf public

cd ..

git add -A 

git commit


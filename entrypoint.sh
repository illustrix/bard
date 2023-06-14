#!/bin/sh

export NODE_PATH=./dist
export NODE_ENV=production
exec node ./dist/index.js $@

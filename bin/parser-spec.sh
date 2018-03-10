#!/bin/sh
script_path="`dirname $0`"
grammar_path="`mktemp`"
parser_path="`mktemp`"

echo "$1" > "$grammar_path"
node $script_path/../current/meta-to-js.js "$grammar_path" "$parser_path"
node $script_path/eval-parser.js $parser_path $2

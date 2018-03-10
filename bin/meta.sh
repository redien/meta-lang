#!/bin/sh

language="$1"
input_path="$2"
output_path="$3"

resolve_symlink() {
    if command -v realpath >/dev/null 2>&1; then
        realpath "$1"
    else
        readlink "$1"
    fi
}

if [ -z "$language" ] || [ -z "$input_path" ] || [ -z "$output_path" ]; then
    >&2 cat <<endhelp

Usage: meta [language] [input grammar] [destination]

    language        Target language of the parser
    input grammar   The .meta grammar to generate a parser for
    destination     Where to write the parser to

Languages:
    js              Javascript

endhelp
    exit 1
fi

script_path="`dirname $0`/`resolve_symlink $0`/.."

node $script_path/../current/meta-to-$language.js "$input_path" "$output_path"

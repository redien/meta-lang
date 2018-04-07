
var slice = Array.prototype.slice;
function cont (f) {
    var args = arguments;
    var thunk = function () { return f.apply(null, slice.call(args, 1)); }
    thunk.isThunk = true;
    return thunk;
}
function identity (x) { return x; }
function trampoline (thunk) {
    while (thunk && thunk.isThunk) {
        thunk = thunk();
    }
    return thunk;
}
function _pipe (a, b) { return function (value) { return b(a(value)); }; }
function pipe (fs) { return fs.reduce(_pipe) };
function zip (arrays) { return arrays[0].map(function(_,i){ return arrays.map(function(array){return array[i]}) }); }
function objectToArray(obj) { return zip([Object.keys(obj), Object.values(obj)]); }
function indexedIterator(input) {
    return {input: input, offset: 0};
}
function next(iterator) {
    return {input: iterator.input, offset: iterator.offset + 1};
}
function value(iterator) {
    return iterator.input.charCodeAt(iterator.offset);
}
function isEnd(iterator) {
    return iterator.offset === iterator.input.length;
}
function match (alternatives, iterator, transform, continuation) {
    if (alternatives.length === 0) {
        return cont(continuation, null);
    } else {
        return cont(alternatives[0], iterator, transform, function (result) {
            if (result !== null) { return cont(continuation, result); }
            return cont(match, alternatives.slice(1), iterator, transform, continuation);
        });
    }
}
function numberParser (number, returnFromRule, continuation) {
    return function (items, iterator) {
        if (value(iterator) === number) {
            var result = {result: String.fromCharCode(value(iterator)), start: iterator, end: next(iterator)};
            return cont(continuation, items.concat([result]), next(iterator));
        } else {
            return cont(returnFromRule, null);
        }
    };
}
function rangeParser (from, to, returnFromRule, continuation) {
    return function (items, iterator) {
        var code = value(iterator);
        if (code >= from && code <= to) {
            var result = {result: String.fromCharCode(code), start: iterator, end: next(iterator)};
            return cont(continuation, items.concat([result]), next(iterator));
        } else {
            return cont(returnFromRule, null);
        }
    };
}
function identifierParser (identifier, returnFromRule, transform, continuation) {
    return function (items, iterator) {
        return cont(parse, identifier, iterator, transform, function (result) {
            if (result === null) { return cont(returnFromRule, null); }
            return cont(continuation, items.concat([result]), result.end);
        });
    };
}
function eofParser (returnFromRule, continuation) {
    return function (items, iterator) {
        if (isEnd(iterator)) {
            return cont(continuation, items.concat([{result: null, start: iterator, end: iterator}]), iterator);
        } else {
            return cont(returnFromRule, null);
        }
    };
}
function initialContinuation (returnFromRule, startIterator) {
    return function (items, iterator) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startIterator, end: iterator});
    };
}
function findTransformer(transform, name) {
    return transform.filter(function (transformer) {
        return transformer[0] === name;
    });
}
function initialSuffixContinuation (transformer, returnFromRule, startIterator, transform) {
    return function (items, iterator) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = findTransformer(transform, transformer)[0][1].apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startIterator, end: iterator});
    };
}
function parse (name, iterator, transform, continuation) {
    var alternatives = grammar
        .filter(function (rule) { return rule.name === name; })
        .map(function (rule) { return rule.parser; });
    if (alternatives.length === 0) {
        throw new Error('Unknown rule ' + name);
    }
    return cont(match, alternatives, iterator, transform, continuation);
}
var grammar = [
{
    name: "dash",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            numberParser.bind(null, 45, returnFromRule)
        ])(initialContinuation(returnFromRule, iterator)), [], iterator);
    }
},
{
    name: "dot",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            numberParser.bind(null, 46, returnFromRule)
        ])(initialContinuation(returnFromRule, iterator)), [], iterator);
    }
},
{
    name: "space",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            numberParser.bind(null, 32, returnFromRule)
        ])(initialContinuation(returnFromRule, iterator)), [], iterator);
    }
},
{
    name: "lf",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            numberParser.bind(null, 10, returnFromRule)
        ])(initialContinuation(returnFromRule, iterator)), [], iterator);
    }
},
{
    name: "cr",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            numberParser.bind(null, 13, returnFromRule)
        ])(initialContinuation(returnFromRule, iterator)), [], iterator);
    }
},
{
    name: "newline",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "cr", returnFromRule, transform),
            identifierParser.bind(null, "lf", returnFromRule, transform)
        ])(initialContinuation(returnFromRule, iterator)), [], iterator);
    }
},
{
    name: "newline",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "lf", returnFromRule, transform),
            identifierParser.bind(null, "cr", returnFromRule, transform)
        ])(initialContinuation(returnFromRule, iterator)), [], iterator);
    }
},
{
    name: "newline",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "lf", returnFromRule, transform)
        ])(initialContinuation(returnFromRule, iterator)), [], iterator);
    }
},
{
    name: "newlines",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "newlines", returnFromRule, transform),
            identifierParser.bind(null, "newline", returnFromRule, transform)
        ])(initialContinuation(returnFromRule, iterator)), [], iterator);
    }
},
{
    name: "newlines",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "newline", returnFromRule, transform),
            identifierParser.bind(null, "whitespaces", returnFromRule, transform)
        ])(initialContinuation(returnFromRule, iterator)), [], iterator);
    }
},
{
    name: "newlines",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity
        ])(initialContinuation(returnFromRule, iterator)), [], iterator);
    }
},
{
    name: "whitespaces",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "whitespaces", returnFromRule, transform),
            identifierParser.bind(null, "space", returnFromRule, transform)
        ])(initialContinuation(returnFromRule, iterator)), [], iterator);
    }
},
{
    name: "whitespaces",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity
        ])(initialContinuation(returnFromRule, iterator)), [], iterator);
    }
},
{
    name: "numeric",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            rangeParser.bind(null, 48, 57, returnFromRule)
        ])(initialContinuation(returnFromRule, iterator)), [], iterator);
    }
},
{
    name: "number",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "number", returnFromRule, transform),
            identifierParser.bind(null, "numeric", returnFromRule, transform)
        ])(initialSuffixContinuation("number_multiple", returnFromRule, iterator, transform)), [], iterator);
    }
},
{
    name: "number",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "numeric", returnFromRule, transform)
        ])(initialSuffixContinuation("number_single", returnFromRule, iterator, transform)), [], iterator);
    }
},
{
    name: "alphabetical",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            rangeParser.bind(null, 65, 90, returnFromRule)
        ])(initialContinuation(returnFromRule, iterator)), [], iterator);
    }
},
{
    name: "alphabetical",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            rangeParser.bind(null, 97, 122, returnFromRule)
        ])(initialContinuation(returnFromRule, iterator)), [], iterator);
    }
},
{
    name: "alphanumeric",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "numeric", returnFromRule, transform)
        ])(initialContinuation(returnFromRule, iterator)), [], iterator);
    }
},
{
    name: "alphanumeric",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "alphabetical", returnFromRule, transform)
        ])(initialContinuation(returnFromRule, iterator)), [], iterator);
    }
},
{
    name: "identifier",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "identifierRest", returnFromRule, transform),
            identifierParser.bind(null, "alphabetical", returnFromRule, transform)
        ])(initialSuffixContinuation("identifier_multiple", returnFromRule, iterator, transform)), [], iterator);
    }
},
{
    name: "identifier",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "alphabetical", returnFromRule, transform)
        ])(initialSuffixContinuation("identifier_single", returnFromRule, iterator, transform)), [], iterator);
    }
},
{
    name: "identifierRest",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "identifierRest", returnFromRule, transform),
            identifierParser.bind(null, "alphanumeric", returnFromRule, transform)
        ])(initialSuffixContinuation("identifierRest_multiple", returnFromRule, iterator, transform)), [], iterator);
    }
},
{
    name: "identifierRest",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "alphanumeric", returnFromRule, transform)
        ])(initialSuffixContinuation("identifierRest_single", returnFromRule, iterator, transform)), [], iterator);
    }
},
{
    name: "part",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "identifier", returnFromRule, transform)
        ])(initialSuffixContinuation("part_identifier", returnFromRule, iterator, transform)), [], iterator);
    }
},
{
    name: "part",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "number", returnFromRule, transform),
            identifierParser.bind(null, "dash", returnFromRule, transform),
            identifierParser.bind(null, "number", returnFromRule, transform)
        ])(initialSuffixContinuation("part_range", returnFromRule, iterator, transform)), [], iterator);
    }
},
{
    name: "part",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "number", returnFromRule, transform)
        ])(initialSuffixContinuation("part_number", returnFromRule, iterator, transform)), [], iterator);
    }
},
{
    name: "part",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "dot", returnFromRule, transform)
        ])(initialSuffixContinuation("part_eof", returnFromRule, iterator, transform)), [], iterator);
    }
},
{
    name: "parts",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "parts", returnFromRule, transform),
            identifierParser.bind(null, "whitespaces", returnFromRule, transform),
            identifierParser.bind(null, "part", returnFromRule, transform)
        ])(initialSuffixContinuation("parts_multiple", returnFromRule, iterator, transform)), [], iterator);
    }
},
{
    name: "parts",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "part", returnFromRule, transform)
        ])(initialSuffixContinuation("parts_single", returnFromRule, iterator, transform)), [], iterator);
    }
},
{
    name: "parts",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity
        ])(initialSuffixContinuation("parts_none", returnFromRule, iterator, transform)), [], iterator);
    }
},
{
    name: "suffix",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "identifier", returnFromRule, transform),
            identifierParser.bind(null, "dash", returnFromRule, transform)
        ])(initialSuffixContinuation("suffix_suffix", returnFromRule, iterator, transform)), [], iterator);
    }
},
{
    name: "rule",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "newline", returnFromRule, transform),
            identifierParser.bind(null, "suffix", returnFromRule, transform),
            identifierParser.bind(null, "whitespaces", returnFromRule, transform),
            identifierParser.bind(null, "parts", returnFromRule, transform),
            identifierParser.bind(null, "whitespaces", returnFromRule, transform),
            identifierParser.bind(null, "identifier", returnFromRule, transform)
        ])(initialSuffixContinuation("rule_withSuffix", returnFromRule, iterator, transform)), [], iterator);
    }
},
{
    name: "rule",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "newline", returnFromRule, transform),
            identifierParser.bind(null, "whitespaces", returnFromRule, transform),
            identifierParser.bind(null, "parts", returnFromRule, transform),
            identifierParser.bind(null, "whitespaces", returnFromRule, transform),
            identifierParser.bind(null, "identifier", returnFromRule, transform)
        ])(initialSuffixContinuation("rule_withoutSuffix", returnFromRule, iterator, transform)), [], iterator);
    }
},
{
    name: "grammar",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "grammar", returnFromRule, transform),
            identifierParser.bind(null, "newlines", returnFromRule, transform),
            identifierParser.bind(null, "rule", returnFromRule, transform),
            identifierParser.bind(null, "newlines", returnFromRule, transform)
        ])(initialSuffixContinuation("grammar_multiple", returnFromRule, iterator, transform)), [], iterator);
    }
},
{
    name: "grammar",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            identifierParser.bind(null, "newlines", returnFromRule, transform),
            identifierParser.bind(null, "rule", returnFromRule, transform),
            identifierParser.bind(null, "newlines", returnFromRule, transform)
        ])(initialSuffixContinuation("grammar_single", returnFromRule, iterator, transform)), [], iterator);
    }
},
{
    name: "start",
    parser: function (iterator, transform, returnFromRule) {
        return cont(pipe([
            identity,
            eofParser.bind(null, returnFromRule),
            identifierParser.bind(null, "grammar", returnFromRule, transform)
        ])(initialSuffixContinuation("start_start", returnFromRule, iterator, transform)), [], iterator);
    }
},

{}
];
module.exports.parse = function (input, transform) {
    return trampoline(cont(parse, 'start', indexedIterator(input), objectToArray(transform), identity));
};
var transform = {};

transform.number_single = function (n) {
    return '' + n + '';
};
transform.number_multiple = function (a, b) {
    return '' + a + '' + b + '';
};
transform.identifier_single = function (n) {
    return '' + n + '';
};
transform.identifier_multiple = function (a, b) {
    return '' + a + '' + b + '';
};
transform.identifierRest_single = function (n) {
    return '' + n + '';
};
transform.identifierRest_multiple = function (a, b) {
    return '' + a + '' + b + '';
};
transform.part_number = function (number) {
    return 'numberParser.bind(null, ' + number + ', returnFromRule)';
};
transform.part_range = function (from, _, to) {
    return 'rangeParser.bind(null, ' + from + ', ' + to + ', returnFromRule)';
};
transform.part_identifier = function (identifier) {
    return 'identifierParser.bind(null, "' + identifier + '", returnFromRule, transform)';
};
transform.part_eof = function () {
    return 'eofParser.bind(null, returnFromRule)';
};
transform.parts_single = function (n) {
    return '' + n + '';
};
transform.parts_multiple = function (part, _, rest) {
    return '' + rest + ',\n\
            ' + part + '';
};
transform.parts_none = function () {
    return '';
};
transform.rule_withoutSuffix = function (name, _, parts, _, _) {
    return '{\n\
    name: "' + name + '",\n\
    parser: function (iterator, transform, returnFromRule) {\n\
        return cont(pipe([\n\
            identity' + parts + '\n\
        ])(initialContinuation(returnFromRule, iterator)), [], iterator);\n\
    }\n\
},\n\
';
};
transform.rule_withSuffix = function (name, _, parts, _, suffix, _) {
    return '{\n\
    name: "' + name + '",\n\
    parser: function (iterator, transform, returnFromRule) {\n\
        return cont(pipe([\n\
            identity' + parts + '\n\
        ])(initialSuffixContinuation("' + name + '_' + suffix + '", returnFromRule, iterator, transform)), [], iterator);\n\
    }\n\
},\n\
';
};
transform.suffix_suffix = function (_, suffix) {
    return '' + suffix + '';
};
transform.grammar_single = function (_, rule, _) {
    return '' + rule + '';
};
transform.grammar_multiple = function (_, rule, _, rest) {
    return '' + rule + '' + rest + '';
};
transform.start_start = function (grammar, _) {
    return 'var slice = Array.prototype.slice;\n\
function cont (f) {\n\
    var args = arguments;\n\
    var thunk = function () { return f.apply(null, slice.call(args, 1)); }\n\
    thunk.isThunk = true;\n\
    return thunk;\n\
}\n\
function identity (x) { return x; }\n\
function trampoline (thunk) {\n\
    while (thunk && thunk.isThunk) {\n\
        thunk = thunk();\n\
    }\n\
    return thunk;\n\
}\n\
function _pipe (a, b) { return function (value) { return b(a(value)); }; }\n\
function pipe (fs) { return fs.reduce(_pipe) };\n\
function zip (arrays) { return arrays[0].map(function(_,i){ return arrays.map(function(array){return array[i]}) }); }\n\
function objectToArray(obj) { return zip([Object.keys(obj), Object.values(obj)]); }\n\
function indexedIterator(input) {\n\
    return {input: input, offset: 0};\n\
}\n\
function next(iterator) {\n\
    return {input: iterator.input, offset: iterator.offset + 1};\n\
}\n\
function value(iterator) {\n\
    return iterator.input.charCodeAt(iterator.offset);\n\
}\n\
function isEnd(iterator) {\n\
    return iterator.offset === iterator.input.length;\n\
}\n\
function match (alternatives, iterator, transform, continuation) {\n\
    if (alternatives.length === 0) {\n\
        return cont(continuation, null);\n\
    } else {\n\
        return cont(alternatives[0], iterator, transform, function (result) {\n\
            if (result !== null) { return cont(continuation, result); }\n\
            return cont(match, alternatives.slice(1), iterator, transform, continuation);\n\
        });\n\
    }\n\
}\n\
function numberParser (number, returnFromRule, continuation) {\n\
    return function (items, iterator) {\n\
        if (value(iterator) === number) {\n\
            var result = {result: String.fromCharCode(value(iterator)), start: iterator, end: next(iterator)};\n\
            return cont(continuation, items.concat([result]), next(iterator));\n\
        } else {\n\
            return cont(returnFromRule, null);\n\
        }\n\
    };\n\
}\n\
function rangeParser (from, to, returnFromRule, continuation) {\n\
    return function (items, iterator) {\n\
        var code = value(iterator);\n\
        if (code >= from && code <= to) {\n\
            var result = {result: String.fromCharCode(code), start: iterator, end: next(iterator)};\n\
            return cont(continuation, items.concat([result]), next(iterator));\n\
        } else {\n\
            return cont(returnFromRule, null);\n\
        }\n\
    };\n\
}\n\
function identifierParser (identifier, returnFromRule, transform, continuation) {\n\
    return function (items, iterator) {\n\
        return cont(parse, identifier, iterator, transform, function (result) {\n\
            if (result === null) { return cont(returnFromRule, null); }\n\
            return cont(continuation, items.concat([result]), result.end);\n\
        });\n\
    };\n\
}\n\
function eofParser (returnFromRule, continuation) {\n\
    return function (items, iterator) {\n\
        if (isEnd(iterator)) {\n\
            return cont(continuation, items.concat([{result: null, start: iterator, end: iterator}]), iterator);\n\
        } else {\n\
            return cont(returnFromRule, null);\n\
        }\n\
    };\n\
}\n\
function initialContinuation (returnFromRule, startIterator) {\n\
    return function (items, iterator) {\n\
        var results = items.map(function (i) { return i.result; });\n\
        return cont(returnFromRule, {result: results, start: startIterator, end: iterator});\n\
    };\n\
}\n\
function findTransformer(transform, name) {\n\
    return transform.filter(function (transformer) {\n\
        return transformer[0] === name;\n\
    });\n\
}\n\
function initialSuffixContinuation (transformer, returnFromRule, startIterator, transform) {\n\
    return function (items, iterator) {\n\
        var results = items.map(function (i) { return i.result; });\n\
        var transformedResults = findTransformer(transform, transformer)[0][1].apply(null, results);\n\
        return cont(returnFromRule, {result: transformedResults, start: startIterator, end: iterator});\n\
    };\n\
}\n\
function parse (name, iterator, transform, continuation) {\n\
    var alternatives = grammar\n\
        .filter(function (rule) { return rule.name === name; })\n\
        .map(function (rule) { return rule.parser; });\n\
    if (alternatives.length === 0) {\n\
        throw new Error(\'Unknown rule \' + name);\n\
    }\n\
    return cont(match, alternatives, iterator, transform, continuation);\n\
}\n\
var grammar = [\n\
' + grammar + '\n\
{}\n\
];\n\
module.exports.parse = function (input, transform) {\n\
    return trampoline(cont(parse, \'start\', indexedIterator(input), objectToArray(transform), identity));\n\
};';
};
var fs = require('fs');
var input = fs.readFileSync(process.argv[2], 'utf8');
var output = module.exports.parse(input, transform).result;
fs.writeFileSync(process.argv[3], output, 'utf8');


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
var rules = {};
function addRule (name, parseFunction) {
    let rule = rules[name];
    if (rule === undefined) {
        rule = []; 
        rules[name] = rule;
    }
    rule.push(parseFunction);
};
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

function initialSuffixContinuation (transformer, returnFromRule, startIterator, transform) {
    return function (items, iterator) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform[transformer].apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startIterator, end: iterator});
    };
}
function parse (name, iterator, transform, continuation) {
    var alternatives = rules[name];
    if (alternatives === undefined) {
        throw new Error('Unknown rule ' + name);
    }
    return cont(match, alternatives, iterator, transform, continuation);
}

addRule("dash", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = numberParser(45, returnFromRule, continuation);
    return cont(continuation, [], iterator);
});

addRule("dot", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = numberParser(46, returnFromRule, continuation);
    return cont(continuation, [], iterator);
});

addRule("space", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = numberParser(32, returnFromRule, continuation);
    return cont(continuation, [], iterator);
});

addRule("lf", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = numberParser(10, returnFromRule, continuation);
    return cont(continuation, [], iterator);
});

addRule("cr", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = numberParser(13, returnFromRule, continuation);
    return cont(continuation, [], iterator);
});

addRule("newline", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = identifierParser("cr", returnFromRule, transform, continuation);
    continuation = identifierParser("lf", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("newline", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = identifierParser("lf", returnFromRule, transform, continuation);
    continuation = identifierParser("cr", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("newline", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = identifierParser("lf", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("newlines", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = identifierParser("newlines", returnFromRule, transform, continuation);
    continuation = identifierParser("newline", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("newlines", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = identifierParser("newline", returnFromRule, transform, continuation);
    continuation = identifierParser("whitespaces", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("newlines", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    return cont(continuation, [], iterator);
});

addRule("whitespaces", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = identifierParser("whitespaces", returnFromRule, transform, continuation);
    continuation = identifierParser("space", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("whitespaces", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    return cont(continuation, [], iterator);
});

addRule("numeric", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = rangeParser(48, 57, returnFromRule, continuation);
    return cont(continuation, [], iterator);
});

addRule("number", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("number_multiple", returnFromRule, iterator, transform);
    continuation = identifierParser("number", returnFromRule, transform, continuation);
    continuation = identifierParser("numeric", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("number", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("number_single", returnFromRule, iterator, transform);
    continuation = identifierParser("numeric", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("alphabetical", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = rangeParser(65, 90, returnFromRule, continuation);
    return cont(continuation, [], iterator);
});

addRule("alphabetical", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = rangeParser(97, 122, returnFromRule, continuation);
    return cont(continuation, [], iterator);
});

addRule("alphanumeric", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = identifierParser("numeric", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("alphanumeric", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = identifierParser("alphabetical", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("identifier", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("identifier_multiple", returnFromRule, iterator, transform);
    continuation = identifierParser("identifierRest", returnFromRule, transform, continuation);
    continuation = identifierParser("alphabetical", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("identifier", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("identifier_single", returnFromRule, iterator, transform);
    continuation = identifierParser("alphabetical", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("identifierRest", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("identifierRest_multiple", returnFromRule, iterator, transform);
    continuation = identifierParser("identifierRest", returnFromRule, transform, continuation);
    continuation = identifierParser("alphanumeric", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("identifierRest", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("identifierRest_single", returnFromRule, iterator, transform);
    continuation = identifierParser("alphanumeric", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("part", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("part_identifier", returnFromRule, iterator, transform);
    continuation = identifierParser("identifier", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("part", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("part_range", returnFromRule, iterator, transform);
    continuation = identifierParser("number", returnFromRule, transform, continuation);
    continuation = identifierParser("dash", returnFromRule, transform, continuation);
    continuation = identifierParser("number", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("part", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("part_number", returnFromRule, iterator, transform);
    continuation = identifierParser("number", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("part", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("part_eof", returnFromRule, iterator, transform);
    continuation = identifierParser("dot", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("parts", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("parts_multiple", returnFromRule, iterator, transform);
    continuation = identifierParser("parts", returnFromRule, transform, continuation);
    continuation = identifierParser("whitespaces", returnFromRule, transform, continuation);
    continuation = identifierParser("part", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("parts", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("parts_single", returnFromRule, iterator, transform);
    continuation = identifierParser("part", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("parts", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("parts_none", returnFromRule, iterator, transform);
    return cont(continuation, [], iterator);
});

addRule("suffix", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("suffix_suffix", returnFromRule, iterator, transform);
    continuation = identifierParser("identifier", returnFromRule, transform, continuation);
    continuation = identifierParser("dash", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("rule", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("rule_withSuffix", returnFromRule, iterator, transform);
    continuation = identifierParser("newline", returnFromRule, transform, continuation);
    continuation = identifierParser("suffix", returnFromRule, transform, continuation);
    continuation = identifierParser("whitespaces", returnFromRule, transform, continuation);
    continuation = identifierParser("parts", returnFromRule, transform, continuation);
    continuation = identifierParser("whitespaces", returnFromRule, transform, continuation);
    continuation = identifierParser("identifier", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("rule", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("rule_withoutSuffix", returnFromRule, iterator, transform);
    continuation = identifierParser("newline", returnFromRule, transform, continuation);
    continuation = identifierParser("whitespaces", returnFromRule, transform, continuation);
    continuation = identifierParser("parts", returnFromRule, transform, continuation);
    continuation = identifierParser("whitespaces", returnFromRule, transform, continuation);
    continuation = identifierParser("identifier", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("grammar", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("grammar_multiple", returnFromRule, iterator, transform);
    continuation = identifierParser("grammar", returnFromRule, transform, continuation);
    continuation = identifierParser("newlines", returnFromRule, transform, continuation);
    continuation = identifierParser("rule", returnFromRule, transform, continuation);
    continuation = identifierParser("newlines", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("grammar", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("grammar_single", returnFromRule, iterator, transform);
    continuation = identifierParser("newlines", returnFromRule, transform, continuation);
    continuation = identifierParser("rule", returnFromRule, transform, continuation);
    continuation = identifierParser("newlines", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

addRule("start", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("start_start", returnFromRule, iterator, transform);
    continuation = eofParser(returnFromRule, continuation);
    continuation = identifierParser("grammar", returnFromRule, transform, continuation);
    return cont(continuation, [], iterator);
});

module.exports.parse = function (input, transform) {
    return trampoline(cont(parse, 'start', indexedIterator(input), transform, identity));
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
    return 'numberParser(' + number + ', returnFromRule, continuation)';
};
transform.part_range = function (from, _, to) {
    return 'rangeParser(' + from + ', ' + to + ', returnFromRule, continuation)';
};
transform.part_identifier = function (identifier) {
    return 'identifierParser("' + identifier + '", returnFromRule, transform, continuation)';
};
transform.part_eof = function () {
    return 'eofParser(returnFromRule, continuation)';
};
transform.parts_single = function (n) {
    return '' + n + '';
};
transform.parts_multiple = function (part, _, rest) {
    return '' + rest + '    continuation = ' + part + ';\n\
';
};
transform.parts_none = function () {
    return '';
};
transform.rule_withoutSuffix = function (name, _, parts, _, _) {
    return '\n\
addRule("' + name + '", function (iterator, transform, continuation) {\n\
    var returnFromRule = continuation;\n\
    continuation = initialContinuation(returnFromRule, iterator);\n\
' + parts + '    return cont(continuation, [], iterator);\n\
});\n\
';
};
transform.rule_withSuffix = function (name, _, parts, _, suffix, _) {
    return '\n\
addRule("' + name + '", function (iterator, transform, continuation) {\n\
    var returnFromRule = continuation;\n\
    continuation = initialSuffixContinuation("' + name + '_' + suffix + '", returnFromRule, iterator, transform);\n\
' + parts + '    return cont(continuation, [], iterator);\n\
});\n\
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
var rules = {};\n\
function addRule (name, parseFunction) {\n\
    let rule = rules[name];\n\
    if (rule === undefined) {\n\
        rule = []; \n\
        rules[name] = rule;\n\
    }\n\
    rule.push(parseFunction);\n\
};\n\
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
\n\
function initialContinuation (returnFromRule, startIterator) {\n\
    return function (items, iterator) {\n\
        var results = items.map(function (i) { return i.result; });\n\
        return cont(returnFromRule, {result: results, start: startIterator, end: iterator});\n\
    };\n\
}\n\
\n\
function initialSuffixContinuation (transformer, returnFromRule, startIterator, transform) {\n\
    return function (items, iterator) {\n\
        var results = items.map(function (i) { return i.result; });\n\
        var transformedResults = transform[transformer].apply(null, results);\n\
        return cont(returnFromRule, {result: transformedResults, start: startIterator, end: iterator});\n\
    };\n\
}\n\
function parse (name, iterator, transform, continuation) {\n\
    var alternatives = rules[name];\n\
    if (alternatives === undefined) {\n\
        throw new Error(\'Unknown rule \' + name);\n\
    }\n\
    return cont(match, alternatives, iterator, transform, continuation);\n\
}\n\
' + grammar + '\n\
module.exports.parse = function (input, transform) {\n\
    return trampoline(cont(parse, \'start\', indexedIterator(input), transform, identity));\n\
};';
};
var fs = require('fs');
var input = fs.readFileSync(process.argv[2], 'utf8');
var output = module.exports.parse(input, transform).result;
fs.writeFileSync(process.argv[3], output, 'utf8');

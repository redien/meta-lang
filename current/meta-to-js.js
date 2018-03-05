
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
function match (alternatives, input, offset, transform, continuation) {
    if (alternatives.length === 0) {
        return cont(continuation, null);
    } else {
        return cont(alternatives[0], input, offset, transform, function (result) {
            if (result !== null) { return cont(continuation, result); }
            return cont(match, alternatives.slice(1), input, offset, transform, continuation);
        });
    }
}
function numberParser (number, continuation, returnFromRule, input) {
    return function (items, offset) {
        if (input.charCodeAt(offset) === number) {
            var result = {result: input[offset], start: offset, end: offset + 1};
            return cont(continuation, items.concat([result]), offset + 1);
        } else {
            return cont(returnFromRule, null);
        }
    };
}
function rangeParser (from, to, continuation, returnFromRule, input) {
    return function (items, offset) {
        var code = input.charCodeAt(offset);
        if (code >= from && code <= to) {
            var result = {result: input[offset], start: offset, end: offset + 1};
            return cont(continuation, items.concat([result]), offset + 1);
        } else {
            return cont(returnFromRule, null);
        }
    };
}
function identifierParser (identifier, continuation, returnFromRule, input, transform) {
    return function (items, offset) {
        return cont(parse, identifier, input, offset, transform, function (result) {
            if (result === null) { return cont(returnFromRule, null); }
            return cont(continuation, items.concat([result]), result.end);
        });
    };
}
function eofParser (continuation, returnFromRule, input) {
    return function (items, offset) {
        if (offset === input.length) {
            return cont(continuation, items.concat([{result: null, start: offset, end: offset}]), offset);
        } else {
            return cont(returnFromRule, null);
        }
    };
}

function initialContinuation (returnFromRule, startOffset) {
    return function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
}

function initialSuffixContinuation (transformer, returnFromRule, startOffset, transform) {
    return function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform[transformer].apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
}
function parse (name, input, offset, transform, continuation) {
    var alternatives = rules[name];
    if (alternatives === undefined) {
        throw new Error('Unknown rule ' + name);
    }
    return cont(match, alternatives, input, offset, transform, continuation);
}

addRule("dash", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(45, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("dot", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(46, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("space", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(32, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("lf", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(10, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("cr", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(13, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("newline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("cr", continuation, returnFromRule, input, transform);
    continuation = identifierParser("lf", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("newline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("lf", continuation, returnFromRule, input, transform);
    continuation = identifierParser("cr", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("newline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("lf", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("newlines", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("newlines", continuation, returnFromRule, input, transform);
    continuation = identifierParser("newline", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("newlines", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("newline", continuation, returnFromRule, input, transform);
    continuation = identifierParser("whitespaces", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("newlines", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    return cont(continuation, [], offset);
});

addRule("whitespaces", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("whitespaces", continuation, returnFromRule, input, transform);
    continuation = identifierParser("space", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("whitespaces", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    return cont(continuation, [], offset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = rangeParser(48, 57, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("number", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("number_multiple", returnFromRule, offset, transform);
    continuation = identifierParser("number", continuation, returnFromRule, input, transform);
    continuation = identifierParser("numeric", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("number", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("number_single", returnFromRule, offset, transform);
    continuation = identifierParser("numeric", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = rangeParser(65, 90, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = rangeParser(97, 122, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphanumeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("numeric", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("alphanumeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("alphabetical", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("identifier", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("identifier_multiple", returnFromRule, offset, transform);
    continuation = identifierParser("identifierRest", continuation, returnFromRule, input, transform);
    continuation = identifierParser("alphabetical", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("identifier", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("identifier_single", returnFromRule, offset, transform);
    continuation = identifierParser("alphabetical", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("identifierRest", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("identifierRest_multiple", returnFromRule, offset, transform);
    continuation = identifierParser("identifierRest", continuation, returnFromRule, input, transform);
    continuation = identifierParser("alphanumeric", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("identifierRest", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("identifierRest_single", returnFromRule, offset, transform);
    continuation = identifierParser("alphanumeric", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("part", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("part_identifier", returnFromRule, offset, transform);
    continuation = identifierParser("identifier", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("part", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("part_range", returnFromRule, offset, transform);
    continuation = identifierParser("number", continuation, returnFromRule, input, transform);
    continuation = identifierParser("dash", continuation, returnFromRule, input, transform);
    continuation = identifierParser("number", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("part", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("part_number", returnFromRule, offset, transform);
    continuation = identifierParser("number", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("part", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("part_eof", returnFromRule, offset, transform);
    continuation = identifierParser("dot", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("parts", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("parts_multiple", returnFromRule, offset, transform);
    continuation = identifierParser("parts", continuation, returnFromRule, input, transform);
    continuation = identifierParser("whitespaces", continuation, returnFromRule, input, transform);
    continuation = identifierParser("part", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("parts", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("parts_single", returnFromRule, offset, transform);
    continuation = identifierParser("part", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("parts", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("parts_none", returnFromRule, offset, transform);
    return cont(continuation, [], offset);
});

addRule("suffix", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("suffix_suffix", returnFromRule, offset, transform);
    continuation = identifierParser("identifier", continuation, returnFromRule, input, transform);
    continuation = identifierParser("dash", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("rule", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("rule_withSuffix", returnFromRule, offset, transform);
    continuation = identifierParser("newline", continuation, returnFromRule, input, transform);
    continuation = identifierParser("suffix", continuation, returnFromRule, input, transform);
    continuation = identifierParser("whitespaces", continuation, returnFromRule, input, transform);
    continuation = identifierParser("parts", continuation, returnFromRule, input, transform);
    continuation = identifierParser("whitespaces", continuation, returnFromRule, input, transform);
    continuation = identifierParser("identifier", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("rule", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("rule_withoutSuffix", returnFromRule, offset, transform);
    continuation = identifierParser("newline", continuation, returnFromRule, input, transform);
    continuation = identifierParser("whitespaces", continuation, returnFromRule, input, transform);
    continuation = identifierParser("parts", continuation, returnFromRule, input, transform);
    continuation = identifierParser("whitespaces", continuation, returnFromRule, input, transform);
    continuation = identifierParser("identifier", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("grammar", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("grammar_multiple", returnFromRule, offset, transform);
    continuation = identifierParser("grammar", continuation, returnFromRule, input, transform);
    continuation = identifierParser("newlines", continuation, returnFromRule, input, transform);
    continuation = identifierParser("rule", continuation, returnFromRule, input, transform);
    continuation = identifierParser("newlines", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("grammar", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("grammar_single", returnFromRule, offset, transform);
    continuation = identifierParser("newlines", continuation, returnFromRule, input, transform);
    continuation = identifierParser("rule", continuation, returnFromRule, input, transform);
    continuation = identifierParser("newlines", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("start", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("start_start", returnFromRule, offset, transform);
    continuation = eofParser(continuation, returnFromRule, input);
    continuation = identifierParser("grammar", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

module.exports.parse = function (input, transform) {
    return trampoline(cont(parse, 'start', input, 0, transform, identity));
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
    return '    continuation = numberParser(' + number + ', continuation, returnFromRule, input);\n\
';
};
transform.part_range = function (from, _, to) {
    return '    continuation = rangeParser(' + from + ', ' + to + ', continuation, returnFromRule, input);\n\
';
};
transform.part_identifier = function (identifier) {
    return '    continuation = identifierParser("' + identifier + '", continuation, returnFromRule, input, transform);\n\
';
};
transform.part_eof = function () {
    return '    continuation = eofParser(continuation, returnFromRule, input);\n\
';
};
transform.parts_single = function (n) {
    return '' + n + '';
};
transform.parts_multiple = function (part, _, rest) {
    return '' + rest + '' + part + '';
};
transform.parts_none = function () {
    return '';
};
transform.rule_withoutSuffix = function (name, _, parts, _, _) {
    return '\n\
addRule("' + name + '", function (input, offset, transform, continuation) {\n\
    var returnFromRule = continuation;\n\
    continuation = initialContinuation(returnFromRule, offset);\n\
' + parts + '    return cont(continuation, [], offset);\n\
});\n\
';
};
transform.rule_withSuffix = function (name, _, parts, _, suffix, _) {
    return '\n\
addRule("' + name + '", function (input, offset, transform, continuation) {\n\
    var returnFromRule = continuation;\n\
    continuation = initialSuffixContinuation("' + name + '_' + suffix + '", returnFromRule, offset, transform);\n\
' + parts + '    return cont(continuation, [], offset);\n\
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
function match (alternatives, input, offset, transform, continuation) {\n\
    if (alternatives.length === 0) {\n\
        return cont(continuation, null);\n\
    } else {\n\
        return cont(alternatives[0], input, offset, transform, function (result) {\n\
            if (result !== null) { return cont(continuation, result); }\n\
            return cont(match, alternatives.slice(1), input, offset, transform, continuation);\n\
        });\n\
    }\n\
}\n\
function numberParser (number, continuation, returnFromRule, input) {\n\
    return function (items, offset) {\n\
        if (input.charCodeAt(offset) === number) {\n\
            var result = {result: input[offset], start: offset, end: offset + 1};\n\
            return cont(continuation, items.concat([result]), offset + 1);\n\
        } else {\n\
            return cont(returnFromRule, null);\n\
        }\n\
    };\n\
}\n\
function rangeParser (from, to, continuation, returnFromRule, input) {\n\
    return function (items, offset) {\n\
        var code = input.charCodeAt(offset);\n\
        if (code >= from && code <= to) {\n\
            var result = {result: input[offset], start: offset, end: offset + 1};\n\
            return cont(continuation, items.concat([result]), offset + 1);\n\
        } else {\n\
            return cont(returnFromRule, null);\n\
        }\n\
    };\n\
}\n\
function identifierParser (identifier, continuation, returnFromRule, input, transform) {\n\
    return function (items, offset) {\n\
        return cont(parse, identifier, input, offset, transform, function (result) {\n\
            if (result === null) { return cont(returnFromRule, null); }\n\
            return cont(continuation, items.concat([result]), result.end);\n\
        });\n\
    };\n\
}\n\
function eofParser (continuation, returnFromRule, input) {\n\
    return function (items, offset) {\n\
        if (offset === input.length) {\n\
            return cont(continuation, items.concat([{result: null, start: offset, end: offset}]), offset);\n\
        } else {\n\
            return cont(returnFromRule, null);\n\
        }\n\
    };\n\
}\n\
\n\
function initialContinuation (returnFromRule, startOffset) {\n\
    return function (items, offset) {\n\
        var results = items.map(function (i) { return i.result; });\n\
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});\n\
    };\n\
}\n\
\n\
function initialSuffixContinuation (transformer, returnFromRule, startOffset, transform) {\n\
    return function (items, offset) {\n\
        var results = items.map(function (i) { return i.result; });\n\
        var transformedResults = transform[transformer].apply(null, results);\n\
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});\n\
    };\n\
}\n\
function parse (name, input, offset, transform, continuation) {\n\
    var alternatives = rules[name];\n\
    if (alternatives === undefined) {\n\
        throw new Error(\'Unknown rule \' + name);\n\
    }\n\
    return cont(match, alternatives, input, offset, transform, continuation);\n\
}\n\
' + grammar + '\n\
module.exports.parse = function (input, transform) {\n\
    return trampoline(cont(parse, \'start\', input, 0, transform, identity));\n\
};';
};
var fs = require('fs');
var input = fs.readFileSync(process.argv[2], 'utf8');
var output = module.exports.parse(input, transform).result;
fs.writeFileSync(process.argv[3], output, 'utf8');

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
function match (parseCache, alternatives, input, offset, transform, continuation) {
    if (alternatives.length === 0) {
        return cont(continuation, null);
    } else {
        return cont(alternatives[0], parseCache, input, offset, transform, function (result) {
            if (result !== null) { return cont(continuation, result); }
            return cont(match, parseCache, alternatives.slice(1), input, offset, transform, continuation);
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
function identifierParser (identifier, parseCache, continuation, returnFromRule, input, transform) {
    return function (items, offset) {
        return cont(parse, parseCache, identifier, input, offset, transform, function (result) {
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
function parse (parseCache, name, input, offset, transform, continuation) {
    var alternatives = rules[name];
    if (alternatives === undefined) {
        throw new Error('Unknown rule ' + name);
    }
    var key = name + ':' + offset;
    var cachedParse = parseCache[key];
    if (cachedParse !== undefined) {
        return cont(continuation, cachedParse);
    } else {
        return cont(match, parseCache, alternatives, input, offset, transform, function (result) {
            parseCache[key] = result;
            return cont(continuation, result);
        });
    }
}

addRule("underscore", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(95, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("dash", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(45, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("space", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(32, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("lf", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(10, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("cr", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(13, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("newline", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("cr", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("lf", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("newline", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("lf", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("cr", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("newline", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("lf", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("newlines", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("newlines", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("newline", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("newlines", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("newline", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("whitespaces", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("newlines", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    return cont(continuation, [], offset);
});

addRule("whitespaces", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("whitespaces", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("space", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("whitespaces", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    return cont(continuation, [], offset);
});

addRule("numeric", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = rangeParser(48, 57, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("number", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("number_multiple", returnFromRule, offset, transform);
    continuation = identifierParser("number", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("numeric", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("number", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("number_single", returnFromRule, offset, transform);
    continuation = identifierParser("numeric", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = rangeParser(65, 90, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = rangeParser(97, 122, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphanumeric", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("numeric", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("alphanumeric", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("alphabetical", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = rangeParser(0, 9, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = rangeParser(11, 12, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = rangeParser(14, 255, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("identifier", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("identifier_multiple", returnFromRule, offset, transform);
    continuation = identifierParser("identifierRest", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("alphabetical", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("identifier", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("identifier_single", returnFromRule, offset, transform);
    continuation = identifierParser("alphabetical", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("identifierRest", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("identifierRest_multiple", returnFromRule, offset, transform);
    continuation = identifierParser("identifierRest", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("alphanumeric", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("identifierRest", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("identifierRest_single", returnFromRule, offset, transform);
    continuation = identifierParser("alphanumeric", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("name", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("name_name", returnFromRule, offset, transform);
    continuation = identifierParser("identifier", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("dash", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("identifier", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("fourSpaces", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("space", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("space", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("space", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("space", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("text", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("text_multiple", returnFromRule, offset, transform);
    continuation = identifierParser("text", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("notNewline", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("text", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("text_none", returnFromRule, offset, transform);
    return cont(continuation, [], offset);
});

addRule("ruleLines", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("ruleLines_multiple", returnFromRule, offset, transform);
    continuation = identifierParser("ruleLines", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("newline", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("text", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("fourSpaces", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("ruleLines", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("ruleLines_single", returnFromRule, offset, transform);
    continuation = identifierParser("newline", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("text", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("fourSpaces", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("parameter", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("identifier", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("parameter", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("underscore", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("parameters", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("parameters_multiple", returnFromRule, offset, transform);
    continuation = identifierParser("parameters", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("whitespaces", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("parameter", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("parameters", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("parameters_none", returnFromRule, offset, transform);
    return cont(continuation, [], offset);
});

addRule("rule", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("rule_rule", returnFromRule, offset, transform);
    continuation = identifierParser("ruleLines", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("newline", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("whitespaces", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("parameters", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("whitespaces", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("name", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("rule", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("rule_empty", returnFromRule, offset, transform);
    continuation = identifierParser("newline", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("whitespaces", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("parameters", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("whitespaces", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("name", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("template", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("template_multiple", returnFromRule, offset, transform);
    continuation = identifierParser("template", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("rule", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("newlines", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("template", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("template_single", returnFromRule, offset, transform);
    continuation = identifierParser("rule", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("newlines", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("start", function (parseCache, input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("start_start", returnFromRule, offset, transform);
    continuation = eofParser(continuation, returnFromRule, input);
    continuation = identifierParser("newlines", parseCache, continuation, returnFromRule, input, transform);
    continuation = identifierParser("template", parseCache, continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

module.exports.parse = function (input, transform) {
    return trampoline(cont(parse, {}, 'start', input, 0, transform, identity));
};
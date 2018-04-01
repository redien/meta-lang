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
function numberParser (number, continuation, returnFromRule) {
    return function (items, iterator) {
        if (value(iterator) === number) {
            var result = {result: String.fromCharCode(value(iterator)), start: iterator, end: next(iterator)};
            return cont(continuation, items.concat([result]), next(iterator));
        } else {
            return cont(returnFromRule, null);
        }
    };
}
function rangeParser (from, to, continuation, returnFromRule) {
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
function identifierParser (identifier, continuation, returnFromRule, transform) {
    return function (items, iterator) {
        return cont(parse, identifier, iterator, transform, function (result) {
            if (result === null) { return cont(returnFromRule, null); }
            return cont(continuation, items.concat([result]), result.end);
        });
    };
}
function eofParser (continuation, returnFromRule) {
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
    continuation = numberParser(45, continuation, returnFromRule);
    return cont(continuation, [], iterator);
});

addRule("dot", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = numberParser(46, continuation, returnFromRule);
    return cont(continuation, [], iterator);
});

addRule("space", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = numberParser(32, continuation, returnFromRule);
    return cont(continuation, [], iterator);
});

addRule("lf", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = numberParser(10, continuation, returnFromRule);
    return cont(continuation, [], iterator);
});

addRule("cr", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = numberParser(13, continuation, returnFromRule);
    return cont(continuation, [], iterator);
});

addRule("newline", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = identifierParser("cr", continuation, returnFromRule, transform);
    continuation = identifierParser("lf", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

addRule("newline", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = identifierParser("lf", continuation, returnFromRule, transform);
    continuation = identifierParser("cr", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

addRule("newline", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = identifierParser("lf", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

addRule("newlines", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = identifierParser("newlines", continuation, returnFromRule, transform);
    continuation = identifierParser("newline", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

addRule("newlines", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = identifierParser("newline", continuation, returnFromRule, transform);
    continuation = identifierParser("whitespaces", continuation, returnFromRule, transform);
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
    continuation = identifierParser("whitespaces", continuation, returnFromRule, transform);
    continuation = identifierParser("space", continuation, returnFromRule, transform);
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
    continuation = rangeParser(48, 57, continuation, returnFromRule);
    return cont(continuation, [], iterator);
});

addRule("number", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("number_multiple", returnFromRule, iterator, transform);
    continuation = identifierParser("number", continuation, returnFromRule, transform);
    continuation = identifierParser("numeric", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

addRule("number", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("number_single", returnFromRule, iterator, transform);
    continuation = identifierParser("numeric", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

addRule("alphabetical", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = rangeParser(65, 90, continuation, returnFromRule);
    return cont(continuation, [], iterator);
});

addRule("alphabetical", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = rangeParser(97, 122, continuation, returnFromRule);
    return cont(continuation, [], iterator);
});

addRule("alphanumeric", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = identifierParser("numeric", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

addRule("alphanumeric", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, iterator);
    continuation = identifierParser("alphabetical", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

addRule("identifier", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("identifier_multiple", returnFromRule, iterator, transform);
    continuation = identifierParser("identifierRest", continuation, returnFromRule, transform);
    continuation = identifierParser("alphabetical", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

addRule("identifier", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("identifier_single", returnFromRule, iterator, transform);
    continuation = identifierParser("alphabetical", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

addRule("identifierRest", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("identifierRest_multiple", returnFromRule, iterator, transform);
    continuation = identifierParser("identifierRest", continuation, returnFromRule, transform);
    continuation = identifierParser("alphanumeric", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

addRule("identifierRest", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("identifierRest_single", returnFromRule, iterator, transform);
    continuation = identifierParser("alphanumeric", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

addRule("part", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("part_identifier", returnFromRule, iterator, transform);
    continuation = identifierParser("identifier", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

addRule("part", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("part_range", returnFromRule, iterator, transform);
    continuation = identifierParser("number", continuation, returnFromRule, transform);
    continuation = identifierParser("dash", continuation, returnFromRule, transform);
    continuation = identifierParser("number", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

addRule("part", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("part_number", returnFromRule, iterator, transform);
    continuation = identifierParser("number", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

addRule("part", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("part_eof", returnFromRule, iterator, transform);
    continuation = identifierParser("dot", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

addRule("parts", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("parts_multiple", returnFromRule, iterator, transform);
    continuation = identifierParser("parts", continuation, returnFromRule, transform);
    continuation = identifierParser("whitespaces", continuation, returnFromRule, transform);
    continuation = identifierParser("part", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

addRule("parts", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("parts_single", returnFromRule, iterator, transform);
    continuation = identifierParser("part", continuation, returnFromRule, transform);
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
    continuation = identifierParser("identifier", continuation, returnFromRule, transform);
    continuation = identifierParser("dash", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

addRule("rule", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("rule_withSuffix", returnFromRule, iterator, transform);
    continuation = identifierParser("newline", continuation, returnFromRule, transform);
    continuation = identifierParser("suffix", continuation, returnFromRule, transform);
    continuation = identifierParser("whitespaces", continuation, returnFromRule, transform);
    continuation = identifierParser("parts", continuation, returnFromRule, transform);
    continuation = identifierParser("whitespaces", continuation, returnFromRule, transform);
    continuation = identifierParser("identifier", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

addRule("rule", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("rule_withoutSuffix", returnFromRule, iterator, transform);
    continuation = identifierParser("newline", continuation, returnFromRule, transform);
    continuation = identifierParser("whitespaces", continuation, returnFromRule, transform);
    continuation = identifierParser("parts", continuation, returnFromRule, transform);
    continuation = identifierParser("whitespaces", continuation, returnFromRule, transform);
    continuation = identifierParser("identifier", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

addRule("grammar", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("grammar_multiple", returnFromRule, iterator, transform);
    continuation = identifierParser("grammar", continuation, returnFromRule, transform);
    continuation = identifierParser("newlines", continuation, returnFromRule, transform);
    continuation = identifierParser("rule", continuation, returnFromRule, transform);
    continuation = identifierParser("newlines", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

addRule("grammar", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("grammar_single", returnFromRule, iterator, transform);
    continuation = identifierParser("newlines", continuation, returnFromRule, transform);
    continuation = identifierParser("rule", continuation, returnFromRule, transform);
    continuation = identifierParser("newlines", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

addRule("start", function (iterator, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("start_start", returnFromRule, iterator, transform);
    continuation = eofParser(continuation, returnFromRule);
    continuation = identifierParser("grammar", continuation, returnFromRule, transform);
    return cont(continuation, [], iterator);
});

module.exports.parse = function (input, transform) {
    return trampoline(cont(parse, 'start', indexedIterator(input), transform, identity));
};
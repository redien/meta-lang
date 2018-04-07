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
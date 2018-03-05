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
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(45, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("dot", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(46, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("space", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(32, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("lf", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(10, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("cr", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(13, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("newline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("cr", continuation, returnFromRule, input, transform);    continuation = identifierParser("lf", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("newline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("lf", continuation, returnFromRule, input, transform);    continuation = identifierParser("cr", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("newline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("lf", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("newlines", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("newlines", continuation, returnFromRule, input, transform);    continuation = identifierParser("newline", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("newlines", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("newline", continuation, returnFromRule, input, transform);    continuation = identifierParser("whitespaces", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("newlines", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);

    return cont(continuation, [], startOffset);
});

addRule("whitespaces", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("whitespaces", continuation, returnFromRule, input, transform);    continuation = identifierParser("space", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("whitespaces", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);

    return cont(continuation, [], startOffset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(48, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(49, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(50, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(51, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(52, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(53, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(54, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(55, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(56, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(57, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("number", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialSuffixContinuation("number_multiple", returnFromRule, offset, transform);
    continuation = identifierParser("number", continuation, returnFromRule, input, transform);    continuation = identifierParser("numeric", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("number", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialSuffixContinuation("number_single", returnFromRule, offset, transform);
    continuation = identifierParser("numeric", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(65, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(66, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(67, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(68, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(69, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(70, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(71, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(72, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(73, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(74, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(75, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(76, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(77, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(78, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(79, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(80, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(81, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(82, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(83, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(84, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(85, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(86, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(87, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(88, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(89, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(90, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(97, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(98, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(99, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(100, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(101, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(102, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(103, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(104, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(105, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(106, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(107, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(108, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(109, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(110, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(111, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(112, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(113, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(114, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(115, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(116, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(117, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(118, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(119, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(120, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(121, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(122, continuation, returnFromRule, input);

    return cont(continuation, [], startOffset);
});

addRule("alphanumeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("numeric", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("alphanumeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("alphabetical", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("identifier", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialSuffixContinuation("identifier_multiple", returnFromRule, offset, transform);
    continuation = identifierParser("identifierRest", continuation, returnFromRule, input, transform);    continuation = identifierParser("alphabetical", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("identifier", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialSuffixContinuation("identifier_single", returnFromRule, offset, transform);
    continuation = identifierParser("alphabetical", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("identifierRest", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialSuffixContinuation("identifierRest_multiple", returnFromRule, offset, transform);
    continuation = identifierParser("identifierRest", continuation, returnFromRule, input, transform);    continuation = identifierParser("alphanumeric", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("identifierRest", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialSuffixContinuation("identifierRest_single", returnFromRule, offset, transform);
    continuation = identifierParser("alphanumeric", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("grammar", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialSuffixContinuation("grammar_multiple", returnFromRule, offset, transform);
    continuation = identifierParser("grammar", continuation, returnFromRule, input, transform);    continuation = identifierParser("newlines", continuation, returnFromRule, input, transform);    continuation = identifierParser("rule", continuation, returnFromRule, input, transform);    continuation = identifierParser("newlines", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("grammar", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialSuffixContinuation("grammar_single", returnFromRule, offset, transform);
    continuation = identifierParser("newlines", continuation, returnFromRule, input, transform);    continuation = identifierParser("rule", continuation, returnFromRule, input, transform);    continuation = identifierParser("newlines", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("rule", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialSuffixContinuation("rule_withSuffix", returnFromRule, offset, transform);
    continuation = identifierParser("newline", continuation, returnFromRule, input, transform);    continuation = identifierParser("suffix", continuation, returnFromRule, input, transform);    continuation = identifierParser("whitespaces", continuation, returnFromRule, input, transform);    continuation = identifierParser("parts", continuation, returnFromRule, input, transform);    continuation = identifierParser("whitespaces", continuation, returnFromRule, input, transform);    continuation = identifierParser("identifier", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("rule", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialSuffixContinuation("rule_withoutSuffix", returnFromRule, offset, transform);
    continuation = identifierParser("newline", continuation, returnFromRule, input, transform);    continuation = identifierParser("whitespaces", continuation, returnFromRule, input, transform);    continuation = identifierParser("parts", continuation, returnFromRule, input, transform);    continuation = identifierParser("whitespaces", continuation, returnFromRule, input, transform);    continuation = identifierParser("identifier", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("suffix", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialSuffixContinuation("suffix_suffix", returnFromRule, offset, transform);
    continuation = identifierParser("identifier", continuation, returnFromRule, input, transform);    continuation = identifierParser("dash", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("parts", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialSuffixContinuation("parts_multiple", returnFromRule, offset, transform);
    continuation = identifierParser("parts", continuation, returnFromRule, input, transform);    continuation = identifierParser("whitespaces", continuation, returnFromRule, input, transform);    continuation = identifierParser("part", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("parts", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialSuffixContinuation("parts_single", returnFromRule, offset, transform);
    continuation = identifierParser("part", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("parts", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialSuffixContinuation("parts_none", returnFromRule, offset, transform);

    return cont(continuation, [], startOffset);
});

addRule("part", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialSuffixContinuation("part_identifier", returnFromRule, offset, transform);
    continuation = identifierParser("identifier", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("part", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialSuffixContinuation("part_number", returnFromRule, offset, transform);
    continuation = identifierParser("number", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("part", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialSuffixContinuation("part_eof", returnFromRule, offset, transform);
    continuation = identifierParser("dot", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

addRule("start", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = initialSuffixContinuation("start_start", returnFromRule, offset, transform);
    continuation = eofParser(continuation, returnFromRule, input);
    continuation = identifierParser("grammar", continuation, returnFromRule, input, transform);
    return cont(continuation, [], startOffset);
});

module.exports.parse = function (input, transform) {
    return trampoline(cont(parse, 'start', input, 0, transform, identity));
};
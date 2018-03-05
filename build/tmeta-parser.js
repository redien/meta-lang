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

addRule("underscore", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(95, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("dash", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(45, continuation, returnFromRule, input);
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
    continuation = numberParser(48, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(49, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(50, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(51, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(52, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(53, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(54, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(55, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(56, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(57, continuation, returnFromRule, input);
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
    continuation = numberParser(65, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(66, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(67, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(68, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(69, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(70, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(71, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(72, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(73, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(74, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(75, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(76, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(77, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(78, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(79, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(80, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(81, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(82, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(83, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(84, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(85, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(86, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(87, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(88, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(89, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(90, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(97, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(98, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(99, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(100, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(101, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(102, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(103, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(104, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(105, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(106, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(107, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(108, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(109, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(110, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(111, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(112, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(113, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(114, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(115, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(116, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(117, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(118, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(119, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(120, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(121, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(122, continuation, returnFromRule, input);
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

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(0, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(1, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(2, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(3, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(4, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(5, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(6, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(7, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(8, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(9, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(11, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(12, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(14, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(15, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(16, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(17, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(18, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(19, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(20, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(21, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(22, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(23, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(24, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(25, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(26, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(27, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(28, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(29, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(30, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(31, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(32, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(33, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(34, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(35, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(36, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(37, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(38, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(39, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(40, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(41, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(42, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(43, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(44, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(45, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(46, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(47, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(48, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(49, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(50, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(51, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(52, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(53, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(54, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(55, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(56, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(57, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(58, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(59, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(60, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(61, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(62, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(63, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(64, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(65, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(66, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(67, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(68, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(69, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(70, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(71, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(72, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(73, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(74, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(75, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(76, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(77, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(78, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(79, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(80, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(81, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(82, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(83, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(84, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(85, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(86, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(87, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(88, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(89, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(90, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(91, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(92, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(93, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(94, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(95, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(96, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(97, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(98, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(99, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(100, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(101, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(102, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(103, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(104, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(105, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(106, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(107, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(108, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(109, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(110, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(111, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(112, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(113, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(114, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(115, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(116, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(117, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(118, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(119, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(120, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(121, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(122, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(123, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(124, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(125, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(126, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(127, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(128, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(129, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(130, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(131, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(132, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(133, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(134, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(135, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(136, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(137, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(138, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(139, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(140, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(141, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(142, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(143, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(144, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(145, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(146, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(147, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(148, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(149, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(150, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(151, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(152, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(153, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(154, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(155, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(156, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(157, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(158, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(159, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(160, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(161, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(162, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(163, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(164, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(165, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(166, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(167, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(168, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(169, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(170, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(171, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(172, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(173, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(174, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(175, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(176, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(177, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(178, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(179, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(180, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(181, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(182, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(183, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(184, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(185, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(186, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(187, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(188, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(189, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(190, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(191, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(192, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(193, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(194, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(195, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(196, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(197, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(198, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(199, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(200, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(201, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(202, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(203, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(204, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(205, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(206, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(207, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(208, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(209, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(210, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(211, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(212, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(213, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(214, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(215, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(216, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(217, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(218, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(219, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(220, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(221, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(222, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(223, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(224, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(225, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(226, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(227, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(228, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(229, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(230, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(231, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(232, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(233, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(234, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(235, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(236, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(237, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(238, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(239, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(240, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(241, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(242, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(243, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(244, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(245, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(246, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(247, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(248, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(249, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(250, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(251, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(252, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(253, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(254, continuation, returnFromRule, input);
    return cont(continuation, [], offset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = numberParser(255, continuation, returnFromRule, input);
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

addRule("name", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("name_name", returnFromRule, offset, transform);
    continuation = identifierParser("identifier", continuation, returnFromRule, input, transform);
    continuation = identifierParser("dash", continuation, returnFromRule, input, transform);
    continuation = identifierParser("identifier", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("fourSpaces", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("space", continuation, returnFromRule, input, transform);
    continuation = identifierParser("space", continuation, returnFromRule, input, transform);
    continuation = identifierParser("space", continuation, returnFromRule, input, transform);
    continuation = identifierParser("space", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("text", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("text_multiple", returnFromRule, offset, transform);
    continuation = identifierParser("text", continuation, returnFromRule, input, transform);
    continuation = identifierParser("notNewline", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("text", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("text_none", returnFromRule, offset, transform);
    return cont(continuation, [], offset);
});

addRule("ruleLines", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("ruleLines_multiple", returnFromRule, offset, transform);
    continuation = identifierParser("ruleLines", continuation, returnFromRule, input, transform);
    continuation = identifierParser("newline", continuation, returnFromRule, input, transform);
    continuation = identifierParser("text", continuation, returnFromRule, input, transform);
    continuation = identifierParser("fourSpaces", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("ruleLines", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("ruleLines_single", returnFromRule, offset, transform);
    continuation = identifierParser("newline", continuation, returnFromRule, input, transform);
    continuation = identifierParser("text", continuation, returnFromRule, input, transform);
    continuation = identifierParser("fourSpaces", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("parameter", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("identifier", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("parameter", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialContinuation(returnFromRule, offset);
    continuation = identifierParser("underscore", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("parameters", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("parameters_multiple", returnFromRule, offset, transform);
    continuation = identifierParser("parameters", continuation, returnFromRule, input, transform);
    continuation = identifierParser("whitespaces", continuation, returnFromRule, input, transform);
    continuation = identifierParser("parameter", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("parameters", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("parameters_none", returnFromRule, offset, transform);
    return cont(continuation, [], offset);
});

addRule("rule", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("rule_rule", returnFromRule, offset, transform);
    continuation = identifierParser("ruleLines", continuation, returnFromRule, input, transform);
    continuation = identifierParser("newline", continuation, returnFromRule, input, transform);
    continuation = identifierParser("whitespaces", continuation, returnFromRule, input, transform);
    continuation = identifierParser("parameters", continuation, returnFromRule, input, transform);
    continuation = identifierParser("whitespaces", continuation, returnFromRule, input, transform);
    continuation = identifierParser("name", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("rule", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("rule_empty", returnFromRule, offset, transform);
    continuation = identifierParser("newline", continuation, returnFromRule, input, transform);
    continuation = identifierParser("whitespaces", continuation, returnFromRule, input, transform);
    continuation = identifierParser("parameters", continuation, returnFromRule, input, transform);
    continuation = identifierParser("whitespaces", continuation, returnFromRule, input, transform);
    continuation = identifierParser("name", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("template", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("template_multiple", returnFromRule, offset, transform);
    continuation = identifierParser("template", continuation, returnFromRule, input, transform);
    continuation = identifierParser("rule", continuation, returnFromRule, input, transform);
    continuation = identifierParser("newlines", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("template", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("template_single", returnFromRule, offset, transform);
    continuation = identifierParser("rule", continuation, returnFromRule, input, transform);
    continuation = identifierParser("newlines", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

addRule("start", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    continuation = initialSuffixContinuation("start_start", returnFromRule, offset, transform);
    continuation = eofParser(continuation, returnFromRule, input);
    continuation = identifierParser("newlines", continuation, returnFromRule, input, transform);
    continuation = identifierParser("template", continuation, returnFromRule, input, transform);
    return cont(continuation, [], offset);
});

module.exports.parse = function (input, transform) {
    return trampoline(cont(parse, 'start', input, 0, transform, identity));
};
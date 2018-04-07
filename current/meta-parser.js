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

addRule("dash", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        numberParser.bind(null, 45, returnFromRule)
    ])(initialContinuation(returnFromRule, iterator));
    return cont(parser, [], iterator);
});

addRule("dot", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        numberParser.bind(null, 46, returnFromRule)
    ])(initialContinuation(returnFromRule, iterator));
    return cont(parser, [], iterator);
});

addRule("space", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        numberParser.bind(null, 32, returnFromRule)
    ])(initialContinuation(returnFromRule, iterator));
    return cont(parser, [], iterator);
});

addRule("lf", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        numberParser.bind(null, 10, returnFromRule)
    ])(initialContinuation(returnFromRule, iterator));
    return cont(parser, [], iterator);
});

addRule("cr", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        numberParser.bind(null, 13, returnFromRule)
    ])(initialContinuation(returnFromRule, iterator));
    return cont(parser, [], iterator);
});

addRule("newline", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "cr", returnFromRule, transform),
        identifierParser.bind(null, "lf", returnFromRule, transform)
    ])(initialContinuation(returnFromRule, iterator));
    return cont(parser, [], iterator);
});

addRule("newline", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "lf", returnFromRule, transform),
        identifierParser.bind(null, "cr", returnFromRule, transform)
    ])(initialContinuation(returnFromRule, iterator));
    return cont(parser, [], iterator);
});

addRule("newline", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "lf", returnFromRule, transform)
    ])(initialContinuation(returnFromRule, iterator));
    return cont(parser, [], iterator);
});

addRule("newlines", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "newlines", returnFromRule, transform),
        identifierParser.bind(null, "newline", returnFromRule, transform)
    ])(initialContinuation(returnFromRule, iterator));
    return cont(parser, [], iterator);
});

addRule("newlines", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "newline", returnFromRule, transform),
        identifierParser.bind(null, "whitespaces", returnFromRule, transform)
    ])(initialContinuation(returnFromRule, iterator));
    return cont(parser, [], iterator);
});

addRule("newlines", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity
    ])(initialContinuation(returnFromRule, iterator));
    return cont(parser, [], iterator);
});

addRule("whitespaces", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "whitespaces", returnFromRule, transform),
        identifierParser.bind(null, "space", returnFromRule, transform)
    ])(initialContinuation(returnFromRule, iterator));
    return cont(parser, [], iterator);
});

addRule("whitespaces", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity
    ])(initialContinuation(returnFromRule, iterator));
    return cont(parser, [], iterator);
});

addRule("numeric", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        rangeParser.bind(null, 48, 57, returnFromRule)
    ])(initialContinuation(returnFromRule, iterator));
    return cont(parser, [], iterator);
});

addRule("number", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "number", returnFromRule, transform),
        identifierParser.bind(null, "numeric", returnFromRule, transform)
    ])(initialSuffixContinuation("number_multiple", returnFromRule, iterator, transform));
    return cont(parser, [], iterator);
});

addRule("number", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "numeric", returnFromRule, transform)
    ])(initialSuffixContinuation("number_single", returnFromRule, iterator, transform));
    return cont(parser, [], iterator);
});

addRule("alphabetical", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        rangeParser.bind(null, 65, 90, returnFromRule)
    ])(initialContinuation(returnFromRule, iterator));
    return cont(parser, [], iterator);
});

addRule("alphabetical", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        rangeParser.bind(null, 97, 122, returnFromRule)
    ])(initialContinuation(returnFromRule, iterator));
    return cont(parser, [], iterator);
});

addRule("alphanumeric", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "numeric", returnFromRule, transform)
    ])(initialContinuation(returnFromRule, iterator));
    return cont(parser, [], iterator);
});

addRule("alphanumeric", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "alphabetical", returnFromRule, transform)
    ])(initialContinuation(returnFromRule, iterator));
    return cont(parser, [], iterator);
});

addRule("identifier", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "identifierRest", returnFromRule, transform),
        identifierParser.bind(null, "alphabetical", returnFromRule, transform)
    ])(initialSuffixContinuation("identifier_multiple", returnFromRule, iterator, transform));
    return cont(parser, [], iterator);
});

addRule("identifier", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "alphabetical", returnFromRule, transform)
    ])(initialSuffixContinuation("identifier_single", returnFromRule, iterator, transform));
    return cont(parser, [], iterator);
});

addRule("identifierRest", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "identifierRest", returnFromRule, transform),
        identifierParser.bind(null, "alphanumeric", returnFromRule, transform)
    ])(initialSuffixContinuation("identifierRest_multiple", returnFromRule, iterator, transform));
    return cont(parser, [], iterator);
});

addRule("identifierRest", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "alphanumeric", returnFromRule, transform)
    ])(initialSuffixContinuation("identifierRest_single", returnFromRule, iterator, transform));
    return cont(parser, [], iterator);
});

addRule("part", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "identifier", returnFromRule, transform)
    ])(initialSuffixContinuation("part_identifier", returnFromRule, iterator, transform));
    return cont(parser, [], iterator);
});

addRule("part", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "number", returnFromRule, transform),
        identifierParser.bind(null, "dash", returnFromRule, transform),
        identifierParser.bind(null, "number", returnFromRule, transform)
    ])(initialSuffixContinuation("part_range", returnFromRule, iterator, transform));
    return cont(parser, [], iterator);
});

addRule("part", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "number", returnFromRule, transform)
    ])(initialSuffixContinuation("part_number", returnFromRule, iterator, transform));
    return cont(parser, [], iterator);
});

addRule("part", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "dot", returnFromRule, transform)
    ])(initialSuffixContinuation("part_eof", returnFromRule, iterator, transform));
    return cont(parser, [], iterator);
});

addRule("parts", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "parts", returnFromRule, transform),
        identifierParser.bind(null, "whitespaces", returnFromRule, transform),
        identifierParser.bind(null, "part", returnFromRule, transform)
    ])(initialSuffixContinuation("parts_multiple", returnFromRule, iterator, transform));
    return cont(parser, [], iterator);
});

addRule("parts", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "part", returnFromRule, transform)
    ])(initialSuffixContinuation("parts_single", returnFromRule, iterator, transform));
    return cont(parser, [], iterator);
});

addRule("parts", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity
    ])(initialSuffixContinuation("parts_none", returnFromRule, iterator, transform));
    return cont(parser, [], iterator);
});

addRule("suffix", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "identifier", returnFromRule, transform),
        identifierParser.bind(null, "dash", returnFromRule, transform)
    ])(initialSuffixContinuation("suffix_suffix", returnFromRule, iterator, transform));
    return cont(parser, [], iterator);
});

addRule("rule", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "newline", returnFromRule, transform),
        identifierParser.bind(null, "suffix", returnFromRule, transform),
        identifierParser.bind(null, "whitespaces", returnFromRule, transform),
        identifierParser.bind(null, "parts", returnFromRule, transform),
        identifierParser.bind(null, "whitespaces", returnFromRule, transform),
        identifierParser.bind(null, "identifier", returnFromRule, transform)
    ])(initialSuffixContinuation("rule_withSuffix", returnFromRule, iterator, transform));
    return cont(parser, [], iterator);
});

addRule("rule", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "newline", returnFromRule, transform),
        identifierParser.bind(null, "whitespaces", returnFromRule, transform),
        identifierParser.bind(null, "parts", returnFromRule, transform),
        identifierParser.bind(null, "whitespaces", returnFromRule, transform),
        identifierParser.bind(null, "identifier", returnFromRule, transform)
    ])(initialSuffixContinuation("rule_withoutSuffix", returnFromRule, iterator, transform));
    return cont(parser, [], iterator);
});

addRule("grammar", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "grammar", returnFromRule, transform),
        identifierParser.bind(null, "newlines", returnFromRule, transform),
        identifierParser.bind(null, "rule", returnFromRule, transform),
        identifierParser.bind(null, "newlines", returnFromRule, transform)
    ])(initialSuffixContinuation("grammar_multiple", returnFromRule, iterator, transform));
    return cont(parser, [], iterator);
});

addRule("grammar", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        identifierParser.bind(null, "newlines", returnFromRule, transform),
        identifierParser.bind(null, "rule", returnFromRule, transform),
        identifierParser.bind(null, "newlines", returnFromRule, transform)
    ])(initialSuffixContinuation("grammar_single", returnFromRule, iterator, transform));
    return cont(parser, [], iterator);
});

addRule("start", function (iterator, transform, returnFromRule) {
    var parser = pipe([
        identity,
        eofParser.bind(null, returnFromRule),
        identifierParser.bind(null, "grammar", returnFromRule, transform)
    ])(initialSuffixContinuation("start_start", returnFromRule, iterator, transform));
    return cont(parser, [], iterator);
});

module.exports.parse = function (input, transform) {
    return trampoline(cont(parse, 'start', indexedIterator(input), transform, identity));
};
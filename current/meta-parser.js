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
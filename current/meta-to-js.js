
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
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 45) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("dot", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 46) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("space", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 32) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("lf", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 10) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("cr", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 13) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("newline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "cr", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "lf", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("newline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "lf", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "cr", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("newline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "lf", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("newlines", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "newlines", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "newline", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("newlines", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "newline", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "whitespaces", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("newlines", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };

    return cont(continuation, [], startOffset);
});

addRule("whitespaces", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "whitespaces", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "space", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("whitespaces", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };

    return cont(continuation, [], startOffset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 48) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 49) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 50) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 51) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 52) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 53) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 54) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 55) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 56) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("numeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 57) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("number", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.number_multiple.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "number", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "numeric", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("number", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.number_single.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "numeric", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 65) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 66) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 67) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 68) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 69) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 70) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 71) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 72) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 73) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 74) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 75) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 76) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 77) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 78) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 79) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 80) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 81) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 82) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 83) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 84) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 85) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 86) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 87) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 88) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 89) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 90) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 97) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 98) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 99) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 100) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 101) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 102) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 103) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 104) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 105) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 106) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 107) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 108) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 109) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 110) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 111) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 112) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 113) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 114) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 115) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 116) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 117) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 118) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 119) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 120) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 121) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphabetical", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 122) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphanumeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "numeric", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("alphanumeric", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "alphabetical", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("identifier", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.identifier_multiple.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "identifierRest", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "alphabetical", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("identifier", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.identifier_single.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "alphabetical", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("identifierRest", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.identifierRest_multiple.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "identifierRest", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "alphanumeric", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("identifierRest", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.identifierRest_single.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "alphanumeric", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("grammar", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.grammar_multiple.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "grammar", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "newlines", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "rule", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "newlines", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("grammar", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.grammar_single.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "newlines", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "rule", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "newlines", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("rule", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.rule_withSuffix.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "newline", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "suffix", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "whitespaces", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "parts", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "whitespaces", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "identifier", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("rule", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.rule_withoutSuffix.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "newline", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "whitespaces", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "parts", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "whitespaces", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "identifier", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("suffix", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.suffix_suffix.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "identifier", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "dash", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("parts", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.parts_multiple.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "parts", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "whitespaces", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "part", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("parts", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.parts_single.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "part", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("parts", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.parts_none.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };

    return cont(continuation, [], startOffset);
});

addRule("part", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.part_identifier.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "identifier", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("part", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.part_number.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "number", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("part", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.part_eof.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "dot", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("start", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.start_start.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (offset === input.length) {
                return cont(continuation, items.concat([{result: null, start: offset, end: offset}]), offset);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "grammar", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
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
    return '    \n\
    continuation = (function (continuation) {\n\
        return function (items, offset) {\n\
            if (input.charCodeAt(offset) === ' + number + ') {\n\
                var result = {result: input[offset], start: offset, end: offset + 1};\n\
                return cont(continuation, items.concat([result]), offset + 1);\n\
            } else {\n\
                return cont(returnFromRule, null);\n\
            }\n\
        };\n\
    }(continuation));\n\
    ';
};
transform.part_identifier = function (identifier) {
    return '    \n\
    continuation = (function (continuation) {\n\
        return function (items, offset) {\n\
            return cont(parse, "' + identifier + '", input, offset, transform, function (result) {\n\
                if (result === null) { return cont(returnFromRule, null); }\n\
                return cont(continuation, items.concat([result]), result.end);\n\
            });\n\
        };\n\
    }(continuation));\n\
    ';
};
transform.part_eof = function () {
    return '    \n\
    continuation = (function (continuation) {\n\
        return function (items, offset) {\n\
            if (offset === input.length) {\n\
                return cont(continuation, items.concat([{result: null, start: offset, end: offset}]), offset);\n\
            } else {\n\
                return cont(returnFromRule, null);\n\
            }\n\
        };\n\
    }(continuation));\n\
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
    var startOffset = offset;\n\
    continuation = function (items, offset) {\n\
        var results = items.map(function (i) { return i.result; });\n\
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});\n\
    };\n\
' + parts + '\n\
    return cont(continuation, [], startOffset);\n\
});\n\
';
};
transform.rule_withSuffix = function (name, _, parts, _, suffix, _) {
    return '\n\
addRule("' + name + '", function (input, offset, transform, continuation) {\n\
    var returnFromRule = continuation;\n\
    var startOffset = offset;\n\
    continuation = function (items, offset) {\n\
        var results = items.map(function (i) { return i.result; });\n\
        var transformedResults = transform.' + name + '_' + suffix + '.apply(null, results);\n\
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});\n\
    };\n\
' + parts + '\n\
    return cont(continuation, [], startOffset);\n\
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
    return '' + grammar + '';
};
var transformer = function (result) {
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
function parse (name, input, offset, transform, continuation) {\n\
    var alternatives = rules[name];\n\
    if (alternatives === undefined) {\n\
        throw new Error(\'Unknown rule \' + name);\n\
    }\n\
    return cont(match, alternatives, input, offset, transform, continuation);\n\
}\n\
' + result + '\n\
module.exports.parse = function (input, transform) {\n\
    return trampoline(cont(parse, \'start\', input, 0, transform, identity));\n\
};';
};
var fs = require('fs');
var input = fs.readFileSync(process.argv[2], 'utf8');
var output = transformer(module.exports.parse(input, transform).result);
fs.writeFileSync(process.argv[3], output, 'utf8');

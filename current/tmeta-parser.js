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

addRule("underscore", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 95) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

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

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 0) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 1) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 2) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 3) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 4) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 5) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 6) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 7) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 8) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 9) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 11) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 12) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 14) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 15) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 16) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 17) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 18) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 19) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 20) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 21) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 22) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 23) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 24) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 25) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 26) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 27) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 28) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 29) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 30) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 31) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 33) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 34) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 35) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 36) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 37) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 38) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 39) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 40) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 41) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 42) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 43) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 44) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 47) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 58) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 59) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 60) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 61) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 62) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 63) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 64) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 91) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 92) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 93) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 94) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 95) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 96) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
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

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 123) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 124) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 125) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 126) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 127) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 128) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 129) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 130) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 131) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 132) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 133) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 134) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 135) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 136) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 137) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 138) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 139) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 140) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 141) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 142) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 143) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 144) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 145) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 146) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 147) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 148) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 149) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 150) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 151) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 152) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 153) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 154) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 155) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 156) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 157) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 158) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 159) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 160) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 161) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 162) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 163) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 164) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 165) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 166) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 167) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 168) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 169) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 170) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 171) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 172) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 173) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 174) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 175) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 176) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 177) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 178) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 179) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 180) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 181) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 182) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 183) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 184) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 185) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 186) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 187) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 188) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 189) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 190) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 191) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 192) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 193) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 194) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 195) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 196) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 197) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 198) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 199) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 200) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 201) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 202) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 203) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 204) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 205) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 206) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 207) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 208) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 209) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 210) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 211) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 212) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 213) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 214) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 215) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 216) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 217) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 218) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 219) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 220) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 221) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 222) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 223) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 224) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 225) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 226) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 227) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 228) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 229) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 230) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 231) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 232) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 233) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 234) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 235) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 236) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 237) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 238) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 239) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 240) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 241) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 242) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 243) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 244) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 245) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 246) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 247) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 248) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 249) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 250) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 251) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 252) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 253) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 254) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("notNewline", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            if (input.charCodeAt(offset) === 255) {
                var result = {result: input[offset], start: offset, end: offset + 1};
                return cont(continuation, items.concat([result]), offset + 1);
            } else {
                return cont(returnFromRule, null);
            }
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

addRule("name", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.name_name.apply(null, results);
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

addRule("fourSpaces", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "space", input, offset, transform, function (result) {
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
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "space", input, offset, transform, function (result) {
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

addRule("text", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.text_multiple.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "text", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "notNewline", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("text", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.text_none.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };

    return cont(continuation, [], startOffset);
});

addRule("ruleLines", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.ruleLines_multiple.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "ruleLines", input, offset, transform, function (result) {
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
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "text", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "fourSpaces", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("ruleLines", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.ruleLines_single.apply(null, results);
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
            return cont(parse, "text", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "fourSpaces", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("parameter", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
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

addRule("parameter", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        return cont(returnFromRule, {result: results, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "underscore", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("parameters", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.parameters_multiple.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "parameters", input, offset, transform, function (result) {
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
            return cont(parse, "parameter", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("parameters", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.parameters_none.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };

    return cont(continuation, [], startOffset);
});

addRule("result", function (input, offset, transform, continuation) {
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

addRule("rule", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.rule_rule.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "ruleLines", input, offset, transform, function (result) {
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
            return cont(parse, "parameters", input, offset, transform, function (result) {
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
            return cont(parse, "name", input, offset, transform, function (result) {
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
        var transformedResults = transform.rule_empty.apply(null, results);
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
            return cont(parse, "parameters", input, offset, transform, function (result) {
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
            return cont(parse, "name", input, offset, transform, function (result) {
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
        var transformedResults = transform.rule_result.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "ruleLines", input, offset, transform, function (result) {
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
            return cont(parse, "result", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
    
    return cont(continuation, [], startOffset);
});

addRule("template", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.template_multiple.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "template", input, offset, transform, function (result) {
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

addRule("template", function (input, offset, transform, continuation) {
    var returnFromRule = continuation;
    var startOffset = offset;
    continuation = function (items, offset) {
        var results = items.map(function (i) { return i.result; });
        var transformedResults = transform.template_single.apply(null, results);
        return cont(returnFromRule, {result: transformedResults, start: startOffset, end: offset});
    };
    
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
            return cont(parse, "newlines", input, offset, transform, function (result) {
                if (result === null) { return cont(returnFromRule, null); }
                return cont(continuation, items.concat([result]), result.end);
            });
        };
    }(continuation));
        
    continuation = (function (continuation) {
        return function (items, offset) {
            return cont(parse, "template", input, offset, transform, function (result) {
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
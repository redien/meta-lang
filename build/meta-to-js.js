
const parser = {rule: {}};
parser.add = function (name, parseFunction) {
    let rule = parser.rule[name];
    if (rule === undefined) {
        rule = []; 
        parser.rule[name] = rule;
    }   
    
    rule.push(parseFunction);
};

parser.parse = function (name, input, offset, transform) {
    var alternatives = parser.rule[name];
    if (alternatives === undefined) {
        throw new Error('Unknown rule ' + name);
    }   
    
    for (var i = 0; i < alternatives.length; ++i) {
        var alternative = alternatives[i];
        const result = alternative(input, offset, transform);
        if (result !== null) { return result; }
    }   
    
    return null;
};

parser.add("dash", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 45) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("dot", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 46) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("space", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 32) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("lf", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 10) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("cr", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 13) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("newline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("lf", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("cr", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("newline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("cr", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("lf", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("newline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("lf", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("newlines", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("newline", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("newlines", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("newlines", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("whitespaces", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("newline", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("newlines", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;

    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("whitespaces", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("space", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("whitespaces", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("whitespaces", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;

    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("numeric", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 48) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("numeric", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 49) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("numeric", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 50) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("numeric", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 51) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("numeric", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 52) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("numeric", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 53) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("numeric", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 54) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("numeric", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 55) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("numeric", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 56) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("numeric", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 57) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("number", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("numeric", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("number", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.number_multiple.apply(null, parsedResults), start: startOffset, end: offset};
});

parser.add("number", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("numeric", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.number_single.apply(null, parsedResults), start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 65) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 66) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 67) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 68) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 69) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 70) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 71) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 72) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 73) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 74) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 75) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 76) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 77) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 78) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 79) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 80) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 81) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 82) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 83) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 84) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 85) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 86) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 87) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 88) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 89) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 90) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 97) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 98) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 99) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 100) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 101) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 102) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 103) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 104) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 105) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 106) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 107) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 108) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 109) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 110) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 111) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 112) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 113) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 114) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 115) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 116) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 117) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 118) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 119) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 120) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 121) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    if (input.charCodeAt(offset) === 122) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphanumeric", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("numeric", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("alphanumeric", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("alphabetical", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});

parser.add("identifier", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("alphabetical", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("identifierRest", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.identifier_multiple.apply(null, parsedResults), start: startOffset, end: offset};
});

parser.add("identifier", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("alphabetical", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.identifier_single.apply(null, parsedResults), start: startOffset, end: offset};
});

parser.add("identifierRest", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("alphanumeric", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("identifierRest", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.identifierRest_multiple.apply(null, parsedResults), start: startOffset, end: offset};
});

parser.add("identifierRest", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("alphanumeric", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.identifierRest_single.apply(null, parsedResults), start: startOffset, end: offset};
});

parser.add("grammar", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("newlines", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("rule", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("newlines", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("grammar", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.grammar_multiple.apply(null, parsedResults), start: startOffset, end: offset};
});

parser.add("grammar", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("newlines", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("rule", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("newlines", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.grammar_single.apply(null, parsedResults), start: startOffset, end: offset};
});

parser.add("rule", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("identifier", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("whitespaces", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("parts", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("whitespaces", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("suffix", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("newline", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.rule_withSuffix.apply(null, parsedResults), start: startOffset, end: offset};
});

parser.add("rule", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("identifier", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("whitespaces", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("parts", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("whitespaces", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("newline", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.rule_withoutSuffix.apply(null, parsedResults), start: startOffset, end: offset};
});

parser.add("suffix", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("dash", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("identifier", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.suffix_suffix.apply(null, parsedResults), start: startOffset, end: offset};
});

parser.add("parts", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("part", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("whitespaces", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    parsed.push(parser.parse("parts", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.parts_multiple.apply(null, parsedResults), start: startOffset, end: offset};
});

parser.add("parts", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("part", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.parts_single.apply(null, parsedResults), start: startOffset, end: offset};
});

parser.add("parts", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;

    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.parts_none.apply(null, parsedResults), start: startOffset, end: offset};
});

parser.add("part", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("identifier", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.part_identifier.apply(null, parsedResults), start: startOffset, end: offset};
});

parser.add("part", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("number", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.part_number.apply(null, parsedResults), start: startOffset, end: offset};
});

parser.add("part", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("dot", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.part_eof.apply(null, parsedResults), start: startOffset, end: offset};
});

parser.add("start", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    
    parsed.push(parser.parse("grammar", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
        
    if (offset === input.length) {
        parsed.push({result: null, start: offset, end: offset});
    } else {
        return null;
    }
    
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.start_start.apply(null, parsedResults), start: startOffset, end: offset};
});

module.exports.parse = function (input, transform) {
    return parser.parse('start', input, 0, transform);
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
    if (input.charCodeAt(offset) === ' + number + ') {\n\
        parsed.push({result: input[offset], start: offset, end: offset + 1});\n\
        offset += 1;\n\
    } else {\n\
        return null;\n\
    }\n\
    ';
};
transform.part_identifier = function (identifier) {
    return '    \n\
    parsed.push(parser.parse("' + identifier + '", input, offset, transform));\n\
    if (parsed[parsed.length - 1] === null) { return null; }\n\
    offset = parsed[parsed.length - 1].end;\n\
    ';
};
transform.part_eof = function () {
    return '    \n\
    if (offset === input.length) {\n\
        parsed.push({result: null, start: offset, end: offset});\n\
    } else {\n\
        return null;\n\
    }\n\
    ';
};
transform.parts_single = function (n) {
    return '' + n + '';
};
transform.parts_multiple = function (part, _, rest) {
    return '' + part + '' + rest + '';
};
transform.parts_none = function () {
    return '';
};
transform.rule_withoutSuffix = function (name, _, parts, _, _) {
    return '\n\
parser.add("' + name + '", function (input, offset, transform) {\n\
    const parsed = [];\n\
    const startOffset = offset;\n\
' + parts + '\n\
    const parsedResults = parsed.map(function (p) { return p.result; });\n\
    return {result: parsedResults, start: startOffset, end: offset};\n\
});\n\
';
};
transform.rule_withSuffix = function (name, _, parts, _, suffix, _) {
    return '\n\
parser.add("' + name + '", function (input, offset, transform) {\n\
    const parsed = [];\n\
    const startOffset = offset;\n\
' + parts + '\n\
    const parsedResults = parsed.map(function (p) { return p.result; });\n\
    return {result: transform.' + name + '_' + suffix + '.apply(null, parsedResults), start: startOffset, end: offset};\n\
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
    return 'const parser = {rule: {}};\n\
parser.add = function (name, parseFunction) {\n\
    let rule = parser.rule[name];\n\
    if (rule === undefined) {\n\
        rule = []; \n\
        parser.rule[name] = rule;\n\
    }   \n\
    \n\
    rule.push(parseFunction);\n\
};\n\
\n\
parser.parse = function (name, input, offset, transform) {\n\
    var alternatives = parser.rule[name];\n\
    if (alternatives === undefined) {\n\
        throw new Error(\'Unknown rule \' + name);\n\
    }   \n\
    \n\
    for (var i = 0; i < alternatives.length; ++i) {\n\
        var alternative = alternatives[i];\n\
        const result = alternative(input, offset, transform);\n\
        if (result !== null) { return result; }\n\
    }   \n\
    \n\
    return null;\n\
};\n\
' + result + '\n\
module.exports.parse = function (input, transform) {\n\
    return parser.parse(\'start\', input, 0, transform);\n\
};';
};
var fs = require('fs');
var input = fs.readFileSync(process.argv[2], 'utf8');
var output = transformer(module.exports.parse(input, transform).result);
fs.writeFileSync(process.argv[3], output, 'utf8');

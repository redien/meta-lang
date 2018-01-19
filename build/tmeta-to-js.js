
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
    if (name === '.') {
        if (offset === input.length) {
            return {result: null, start: offset, end: offset};
        } else {
            return null;
        }   
    } else if (!isNaN(name)) {
        if (input.charCodeAt(offset) === parseInt(name)) {
            return {result: input[offset], start: offset, end: offset + 1}; 
        } else {
            return null;
        }   
    } else {
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
    }   
};
parser.add("underscore", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 95) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("dash", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 45) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("space", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 32) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("lf", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 10) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("cr", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 13) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
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
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("numeric", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 49) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("numeric", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 50) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("numeric", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 51) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("numeric", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 52) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("numeric", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 53) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("numeric", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 54) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("numeric", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 55) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("numeric", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 56) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("numeric", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 57) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
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
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 66) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 67) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 68) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 69) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 70) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 71) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 72) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 73) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 74) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 75) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 76) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 77) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 78) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 79) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 80) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 81) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 82) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 83) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 84) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 85) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 86) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 87) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 88) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 89) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 90) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 97) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 98) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 99) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 100) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 101) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 102) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 103) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 104) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 105) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 106) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 107) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 108) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 109) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 110) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 111) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 112) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 113) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 114) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 115) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 116) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 117) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 118) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 119) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 120) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 121) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("alphabetical", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 122) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
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
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 0) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 1) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 2) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 3) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 4) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 5) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 6) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 7) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 8) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 9) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 11) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 12) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 14) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 15) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 16) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 17) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 18) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 19) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 20) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 21) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 22) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 23) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 24) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 25) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 26) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 27) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 28) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 29) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 30) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 31) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 32) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 33) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 34) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 35) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 36) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 37) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 38) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 39) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 40) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 41) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 42) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 43) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 44) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 45) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 46) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 47) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 48) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 49) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 50) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 51) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 52) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 53) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 54) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 55) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 56) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 57) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 58) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 59) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 60) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 61) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 62) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 63) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 64) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 65) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 66) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 67) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 68) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 69) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 70) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 71) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 72) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 73) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 74) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 75) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 76) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 77) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 78) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 79) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 80) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 81) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 82) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 83) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 84) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 85) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 86) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 87) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 88) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 89) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 90) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 91) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 92) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 93) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 94) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 95) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 96) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 97) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 98) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 99) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 100) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 101) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 102) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 103) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 104) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 105) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 106) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 107) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 108) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 109) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 110) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 111) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 112) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 113) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 114) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 115) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 116) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 117) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 118) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 119) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 120) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 121) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 122) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 123) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 124) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 125) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 126) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 127) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 128) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 129) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 130) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 131) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 132) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 133) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 134) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 135) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 136) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 137) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 138) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 139) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 140) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 141) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 142) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 143) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 144) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 145) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 146) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 147) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 148) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 149) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 150) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 151) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 152) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 153) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 154) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 155) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 156) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 157) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 158) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 159) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 160) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 161) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 162) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 163) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 164) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 165) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 166) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 167) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 168) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 169) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 170) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 171) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 172) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 173) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 174) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 175) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 176) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 177) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 178) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 179) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 180) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 181) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 182) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 183) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 184) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 185) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 186) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 187) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 188) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 189) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 190) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 191) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 192) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 193) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 194) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 195) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 196) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 197) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 198) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 199) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 200) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 201) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 202) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 203) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 204) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 205) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 206) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 207) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 208) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 209) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 210) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 211) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 212) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 213) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 214) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 215) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 216) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 217) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 218) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 219) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 220) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 221) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 222) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 223) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 224) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 225) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 226) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 227) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 228) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 229) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 230) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 231) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 232) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 233) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 234) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 235) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 236) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 237) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 238) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 239) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 240) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 241) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 242) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 243) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 244) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 245) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 246) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 247) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 248) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 249) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 250) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 251) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 252) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 253) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 254) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("notNewline", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 255) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
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
parser.add("name", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    parsed.push(parser.parse("identifier", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("dash", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("identifier", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.name_name.apply(null, parsedResults), start: startOffset, end: offset};
});
parser.add("fourSpaces", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    parsed.push(parser.parse("space", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("space", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("space", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("space", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("text", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    parsed.push(parser.parse("notNewline", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("text", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.text_multiple.apply(null, parsedResults), start: startOffset, end: offset};
});
parser.add("text", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.text_none.apply(null, parsedResults), start: startOffset, end: offset};
});
parser.add("ruleLines", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    parsed.push(parser.parse("fourSpaces", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("text", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("newline", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("ruleLines", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.ruleLines_multiple.apply(null, parsedResults), start: startOffset, end: offset};
});
parser.add("ruleLines", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    parsed.push(parser.parse("fourSpaces", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("text", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("newline", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.ruleLines_single.apply(null, parsedResults), start: startOffset, end: offset};
});
parser.add("parameter", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    parsed.push(parser.parse("identifier", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("parameter", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    parsed.push(parser.parse("underscore", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("parameters", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    parsed.push(parser.parse("parameter", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("whitespaces", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("parameters", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.parameters_multiple.apply(null, parsedResults), start: startOffset, end: offset};
});
parser.add("parameters", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.parameters_none.apply(null, parsedResults), start: startOffset, end: offset};
});
parser.add("result", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    if (input.charCodeAt(offset) === 114) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    if (input.charCodeAt(offset) === 101) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    if (input.charCodeAt(offset) === 115) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    if (input.charCodeAt(offset) === 117) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    if (input.charCodeAt(offset) === 108) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    if (input.charCodeAt(offset) === 116) {
        parsed.push({result: input[offset], start: offset, end: offset + 1});
        offset += 1;
    } else { return null }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: parsedResults, start: startOffset, end: offset};
});
parser.add("rule", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    parsed.push(parser.parse("name", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("whitespaces", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("parameters", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("whitespaces", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("newline", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("ruleLines", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.rule_rule.apply(null, parsedResults), start: startOffset, end: offset};
});
parser.add("rule", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    parsed.push(parser.parse("name", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("whitespaces", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("parameters", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("whitespaces", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("newline", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.rule_empty.apply(null, parsedResults), start: startOffset, end: offset};
});
parser.add("rule", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    parsed.push(parser.parse("result", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("whitespaces", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("newline", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("ruleLines", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.rule_result.apply(null, parsedResults), start: startOffset, end: offset};
});
parser.add("template", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    parsed.push(parser.parse("newlines", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("rule", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("template", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.template_multiple.apply(null, parsedResults), start: startOffset, end: offset};
});
parser.add("template", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    parsed.push(parser.parse("newlines", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("rule", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.template_single.apply(null, parsedResults), start: startOffset, end: offset};
});
parser.add("start", function (input, offset, transform) {
    const parsed = [];
    const startOffset = offset;
    parsed.push(parser.parse("template", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    parsed.push(parser.parse("newlines", input, offset, transform));
    if (parsed[parsed.length - 1] === null) { return null; }
    offset = parsed[parsed.length - 1].end;
    if (offset === input.length) { parsed.push({result: null, start: offset, end: offset}); } else { return null; }
    const parsedResults = parsed.map(function (p) { return p.result; });
    return {result: transform.start_start.apply(null, parsedResults), start: startOffset, end: offset};
});


module.exports.parse = function (input, transform) {
    return parser.parse('start', input, 0, transform);
};

var transform = {};

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
transform.template_single = function (_, rule) {
    return '' + rule + '';
};
transform.template_multiple = function (_, rule, rest) {
    return '' + rule + '' + rest + '';
};
transform.text_none = function () {
    return '';
};
transform.text_multiple = function (c, rest) {
    return '' + c + '' + rest + '';
};
transform.text_single = function (c) {
    return '' + c + '';
};
transform.name_name = function (rule, _, suffix) {
    return '' + rule + '_' + suffix + '';
};
transform.ruleLines_multiple = function (_, text, _, rest) {
    return '' + text.replace(/\\\\/g, \'\\\\\\\\\').replace(/\'/g, "\\\\\'") + '\\n\\\n\
' + rest + '';
};
transform.ruleLines_single = function (_, text, _) {
    return '' + text.replace(/\\\\/g, \'\\\\\\\\\').replace(/\'/g, "\\\\\'") + '';
};
transform.parameters_none = function () {
    return '';
};
transform.parameters_multiple = function (parameter, _, rest) {
    return '' + parameter + ', ' + rest + '';
};
transform.rule_rule = function (name, _, parameters, _, _, lines) {
    return 'transform.' + name + ' = function (' + parameters + ') {\n\
    return \'' + lines.replace(/\\<\\%(.+?)\\%\\>/g, "\' +$1+ \'") + '\';\n\
};';
};
transform.rule_empty = function (name, _, parameters, _, _) {
    return 'transform.' + name + ' = function (' + parameters + ') {\n\
    return \'\';\n\
};';
};
transform.rule_result = function (_, _, _, lines) {
    return 'var transformer = function (result) {\n\
    return \'' + lines.replace(/\\<\\% result \\%\\>/g, "\' + result + \'") + '\';\n\
};';
};
transform.start_start = function (template, _) {
    return '' + template + '';
};
var transformer = function (result) {
    return 'var transform = {}; \n\
' + result + '\n\
var fs = require(\'fs\');\n\
var input = fs.readFileSync(process.argv[2], \'utf8\');\n\
var output = transformer(module.exports.parse(input, transform).result);\n\
fs.writeFileSync(process.argv[3], output, \'utf8\');';
};
var fs = require('fs');
var input = fs.readFileSync(process.argv[2], 'utf8');
var output = transformer(module.exports.parse(input, transform).result);
fs.writeFileSync(process.argv[3], output, 'utf8');


function identity(n) { return n; }
function concat(a, b) { return a + b; }

var transform = {};

transform.number_single = identity;
transform.number_multiple = concat;

transform.identifier_single = identity;
transform.identifier_multiple = concat;

transform.identifierRest_single = identity;
transform.identifierRest_multiple = concat;

transform.part_number = function (number) {
    return '    if (input.charCodeAt(offset) === ' + number + ') {\n' +
           '        parsed.push({result: input[offset], start: offset, end: offset + 1});\n' +
           '        offset += 1;\n' +
           '    } else { return null }\n';
};
transform.part_identifier = function (identifier) {
    return '    parsed.push(parser.parse("' + identifier + '", input, offset, transform));\n' +
           '    if (parsed[parsed.length - 1] === null) { return null; }\n' +
           '    offset = parsed[parsed.length - 1].end;\n';
};
transform.part_eof = function (_) {
    return '    if (offset === input.length) { parsed.push({result: null, start: offset, end: offset}); } else { return null; }\n';
};

transform.parts_single = identity; 
transform.parts_multiple = function (part, _, rest) {
    return part + rest;
};
transform.parts_none = function () {
    return '';
};

function rule(name, parts, result) {
    return 'parser.add("' + name + '", function (input, offset, transform) {\n' +
'    const parsed = [];\n' +
'    const startOffset = offset;\n' + 
parts +
'    const parsedResults = parsed.map(function (p) { return p.result; });\n' +
'    return {result: ' + result + ', start: startOffset, end: offset};\n' +
'});\n';
}

transform.rule_withoutSuffix = function (name, _, parts, __, ___) {
    return rule(name, parts, 'parsedResults');
};
transform.rule_withSuffix = function (name, _, parts, __, suffix, ___) {
    return rule(name, parts, 'transform.' + name + '_' + suffix + '.apply(null, parsedResults)');
};

transform.suffix_suffix = function (dash, suffix) {
    return suffix;
};

transform.grammar_single = function (_, rule, __) {
    return rule;
};
transform.grammar_multiple = function (_, rule, __, rest) {
    return rule + rest;
};


transform.start_start = function (grammar, _) {
    return grammar;
};

var parser = require(process.argv[2]);
var fs = require('fs');

var input = fs.readFileSync(process.argv[3], 'utf8');
var result = parser.parse(input, transform);

var output = "\
const parser = {rule: {}};\n\
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
    if (name === '.') {\n\
        if (offset === input.length) {\n\
            return {result: null, start: offset, end: offset};\n\
        } else {\n\
            return null;\n\
        }   \n\
    } else if (!isNaN(name)) {\n\
        if (input.charCodeAt(offset) === parseInt(name)) {\n\
            return {result: input[offset], start: offset, end: offset + 1}; \n\
        } else {\n\
            return null;\n\
        }   \n\
    } else {\n\
        var alternatives = parser.rule[name];\n\
        if (alternatives === undefined) {\n\
            throw new Error('Unknown rule ' + name);\n\
        }   \n\
\n\
        for (var i = 0; i < alternatives.length; ++i) {\n\
            var alternative = alternatives[i];\n\
            const result = alternative(input, offset, transform);\n\
            if (result !== null) { return result; }\n\
        }   \n\
\n\
        return null;\n\
    }   \n\
};\n\
" + result.result + "\n\
\n\
module.exports.parse = function (input, transform) {\n\
    return parser.parse('start', input, 0, transform);\n\
};\n\
";

fs.writeFileSync(process.argv[4], output, 'utf8');


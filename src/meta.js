
var fs = require('fs');
var grammar = fs.readFileSync(process.argv[2], 'utf8');

const parse = row => {
    let result = null;
    let subrules = null;
    const name = row[0];

    if (row[row.length - 1].substring(0, 1) === '-') {
        const suffix = row[row.length - 1].substring(1);
        subrules = row.slice(1, -1);
        subruleResults = subrules.map((_, index) => `part_${index}.result`);
        result = `transform.${name}_${suffix}(${subruleResults.join(', ')})`;
    } else {
        subrules = row.slice(1);
        subruleResults = subrules.map((_, index) => `part_${index}.result`);
        if (subrules.length === 1) {
            result = subruleResults[0];
        } else {
            result = `[${subruleResults.join(', ')}]`;
        }
    }
 
    return `
parser.add('${name}', function (input, offset, transform) {
    const startOffset = offset;
${subrules.map((rule, index) => `    var part_${index} = parser.parse('${rule}', input, offset, transform);
    if (part_${index} === null) { return null; }
    offset = part_${index}.end;
`).join('')}
    return {result: ${result}, start: startOffset, end: offset};
});
`;
};

var parser = grammar
    .split('\n')
    .filter(row => row.trim().length > 0)
    .map(row => row.split(' ').filter(w => w.length > 0))
    .map(parse)
    .join('');

fs.writeFileSync(process.argv[3], `

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

${parser}

module.exports.parse = function (input, transform) {
    return parser.parse('start', input, 0, transform);
};

`, 'utf8');


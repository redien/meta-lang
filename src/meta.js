

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


parser.add('dash', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('45', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('dot', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('46', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('space', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('32', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('lf', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('10', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('cr', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('13', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('newline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('lf', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('cr', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;

    return {result: [part_0.result, part_1.result], start: startOffset, end: offset};
});

parser.add('newline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('cr', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('lf', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;

    return {result: [part_0.result, part_1.result], start: startOffset, end: offset};
});

parser.add('newline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('lf', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('newlines', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('newline', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('newlines', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;

    return {result: [part_0.result, part_1.result], start: startOffset, end: offset};
});

parser.add('newlines', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('whitespaces', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('newline', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;

    return {result: [part_0.result, part_1.result], start: startOffset, end: offset};
});

parser.add('newlines', function (input, offset, transform) {
    const startOffset = offset;

    return {result: [], start: startOffset, end: offset};
});

parser.add('whitespaces', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('space', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('whitespaces', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;

    return {result: [part_0.result, part_1.result], start: startOffset, end: offset};
});

parser.add('whitespaces', function (input, offset, transform) {
    const startOffset = offset;

    return {result: [], start: startOffset, end: offset};
});

parser.add('numeric', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('48', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('numeric', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('49', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('numeric', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('50', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('numeric', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('51', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('numeric', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('52', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('numeric', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('53', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('numeric', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('54', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('numeric', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('55', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('numeric', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('56', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('numeric', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('57', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('number', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('numeric', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('number', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;

    return {result: transform.number_multiple(part_0.result, part_1.result), start: startOffset, end: offset};
});

parser.add('number', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('numeric', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: transform.number_single(part_0.result), start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('65', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('66', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('67', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('68', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('69', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('70', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('71', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('72', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('73', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('74', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('75', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('76', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('77', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('78', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('79', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('80', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('81', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('82', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('83', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('84', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('85', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('86', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('87', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('88', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('89', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('90', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('97', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('98', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('99', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('100', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('101', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('102', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('103', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('104', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('105', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('106', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('107', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('108', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('109', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('110', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('111', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('112', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('113', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('114', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('115', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('116', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('117', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('118', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('119', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('120', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('121', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphabetical', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('122', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphanumeric', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('numeric', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('alphanumeric', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('alphabetical', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('identifier', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('alphabetical', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('identifierRest', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;

    return {result: transform.identifier_multiple(part_0.result, part_1.result), start: startOffset, end: offset};
});

parser.add('identifier', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('alphabetical', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: transform.identifier_single(part_0.result), start: startOffset, end: offset};
});

parser.add('identifierRest', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('alphanumeric', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('identifierRest', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;

    return {result: transform.identifierRest_multiple(part_0.result, part_1.result), start: startOffset, end: offset};
});

parser.add('identifierRest', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('alphanumeric', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: transform.identifierRest_single(part_0.result), start: startOffset, end: offset};
});

parser.add('grammar', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('newlines', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('rule', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;
    var part_2 = parser.parse('newlines', input, offset, transform);
    if (part_2 === null) { return null; }
    offset = part_2.end;
    var part_3 = parser.parse('grammar', input, offset, transform);
    if (part_3 === null) { return null; }
    offset = part_3.end;

    return {result: transform.grammar_multiple(part_0.result, part_1.result, part_2.result, part_3.result), start: startOffset, end: offset};
});

parser.add('grammar', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('newlines', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('rule', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;
    var part_2 = parser.parse('newlines', input, offset, transform);
    if (part_2 === null) { return null; }
    offset = part_2.end;

    return {result: transform.grammar_single(part_0.result, part_1.result, part_2.result), start: startOffset, end: offset};
});

parser.add('rule', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('identifier', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('whitespaces', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;
    var part_2 = parser.parse('parts', input, offset, transform);
    if (part_2 === null) { return null; }
    offset = part_2.end;
    var part_3 = parser.parse('whitespaces', input, offset, transform);
    if (part_3 === null) { return null; }
    offset = part_3.end;
    var part_4 = parser.parse('suffix', input, offset, transform);
    if (part_4 === null) { return null; }
    offset = part_4.end;
    var part_5 = parser.parse('newline', input, offset, transform);
    if (part_5 === null) { return null; }
    offset = part_5.end;

    return {result: transform.rule_withSuffix(part_0.result, part_1.result, part_2.result, part_3.result, part_4.result, part_5.result), start: startOffset, end: offset};
});

parser.add('rule', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('identifier', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('whitespaces', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;
    var part_2 = parser.parse('parts', input, offset, transform);
    if (part_2 === null) { return null; }
    offset = part_2.end;
    var part_3 = parser.parse('whitespaces', input, offset, transform);
    if (part_3 === null) { return null; }
    offset = part_3.end;
    var part_4 = parser.parse('newline', input, offset, transform);
    if (part_4 === null) { return null; }
    offset = part_4.end;

    return {result: transform.rule_withoutSuffix(part_0.result, part_1.result, part_2.result, part_3.result, part_4.result), start: startOffset, end: offset};
});

parser.add('suffix', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('dash', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('identifier', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;

    return {result: transform.suffix_suffix(part_0.result, part_1.result), start: startOffset, end: offset};
});

parser.add('parts', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('part', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('whitespaces', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;
    var part_2 = parser.parse('parts', input, offset, transform);
    if (part_2 === null) { return null; }
    offset = part_2.end;

    return {result: transform.parts_multiple(part_0.result, part_1.result, part_2.result), start: startOffset, end: offset};
});

parser.add('parts', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('part', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: transform.parts_single(part_0.result), start: startOffset, end: offset};
});

parser.add('parts', function (input, offset, transform) {
    const startOffset = offset;

    return {result: transform.parts_none(), start: startOffset, end: offset};
});

parser.add('part', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('identifier', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: transform.part_identifier(part_0.result), start: startOffset, end: offset};
});

parser.add('part', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('number', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: transform.part_number(part_0.result), start: startOffset, end: offset};
});

parser.add('part', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('dot', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: transform.part_eof(part_0.result), start: startOffset, end: offset};
});

parser.add('start', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('grammar', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('.', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;

    return {result: transform.start_start(part_0.result, part_1.result), start: startOffset, end: offset};
});


module.exports.parse = function (input, transform) {
    return parser.parse('start', input, 0, transform);
};


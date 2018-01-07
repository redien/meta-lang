

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


parser.add('underscore', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('95', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('dash', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('45', input, offset, transform);
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

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('0', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('1', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('2', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('3', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('4', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('5', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('6', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('7', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('8', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('9', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('11', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('12', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('14', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('15', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('16', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('17', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('18', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('19', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('20', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('21', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('22', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('23', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('24', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('25', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('26', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('27', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('28', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('29', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('30', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('31', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('32', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('33', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('34', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('35', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('36', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('37', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('38', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('39', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('40', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('41', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('42', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('43', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('44', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('45', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('46', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('47', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('48', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('49', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('50', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('51', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('52', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('53', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('54', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('55', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('56', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('57', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('58', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('59', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('60', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('61', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('62', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('63', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('64', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('65', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('66', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('67', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('68', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('69', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('70', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('71', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('72', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('73', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('74', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('75', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('76', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('77', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('78', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('79', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('80', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('81', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('82', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('83', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('84', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('85', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('86', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('87', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('88', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('89', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('90', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('91', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('92', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('93', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('94', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('95', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('96', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('97', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('98', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('99', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('100', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('101', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('102', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('103', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('104', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('105', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('106', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('107', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('108', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('109', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('110', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('111', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('112', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('113', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('114', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('115', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('116', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('117', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('118', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('119', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('120', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('121', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('122', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('123', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('124', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('125', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('126', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('127', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('128', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('129', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('130', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('131', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('132', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('133', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('134', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('135', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('136', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('137', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('138', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('139', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('140', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('141', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('142', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('143', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('144', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('145', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('146', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('147', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('148', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('149', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('150', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('151', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('152', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('153', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('154', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('155', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('156', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('157', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('158', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('159', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('160', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('161', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('162', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('163', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('164', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('165', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('166', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('167', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('168', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('169', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('170', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('171', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('172', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('173', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('174', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('175', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('176', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('177', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('178', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('179', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('180', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('181', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('182', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('183', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('184', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('185', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('186', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('187', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('188', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('189', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('190', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('191', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('192', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('193', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('194', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('195', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('196', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('197', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('198', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('199', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('200', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('201', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('202', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('203', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('204', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('205', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('206', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('207', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('208', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('209', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('210', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('211', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('212', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('213', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('214', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('215', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('216', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('217', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('218', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('219', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('220', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('221', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('222', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('223', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('224', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('225', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('226', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('227', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('228', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('229', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('230', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('231', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('232', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('233', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('234', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('235', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('236', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('237', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('238', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('239', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('240', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('241', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('242', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('243', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('244', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('245', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('246', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('247', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('248', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('249', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('250', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('251', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('252', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('253', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('254', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('notNewline', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('255', input, offset, transform);
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

parser.add('name', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('identifier', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('dash', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;
    var part_2 = parser.parse('identifier', input, offset, transform);
    if (part_2 === null) { return null; }
    offset = part_2.end;

    return {result: transform.name_name(part_0.result, part_1.result, part_2.result), start: startOffset, end: offset};
});

parser.add('fourSpaces', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('space', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('space', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;
    var part_2 = parser.parse('space', input, offset, transform);
    if (part_2 === null) { return null; }
    offset = part_2.end;
    var part_3 = parser.parse('space', input, offset, transform);
    if (part_3 === null) { return null; }
    offset = part_3.end;

    return {result: [part_0.result, part_1.result, part_2.result, part_3.result], start: startOffset, end: offset};
});

parser.add('text', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('notNewline', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('text', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;

    return {result: transform.text_multiple(part_0.result, part_1.result), start: startOffset, end: offset};
});

parser.add('text', function (input, offset, transform) {
    const startOffset = offset;

    return {result: transform.text_none(), start: startOffset, end: offset};
});

parser.add('ruleLines', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('fourSpaces', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('text', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;
    var part_2 = parser.parse('newline', input, offset, transform);
    if (part_2 === null) { return null; }
    offset = part_2.end;
    var part_3 = parser.parse('ruleLines', input, offset, transform);
    if (part_3 === null) { return null; }
    offset = part_3.end;

    return {result: transform.ruleLines_multiple(part_0.result, part_1.result, part_2.result, part_3.result), start: startOffset, end: offset};
});

parser.add('ruleLines', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('fourSpaces', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('text', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;
    var part_2 = parser.parse('newline', input, offset, transform);
    if (part_2 === null) { return null; }
    offset = part_2.end;

    return {result: transform.ruleLines_single(part_0.result, part_1.result, part_2.result), start: startOffset, end: offset};
});

parser.add('ruleLines', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('newline', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: transform.ruleLines_empty(part_0.result), start: startOffset, end: offset};
});

parser.add('parameter', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('identifier', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('parameter', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('underscore', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;

    return {result: part_0.result, start: startOffset, end: offset};
});

parser.add('parameters', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('parameter', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('whitespaces', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;
    var part_2 = parser.parse('parameters', input, offset, transform);
    if (part_2 === null) { return null; }
    offset = part_2.end;

    return {result: transform.parameters_multiple(part_0.result, part_1.result, part_2.result), start: startOffset, end: offset};
});

parser.add('parameters', function (input, offset, transform) {
    const startOffset = offset;

    return {result: transform.parameters_none(), start: startOffset, end: offset};
});

parser.add('result', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('114', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('101', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;
    var part_2 = parser.parse('115', input, offset, transform);
    if (part_2 === null) { return null; }
    offset = part_2.end;
    var part_3 = parser.parse('117', input, offset, transform);
    if (part_3 === null) { return null; }
    offset = part_3.end;
    var part_4 = parser.parse('108', input, offset, transform);
    if (part_4 === null) { return null; }
    offset = part_4.end;
    var part_5 = parser.parse('116', input, offset, transform);
    if (part_5 === null) { return null; }
    offset = part_5.end;

    return {result: [part_0.result, part_1.result, part_2.result, part_3.result, part_4.result, part_5.result], start: startOffset, end: offset};
});

parser.add('rule', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('name', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('whitespaces', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;
    var part_2 = parser.parse('parameters', input, offset, transform);
    if (part_2 === null) { return null; }
    offset = part_2.end;
    var part_3 = parser.parse('whitespaces', input, offset, transform);
    if (part_3 === null) { return null; }
    offset = part_3.end;
    var part_4 = parser.parse('newline', input, offset, transform);
    if (part_4 === null) { return null; }
    offset = part_4.end;
    var part_5 = parser.parse('ruleLines', input, offset, transform);
    if (part_5 === null) { return null; }
    offset = part_5.end;

    return {result: transform.rule_rule(part_0.result, part_1.result, part_2.result, part_3.result, part_4.result, part_5.result), start: startOffset, end: offset};
});

parser.add('rule', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('result', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('whitespaces', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;
    var part_2 = parser.parse('newline', input, offset, transform);
    if (part_2 === null) { return null; }
    offset = part_2.end;
    var part_3 = parser.parse('ruleLines', input, offset, transform);
    if (part_3 === null) { return null; }
    offset = part_3.end;

    return {result: transform.rule_result(part_0.result, part_1.result, part_2.result, part_3.result), start: startOffset, end: offset};
});

parser.add('template', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('newlines', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('rule', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;
    var part_2 = parser.parse('template', input, offset, transform);
    if (part_2 === null) { return null; }
    offset = part_2.end;

    return {result: transform.template_multiple(part_0.result, part_1.result, part_2.result), start: startOffset, end: offset};
});

parser.add('template', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('newlines', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('rule', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;

    return {result: transform.template_single(part_0.result, part_1.result), start: startOffset, end: offset};
});

parser.add('start', function (input, offset, transform) {
    const startOffset = offset;
    var part_0 = parser.parse('template', input, offset, transform);
    if (part_0 === null) { return null; }
    offset = part_0.end;
    var part_1 = parser.parse('newlines', input, offset, transform);
    if (part_1 === null) { return null; }
    offset = part_1.end;
    var part_2 = parser.parse('.', input, offset, transform);
    if (part_2 === null) { return null; }
    offset = part_2.end;

    return {result: transform.start_start(part_0.result, part_1.result, part_2.result), start: startOffset, end: offset};
});


module.exports.parse = function (input, transform) {
    return parser.parse('start', input, 0, transform);
};


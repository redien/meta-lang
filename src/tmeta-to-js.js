
function identity(n) { return n; }
function concat(a, b) { return a + b; }

var transform = {};

transform.identifier_single = identity;
transform.identifier_multiple = concat;

transform.identifierRest_single = identity;
transform.identifierRest_multiple = concat;

transform.template_single = function (_, rule) {
    return rule;
};
transform.template_multiple = function (_, rule, rest) {
    return rule + rest;
};

transform.text_none = function () {
    return '';
};
transform.text_multiple = function (c, rest) {
    return c + rest;
};
transform.text_single = function (c) {
    return c;
};

transform.name_name = function (rule, _, suffix) {
    return rule + '_' + suffix;
};

function escapequote(text) {
    return text.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

transform.ruleLines_multiple = function (_, text, _, rest) {
    return escapequote(text) + '\\n\\\n' + rest;
};
transform.ruleLines_single = function (_, text, _) {
    return escapequote(text);
};

transform.parameters_none = function () {
    return [];
};
transform.parameters_multiple = function (parameter, _, rest) {
    return [parameter, ...rest];
};


transform.rule_rule = function (name, _, parameters, _, _, lines) {
    return `
transform.${name} = function (${parameters.join(', ')}) {
    return '${lines.replace(/<%(.+?)%>/g, "' +$1+ '")}';
};`;
};
transform.rule_empty = function (name, _, parameters, _, _) {
    return `
transform.${name} = function (${parameters.join(', ')}) {
    return '';
};`;
};
transform.rule_result = function (_, __, ___, lines) {
    return `
var transformer = function (result) {
    return '${lines.replace(/<% result %>/g, "' + result + '")}';
};`;
};

transform.start_start = function (template, _) {
    return template;
};

var parser = require('./tmeta.js');
var fs = require('fs');

var input = fs.readFileSync(process.argv[2], 'utf8');
var result = parser.parse(input, transform);
var parserSource = fs.readFileSync(process.argv[3]);

var output = `
${parserSource}
var transform = {};
${result.result}
var fs = require('fs');
var input = fs.readFileSync(process.argv[2], 'utf8');
var output = transformer(module.exports.parse(input, transform).result);
fs.writeFileSync(process.argv[3], output, 'utf8');
`;

fs.writeFileSync(process.argv[4], output, 'utf8');


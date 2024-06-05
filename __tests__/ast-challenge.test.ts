import generate from '@babel/generator';
import { readFileSync, writeFileSync } from 'fs';
import GenAst, { GenParams } from '../src';


const data = JSON.parse(readFileSync('example-methods.json', 'utf-8'));

const expectCode = (ast, path) => {
    expect(
        generate(ast).code
    ).toMatchSnapshot(path);
}

const printCode = (ast) => {
    console.log(
        generate(ast).code
    );
}

it('works', () => {
    for (let key in data) {
        const methodName = key[0].toLowerCase() + key.slice(1)
        const genParams: GenParams = {
            queryInterface: 'Use' + key + 'Query',
            hookName: 'use' + key,
            requestType: data[key]['requestType'],
            responseType: data[key]['responseType'],
            methodName: methodName,
            keyName: methodName + 'Query'
        }
        const ast = GenAst(genParams)
        expectCode(ast, key);
    }
});
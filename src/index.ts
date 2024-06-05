import traverse from "@babel/traverse";
import { ParseResult, parse } from "@babel/parser";
import { File } from "@babel/types";

export interface GenParams {
    queryInterface: string,
    hookName: string,
    requestType: string,
    responseType: string,
    methodName: string,
    keyName: string
}

export default function GenAst(params: GenParams): ParseResult<File> {

    const codeTemplate = `
    export interface UsePoolsQuery<TData> extends ReactQueryParams<QueryPoolsResponse, TData> {
        request?: QueryPoolsRequest;
    }
    const usePools = <TData = QueryPoolsResponse,>({
        request,
        options
    }: UsePoolsQuery<TData>) => {
        return useQuery<QueryPoolsResponse, Error, TData>(["poolsQuery", request], () => {
            if (!queryService) throw new Error("Query Service not initialized");
            return queryService.pools(request);
        }, options);
    };
    `

    const ast = parse(codeTemplate, {
        sourceType: 'module',
        plugins: ["typescript"]
    });

    traverse(ast, {
        enter(path) {
            if (path.isIdentifier({ name: 'UsePoolsQuery' })) {
                path.node.name = params.queryInterface;
            }
            if (path.isIdentifier({ name: 'QueryPoolsRequest' })) {
                path.node.name = params.requestType;
            }
            if (path.isIdentifier({ name: 'QueryPoolsResponse' })) {
                path.node.name = params.responseType;
            }
            if (path.isIdentifier({ name: 'usePools' })) {
                path.node.name = params.hookName;
            }
            if (path.isIdentifier({ name: 'pools' })) {
                path.node.name = params.methodName;
            }
            if (path.isStringLiteral({ value: 'poolsQuery' })) {
                path.node.value = params.keyName;
            }
        },
    });

    return ast

};

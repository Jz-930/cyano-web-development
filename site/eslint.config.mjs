import tseslint from 'typescript-eslint';
const tokens={meta:{type:'problem',schema:[],messages:{literal:'Use the approved v3 tokens instead of literal colors or arbitrary font sizes.'}},create(context){return {Literal(node){if(typeof node.value==='string'&&(/#[\da-f]{3,8}\b/i.test(node.value)||/text-\[\d+(?:\.\d+)?px\]/.test(node.value)))context.report({node,messageId:'literal'});}};}};
export default [
 {ignores:['.next/**','node_modules/**','public/**','scripts/**','next-env.d.ts']},
 {files:['**/*.ts','**/*.tsx'],languageOptions:{parser:tseslint.parser,parserOptions:{ecmaFeatures:{jsx:true}}},rules:{'no-unreachable':'error','no-dupe-keys':'error','no-duplicate-case':'error','no-constant-binary-expression':'error'}},
 {files:['components/**/*.tsx'],plugins:{cyano:{rules:{tokens}}},rules:{'cyano/tokens':'error'}},
];

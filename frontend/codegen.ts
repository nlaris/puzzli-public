import {CodegenConfig} from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: 'schema.graphql',
  generates: {
    'src/graphql-codegen/types.ts': {
      plugins: [
        {
          add: {
            content: '// AUTO-GENERATED \n',
          },
        },
        'typescript'
      ]
    }
  }
}

export default config;
import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cognito from "@aws-cdk/aws-cognito";
import * as ec2 from '@aws-cdk/aws-ec2';
import * as neptune from "@aws-cdk/aws-neptune";
import * as iam from '@aws-cdk/aws-iam';
import { GQL_QUERRIES } from '../lambda-fns/queryHandler';
import { GQL_MUTATIONS } from '../lambda-fns/mutationHandler';

export class AwsCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //////////////////////// creating User Pool /////////////////////////////////
    const userPool = new cognito.UserPool(this, `${this.stackName}_USER_POOL`, {
      selfSignUpEnabled: true,
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      // userVerification: {
      //   emailStyle: cognito.VerificationEmailStyle.CODE,
      // },
      autoVerify: { email: true, },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
        phoneNumber: {
          required: true,
          mutable: true
        }
      },
    })
    const userPoolClient = new cognito.UserPoolClient(this, `${this.stackName}_USER_POOL_CLIENT`, {
      userPool,
    });

    /////////////////////////// Creating Appsync API /////////////////////////
    const api = new appsync.GraphqlApi(this, "Api", {
      name: `${this.stackName}_GraphqlApi`,
      schema: appsync.Schema.fromAsset("schema/schema.gql"),
      authorizationConfig: {
        defaultAuthorization: {
          userPoolConfig: { userPool },
          authorizationType: appsync.AuthorizationType.USER_POOL,
        },
      },
      logConfig: { fieldLogLevel: appsync.FieldLogLevel.ALL },
    });

    ////////////////////////// creating lambdas //////////////////////////////////
    /* 1. queryHandler */
    const queryHandler = new lambda.Function(this, "QueryHandler", {
      code: lambda.Code.fromAsset('lambda-fns'),
      handler: 'queryHandler.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      timeout: cdk.Duration.seconds(10),
      environment: {

      },
      // layers: [resourceManageLayer]
    });

    /* 2. mutationHandler */
    const mutationHandler = new lambda.Function(this, "MutationHandler", {
      code: lambda.Code.fromAsset('lambda-fns'),
      handler: 'mutationHandler.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      timeout: cdk.Duration.seconds(10),
      environment: {

      },
      // layers: [resourceManageLayer]
    });

    /* 3. addPersonHandler */
    const addPersonHandler = new lambda.Function(this, "AddPersonHandler", {
      code: lambda.Code.fromAsset('lambda-fns'),
      handler: 'addPersonHandler.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      timeout: cdk.Duration.seconds(10),
      environment: {

      },
      // layers: [resourceManageLayer]
    });
    userPool.addTrigger(cognito.UserPoolOperation.POST_CONFIRMATION, addPersonHandler)

    ///////////////////////// Creating Appsync Resolvers /////////////////////////
    const queryResolverDS = api.addLambdaDataSource("queryResolver", queryHandler);
    const mutationResolverDS = api.addLambdaDataSource("mutationResolver", mutationHandler);

    Object.keys(GQL_QUERRIES).forEach((query) => {
      queryResolverDS.createResolver({
        typeName: "Query",
        fieldName: query,
        requestMappingTemplate: appsync.MappingTemplate.lambdaRequest(),
        responseMappingTemplate: appsync.MappingTemplate.lambdaResult()
      })
    });

    Object.keys(GQL_MUTATIONS).forEach((mutation) => {
      mutationResolverDS.createResolver({
        typeName: "Mutation",
        fieldName: mutation,
        requestMappingTemplate: appsync.MappingTemplate.lambdaRequest(),
        responseMappingTemplate: appsync.MappingTemplate.lambdaResult()
      })
    });


    ///////////////////////// logging info /////////////////////////
    new cdk.CfnOutput(this, "GraphqlUrl", { value: api.graphqlUrl });
    new cdk.CfnOutput(this, "UserPoolId", { value: userPool.userPoolId });
    new cdk.CfnOutput(this, "UserPoolClientId", { value: userPoolClient.userPoolClientId });


  }
}

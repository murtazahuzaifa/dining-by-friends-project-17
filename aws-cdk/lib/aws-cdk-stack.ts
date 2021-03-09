import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cognito from "@aws-cdk/aws-cognito";
import * as ec2 from '@aws-cdk/aws-ec2';
import * as neptune from "@aws-cdk/aws-neptune";
import { GQL_QUERRIES } from '../lambda-fns/queryHandler';
import { GQL_MUTATIONS } from '../lambda-fns/mutationHandler';
// import * as iam from '@aws-cdk/aws-iam';

export class AwsCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //////////////////////// creating a VPC /////////////////////////////////
    const vpc = new ec2.Vpc(this, "Vpc", {
      subnetConfiguration: [
        { cidrMask: 24, name: `${id.toLowerCase().replace('-', '')}subnet`, subnetType: ec2.SubnetType.ISOLATED, }
      ]
    });
    const sg1 = new ec2.SecurityGroup(this, id + "-neptuneSecurityGroup1", {
      vpc,
      allowAllOutbound: true,
      description: id + " security group 1",
      securityGroupName: id + "-neptuneSecurityGroup1",
    });
    cdk.Tags.of(sg1).add("Name", id + "-neptuneSecurityGroup1");


    //////////////////////// Creating neptune cluster /////////////////////////////////
    const neptuneSubnet = new neptune.CfnDBSubnetGroup(this, id + "-neptunesubnetgroup", {
      dbSubnetGroupDescription: id + " neptune Subnet",
      subnetIds: vpc.selectSubnets({ subnetType: ec2.SubnetType.ISOLATED }).subnetIds,
      dbSubnetGroupName: id.toLowerCase() + "-neptunesubnetgroup",
    }
    );

    const neptuneCluster = new neptune.CfnDBCluster(this, id + "-neptuneCluster", {
      dbSubnetGroupName: neptuneSubnet.dbSubnetGroupName,
      dbClusterIdentifier: id + "-graphDBCluster",
      vpcSecurityGroupIds: [sg1.securityGroupId],
    });
    neptuneCluster.addDependsOn(neptuneSubnet);
    // Creating neptune instance
    const neptuneInstance = new neptune.CfnDBInstance(this, id + "-neptuneinstance", {
      dbInstanceClass: "db.t3.medium",
      dbClusterIdentifier: neptuneCluster.dbClusterIdentifier,
      availabilityZone: vpc.availabilityZones[0],
    });
    neptuneInstance.addDependsOn(neptuneCluster);


    //////////////////////// creating User Pool /////////////////////////////////
    const userPool = new cognito.UserPool(this, `${this.stackName}_USER_POOL`, {
      selfSignUpEnabled: true,
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      // userVerification: {
      //   emailStyle: cognito.VerificationEmailStyle.CODE,
      // },
      autoVerify: { email: true, },
      standardAttributes: {
        email: { required: true, mutable: true, },
        // phoneNumber: { required: true, mutable: true }
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

    const lambdaNames = {
      QueryHandler: "QueryHandler",
      MutationHandler: "MutationHandler",
      AddPersonHandler: "AddPersonHandler",
    }
    const lambdaFn: { [P in keyof typeof lambdaNames]?: lambda.IFunction } = {};

    Object.keys(lambdaNames).forEach((name) => {
      const key = name as keyof typeof lambdaNames
      lambdaFn[key] = new lambda.Function(this, name, {
        code: lambda.Code.fromAsset('lambda-fns'),
        handler: 'queryHandler.handler',
        runtime: lambda.Runtime.NODEJS_12_X,
        timeout: cdk.Duration.seconds(30),
        vpc: vpc,
        securityGroups: [sg1],
        environment: {
          NEPTUNE_ENDPOINT: neptuneCluster.attrEndpoint
        },
        vpcSubnets: { subnetType: ec2.SubnetType.ISOLATED }
      });
    })

    userPool.addTrigger(cognito.UserPoolOperation.POST_CONFIRMATION, lambdaFn['AddPersonHandler']!)

    ///////////////////////// Creating Appsync Resolvers /////////////////////////
    const queryResolverDS = api.addLambdaDataSource("queryResolver", lambdaFn['QueryHandler']!);
    const mutationResolverDS = api.addLambdaDataSource("mutationResolver", lambdaFn['MutationHandler']!);

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

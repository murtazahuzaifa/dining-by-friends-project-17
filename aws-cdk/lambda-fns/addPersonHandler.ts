import { Callback, Context, BasePostConfirmationTriggerEvent } from 'aws-lambda';
import { g, gremlinQueryHandler, __ } from './gremlinQueryHandler';
import { collections } from './graphDatabaseScheme.json';
import { Person } from './graphql';

export const handler = async (event: BasePostConfirmationTriggerEvent<string>, context: Context, callback: Callback):Promise<any> => {
    console.log("EVENT==>", event);

    try {
        await gremlinQueryHandler(async () => {
            const result = await g.addV(collections[0].collectionName as "Person")
                .property("_id", event.request.userAttributes.sub)
                .property("email", event.request.userAttributes.email)
                .property("name", event.userName)
                .elementMap()
                .next();

            console.log(result);

            // callback(null, {
            //     id: result.value.id,
            //     name: result.value.name,
            //     email: result.value.email,
            //     friends: []
            // } as Person);

        })

        return event


    } catch (e) {
        callback(e, null);
    }
}

/*
expected event

{
  version: '1',
  region: 'us-east-1',
  userPoolId: 'us-east-1_xxxxxxxt',
  userName: 'user name',
  callerContext: {
    awsSdkVersion: 'aws-sdk-unknown-unknown',
    clientId: '6hxxxxxxxxxxxxxxxxxxxv2b'
  },
  triggerSource: 'PostConfirmation_ConfirmSignUp',
  request: {
    userAttributes: {
      sub: 'xxxxxx-xxxxxx-xxxxxx-xxxxxx-xxxxxx',
      'cognito:user_status': 'CONFIRMED',
      email_verified: 'true',
      phone_number_verified: 'false',
      phone_number: '+13423567',
      email: 'example@gmail.com'
    }
  },
  response: {}
}

*/
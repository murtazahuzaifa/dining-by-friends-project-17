import { Callback, Context, BasePostConfirmationTriggerEvent } from 'aws-lambda';

export const handler = async (event: BasePostConfirmationTriggerEvent<string>, context: Context, callback: Callback): Promise<void> => {
    console.log("EVENT==>", event);

    try {
        console.log('new person added')

        callback(null, event);

    } catch (e) {
        callback(e, null);
    }
}

/*
expected event

{
  version: '1',
  region: 'us-east-1',
  userPoolId: 'us-east-1_j6yA3j5pt',
  userName: 'murtazahuzaifa',
  callerContext: {
    awsSdkVersion: 'aws-sdk-unknown-unknown',
    clientId: '6h2vacq1pbfighdh0022qmrv2b'
  },
  triggerSource: 'PostConfirmation_ConfirmSignUp',
  request: {
    userAttributes: {
      sub: 'f5a46c3e-7d45-4334-b3de-ab92ad97e054',
      'cognito:user_status': 'CONFIRMED',
      email_verified: 'true',
      phone_number_verified: 'false',
      phone_number: '+13423567',
      email: 'murtaza.huzaifa2@gmail.com'
    }
  },
  response: {}
}

*/
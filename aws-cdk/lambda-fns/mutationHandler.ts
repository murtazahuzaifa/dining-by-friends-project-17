import { Callback, Context } from 'aws-lambda';
import { NewAppSyncResolverEvent } from './typeDefs';
import { Person, PersonInput } from './graphql';
import { g, gremlinQueryHandler, __ } from './gremlinQueryHandler';

export const GQL_MUTATIONS = {
    "add_person": "add_person",
    "add_restaurant": "add_restaurant",
    "write_review_for_restaurant": "write_review_for_restaurant",
    "rate_to_review": "rate_to_review",
    "add_cuisine": "add_cuisine",
}

////////////////////////// Handler //////////////////////////
export const handler = async (event: NewAppSyncResolverEvent<any>, context: Context, callback: Callback): Promise<void> => {
    console.log("EVENT==>", event);
    const EVENT_ACTION = event.info.fieldName as keyof typeof GQL_MUTATIONS

    try {

        switch (EVENT_ACTION) {
            case "add_person":
                callback(null, {
                    id: "123",
                    name: "Murtaza",
                    email: "murtaza.huzaifa2@gmail.com",
                    friends: []
                } as Person)

                break;
        }

    } catch (e) {
        console.log("Error ==>", e);
        callback(e, null)

    }


}
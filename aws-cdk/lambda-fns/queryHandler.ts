import { Callback, Context } from 'aws-lambda';
import { NewAppSyncResolverEvent } from './typeDefs';
import { g, gremlinQueryHandler, __ } from './gremlinQueryHandler';


export const GQL_QUERRIES = {
    "person": "person",
    "persons": "persons",
    "restaurants": "restaurants",
    "restaurant": "restaurant",
    "person_friends": "person_friends",
    "persons_relation": "persons_relation",
    "top_rated_nearest_restaurants": "top_rated_nearest_restaurants",
    "newest_review_of_restaurant": "newest_review_of_restaurant",
    "recommended_restaurants_by_friends": "recommended_restaurants_by_friends",
    "recent_feedback_to_restaurants_by_friends": "recent_feedback_to_restaurants_by_friends",
}

////////////////////////// Handler //////////////////////////
export const handler = async (event: NewAppSyncResolverEvent<any>, context: Context, callback: Callback): Promise<void> => {
    console.log("EVENT==>", event);
    const EVENT_ACTION = event.info.fieldName as keyof typeof GQL_QUERRIES;

    try {
        switch (EVENT_ACTION) {
            case "persons":
                callback(null, [])
                break;

        }

    } catch (e) {
        console.log("Error ==>", e);
        callback(e, null);
    }


}

import { Callback, Context } from 'aws-lambda';
import { NewAppSyncResolverEvent } from './typeDefs';
import { Person, QueryPersonArgs, Restaurant, QueryRestaurantArgs, Cuisine, CuisineInput, Rate, RateInput, Thumb, Review, ReviewInput, Query } from './graphql';
import { g, gremlinQueryHandler, __ } from './gremlinQueryHandler';
import { collections } from './graphDatabaseScheme.json';


export const GQL_QUERRIES: { [P in keyof Query]: string } = {
    person: "person",
    persons: "persons",
    restaurants: "restaurants",
    restaurant: "restaurant",
    person_friends: "person_friends",
    persons_relation: "persons_relation",
    top_rated_nearest_restaurants: "top_rated_nearest_restaurants",
    newest_review_of_restaurant: "newest_review_of_restaurant",
    recommended_restaurants_by_friends: "recommended_restaurants_by_friends",
    recent_feedback_to_restaurants_by_friends: "recent_feedback_to_restaurants_by_friends",
}

////////////////////////// Handler //////////////////////////
export const handler = async (event: NewAppSyncResolverEvent<QueryPersonArgs | QueryRestaurantArgs>, context: Context, callback: Callback): Promise<void> => {
    console.log("EVENT==>", event);
    const EVENT_ACTION = event.info.fieldName as keyof typeof GQL_QUERRIES;
    // let result = {};

    try {
        switch (EVENT_ACTION) {

            case "persons":
                return gremlinQueryHandler(async () => {
                    const result = await g.V().hasLabel(collections[0].collectionName as "Person")
                        .elementMap().toList();
                    /* aspect in result
                      array of {id:string, _id:string, label: string, name:string, email:string}
                     */
                    console.log("Result", result);

                    const persons: Person[] = result.map<Person>((trs) => {
                        const trsvl = trs as { id: string, _id: string, label: string, name: string, email: string }
                        return { id: trsvl.id, name: trsvl.name, email: trsvl.email, friends: [] }
                    });
                    return persons
                })
                // callback(null, persons as Person[])
                break;

            case "person":
                const { person_id } = event.arguments as QueryPersonArgs
                const person: Person = {
                    id: "123",
                    name: "Murtaza",
                    email: "murtaza.huzaifa2@gmail.com",
                    friends: []
                };
                callback(null, person as Person)
                break;


            case "restaurants":
                return gremlinQueryHandler(async () => {
                    const result = await g.V().hasLabel(collections[1].collectionName as "Restaurant")
                        .elementMap().toList();
                    /* aspect in result
                      {id:string, label: string, name:string, location: '{\"units\":\"number\"}'}
                     */
                    console.log("Result", result);

                    const restaurants: Restaurant[] = result.map<Restaurant>((trs) => {
                        const trsvl = trs as { id: string, label: string, name: string, location: string }
                        return { id: trsvl.id, name: trsvl.name, location: JSON.parse(trsvl.location), reviews: [], serves: [] }
                    });
                    return restaurants
                })
                break;


            case "restaurant":
                const { restaurant_id } = event.arguments as QueryRestaurantArgs
                const restaurant: Restaurant = {
                    id: "123",
                    name: "Domino",
                    location: { units: 10 },
                    reviews: [],
                    serves: []
                };
                callback(null, restaurant as Restaurant);
                break;


        }

    } catch (e) {
        console.log("Error ==>", e);
        callback(e, null);
    }


}

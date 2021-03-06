import { Callback, Context } from 'aws-lambda';
import { NewAppSyncResolverEvent } from './typeDefs';
import {
    Person, QueryPersonArgs, Restaurant, QueryRestaurantArgs, FriendsOfFriend, Query, PersonFriend,
    QueryTop_Rated_Nearest_RestaurantsArgs,
    Thumb, RestaurantReview, RestaurantCuisine, TopRatedNearestRestaurant
} from './graphql';
import { g, gremlinQueryHandler, __, P } from './gremlinQueryHandler';
import { collections, relationships } from './graphDatabaseScheme.json';


export const GQL_QUERRIES: { [P in keyof Query]: string } = {
    person: "person",
    persons: "persons",
    restaurants: "restaurants",
    restaurant: "restaurant",
    my_friends: "my_friends",
    persons_relation: "persons_relation",
    top_rated_nearest_restaurants: "top_rated_nearest_restaurants",
    newest_review_of_restaurant: "newest_review_of_restaurant",
    recommended_restaurants_by_friends: "recommended_restaurants_by_friends",
    recent_feedback_to_restaurants_by_friends: "recent_feedback_to_restaurants_by_friends",
    friends_of_my_friends: "friends_of_my_friends"
}

////////////////////////// Handler //////////////////////////
export const handler = async (event: NewAppSyncResolverEvent<any>, context: Context, callback: Callback): Promise<void> => {
    console.log("EVENT==>", event);
    const EVENT_ACTION = event.info.fieldName as keyof typeof GQL_QUERRIES;
    const USER_ID = event.identity.sub;
    // let result = {};

    try {
        switch (EVENT_ACTION) {

            case "persons":
                return gremlinQueryHandler(async () => {
                    const _person = "person"; const _friends = "friends"
                    const result = await g.V().hasLabel(collections[0].collectionName as "Person")
                        .project(_person, _friends)
                        .by(__.elementMap())
                        .by(__.out(relationships[0].name as "Friends").elementMap().fold())
                        .toList();

                    const value = result as {
                        [_person]: { id: string, _id: string, label: string, name: string, email: string },
                        [_friends]: { id: string, _id: string, label: string, name: string, email: string }[]
                    }[]
                    console.log("Result", JSON.stringify(result, null, 2))

                    const persons: Person[] = value.map((v) => ({
                        id: v[_person].id, name: v[_person].name, email: v[_person].email,
                        friends: v[_friends].map((v) => ({ person_id: v.id, person_name: v.name, person_email: v.email }))
                    }));
                    return persons;
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
                    const _review = "review"; const _restaurant = "restaurant"; const _cuisine = 'cuisine'
                    const result = await g.V().hasLabel(collections[1].collectionName as "Restaurant")
                        .as(_restaurant).as(_review).as(_cuisine)
                        .select(_restaurant, _review, _cuisine)
                        .by(__.elementMap())
                        .by(__.in_(relationships[4].name as "Are About").elementMap().fold())
                        .by(__.out(relationships[1].name as "Serves").elementMap().fold())
                        .toList();
                    /* aspect in result
                     restaurant: {id:string, label: string, name:string, location: '{\"units\":\"number\"}'}
                     review:[{id: string, label: string, text: string, datetime: number}]
                     cuisine:[{id: string, label: string, name: string }]
                     */
                    console.log("Result", JSON.stringify(result, null, 2))

                    const value = result as {
                        [_restaurant]: { id: string, label: string, name: string, location: string },
                        [_review]: { id: string, label: string, text: string, datetime: number }[],
                        [_cuisine]: { id: string, label: string, name: string }[],
                    }[]

                    const restaurants: Restaurant[] = value.map((v) => ({
                        id: v[_restaurant].id,
                        name: v[_restaurant].name,
                        location: JSON.parse(v[_restaurant].location),
                        reviews: v[_review].map<RestaurantReview>(({ id, text, datetime }) => ({
                            review_id: id, review_datetime: datetime, review_text: text
                        })),
                        serves: v[_cuisine].map<RestaurantCuisine>(({ id, name }) => ({
                            cuisine_id: id, cuisine_name: name
                        }))
                    }));
                    return restaurants
                })
                break;


            case "restaurant":
                const { restaurant_id } = event.arguments as QueryRestaurantArgs
                const restaurant: Restaurant = {
                    id: "random 123",
                    name: "Domino",
                    location: { units: 10 },
                    reviews: [],
                    serves: []
                };
                callback(null, restaurant as Restaurant);
                break;

            case "my_friends":
                return gremlinQueryHandler(async () => {
                    const result = await g.V().has(collections[0].collectionName as "Person", '_id', USER_ID)
                        .out(relationships[0].name as "Friends").elementMap().toList()
                    const value = result as { id: string, _id: string, label: string, name: string, email: string }[]

                    const myFriends: PersonFriend[] = value.map(({ id, name, email }) => ({
                        person_id: id, person_name: name, person_email: email
                    }))
                    return myFriends
                })
                break;


            case "friends_of_my_friends":
                return gremlinQueryHandler(async () => {
                    const _friend = "friend"; const _friendsOfFriend = "friendsOfFriend";
                    const result = await g.V().has(collections[0].collectionName as "Person", '_id', USER_ID)
                        .out(relationships[0].name as "Friends").project(_friend, _friendsOfFriend)
                        .by(__.elementMap()).by(__.out(relationships[0].name as "Friends").elementMap().fold())
                        .toList();

                    const value = result as {
                        [_friend]: { id: string, _id: string, label: string, name: string, email: string },
                        [_friendsOfFriend]: { id: string, _id: string, label: string, name: string, email: string }[]
                    }[]
                    console.log("Result", JSON.stringify(result, null, 2))

                    const friendsOfFriend: FriendsOfFriend[] = value.map((v) => ({
                        friend_id: v[_friend].id, friend_name: v[_friend].name, friend_email: v[_friend].email,
                        friends_of_friend: v[_friendsOfFriend].map((v) => ({ person_id: v.id, person_name: v.name, person_email: v.email }))
                    }));
                    return friendsOfFriend;
                })
                break;

            case "top_rated_nearest_restaurants":
                return gremlinQueryHandler(async () => {
                    const { person_location: { units }, limit } = event.arguments as QueryTop_Rated_Nearest_RestaurantsArgs;
                    const result = await g.V().hasLabel(collections[1].collectionName as "Restaurant")
                        .in_(relationships[4].name as "Are About")
                        .inE(relationships[3].name as "Rates").has('thumb', P.eq(Thumb.Up))
                        .inV(/* collections[3].collectionName as "Review" */)
                        .out(relationships[4].name as "Are About")
                        .hasLabel(collections[1].collectionName as "Restaurant")
                        .elementMap().toList()

                    const value = result as { id: string, label: string, name: string, location: string }[]
                    console.log("Result", JSON.stringify(result, null, 2))

                    const restaurants: TopRatedNearestRestaurant[] = value.map(({ id, name, location }) => ({
                        restaurant_id: id, restaurant_name: name, restaurant_location: JSON.parse(location),
                    }));
                    return restaurants
                })
                break;


        }

    } catch (e) {
        console.log("Error ==>", e);
        callback(e, null);
    }


}

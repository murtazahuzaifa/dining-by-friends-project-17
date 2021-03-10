import { Callback, Context } from 'aws-lambda';
import { NewAppSyncResolverEvent } from './typeDefs';
import { Person, PersonInput, Restaurant, RestaurantInput, Cuisine, CuisineInput, Rate, RateInput, Thumb, Review, ReviewInput, Mutation } from './graphql';
import { g, gremlinQueryHandler, __ } from './gremlinQueryHandler';
import { collections, relationships } from './graphDatabaseScheme.json';

export const GQL_MUTATIONS: { [P in keyof Mutation]: string } = {
    add_person: "add_person",
    add_restaurant: "add_restaurant",
    write_review_for_restaurant: "write_review_for_restaurant",
    rate_to_review: "rate_to_review",
    add_cuisine: "add_cuisine",
}

////////////////////////// Handler //////////////////////////
export const handler = async (event: NewAppSyncResolverEvent<any>, context: Context, callback: Callback) => {
    console.log("EVENT==>", event);
    const EVENT_ACTION = event.info.fieldName as keyof typeof GQL_MUTATIONS;
    const USER_ID = event.identity.sub;

    try {

        switch (EVENT_ACTION) {

            case "add_person":
                const personInput = event.arguments.input as PersonInput;
                callback(null, {
                    id: "123",
                    name: "Murtaza",
                    email: "murtaza.huzaifa2@gmail.com",
                    friends: []
                } as Person)
                break;


            case "add_restaurant":
                return gremlinQueryHandler(async () => {
                    const { name, location } = event.arguments.input as RestaurantInput;
                    // console.log('{ "units" : {{units}} }'.replace("{{units}}", `${location.units}`))
                    const result = await g.addV(collections[1].collectionName as "Restaurant")
                        .property("name", name)
                        .property("location", JSON.stringify(location))
                        .elementMap().next()
                    console.log("Result", result)
                    const value = result.value as { id: string, label: string, location: string, name: string }
                    /* aspect in value
                          {id:string, label: string, name:string, location: '{\"units\":\"number\"}'}
                         */
                    const restaurant: Restaurant = { id: value.id, name: value.name, location: JSON.parse(value.location), serves: [], reviews: [] }
                    return restaurant;
                })
                break;


            case "add_cuisine":
                return gremlinQueryHandler(async () => {
                    const { name, restaurantId } = event.arguments.input as CuisineInput;
                    // console.log('{ "units" : {{units}} }'.replace("{{units}}", `${location.units}`))
                    const result = await g.addV(collections[2].collectionName as "Cuisine")
                        .property("name", name).as('cuisine')
                        .V(restaurantId).as('restaurant')
                        .addE(relationships[1].name as "Serves")
                        .from_('restaurant').to('cuisine')
                        .select("cuisine", "restaurant")
                        .by(__.elementMap()).by(__.elementMap())
                        .next()
                    console.log("Result", result)
                    const v = result.value as {
                        cuisine: { id: string, label: string, name: string },
                        restaurant: { id: string, label: string, name: string, location: string }
                    }
                    /* aspect in value
                          {
                              cuisine: {id:string, label: string, name:string},
                              restaurant : {id:string, label: string, name:string, location: '{"units":number}'},
                          }
                         */
                    const cuisine: Cuisine = {
                        id: v.cuisine.id, name: v.cuisine.name, servedBy: {
                            restaurant_id: v.restaurant.id,
                            restaurant_location: JSON.parse(v.restaurant.location),
                            restaurant_name: v.restaurant.name
                        }
                    }
                    return cuisine;
                })
                break;


            case "write_review_for_restaurant":
                return gremlinQueryHandler(async () => {
                    const _person = "person"; const _review = "review"; const _restaurant = "restaurant";
                    const { restaurantId, text } = event.arguments.input as ReviewInput;
                    const result = await g.addV(collections[3].collectionName as "Review")
                        .property("text", text).property("datetime", new Date().getTime()).as(_review)
                        .V().has(collections[0].collectionName as "Person", '_id', USER_ID).as(_person)
                        .V(restaurantId).as(_restaurant)
                        .addE(relationships[2].name as "Writes")
                        .from_(_person).to(_review)
                        .addE(relationships[4].name as "Are About")
                        .from_(_review).to(_restaurant)
                        .select(_person, _review, _restaurant)
                        .by(__.elementMap()).by(__.elementMap()).by(__.elementMap())
                        .next()
                    console.log("Result", result)
                    const v = result.value as {
                        [_review]: { id: string, label: string, text: string, datetime: number },
                        [_restaurant]: { id: string, label: string, name: string, location: string },
                        [_person]: { id: string, _id: string, label: string, name: string, email: string }
                    }
                    const review: Review = {
                        id: v[_review].id,
                        text: v[_review].text,
                        datetime: v[_review].datetime,
                        isAbout: { restaurant_id: v[_restaurant].id, restaurant_location: JSON.parse(v[_restaurant].location), restaurant_name: v[_restaurant].name },
                        wroteBy: { person_id: v[_person].id, person_name: v[_person].name, person_email: v[_person].email },
                        rating: [],
                    }
                    return review;
                })
                break;


            case "rate_to_review":
                const rateInput = event.arguments.input as RateInput;
                callback(null, {
                    id: "23423",
                    datetime: new Date().getTime(),
                    givenBy: { person_id: "123", person_name: "Murtaza", person_email: "murtaza@gmail.com" },
                    givenTo: { review_datetime: new Date().getTime(), review_id: "123", review_text: "this is a good restaurant" },
                    thumb: Thumb.Up,
                } as Rate)
                break;




        }

    } catch (e) {
        console.log("Error ==>", e);
        callback(e, null)

    }


}
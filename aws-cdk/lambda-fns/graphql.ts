import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Person = {
  __typename?: 'Person';
  id: Scalars['ID'];
  name: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  friends?: Maybe<Array<Maybe<PersonFriend>>>;
};

export type Restaurant = {
  __typename?: 'Restaurant';
  id: Scalars['ID'];
  name: Scalars['String'];
  serves?: Maybe<Array<Maybe<RestaurantCuisine>>>;
  reviews?: Maybe<Array<Maybe<RestaurantReview>>>;
  location: Location;
};

export type Cuisine = {
  __typename?: 'Cuisine';
  id: Scalars['ID'];
  name: Scalars['String'];
  servedBy: CuisineServeByRestaurant;
};

export type Review = {
  __typename?: 'Review';
  id: Scalars['ID'];
  text: Scalars['String'];
  datetime: Scalars['Float'];
  wroteBy: ReviewByPerson;
  rating?: Maybe<Array<Maybe<ReviewRating>>>;
  isAbout: ReviewAboutRestaurant;
};

export type Rate = {
  __typename?: 'Rate';
  id: Scalars['ID'];
  thumb: Thumb;
  givenBy: RateByPerson;
  givenTo: RateToReview;
  datetime: Scalars['Float'];
};

export type RestaurantCuisine = {
  __typename?: 'RestaurantCuisine';
  cuisine_id: Scalars['ID'];
  cuisine_name: Scalars['String'];
};

export type RestaurantReview = {
  __typename?: 'RestaurantReview';
  review_id: Scalars['ID'];
  review_text: Scalars['String'];
  review_datetime: Scalars['Float'];
};

export type ReviewAboutRestaurant = {
  __typename?: 'ReviewAboutRestaurant';
  restaurant_id: Scalars['ID'];
  restaurant_name: Scalars['String'];
  restaurant_location: Location;
};

export type ReviewRating = {
  __typename?: 'ReviewRating';
  rate_id: Scalars['ID'];
  rate_thumb: Thumb;
  rate_datetime: Scalars['Float'];
};

export type ReviewByPerson = {
  __typename?: 'ReviewByPerson';
  person_id: Scalars['ID'];
  person_name: Scalars['String'];
  person_email?: Maybe<Scalars['String']>;
};

export type PersonFriend = {
  __typename?: 'PersonFriend';
  person_id: Scalars['ID'];
  person_name: Scalars['String'];
  person_email?: Maybe<Scalars['String']>;
};

export type RateByPerson = {
  __typename?: 'RateByPerson';
  person_id: Scalars['ID'];
  person_name: Scalars['String'];
  person_email?: Maybe<Scalars['String']>;
};

export type RateToReview = {
  __typename?: 'RateToReview';
  review_id: Scalars['ID'];
  review_text: Scalars['String'];
  review_datetime: Scalars['Float'];
};

export type CuisineServeByRestaurant = {
  __typename?: 'CuisineServeByRestaurant';
  restaurant_id: Scalars['ID'];
  restaurant_name: Scalars['String'];
  restaurant_location: Location;
};

export type Query = {
  __typename?: 'Query';
  person: Person;
  persons?: Maybe<Array<Maybe<Person>>>;
  restaurants?: Maybe<Array<Maybe<Restaurant>>>;
  restaurant?: Maybe<Restaurant>;
  person_friends?: Maybe<Array<Maybe<PersonFriend>>>;
  persons_relation: PersonsRelation;
  top_rated_nearest_restaurants?: Maybe<Array<Maybe<TopRatedNearestRestaurant>>>;
  newest_review_of_restaurant?: Maybe<Review>;
  recommended_restaurants_by_friends?: Maybe<Array<Maybe<RecommendedRestaurant>>>;
  recent_feedback_to_restaurants_by_friends?: Maybe<Array<Maybe<RecommendedRestaurant>>>;
};


export type QueryPersonArgs = {
  person_id: Scalars['ID'];
};


export type QueryRestaurantArgs = {
  restaurant_id: Scalars['ID'];
};


export type QueryPerson_FriendsArgs = {
  person_id?: Maybe<Scalars['ID']>;
};


export type QueryPersons_RelationArgs = {
  person_x_id?: Maybe<Scalars['ID']>;
  person_y_id?: Maybe<Scalars['ID']>;
};


export type QueryTop_Rated_Nearest_RestaurantsArgs = {
  location: LocationInput;
  limit?: Maybe<Scalars['Int']>;
};


export type QueryNewest_Review_Of_RestaurantArgs = {
  restaurant_id?: Maybe<Scalars['ID']>;
};


export type QueryRecommended_Restaurants_By_FriendsArgs = {
  person_id: Scalars['ID'];
};


export type QueryRecent_Feedback_To_Restaurants_By_FriendsArgs = {
  person_id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  add_person: Person;
  add_restaurant: Restaurant;
  write_review_for_restaurant: Review;
  rate_to_review: Rate;
  add_cuisine: Cuisine;
};


export type MutationAdd_PersonArgs = {
  input: PersonInput;
};


export type MutationAdd_RestaurantArgs = {
  input: RestaurantInput;
};


export type MutationWrite_Review_For_RestaurantArgs = {
  input?: Maybe<ReviewInput>;
};


export type MutationRate_To_ReviewArgs = {
  input?: Maybe<RateInput>;
};


export type MutationAdd_CuisineArgs = {
  input?: Maybe<CuisineInput>;
};

export type PersonInput = {
  name: Scalars['String'];
  email?: Maybe<Scalars['String']>;
};

export type RestaurantInput = {
  name: Scalars['String'];
  location: LocationInput;
};

export type CuisineInput = {
  name: Scalars['String'];
  restaurantId: Scalars['ID'];
};

export type ReviewInput = {
  text: Scalars['String'];
  restaurantId: Scalars['ID'];
};

export type RateInput = {
  thumb: Thumb;
  personId: Scalars['ID'];
  reviewId: Scalars['ID'];
  datetime: Scalars['Float'];
};

export type Location = {
  __typename?: 'Location';
  units: Scalars['Int'];
};

export type LocationInput = {
  units?: Maybe<Scalars['Int']>;
};

export enum PersonsRelation {
  Friends = 'FRIENDS',
  FriendOfFriend = 'FRIEND_OF_FRIEND',
  Unknown = 'UNKNOWN'
}

export enum Thumb {
  Up = 'UP',
  Down = 'DOWN'
}

export type TopRatedNearestRestaurant = {
  __typename?: 'TopRatedNearestRestaurant';
  restaurant_id: Scalars['ID'];
  restaurant_name: Scalars['String'];
  restaurant_location: Location;
};

export type RecommendedRestaurant = {
  __typename?: 'RecommendedRestaurant';
  restaurant_id: Scalars['ID'];
  restaurant_name: Scalars['String'];
  restaurant_location: Location;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Person: ResolverTypeWrapper<Person>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Restaurant: ResolverTypeWrapper<Restaurant>;
  Cuisine: ResolverTypeWrapper<Cuisine>;
  Review: ResolverTypeWrapper<Review>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Rate: ResolverTypeWrapper<Rate>;
  RestaurantCuisine: ResolverTypeWrapper<RestaurantCuisine>;
  RestaurantReview: ResolverTypeWrapper<RestaurantReview>;
  ReviewAboutRestaurant: ResolverTypeWrapper<ReviewAboutRestaurant>;
  ReviewRating: ResolverTypeWrapper<ReviewRating>;
  ReviewByPerson: ResolverTypeWrapper<ReviewByPerson>;
  PersonFriend: ResolverTypeWrapper<PersonFriend>;
  RateByPerson: ResolverTypeWrapper<RateByPerson>;
  RateToReview: ResolverTypeWrapper<RateToReview>;
  CuisineServeByRestaurant: ResolverTypeWrapper<CuisineServeByRestaurant>;
  Query: ResolverTypeWrapper<{}>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  PersonInput: PersonInput;
  RestaurantInput: RestaurantInput;
  CuisineInput: CuisineInput;
  ReviewInput: ReviewInput;
  RateInput: RateInput;
  Location: ResolverTypeWrapper<Location>;
  LocationInput: LocationInput;
  PersonsRelation: PersonsRelation;
  Thumb: Thumb;
  TopRatedNearestRestaurant: ResolverTypeWrapper<TopRatedNearestRestaurant>;
  RecommendedRestaurant: ResolverTypeWrapper<RecommendedRestaurant>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Person: Person;
  ID: Scalars['ID'];
  String: Scalars['String'];
  Restaurant: Restaurant;
  Cuisine: Cuisine;
  Review: Review;
  Float: Scalars['Float'];
  Rate: Rate;
  RestaurantCuisine: RestaurantCuisine;
  RestaurantReview: RestaurantReview;
  ReviewAboutRestaurant: ReviewAboutRestaurant;
  ReviewRating: ReviewRating;
  ReviewByPerson: ReviewByPerson;
  PersonFriend: PersonFriend;
  RateByPerson: RateByPerson;
  RateToReview: RateToReview;
  CuisineServeByRestaurant: CuisineServeByRestaurant;
  Query: {};
  Int: Scalars['Int'];
  Mutation: {};
  PersonInput: PersonInput;
  RestaurantInput: RestaurantInput;
  CuisineInput: CuisineInput;
  ReviewInput: ReviewInput;
  RateInput: RateInput;
  Location: Location;
  LocationInput: LocationInput;
  TopRatedNearestRestaurant: TopRatedNearestRestaurant;
  RecommendedRestaurant: RecommendedRestaurant;
  Boolean: Scalars['Boolean'];
};

export type PersonResolvers<ContextType = any, ParentType extends ResolversParentTypes['Person'] = ResolversParentTypes['Person']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  friends?: Resolver<Maybe<Array<Maybe<ResolversTypes['PersonFriend']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RestaurantResolvers<ContextType = any, ParentType extends ResolversParentTypes['Restaurant'] = ResolversParentTypes['Restaurant']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  serves?: Resolver<Maybe<Array<Maybe<ResolversTypes['RestaurantCuisine']>>>, ParentType, ContextType>;
  reviews?: Resolver<Maybe<Array<Maybe<ResolversTypes['RestaurantReview']>>>, ParentType, ContextType>;
  location?: Resolver<ResolversTypes['Location'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CuisineResolvers<ContextType = any, ParentType extends ResolversParentTypes['Cuisine'] = ResolversParentTypes['Cuisine']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  servedBy?: Resolver<ResolversTypes['CuisineServeByRestaurant'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReviewResolvers<ContextType = any, ParentType extends ResolversParentTypes['Review'] = ResolversParentTypes['Review']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  datetime?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  wroteBy?: Resolver<ResolversTypes['ReviewByPerson'], ParentType, ContextType>;
  rating?: Resolver<Maybe<Array<Maybe<ResolversTypes['ReviewRating']>>>, ParentType, ContextType>;
  isAbout?: Resolver<ResolversTypes['ReviewAboutRestaurant'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RateResolvers<ContextType = any, ParentType extends ResolversParentTypes['Rate'] = ResolversParentTypes['Rate']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  thumb?: Resolver<ResolversTypes['Thumb'], ParentType, ContextType>;
  givenBy?: Resolver<ResolversTypes['RateByPerson'], ParentType, ContextType>;
  givenTo?: Resolver<ResolversTypes['RateToReview'], ParentType, ContextType>;
  datetime?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RestaurantCuisineResolvers<ContextType = any, ParentType extends ResolversParentTypes['RestaurantCuisine'] = ResolversParentTypes['RestaurantCuisine']> = {
  cuisine_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cuisine_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RestaurantReviewResolvers<ContextType = any, ParentType extends ResolversParentTypes['RestaurantReview'] = ResolversParentTypes['RestaurantReview']> = {
  review_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  review_text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  review_datetime?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReviewAboutRestaurantResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReviewAboutRestaurant'] = ResolversParentTypes['ReviewAboutRestaurant']> = {
  restaurant_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  restaurant_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  restaurant_location?: Resolver<ResolversTypes['Location'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReviewRatingResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReviewRating'] = ResolversParentTypes['ReviewRating']> = {
  rate_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  rate_thumb?: Resolver<ResolversTypes['Thumb'], ParentType, ContextType>;
  rate_datetime?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReviewByPersonResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReviewByPerson'] = ResolversParentTypes['ReviewByPerson']> = {
  person_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  person_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  person_email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PersonFriendResolvers<ContextType = any, ParentType extends ResolversParentTypes['PersonFriend'] = ResolversParentTypes['PersonFriend']> = {
  person_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  person_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  person_email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RateByPersonResolvers<ContextType = any, ParentType extends ResolversParentTypes['RateByPerson'] = ResolversParentTypes['RateByPerson']> = {
  person_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  person_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  person_email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RateToReviewResolvers<ContextType = any, ParentType extends ResolversParentTypes['RateToReview'] = ResolversParentTypes['RateToReview']> = {
  review_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  review_text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  review_datetime?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CuisineServeByRestaurantResolvers<ContextType = any, ParentType extends ResolversParentTypes['CuisineServeByRestaurant'] = ResolversParentTypes['CuisineServeByRestaurant']> = {
  restaurant_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  restaurant_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  restaurant_location?: Resolver<ResolversTypes['Location'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  person?: Resolver<ResolversTypes['Person'], ParentType, ContextType, RequireFields<QueryPersonArgs, 'person_id'>>;
  persons?: Resolver<Maybe<Array<Maybe<ResolversTypes['Person']>>>, ParentType, ContextType>;
  restaurants?: Resolver<Maybe<Array<Maybe<ResolversTypes['Restaurant']>>>, ParentType, ContextType>;
  restaurant?: Resolver<Maybe<ResolversTypes['Restaurant']>, ParentType, ContextType, RequireFields<QueryRestaurantArgs, 'restaurant_id'>>;
  person_friends?: Resolver<Maybe<Array<Maybe<ResolversTypes['PersonFriend']>>>, ParentType, ContextType, RequireFields<QueryPerson_FriendsArgs, never>>;
  persons_relation?: Resolver<ResolversTypes['PersonsRelation'], ParentType, ContextType, RequireFields<QueryPersons_RelationArgs, never>>;
  top_rated_nearest_restaurants?: Resolver<Maybe<Array<Maybe<ResolversTypes['TopRatedNearestRestaurant']>>>, ParentType, ContextType, RequireFields<QueryTop_Rated_Nearest_RestaurantsArgs, 'location'>>;
  newest_review_of_restaurant?: Resolver<Maybe<ResolversTypes['Review']>, ParentType, ContextType, RequireFields<QueryNewest_Review_Of_RestaurantArgs, never>>;
  recommended_restaurants_by_friends?: Resolver<Maybe<Array<Maybe<ResolversTypes['RecommendedRestaurant']>>>, ParentType, ContextType, RequireFields<QueryRecommended_Restaurants_By_FriendsArgs, 'person_id'>>;
  recent_feedback_to_restaurants_by_friends?: Resolver<Maybe<Array<Maybe<ResolversTypes['RecommendedRestaurant']>>>, ParentType, ContextType, RequireFields<QueryRecent_Feedback_To_Restaurants_By_FriendsArgs, 'person_id'>>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  add_person?: Resolver<ResolversTypes['Person'], ParentType, ContextType, RequireFields<MutationAdd_PersonArgs, 'input'>>;
  add_restaurant?: Resolver<ResolversTypes['Restaurant'], ParentType, ContextType, RequireFields<MutationAdd_RestaurantArgs, 'input'>>;
  write_review_for_restaurant?: Resolver<ResolversTypes['Review'], ParentType, ContextType, RequireFields<MutationWrite_Review_For_RestaurantArgs, never>>;
  rate_to_review?: Resolver<ResolversTypes['Rate'], ParentType, ContextType, RequireFields<MutationRate_To_ReviewArgs, never>>;
  add_cuisine?: Resolver<ResolversTypes['Cuisine'], ParentType, ContextType, RequireFields<MutationAdd_CuisineArgs, never>>;
};

export type LocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location']> = {
  units?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TopRatedNearestRestaurantResolvers<ContextType = any, ParentType extends ResolversParentTypes['TopRatedNearestRestaurant'] = ResolversParentTypes['TopRatedNearestRestaurant']> = {
  restaurant_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  restaurant_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  restaurant_location?: Resolver<ResolversTypes['Location'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RecommendedRestaurantResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecommendedRestaurant'] = ResolversParentTypes['RecommendedRestaurant']> = {
  restaurant_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  restaurant_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  restaurant_location?: Resolver<ResolversTypes['Location'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Person?: PersonResolvers<ContextType>;
  Restaurant?: RestaurantResolvers<ContextType>;
  Cuisine?: CuisineResolvers<ContextType>;
  Review?: ReviewResolvers<ContextType>;
  Rate?: RateResolvers<ContextType>;
  RestaurantCuisine?: RestaurantCuisineResolvers<ContextType>;
  RestaurantReview?: RestaurantReviewResolvers<ContextType>;
  ReviewAboutRestaurant?: ReviewAboutRestaurantResolvers<ContextType>;
  ReviewRating?: ReviewRatingResolvers<ContextType>;
  ReviewByPerson?: ReviewByPersonResolvers<ContextType>;
  PersonFriend?: PersonFriendResolvers<ContextType>;
  RateByPerson?: RateByPersonResolvers<ContextType>;
  RateToReview?: RateToReviewResolvers<ContextType>;
  CuisineServeByRestaurant?: CuisineServeByRestaurantResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Location?: LocationResolvers<ContextType>;
  TopRatedNearestRestaurant?: TopRatedNearestRestaurantResolvers<ContextType>;
  RecommendedRestaurant?: RecommendedRestaurantResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;

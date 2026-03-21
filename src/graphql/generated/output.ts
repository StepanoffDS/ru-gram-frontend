import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type ChangeEmailInput = {
  newEmail: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type ChangePasswordInput = {
  confirmNewPassword: Scalars['String']['input'];
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type ChangeProfileInfoInput = {
  bio: Scalars['String']['input'];
  name: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type ChangeRoleInput = {
  id: Scalars['String']['input'];
  role: Scalars['String']['input'];
};

export type ChatModel = {
  __typename?: 'ChatModel';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  messages: Array<MessageModel>;
  unreadCount: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  users: Array<UserModel>;
};

export type CreateChatInput = {
  userIds: Array<Scalars['String']['input']>;
};

export type CreateMessageInput = {
  content: Scalars['String']['input'];
  images?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreatePostInput = {
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type FilterPostsInput = {
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type FilterUsersInput = {
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type LikeResponseModel = {
  __typename?: 'LikeResponseModel';
  isLiked: Scalars['Boolean']['output'];
  likesCount: Scalars['Int']['output'];
};

export type LikedUserModel = {
  __typename?: 'LikedUserModel';
  avatar?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  likedAt: Scalars['DateTime']['output'];
  name?: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
};

export type LikesPaginationInput = {
  skip?: Scalars['Int']['input'];
  take?: Scalars['Int']['input'];
};

export type LoginInput = {
  login: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MessageModel = {
  __typename?: 'MessageModel';
  chatId: Scalars['ID']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  images: Array<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user: UserModel;
  userId: Scalars['ID']['output'];
};

export type MessagesPaginationInput = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  changeEmail: Scalars['Boolean']['output'];
  changePassword: Scalars['Boolean']['output'];
  changeProfileInfo: Scalars['Boolean']['output'];
  changeRole: UserModel;
  createMessage: MessageModel;
  createOrFindChat: ChatModel;
  createPost: PostModel;
  createUser: Scalars['Boolean']['output'];
  deleteMessage: Scalars['Boolean']['output'];
  deletePost: Scalars['Boolean']['output'];
  deleteProfile: Scalars['Boolean']['output'];
  followUser: Scalars['Boolean']['output'];
  loginUser: UserModel;
  logoutUser: Scalars['String']['output'];
  markChatAsRead: Scalars['Boolean']['output'];
  toggleHidePost: PostModel;
  toggleLikePost: LikeResponseModel;
  unfollowUser: Scalars['Boolean']['output'];
  updatePost: PostModel;
};


export type MutationChangeEmailArgs = {
  data: ChangeEmailInput;
};


export type MutationChangePasswordArgs = {
  data: ChangePasswordInput;
};


export type MutationChangeProfileInfoArgs = {
  data: ChangeProfileInfoInput;
};


export type MutationChangeRoleArgs = {
  data: ChangeRoleInput;
};


export type MutationCreateMessageArgs = {
  chatId: Scalars['String']['input'];
  data: CreateMessageInput;
};


export type MutationCreateOrFindChatArgs = {
  data: CreateChatInput;
};


export type MutationCreatePostArgs = {
  data: CreatePostInput;
};


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};


export type MutationDeleteMessageArgs = {
  messageId: Scalars['String']['input'];
};


export type MutationDeletePostArgs = {
  id: Scalars['String']['input'];
};


export type MutationFollowUserArgs = {
  userId: Scalars['String']['input'];
};


export type MutationLoginUserArgs = {
  data: LoginInput;
};


export type MutationMarkChatAsReadArgs = {
  chatId: Scalars['String']['input'];
};


export type MutationToggleHidePostArgs = {
  postId: Scalars['String']['input'];
};


export type MutationToggleLikePostArgs = {
  postId: Scalars['String']['input'];
};


export type MutationUnfollowUserArgs = {
  userId: Scalars['String']['input'];
};


export type MutationUpdatePostArgs = {
  data: UpdatePostInput;
  id: Scalars['String']['input'];
};

export type PaginatedLikedUsersModel = {
  __typename?: 'PaginatedLikedUsersModel';
  data: Array<LikedUserModel>;
  hasMore: Scalars['Boolean']['output'];
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PaginatedUsersModel = {
  __typename?: 'PaginatedUsersModel';
  data: Array<UserPreviewModel>;
  hasMore: Scalars['Boolean']['output'];
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PostLikesModel = {
  __typename?: 'PostLikesModel';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  post: PostModel;
  postId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: UserModel;
  userId: Scalars['String']['output'];
};

export type PostModel = {
  __typename?: 'PostModel';
  createdAt: Scalars['DateTime']['output'];
  hidden: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  images?: Maybe<Array<Scalars['String']['output']>>;
  isLiked?: Maybe<Scalars['Boolean']['output']>;
  isMyPost?: Maybe<Scalars['Boolean']['output']>;
  likes: Scalars['Int']['output'];
  postLikes: Array<PostLikesModel>;
  text?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user: UserModel;
  userId: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  findAllByFollowing: Array<PostModel>;
  findAllByMe: Array<PostModel>;
  findAllByMeHidden: Array<PostModel>;
  findAllByUsername: Array<PostModel>;
  findAllChatsByMe: Array<ChatModel>;
  findAllPosts: Array<PostModel>;
  findAllUsers: Array<UserModel>;
  findChatById: ChatModel;
  findMe: UserModel;
  findMessagesByChatId: Array<MessageModel>;
  findOneById: PostModel;
  findOneByUsername: UserModel;
  getFollowers: PaginatedUsersModel;
  getFollowersCount: Scalars['Int']['output'];
  getFollowing: PaginatedUsersModel;
  getFollowingCount: Scalars['Int']['output'];
  getLikedUsersByPost: PaginatedLikedUsersModel;
  isFollowing: Scalars['Boolean']['output'];
};


export type QueryFindAllByFollowingArgs = {
  filter: FilterPostsInput;
};


export type QueryFindAllByMeArgs = {
  filter: FilterPostsInput;
};


export type QueryFindAllByMeHiddenArgs = {
  filter: FilterPostsInput;
};


export type QueryFindAllByUsernameArgs = {
  filter: FilterPostsInput;
  username: Scalars['String']['input'];
};


export type QueryFindAllPostsArgs = {
  filter: FilterPostsInput;
};


export type QueryFindAllUsersArgs = {
  filter: FilterUsersInput;
};


export type QueryFindChatByIdArgs = {
  chatId: Scalars['String']['input'];
};


export type QueryFindMessagesByChatIdArgs = {
  chatId: Scalars['String']['input'];
  pagination?: InputMaybe<MessagesPaginationInput>;
};


export type QueryFindOneByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryFindOneByUsernameArgs = {
  username: Scalars['String']['input'];
};


export type QueryGetFollowersArgs = {
  skip?: Scalars['Int']['input'];
  take?: Scalars['Int']['input'];
  userId: Scalars['String']['input'];
};


export type QueryGetFollowersCountArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetFollowingArgs = {
  skip?: Scalars['Int']['input'];
  take?: Scalars['Int']['input'];
  userId: Scalars['String']['input'];
};


export type QueryGetFollowingCountArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetLikedUsersByPostArgs = {
  pagination?: LikesPaginationInput;
  postId: Scalars['String']['input'];
};


export type QueryIsFollowingArgs = {
  userId: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  messageCreated: MessageModel;
  messageCreatedForUser: MessageModel;
  messageDeleted: Scalars['String']['output'];
};


export type SubscriptionMessageCreatedArgs = {
  chatId: Scalars['String']['input'];
};

export type UpdatePostInput = {
  text: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type UserModel = {
  __typename?: 'UserModel';
  avatar?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  followersCount?: Maybe<Scalars['Int']['output']>;
  followingCount?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  isFollowing?: Maybe<Scalars['Boolean']['output']>;
  isMe: Scalars['Boolean']['output'];
  name?: Maybe<Scalars['String']['output']>;
  password: Scalars['String']['output'];
  postLikes: Array<PostLikesModel>;
  posts: Array<PostModel>;
  postsCount?: Maybe<Scalars['Int']['output']>;
  role: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export type UserPreviewModel = {
  __typename?: 'UserPreviewModel';
  avatar?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  followedAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
};

export type CreateUserMutationVariables = Exact<{
  data: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: boolean };

export type LoginUserMutationVariables = Exact<{
  data: LoginInput;
}>;


export type LoginUserMutation = { __typename?: 'Mutation', loginUser: { __typename?: 'UserModel', id: string, email: string, username: string, name?: string | null, avatar?: string | null, bio?: string | null, role: string } };

export type LogoutUserMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutUserMutation = { __typename?: 'Mutation', logoutUser: string };

export type CreateMessageMutationVariables = Exact<{
  chatId: Scalars['String']['input'];
  data: CreateMessageInput;
}>;


export type CreateMessageMutation = { __typename?: 'Mutation', createMessage: { __typename?: 'MessageModel', id: string, content: string, images: Array<string>, createdAt: any, updatedAt: any, user: { __typename?: 'UserModel', id: string, username: string, name?: string | null, avatar?: string | null } } };

export type CreateOrFindChatMutationVariables = Exact<{
  data: CreateChatInput;
}>;


export type CreateOrFindChatMutation = { __typename?: 'Mutation', createOrFindChat: { __typename?: 'ChatModel', id: string, createdAt: any, updatedAt: any, users: Array<{ __typename?: 'UserModel', id: string, username: string, name?: string | null, avatar?: string | null }>, messages: Array<{ __typename?: 'MessageModel', id: string, content: string, images: Array<string>, createdAt: any, user: { __typename?: 'UserModel', id: string, username: string, name?: string | null, avatar?: string | null } }> } };

export type MarkChatAsReadMutationVariables = Exact<{
  chatId: Scalars['String']['input'];
}>;


export type MarkChatAsReadMutation = { __typename?: 'Mutation', markChatAsRead: boolean };

export type FollowUserMutationVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type FollowUserMutation = { __typename?: 'Mutation', followUser: boolean };

export type UnfollowUserMutationVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type UnfollowUserMutation = { __typename?: 'Mutation', unfollowUser: boolean };

export type CreatePostMutationVariables = Exact<{
  data: CreatePostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'PostModel', id: string, title?: string | null, text?: string | null, images?: Array<string> | null } };

export type DeletePostMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: boolean };

export type ToggleHidePostMutationVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type ToggleHidePostMutation = { __typename?: 'Mutation', toggleHidePost: { __typename?: 'PostModel', id: string, hidden: boolean } };

export type ToggleLikePostMutationVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type ToggleLikePostMutation = { __typename?: 'Mutation', toggleLikePost: { __typename?: 'LikeResponseModel', isLiked: boolean, likesCount: number } };

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['String']['input'];
  data: UpdatePostInput;
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', updatePost: { __typename?: 'PostModel', id: string, title?: string | null, text?: string | null, images?: Array<string> | null, hidden: boolean, likes: number, isLiked?: boolean | null, userId: string, createdAt: any, updatedAt: any, user: { __typename?: 'UserModel', id: string, username: string, name?: string | null, avatar?: string | null } } };

export type ChangeProfileInfoMutationVariables = Exact<{
  data: ChangeProfileInfoInput;
}>;


export type ChangeProfileInfoMutation = { __typename?: 'Mutation', changeProfileInfo: boolean };

export type DeleteProfileMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteProfileMutation = { __typename?: 'Mutation', deleteProfile: boolean };

export type ChangeRoleMutationVariables = Exact<{
  data: ChangeRoleInput;
}>;


export type ChangeRoleMutation = { __typename?: 'Mutation', changeRole: { __typename?: 'UserModel', id: string, role: string, username: string } };

export type FindAllChatsByMeQueryVariables = Exact<{ [key: string]: never; }>;


export type FindAllChatsByMeQuery = { __typename?: 'Query', findAllChatsByMe: Array<{ __typename?: 'ChatModel', id: string, createdAt: any, updatedAt: any, unreadCount: number, users: Array<{ __typename?: 'UserModel', id: string, username: string, name?: string | null, avatar?: string | null }>, messages: Array<{ __typename?: 'MessageModel', id: string, content: string, images: Array<string>, createdAt: any, user: { __typename?: 'UserModel', id: string, username: string, name?: string | null, avatar?: string | null } }> }> };

export type FindMessagesByChatIdQueryVariables = Exact<{
  chatId: Scalars['String']['input'];
  pagination?: InputMaybe<MessagesPaginationInput>;
}>;


export type FindMessagesByChatIdQuery = { __typename?: 'Query', findMessagesByChatId: Array<{ __typename?: 'MessageModel', id: string, content: string, images: Array<string>, createdAt: any, updatedAt: any, user: { __typename?: 'UserModel', id: string, username: string, name?: string | null, avatar?: string | null } }> };

export type FindAllByFollowingQueryVariables = Exact<{
  filter: FilterPostsInput;
}>;


export type FindAllByFollowingQuery = { __typename?: 'Query', findAllByFollowing: Array<{ __typename?: 'PostModel', id: string, title?: string | null, text?: string | null, images?: Array<string> | null, hidden: boolean, createdAt: any, updatedAt: any, isLiked?: boolean | null, likes: number, isMyPost?: boolean | null, user: { __typename?: 'UserModel', id: string, username: string, name?: string | null, avatar?: string | null } }> };

export type GetFollowersQueryVariables = Exact<{
  userId: Scalars['String']['input'];
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetFollowersQuery = { __typename?: 'Query', getFollowers: { __typename?: 'PaginatedUsersModel', total: number, skip: number, take: number, hasMore: boolean, data: Array<{ __typename?: 'UserPreviewModel', id: string, username: string, name?: string | null, avatar?: string | null, bio?: string | null, followedAt: any }> } };

export type GetFollowersCountQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetFollowersCountQuery = { __typename?: 'Query', getFollowersCount: number };

export type GetFollowingQueryVariables = Exact<{
  userId: Scalars['String']['input'];
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetFollowingQuery = { __typename?: 'Query', getFollowing: { __typename?: 'PaginatedUsersModel', total: number, skip: number, take: number, hasMore: boolean, data: Array<{ __typename?: 'UserPreviewModel', id: string, username: string, name?: string | null, avatar?: string | null, bio?: string | null, followedAt: any }> } };

export type GetFollowingCountQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetFollowingCountQuery = { __typename?: 'Query', getFollowingCount: number };

export type FindAllByMeQueryVariables = Exact<{
  filter: FilterPostsInput;
}>;


export type FindAllByMeQuery = { __typename?: 'Query', findAllByMe: Array<{ __typename?: 'PostModel', id: string, title?: string | null, text?: string | null, images?: Array<string> | null, hidden: boolean, createdAt: any, updatedAt: any, isLiked?: boolean | null, likes: number, isMyPost?: boolean | null, user: { __typename?: 'UserModel', id: string, username: string, name?: string | null, avatar?: string | null } }> };

export type FindAllByMeHiddenQueryVariables = Exact<{
  filter: FilterPostsInput;
}>;


export type FindAllByMeHiddenQuery = { __typename?: 'Query', findAllByMeHidden: Array<{ __typename?: 'PostModel', id: string, title?: string | null, text?: string | null, images?: Array<string> | null, createdAt: any, updatedAt: any, isLiked?: boolean | null, likes: number, user: { __typename?: 'UserModel', id: string, username: string, name?: string | null, avatar?: string | null } }> };

export type FindAllByUsernameQueryVariables = Exact<{
  filter: FilterPostsInput;
  username: Scalars['String']['input'];
}>;


export type FindAllByUsernameQuery = { __typename?: 'Query', findAllByUsername: Array<{ __typename?: 'PostModel', id: string, title?: string | null, text?: string | null, images?: Array<string> | null, createdAt: any, updatedAt: any, isLiked?: boolean | null, likes: number, hidden: boolean, isMyPost?: boolean | null, user: { __typename?: 'UserModel', id: string, username: string, name?: string | null, avatar?: string | null, role: string } }> };

export type FindAllPostsQueryVariables = Exact<{
  filter: FilterPostsInput;
}>;


export type FindAllPostsQuery = { __typename?: 'Query', findAllPosts: Array<{ __typename?: 'PostModel', id: string, title?: string | null, text?: string | null, images?: Array<string> | null, hidden: boolean, createdAt: any, updatedAt: any, isLiked?: boolean | null, likes: number, isMyPost?: boolean | null, user: { __typename?: 'UserModel', id: string, username: string, name?: string | null, avatar?: string | null } }> };

export type FindAllUsersQueryVariables = Exact<{
  filter: FilterUsersInput;
}>;


export type FindAllUsersQuery = { __typename?: 'Query', findAllUsers: Array<{ __typename?: 'UserModel', id: string, email: string, username: string, name?: string | null, avatar?: string | null, bio?: string | null, role: string, createdAt: any, updatedAt: any }> };

export type FindMeQueryVariables = Exact<{ [key: string]: never; }>;


export type FindMeQuery = { __typename?: 'Query', findMe: { __typename?: 'UserModel', id: string, username: string, name?: string | null, avatar?: string | null, bio?: string | null, role: string, followersCount?: number | null, followingCount?: number | null } };

export type FindOneByUsernameQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type FindOneByUsernameQuery = { __typename?: 'Query', findOneByUsername: { __typename?: 'UserModel', id: string, username: string, name?: string | null, avatar?: string | null, bio?: string | null, role: string, isMe: boolean, followersCount?: number | null, followingCount?: number | null, postsCount?: number | null, isFollowing?: boolean | null } };

export type MessageCreatedSubscriptionVariables = Exact<{
  chatId: Scalars['String']['input'];
}>;


export type MessageCreatedSubscription = { __typename?: 'Subscription', messageCreated: { __typename?: 'MessageModel', id: string, content: string, images: Array<string>, createdAt: any, updatedAt: any, user: { __typename?: 'UserModel', id: string, username: string, name?: string | null, avatar?: string | null } } };

export type MessageCreatedForUserSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type MessageCreatedForUserSubscription = { __typename?: 'Subscription', messageCreatedForUser: { __typename?: 'MessageModel', id: string, chatId: string, content: string, images: Array<string>, createdAt: any, updatedAt: any, user: { __typename?: 'UserModel', id: string, username: string, name?: string | null, avatar?: string | null } } };


export const CreateUserDocument = gql`
    mutation CreateUser($data: CreateUserInput!) {
  createUser(data: $data)
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const LoginUserDocument = gql`
    mutation LoginUser($data: LoginInput!) {
  loginUser(data: $data) {
    id
    email
    username
    name
    avatar
    bio
    role
  }
}
    `;
export type LoginUserMutationFn = Apollo.MutationFunction<LoginUserMutation, LoginUserMutationVariables>;

/**
 * __useLoginUserMutation__
 *
 * To run a mutation, you first call `useLoginUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginUserMutation, { data, loading, error }] = useLoginUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useLoginUserMutation(baseOptions?: Apollo.MutationHookOptions<LoginUserMutation, LoginUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument, options);
      }
export type LoginUserMutationHookResult = ReturnType<typeof useLoginUserMutation>;
export type LoginUserMutationResult = Apollo.MutationResult<LoginUserMutation>;
export type LoginUserMutationOptions = Apollo.BaseMutationOptions<LoginUserMutation, LoginUserMutationVariables>;
export const LogoutUserDocument = gql`
    mutation LogoutUser {
  logoutUser
}
    `;
export type LogoutUserMutationFn = Apollo.MutationFunction<LogoutUserMutation, LogoutUserMutationVariables>;

/**
 * __useLogoutUserMutation__
 *
 * To run a mutation, you first call `useLogoutUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutUserMutation, { data, loading, error }] = useLogoutUserMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutUserMutation(baseOptions?: Apollo.MutationHookOptions<LogoutUserMutation, LogoutUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutUserMutation, LogoutUserMutationVariables>(LogoutUserDocument, options);
      }
export type LogoutUserMutationHookResult = ReturnType<typeof useLogoutUserMutation>;
export type LogoutUserMutationResult = Apollo.MutationResult<LogoutUserMutation>;
export type LogoutUserMutationOptions = Apollo.BaseMutationOptions<LogoutUserMutation, LogoutUserMutationVariables>;
export const CreateMessageDocument = gql`
    mutation CreateMessage($chatId: String!, $data: CreateMessageInput!) {
  createMessage(chatId: $chatId, data: $data) {
    id
    content
    images
    createdAt
    updatedAt
    user {
      id
      username
      name
      avatar
    }
  }
}
    `;
export type CreateMessageMutationFn = Apollo.MutationFunction<CreateMessageMutation, CreateMessageMutationVariables>;

/**
 * __useCreateMessageMutation__
 *
 * To run a mutation, you first call `useCreateMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMessageMutation, { data, loading, error }] = useCreateMessageMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateMessageMutation(baseOptions?: Apollo.MutationHookOptions<CreateMessageMutation, CreateMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMessageMutation, CreateMessageMutationVariables>(CreateMessageDocument, options);
      }
export type CreateMessageMutationHookResult = ReturnType<typeof useCreateMessageMutation>;
export type CreateMessageMutationResult = Apollo.MutationResult<CreateMessageMutation>;
export type CreateMessageMutationOptions = Apollo.BaseMutationOptions<CreateMessageMutation, CreateMessageMutationVariables>;
export const CreateOrFindChatDocument = gql`
    mutation CreateOrFindChat($data: CreateChatInput!) {
  createOrFindChat(data: $data) {
    id
    createdAt
    updatedAt
    users {
      id
      username
      name
      avatar
    }
    messages {
      id
      content
      images
      createdAt
      user {
        id
        username
        name
        avatar
      }
    }
  }
}
    `;
export type CreateOrFindChatMutationFn = Apollo.MutationFunction<CreateOrFindChatMutation, CreateOrFindChatMutationVariables>;

/**
 * __useCreateOrFindChatMutation__
 *
 * To run a mutation, you first call `useCreateOrFindChatMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrFindChatMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrFindChatMutation, { data, loading, error }] = useCreateOrFindChatMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateOrFindChatMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrFindChatMutation, CreateOrFindChatMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOrFindChatMutation, CreateOrFindChatMutationVariables>(CreateOrFindChatDocument, options);
      }
export type CreateOrFindChatMutationHookResult = ReturnType<typeof useCreateOrFindChatMutation>;
export type CreateOrFindChatMutationResult = Apollo.MutationResult<CreateOrFindChatMutation>;
export type CreateOrFindChatMutationOptions = Apollo.BaseMutationOptions<CreateOrFindChatMutation, CreateOrFindChatMutationVariables>;
export const MarkChatAsReadDocument = gql`
    mutation MarkChatAsRead($chatId: String!) {
  markChatAsRead(chatId: $chatId)
}
    `;
export type MarkChatAsReadMutationFn = Apollo.MutationFunction<MarkChatAsReadMutation, MarkChatAsReadMutationVariables>;

/**
 * __useMarkChatAsReadMutation__
 *
 * To run a mutation, you first call `useMarkChatAsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkChatAsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markChatAsReadMutation, { data, loading, error }] = useMarkChatAsReadMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useMarkChatAsReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkChatAsReadMutation, MarkChatAsReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkChatAsReadMutation, MarkChatAsReadMutationVariables>(MarkChatAsReadDocument, options);
      }
export type MarkChatAsReadMutationHookResult = ReturnType<typeof useMarkChatAsReadMutation>;
export type MarkChatAsReadMutationResult = Apollo.MutationResult<MarkChatAsReadMutation>;
export type MarkChatAsReadMutationOptions = Apollo.BaseMutationOptions<MarkChatAsReadMutation, MarkChatAsReadMutationVariables>;
export const FollowUserDocument = gql`
    mutation FollowUser($userId: String!) {
  followUser(userId: $userId)
}
    `;
export type FollowUserMutationFn = Apollo.MutationFunction<FollowUserMutation, FollowUserMutationVariables>;

/**
 * __useFollowUserMutation__
 *
 * To run a mutation, you first call `useFollowUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFollowUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [followUserMutation, { data, loading, error }] = useFollowUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useFollowUserMutation(baseOptions?: Apollo.MutationHookOptions<FollowUserMutation, FollowUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<FollowUserMutation, FollowUserMutationVariables>(FollowUserDocument, options);
      }
export type FollowUserMutationHookResult = ReturnType<typeof useFollowUserMutation>;
export type FollowUserMutationResult = Apollo.MutationResult<FollowUserMutation>;
export type FollowUserMutationOptions = Apollo.BaseMutationOptions<FollowUserMutation, FollowUserMutationVariables>;
export const UnfollowUserDocument = gql`
    mutation UnfollowUser($userId: String!) {
  unfollowUser(userId: $userId)
}
    `;
export type UnfollowUserMutationFn = Apollo.MutationFunction<UnfollowUserMutation, UnfollowUserMutationVariables>;

/**
 * __useUnfollowUserMutation__
 *
 * To run a mutation, you first call `useUnfollowUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnfollowUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unfollowUserMutation, { data, loading, error }] = useUnfollowUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUnfollowUserMutation(baseOptions?: Apollo.MutationHookOptions<UnfollowUserMutation, UnfollowUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnfollowUserMutation, UnfollowUserMutationVariables>(UnfollowUserDocument, options);
      }
export type UnfollowUserMutationHookResult = ReturnType<typeof useUnfollowUserMutation>;
export type UnfollowUserMutationResult = Apollo.MutationResult<UnfollowUserMutation>;
export type UnfollowUserMutationOptions = Apollo.BaseMutationOptions<UnfollowUserMutation, UnfollowUserMutationVariables>;
export const CreatePostDocument = gql`
    mutation CreatePost($data: CreatePostInput!) {
  createPost(data: $data) {
    id
    title
    text
    images
  }
}
    `;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, options);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const DeletePostDocument = gql`
    mutation DeletePost($id: String!) {
  deletePost(id: $id)
}
    `;
export type DeletePostMutationFn = Apollo.MutationFunction<DeletePostMutation, DeletePostMutationVariables>;

/**
 * __useDeletePostMutation__
 *
 * To run a mutation, you first call `useDeletePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePostMutation, { data, loading, error }] = useDeletePostMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePostMutation(baseOptions?: Apollo.MutationHookOptions<DeletePostMutation, DeletePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument, options);
      }
export type DeletePostMutationHookResult = ReturnType<typeof useDeletePostMutation>;
export type DeletePostMutationResult = Apollo.MutationResult<DeletePostMutation>;
export type DeletePostMutationOptions = Apollo.BaseMutationOptions<DeletePostMutation, DeletePostMutationVariables>;
export const ToggleHidePostDocument = gql`
    mutation ToggleHidePost($postId: String!) {
  toggleHidePost(postId: $postId) {
    id
    hidden
  }
}
    `;
export type ToggleHidePostMutationFn = Apollo.MutationFunction<ToggleHidePostMutation, ToggleHidePostMutationVariables>;

/**
 * __useToggleHidePostMutation__
 *
 * To run a mutation, you first call `useToggleHidePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleHidePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleHidePostMutation, { data, loading, error }] = useToggleHidePostMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useToggleHidePostMutation(baseOptions?: Apollo.MutationHookOptions<ToggleHidePostMutation, ToggleHidePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleHidePostMutation, ToggleHidePostMutationVariables>(ToggleHidePostDocument, options);
      }
export type ToggleHidePostMutationHookResult = ReturnType<typeof useToggleHidePostMutation>;
export type ToggleHidePostMutationResult = Apollo.MutationResult<ToggleHidePostMutation>;
export type ToggleHidePostMutationOptions = Apollo.BaseMutationOptions<ToggleHidePostMutation, ToggleHidePostMutationVariables>;
export const ToggleLikePostDocument = gql`
    mutation ToggleLikePost($postId: String!) {
  toggleLikePost(postId: $postId) {
    isLiked
    likesCount
  }
}
    `;
export type ToggleLikePostMutationFn = Apollo.MutationFunction<ToggleLikePostMutation, ToggleLikePostMutationVariables>;

/**
 * __useToggleLikePostMutation__
 *
 * To run a mutation, you first call `useToggleLikePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleLikePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleLikePostMutation, { data, loading, error }] = useToggleLikePostMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useToggleLikePostMutation(baseOptions?: Apollo.MutationHookOptions<ToggleLikePostMutation, ToggleLikePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleLikePostMutation, ToggleLikePostMutationVariables>(ToggleLikePostDocument, options);
      }
export type ToggleLikePostMutationHookResult = ReturnType<typeof useToggleLikePostMutation>;
export type ToggleLikePostMutationResult = Apollo.MutationResult<ToggleLikePostMutation>;
export type ToggleLikePostMutationOptions = Apollo.BaseMutationOptions<ToggleLikePostMutation, ToggleLikePostMutationVariables>;
export const UpdatePostDocument = gql`
    mutation UpdatePost($id: String!, $data: UpdatePostInput!) {
  updatePost(id: $id, data: $data) {
    id
    title
    text
    images
    hidden
    likes
    isLiked
    userId
    user {
      id
      username
      name
      avatar
    }
    createdAt
    updatedAt
  }
}
    `;
export type UpdatePostMutationFn = Apollo.MutationFunction<UpdatePostMutation, UpdatePostMutationVariables>;

/**
 * __useUpdatePostMutation__
 *
 * To run a mutation, you first call `useUpdatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePostMutation, { data, loading, error }] = useUpdatePostMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdatePostMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePostMutation, UpdatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument, options);
      }
export type UpdatePostMutationHookResult = ReturnType<typeof useUpdatePostMutation>;
export type UpdatePostMutationResult = Apollo.MutationResult<UpdatePostMutation>;
export type UpdatePostMutationOptions = Apollo.BaseMutationOptions<UpdatePostMutation, UpdatePostMutationVariables>;
export const ChangeProfileInfoDocument = gql`
    mutation ChangeProfileInfo($data: ChangeProfileInfoInput!) {
  changeProfileInfo(data: $data)
}
    `;
export type ChangeProfileInfoMutationFn = Apollo.MutationFunction<ChangeProfileInfoMutation, ChangeProfileInfoMutationVariables>;

/**
 * __useChangeProfileInfoMutation__
 *
 * To run a mutation, you first call `useChangeProfileInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeProfileInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeProfileInfoMutation, { data, loading, error }] = useChangeProfileInfoMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useChangeProfileInfoMutation(baseOptions?: Apollo.MutationHookOptions<ChangeProfileInfoMutation, ChangeProfileInfoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeProfileInfoMutation, ChangeProfileInfoMutationVariables>(ChangeProfileInfoDocument, options);
      }
export type ChangeProfileInfoMutationHookResult = ReturnType<typeof useChangeProfileInfoMutation>;
export type ChangeProfileInfoMutationResult = Apollo.MutationResult<ChangeProfileInfoMutation>;
export type ChangeProfileInfoMutationOptions = Apollo.BaseMutationOptions<ChangeProfileInfoMutation, ChangeProfileInfoMutationVariables>;
export const DeleteProfileDocument = gql`
    mutation DeleteProfile {
  deleteProfile
}
    `;
export type DeleteProfileMutationFn = Apollo.MutationFunction<DeleteProfileMutation, DeleteProfileMutationVariables>;

/**
 * __useDeleteProfileMutation__
 *
 * To run a mutation, you first call `useDeleteProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProfileMutation, { data, loading, error }] = useDeleteProfileMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteProfileMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProfileMutation, DeleteProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProfileMutation, DeleteProfileMutationVariables>(DeleteProfileDocument, options);
      }
export type DeleteProfileMutationHookResult = ReturnType<typeof useDeleteProfileMutation>;
export type DeleteProfileMutationResult = Apollo.MutationResult<DeleteProfileMutation>;
export type DeleteProfileMutationOptions = Apollo.BaseMutationOptions<DeleteProfileMutation, DeleteProfileMutationVariables>;
export const ChangeRoleDocument = gql`
    mutation ChangeRole($data: ChangeRoleInput!) {
  changeRole(data: $data) {
    id
    role
    username
  }
}
    `;
export type ChangeRoleMutationFn = Apollo.MutationFunction<ChangeRoleMutation, ChangeRoleMutationVariables>;

/**
 * __useChangeRoleMutation__
 *
 * To run a mutation, you first call `useChangeRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeRoleMutation, { data, loading, error }] = useChangeRoleMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useChangeRoleMutation(baseOptions?: Apollo.MutationHookOptions<ChangeRoleMutation, ChangeRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeRoleMutation, ChangeRoleMutationVariables>(ChangeRoleDocument, options);
      }
export type ChangeRoleMutationHookResult = ReturnType<typeof useChangeRoleMutation>;
export type ChangeRoleMutationResult = Apollo.MutationResult<ChangeRoleMutation>;
export type ChangeRoleMutationOptions = Apollo.BaseMutationOptions<ChangeRoleMutation, ChangeRoleMutationVariables>;
export const FindAllChatsByMeDocument = gql`
    query FindAllChatsByMe {
  findAllChatsByMe {
    id
    createdAt
    updatedAt
    unreadCount
    users {
      id
      username
      name
      avatar
    }
    messages {
      id
      content
      images
      createdAt
      user {
        id
        username
        name
        avatar
      }
    }
  }
}
    `;

/**
 * __useFindAllChatsByMeQuery__
 *
 * To run a query within a React component, call `useFindAllChatsByMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllChatsByMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllChatsByMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useFindAllChatsByMeQuery(baseOptions?: Apollo.QueryHookOptions<FindAllChatsByMeQuery, FindAllChatsByMeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllChatsByMeQuery, FindAllChatsByMeQueryVariables>(FindAllChatsByMeDocument, options);
      }
export function useFindAllChatsByMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllChatsByMeQuery, FindAllChatsByMeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllChatsByMeQuery, FindAllChatsByMeQueryVariables>(FindAllChatsByMeDocument, options);
        }
export function useFindAllChatsByMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FindAllChatsByMeQuery, FindAllChatsByMeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindAllChatsByMeQuery, FindAllChatsByMeQueryVariables>(FindAllChatsByMeDocument, options);
        }
export type FindAllChatsByMeQueryHookResult = ReturnType<typeof useFindAllChatsByMeQuery>;
export type FindAllChatsByMeLazyQueryHookResult = ReturnType<typeof useFindAllChatsByMeLazyQuery>;
export type FindAllChatsByMeSuspenseQueryHookResult = ReturnType<typeof useFindAllChatsByMeSuspenseQuery>;
export type FindAllChatsByMeQueryResult = Apollo.QueryResult<FindAllChatsByMeQuery, FindAllChatsByMeQueryVariables>;
export const FindMessagesByChatIdDocument = gql`
    query FindMessagesByChatId($chatId: String!, $pagination: MessagesPaginationInput) {
  findMessagesByChatId(chatId: $chatId, pagination: $pagination) {
    id
    content
    images
    createdAt
    updatedAt
    user {
      id
      username
      name
      avatar
    }
  }
}
    `;

/**
 * __useFindMessagesByChatIdQuery__
 *
 * To run a query within a React component, call `useFindMessagesByChatIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindMessagesByChatIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindMessagesByChatIdQuery({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useFindMessagesByChatIdQuery(baseOptions: Apollo.QueryHookOptions<FindMessagesByChatIdQuery, FindMessagesByChatIdQueryVariables> & ({ variables: FindMessagesByChatIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindMessagesByChatIdQuery, FindMessagesByChatIdQueryVariables>(FindMessagesByChatIdDocument, options);
      }
export function useFindMessagesByChatIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindMessagesByChatIdQuery, FindMessagesByChatIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindMessagesByChatIdQuery, FindMessagesByChatIdQueryVariables>(FindMessagesByChatIdDocument, options);
        }
export function useFindMessagesByChatIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FindMessagesByChatIdQuery, FindMessagesByChatIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindMessagesByChatIdQuery, FindMessagesByChatIdQueryVariables>(FindMessagesByChatIdDocument, options);
        }
export type FindMessagesByChatIdQueryHookResult = ReturnType<typeof useFindMessagesByChatIdQuery>;
export type FindMessagesByChatIdLazyQueryHookResult = ReturnType<typeof useFindMessagesByChatIdLazyQuery>;
export type FindMessagesByChatIdSuspenseQueryHookResult = ReturnType<typeof useFindMessagesByChatIdSuspenseQuery>;
export type FindMessagesByChatIdQueryResult = Apollo.QueryResult<FindMessagesByChatIdQuery, FindMessagesByChatIdQueryVariables>;
export const FindAllByFollowingDocument = gql`
    query FindAllByFollowing($filter: FilterPostsInput!) {
  findAllByFollowing(filter: $filter) {
    id
    title
    text
    images
    hidden
    createdAt
    updatedAt
    user {
      id
      username
      name
      avatar
    }
    isLiked
    likes
    isMyPost
  }
}
    `;

/**
 * __useFindAllByFollowingQuery__
 *
 * To run a query within a React component, call `useFindAllByFollowingQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllByFollowingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllByFollowingQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useFindAllByFollowingQuery(baseOptions: Apollo.QueryHookOptions<FindAllByFollowingQuery, FindAllByFollowingQueryVariables> & ({ variables: FindAllByFollowingQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllByFollowingQuery, FindAllByFollowingQueryVariables>(FindAllByFollowingDocument, options);
      }
export function useFindAllByFollowingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllByFollowingQuery, FindAllByFollowingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllByFollowingQuery, FindAllByFollowingQueryVariables>(FindAllByFollowingDocument, options);
        }
export function useFindAllByFollowingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FindAllByFollowingQuery, FindAllByFollowingQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindAllByFollowingQuery, FindAllByFollowingQueryVariables>(FindAllByFollowingDocument, options);
        }
export type FindAllByFollowingQueryHookResult = ReturnType<typeof useFindAllByFollowingQuery>;
export type FindAllByFollowingLazyQueryHookResult = ReturnType<typeof useFindAllByFollowingLazyQuery>;
export type FindAllByFollowingSuspenseQueryHookResult = ReturnType<typeof useFindAllByFollowingSuspenseQuery>;
export type FindAllByFollowingQueryResult = Apollo.QueryResult<FindAllByFollowingQuery, FindAllByFollowingQueryVariables>;
export const GetFollowersDocument = gql`
    query GetFollowers($userId: String!, $skip: Int, $take: Int) {
  getFollowers(userId: $userId, skip: $skip, take: $take) {
    data {
      id
      username
      name
      avatar
      bio
      followedAt
    }
    total
    skip
    take
    hasMore
  }
}
    `;

/**
 * __useGetFollowersQuery__
 *
 * To run a query within a React component, call `useGetFollowersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowersQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      skip: // value for 'skip'
 *      take: // value for 'take'
 *   },
 * });
 */
export function useGetFollowersQuery(baseOptions: Apollo.QueryHookOptions<GetFollowersQuery, GetFollowersQueryVariables> & ({ variables: GetFollowersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, options);
      }
export function useGetFollowersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFollowersQuery, GetFollowersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, options);
        }
export function useGetFollowersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFollowersQuery, GetFollowersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, options);
        }
export type GetFollowersQueryHookResult = ReturnType<typeof useGetFollowersQuery>;
export type GetFollowersLazyQueryHookResult = ReturnType<typeof useGetFollowersLazyQuery>;
export type GetFollowersSuspenseQueryHookResult = ReturnType<typeof useGetFollowersSuspenseQuery>;
export type GetFollowersQueryResult = Apollo.QueryResult<GetFollowersQuery, GetFollowersQueryVariables>;
export const GetFollowersCountDocument = gql`
    query GetFollowersCount($userId: String!) {
  getFollowersCount(userId: $userId)
}
    `;

/**
 * __useGetFollowersCountQuery__
 *
 * To run a query within a React component, call `useGetFollowersCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowersCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowersCountQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetFollowersCountQuery(baseOptions: Apollo.QueryHookOptions<GetFollowersCountQuery, GetFollowersCountQueryVariables> & ({ variables: GetFollowersCountQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFollowersCountQuery, GetFollowersCountQueryVariables>(GetFollowersCountDocument, options);
      }
export function useGetFollowersCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFollowersCountQuery, GetFollowersCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFollowersCountQuery, GetFollowersCountQueryVariables>(GetFollowersCountDocument, options);
        }
export function useGetFollowersCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFollowersCountQuery, GetFollowersCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFollowersCountQuery, GetFollowersCountQueryVariables>(GetFollowersCountDocument, options);
        }
export type GetFollowersCountQueryHookResult = ReturnType<typeof useGetFollowersCountQuery>;
export type GetFollowersCountLazyQueryHookResult = ReturnType<typeof useGetFollowersCountLazyQuery>;
export type GetFollowersCountSuspenseQueryHookResult = ReturnType<typeof useGetFollowersCountSuspenseQuery>;
export type GetFollowersCountQueryResult = Apollo.QueryResult<GetFollowersCountQuery, GetFollowersCountQueryVariables>;
export const GetFollowingDocument = gql`
    query GetFollowing($userId: String!, $skip: Int, $take: Int) {
  getFollowing(userId: $userId, skip: $skip, take: $take) {
    data {
      id
      username
      name
      avatar
      bio
      followedAt
    }
    total
    skip
    take
    hasMore
  }
}
    `;

/**
 * __useGetFollowingQuery__
 *
 * To run a query within a React component, call `useGetFollowingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowingQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      skip: // value for 'skip'
 *      take: // value for 'take'
 *   },
 * });
 */
export function useGetFollowingQuery(baseOptions: Apollo.QueryHookOptions<GetFollowingQuery, GetFollowingQueryVariables> & ({ variables: GetFollowingQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFollowingQuery, GetFollowingQueryVariables>(GetFollowingDocument, options);
      }
export function useGetFollowingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFollowingQuery, GetFollowingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFollowingQuery, GetFollowingQueryVariables>(GetFollowingDocument, options);
        }
export function useGetFollowingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFollowingQuery, GetFollowingQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFollowingQuery, GetFollowingQueryVariables>(GetFollowingDocument, options);
        }
export type GetFollowingQueryHookResult = ReturnType<typeof useGetFollowingQuery>;
export type GetFollowingLazyQueryHookResult = ReturnType<typeof useGetFollowingLazyQuery>;
export type GetFollowingSuspenseQueryHookResult = ReturnType<typeof useGetFollowingSuspenseQuery>;
export type GetFollowingQueryResult = Apollo.QueryResult<GetFollowingQuery, GetFollowingQueryVariables>;
export const GetFollowingCountDocument = gql`
    query GetFollowingCount($userId: String!) {
  getFollowingCount(userId: $userId)
}
    `;

/**
 * __useGetFollowingCountQuery__
 *
 * To run a query within a React component, call `useGetFollowingCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowingCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowingCountQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetFollowingCountQuery(baseOptions: Apollo.QueryHookOptions<GetFollowingCountQuery, GetFollowingCountQueryVariables> & ({ variables: GetFollowingCountQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFollowingCountQuery, GetFollowingCountQueryVariables>(GetFollowingCountDocument, options);
      }
export function useGetFollowingCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFollowingCountQuery, GetFollowingCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFollowingCountQuery, GetFollowingCountQueryVariables>(GetFollowingCountDocument, options);
        }
export function useGetFollowingCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFollowingCountQuery, GetFollowingCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFollowingCountQuery, GetFollowingCountQueryVariables>(GetFollowingCountDocument, options);
        }
export type GetFollowingCountQueryHookResult = ReturnType<typeof useGetFollowingCountQuery>;
export type GetFollowingCountLazyQueryHookResult = ReturnType<typeof useGetFollowingCountLazyQuery>;
export type GetFollowingCountSuspenseQueryHookResult = ReturnType<typeof useGetFollowingCountSuspenseQuery>;
export type GetFollowingCountQueryResult = Apollo.QueryResult<GetFollowingCountQuery, GetFollowingCountQueryVariables>;
export const FindAllByMeDocument = gql`
    query FindAllByMe($filter: FilterPostsInput!) {
  findAllByMe(filter: $filter) {
    id
    title
    text
    images
    hidden
    createdAt
    updatedAt
    isLiked
    likes
    isMyPost
    user {
      id
      username
      name
      avatar
    }
  }
}
    `;

/**
 * __useFindAllByMeQuery__
 *
 * To run a query within a React component, call `useFindAllByMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllByMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllByMeQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useFindAllByMeQuery(baseOptions: Apollo.QueryHookOptions<FindAllByMeQuery, FindAllByMeQueryVariables> & ({ variables: FindAllByMeQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllByMeQuery, FindAllByMeQueryVariables>(FindAllByMeDocument, options);
      }
export function useFindAllByMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllByMeQuery, FindAllByMeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllByMeQuery, FindAllByMeQueryVariables>(FindAllByMeDocument, options);
        }
export function useFindAllByMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FindAllByMeQuery, FindAllByMeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindAllByMeQuery, FindAllByMeQueryVariables>(FindAllByMeDocument, options);
        }
export type FindAllByMeQueryHookResult = ReturnType<typeof useFindAllByMeQuery>;
export type FindAllByMeLazyQueryHookResult = ReturnType<typeof useFindAllByMeLazyQuery>;
export type FindAllByMeSuspenseQueryHookResult = ReturnType<typeof useFindAllByMeSuspenseQuery>;
export type FindAllByMeQueryResult = Apollo.QueryResult<FindAllByMeQuery, FindAllByMeQueryVariables>;
export const FindAllByMeHiddenDocument = gql`
    query FindAllByMeHidden($filter: FilterPostsInput!) {
  findAllByMeHidden(filter: $filter) {
    id
    title
    text
    images
    createdAt
    updatedAt
    isLiked
    likes
    user {
      id
      username
      name
      avatar
    }
  }
}
    `;

/**
 * __useFindAllByMeHiddenQuery__
 *
 * To run a query within a React component, call `useFindAllByMeHiddenQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllByMeHiddenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllByMeHiddenQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useFindAllByMeHiddenQuery(baseOptions: Apollo.QueryHookOptions<FindAllByMeHiddenQuery, FindAllByMeHiddenQueryVariables> & ({ variables: FindAllByMeHiddenQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllByMeHiddenQuery, FindAllByMeHiddenQueryVariables>(FindAllByMeHiddenDocument, options);
      }
export function useFindAllByMeHiddenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllByMeHiddenQuery, FindAllByMeHiddenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllByMeHiddenQuery, FindAllByMeHiddenQueryVariables>(FindAllByMeHiddenDocument, options);
        }
export function useFindAllByMeHiddenSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FindAllByMeHiddenQuery, FindAllByMeHiddenQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindAllByMeHiddenQuery, FindAllByMeHiddenQueryVariables>(FindAllByMeHiddenDocument, options);
        }
export type FindAllByMeHiddenQueryHookResult = ReturnType<typeof useFindAllByMeHiddenQuery>;
export type FindAllByMeHiddenLazyQueryHookResult = ReturnType<typeof useFindAllByMeHiddenLazyQuery>;
export type FindAllByMeHiddenSuspenseQueryHookResult = ReturnType<typeof useFindAllByMeHiddenSuspenseQuery>;
export type FindAllByMeHiddenQueryResult = Apollo.QueryResult<FindAllByMeHiddenQuery, FindAllByMeHiddenQueryVariables>;
export const FindAllByUsernameDocument = gql`
    query FindAllByUsername($filter: FilterPostsInput!, $username: String!) {
  findAllByUsername(filter: $filter, username: $username) {
    id
    title
    text
    images
    createdAt
    updatedAt
    isLiked
    likes
    hidden
    isMyPost
    user {
      id
      username
      name
      avatar
      role
    }
  }
}
    `;

/**
 * __useFindAllByUsernameQuery__
 *
 * To run a query within a React component, call `useFindAllByUsernameQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllByUsernameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllByUsernameQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      username: // value for 'username'
 *   },
 * });
 */
export function useFindAllByUsernameQuery(baseOptions: Apollo.QueryHookOptions<FindAllByUsernameQuery, FindAllByUsernameQueryVariables> & ({ variables: FindAllByUsernameQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllByUsernameQuery, FindAllByUsernameQueryVariables>(FindAllByUsernameDocument, options);
      }
export function useFindAllByUsernameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllByUsernameQuery, FindAllByUsernameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllByUsernameQuery, FindAllByUsernameQueryVariables>(FindAllByUsernameDocument, options);
        }
export function useFindAllByUsernameSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FindAllByUsernameQuery, FindAllByUsernameQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindAllByUsernameQuery, FindAllByUsernameQueryVariables>(FindAllByUsernameDocument, options);
        }
export type FindAllByUsernameQueryHookResult = ReturnType<typeof useFindAllByUsernameQuery>;
export type FindAllByUsernameLazyQueryHookResult = ReturnType<typeof useFindAllByUsernameLazyQuery>;
export type FindAllByUsernameSuspenseQueryHookResult = ReturnType<typeof useFindAllByUsernameSuspenseQuery>;
export type FindAllByUsernameQueryResult = Apollo.QueryResult<FindAllByUsernameQuery, FindAllByUsernameQueryVariables>;
export const FindAllPostsDocument = gql`
    query FindAllPosts($filter: FilterPostsInput!) {
  findAllPosts(filter: $filter) {
    id
    title
    text
    images
    hidden
    createdAt
    updatedAt
    user {
      id
      username
      name
      avatar
    }
    isLiked
    likes
    isMyPost
  }
}
    `;

/**
 * __useFindAllPostsQuery__
 *
 * To run a query within a React component, call `useFindAllPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllPostsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useFindAllPostsQuery(baseOptions: Apollo.QueryHookOptions<FindAllPostsQuery, FindAllPostsQueryVariables> & ({ variables: FindAllPostsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllPostsQuery, FindAllPostsQueryVariables>(FindAllPostsDocument, options);
      }
export function useFindAllPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllPostsQuery, FindAllPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllPostsQuery, FindAllPostsQueryVariables>(FindAllPostsDocument, options);
        }
export function useFindAllPostsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FindAllPostsQuery, FindAllPostsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindAllPostsQuery, FindAllPostsQueryVariables>(FindAllPostsDocument, options);
        }
export type FindAllPostsQueryHookResult = ReturnType<typeof useFindAllPostsQuery>;
export type FindAllPostsLazyQueryHookResult = ReturnType<typeof useFindAllPostsLazyQuery>;
export type FindAllPostsSuspenseQueryHookResult = ReturnType<typeof useFindAllPostsSuspenseQuery>;
export type FindAllPostsQueryResult = Apollo.QueryResult<FindAllPostsQuery, FindAllPostsQueryVariables>;
export const FindAllUsersDocument = gql`
    query FindAllUsers($filter: FilterUsersInput!) {
  findAllUsers(filter: $filter) {
    id
    email
    username
    name
    avatar
    bio
    role
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useFindAllUsersQuery__
 *
 * To run a query within a React component, call `useFindAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllUsersQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useFindAllUsersQuery(baseOptions: Apollo.QueryHookOptions<FindAllUsersQuery, FindAllUsersQueryVariables> & ({ variables: FindAllUsersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllUsersQuery, FindAllUsersQueryVariables>(FindAllUsersDocument, options);
      }
export function useFindAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllUsersQuery, FindAllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllUsersQuery, FindAllUsersQueryVariables>(FindAllUsersDocument, options);
        }
export function useFindAllUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FindAllUsersQuery, FindAllUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindAllUsersQuery, FindAllUsersQueryVariables>(FindAllUsersDocument, options);
        }
export type FindAllUsersQueryHookResult = ReturnType<typeof useFindAllUsersQuery>;
export type FindAllUsersLazyQueryHookResult = ReturnType<typeof useFindAllUsersLazyQuery>;
export type FindAllUsersSuspenseQueryHookResult = ReturnType<typeof useFindAllUsersSuspenseQuery>;
export type FindAllUsersQueryResult = Apollo.QueryResult<FindAllUsersQuery, FindAllUsersQueryVariables>;
export const FindMeDocument = gql`
    query FindMe {
  findMe {
    id
    username
    name
    avatar
    bio
    role
    followersCount
    followingCount
  }
}
    `;

/**
 * __useFindMeQuery__
 *
 * To run a query within a React component, call `useFindMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useFindMeQuery(baseOptions?: Apollo.QueryHookOptions<FindMeQuery, FindMeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindMeQuery, FindMeQueryVariables>(FindMeDocument, options);
      }
export function useFindMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindMeQuery, FindMeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindMeQuery, FindMeQueryVariables>(FindMeDocument, options);
        }
export function useFindMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FindMeQuery, FindMeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindMeQuery, FindMeQueryVariables>(FindMeDocument, options);
        }
export type FindMeQueryHookResult = ReturnType<typeof useFindMeQuery>;
export type FindMeLazyQueryHookResult = ReturnType<typeof useFindMeLazyQuery>;
export type FindMeSuspenseQueryHookResult = ReturnType<typeof useFindMeSuspenseQuery>;
export type FindMeQueryResult = Apollo.QueryResult<FindMeQuery, FindMeQueryVariables>;
export const FindOneByUsernameDocument = gql`
    query FindOneByUsername($username: String!) {
  findOneByUsername(username: $username) {
    id
    username
    name
    avatar
    bio
    role
    isMe
    followersCount
    followingCount
    postsCount
    isFollowing
  }
}
    `;

/**
 * __useFindOneByUsernameQuery__
 *
 * To run a query within a React component, call `useFindOneByUsernameQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindOneByUsernameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindOneByUsernameQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useFindOneByUsernameQuery(baseOptions: Apollo.QueryHookOptions<FindOneByUsernameQuery, FindOneByUsernameQueryVariables> & ({ variables: FindOneByUsernameQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindOneByUsernameQuery, FindOneByUsernameQueryVariables>(FindOneByUsernameDocument, options);
      }
export function useFindOneByUsernameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindOneByUsernameQuery, FindOneByUsernameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindOneByUsernameQuery, FindOneByUsernameQueryVariables>(FindOneByUsernameDocument, options);
        }
export function useFindOneByUsernameSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FindOneByUsernameQuery, FindOneByUsernameQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindOneByUsernameQuery, FindOneByUsernameQueryVariables>(FindOneByUsernameDocument, options);
        }
export type FindOneByUsernameQueryHookResult = ReturnType<typeof useFindOneByUsernameQuery>;
export type FindOneByUsernameLazyQueryHookResult = ReturnType<typeof useFindOneByUsernameLazyQuery>;
export type FindOneByUsernameSuspenseQueryHookResult = ReturnType<typeof useFindOneByUsernameSuspenseQuery>;
export type FindOneByUsernameQueryResult = Apollo.QueryResult<FindOneByUsernameQuery, FindOneByUsernameQueryVariables>;
export const MessageCreatedDocument = gql`
    subscription MessageCreated($chatId: String!) {
  messageCreated(chatId: $chatId) {
    id
    content
    images
    createdAt
    updatedAt
    user {
      id
      username
      name
      avatar
    }
  }
}
    `;

/**
 * __useMessageCreatedSubscription__
 *
 * To run a query within a React component, call `useMessageCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMessageCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessageCreatedSubscription({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useMessageCreatedSubscription(baseOptions: Apollo.SubscriptionHookOptions<MessageCreatedSubscription, MessageCreatedSubscriptionVariables> & ({ variables: MessageCreatedSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MessageCreatedSubscription, MessageCreatedSubscriptionVariables>(MessageCreatedDocument, options);
      }
export type MessageCreatedSubscriptionHookResult = ReturnType<typeof useMessageCreatedSubscription>;
export type MessageCreatedSubscriptionResult = Apollo.SubscriptionResult<MessageCreatedSubscription>;
export const MessageCreatedForUserDocument = gql`
    subscription MessageCreatedForUser {
  messageCreatedForUser {
    id
    chatId
    content
    images
    createdAt
    updatedAt
    user {
      id
      username
      name
      avatar
    }
  }
}
    `;

/**
 * __useMessageCreatedForUserSubscription__
 *
 * To run a query within a React component, call `useMessageCreatedForUserSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMessageCreatedForUserSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessageCreatedForUserSubscription({
 *   variables: {
 *   },
 * });
 */
export function useMessageCreatedForUserSubscription(baseOptions?: Apollo.SubscriptionHookOptions<MessageCreatedForUserSubscription, MessageCreatedForUserSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MessageCreatedForUserSubscription, MessageCreatedForUserSubscriptionVariables>(MessageCreatedForUserDocument, options);
      }
export type MessageCreatedForUserSubscriptionHookResult = ReturnType<typeof useMessageCreatedForUserSubscription>;
export type MessageCreatedForUserSubscriptionResult = Apollo.SubscriptionResult<MessageCreatedForUserSubscription>;
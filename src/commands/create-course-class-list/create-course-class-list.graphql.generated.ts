import * as Types from '../../generated/localSchema.types';

import * as Operations from './create-course-class-list.graphql';
import * as Apollo from '@apollo/client';
export type CreateCourseClassListMutationVariables = Types.Exact<{
  input: Types.CreateCourseClassListInput;
  secret: Types.Scalars['String'];
}>;


export type CreateCourseClassListMutation = { __typename?: 'Mutation', createCourseClassList: { __typename: 'CreateCourseClassListPayload', courseClassList: { __typename?: 'CourseClassList', id: string, name: Types.Maybe<string> } } | { __typename: 'GenericError' } | { __typename: 'AuthenticationError' } };


export type CreateCourseClassListMutationFn = Apollo.MutationFunction<CreateCourseClassListMutation, CreateCourseClassListMutationVariables>;
export function useCreateCourseClassListMutation(baseOptions?: Apollo.MutationHookOptions<CreateCourseClassListMutation, CreateCourseClassListMutationVariables>) {
        return Apollo.useMutation<CreateCourseClassListMutation, CreateCourseClassListMutationVariables>(Operations.createCourseClassList, baseOptions);
      }
export type CreateCourseClassListMutationHookResult = ReturnType<typeof useCreateCourseClassListMutation>;
export type CreateCourseClassListMutationResult = Apollo.MutationResult<CreateCourseClassListMutation>;
export type CreateCourseClassListMutationOptions = Apollo.BaseMutationOptions<CreateCourseClassListMutation, CreateCourseClassListMutationVariables>;
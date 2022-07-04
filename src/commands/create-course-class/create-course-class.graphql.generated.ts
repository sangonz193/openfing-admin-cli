import * as Types from '../../generated/localSchema.types';

import * as Operations from './create-course-class.graphql';
import * as Apollo from '@apollo/client';
export type CreateCourseClassMutationVariables = Types.Exact<{
  input: Types.CreateCourseClassInput;
  secret: Types.Scalars['String'];
}>;


export type CreateCourseClassMutation = { __typename?: 'Mutation', createCourseClass: { __typename: 'CreateCourseClassPayload', courseClass: { __typename?: 'CourseClass', name: Types.Maybe<string>, number: Types.Maybe<number>, courseClassList: Types.Maybe<{ __typename?: 'CourseClassList', code: string }> } } | { __typename: 'GenericError' } | { __typename: 'AuthenticationError' } };


export type CreateCourseClassMutationFn = Apollo.MutationFunction<CreateCourseClassMutation, CreateCourseClassMutationVariables>;
export function useCreateCourseClassMutation(baseOptions?: Apollo.MutationHookOptions<CreateCourseClassMutation, CreateCourseClassMutationVariables>) {
        return Apollo.useMutation<CreateCourseClassMutation, CreateCourseClassMutationVariables>(Operations.createCourseClass, baseOptions);
      }
export type CreateCourseClassMutationHookResult = ReturnType<typeof useCreateCourseClassMutation>;
export type CreateCourseClassMutationResult = Apollo.MutationResult<CreateCourseClassMutation>;
export type CreateCourseClassMutationOptions = Apollo.BaseMutationOptions<CreateCourseClassMutation, CreateCourseClassMutationVariables>;
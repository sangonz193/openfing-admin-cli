import * as Types from '../../generated/localSchema.types';

import * as Operations from './update-course-class.graphql';
import * as Apollo from '@apollo/client';
export type UpdateCourseClassMutationVariables = Types.Exact<{
  ref: Types.CourseClassRef;
  input: Types.UpdateCourseClassInput;
  secret: Types.Scalars['String'];
}>;


export type UpdateCourseClassMutation = { __typename?: 'Mutation', updateCourseClass: { __typename: 'UpdateCourseClassPayload', courseClass: { __typename?: 'CourseClass', name: Types.Maybe<string>, number: Types.Maybe<number>, publishedAt: Types.Maybe<string>, courseClassList: Types.Maybe<{ __typename?: 'CourseClassList', code: string }> } } | { __typename: 'GenericError' } | { __typename: 'AuthenticationError' } | { __typename: 'NotFoundError' } };


export type UpdateCourseClassMutationFn = Apollo.MutationFunction<UpdateCourseClassMutation, UpdateCourseClassMutationVariables>;
export function useUpdateCourseClassMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCourseClassMutation, UpdateCourseClassMutationVariables>) {
        return Apollo.useMutation<UpdateCourseClassMutation, UpdateCourseClassMutationVariables>(Operations.updateCourseClass, baseOptions);
      }
export type UpdateCourseClassMutationHookResult = ReturnType<typeof useUpdateCourseClassMutation>;
export type UpdateCourseClassMutationResult = Apollo.MutationResult<UpdateCourseClassMutation>;
export type UpdateCourseClassMutationOptions = Apollo.BaseMutationOptions<UpdateCourseClassMutation, UpdateCourseClassMutationVariables>;
import * as Types from '../../generated/localSchema.types';

import * as Operations from './set-course-class-live-state.graphql';
import * as Apollo from '@apollo/client';
export type SetCourseClassLiveStateMutationVariables = Types.Exact<{
  input: Types.SetCourseClassLiveStateInput;
  secret: Types.Scalars['String'];
}>;


export type SetCourseClassLiveStateMutation = { __typename?: 'Mutation', setCourseClassLiveState: { __typename: 'SetCourseClassLiveStatePayload', courseClassLiveState: Types.Maybe<{ __typename?: 'CourseClassLiveState', id: string }> } | { __typename: 'GenericError' } | { __typename: 'AuthenticationError' } };


export type SetCourseClassLiveStateMutationFn = Apollo.MutationFunction<SetCourseClassLiveStateMutation, SetCourseClassLiveStateMutationVariables>;
export function useSetCourseClassLiveStateMutation(baseOptions?: Apollo.MutationHookOptions<SetCourseClassLiveStateMutation, SetCourseClassLiveStateMutationVariables>) {
        return Apollo.useMutation<SetCourseClassLiveStateMutation, SetCourseClassLiveStateMutationVariables>(Operations.setCourseClassLiveState, baseOptions);
      }
export type SetCourseClassLiveStateMutationHookResult = ReturnType<typeof useSetCourseClassLiveStateMutation>;
export type SetCourseClassLiveStateMutationResult = Apollo.MutationResult<SetCourseClassLiveStateMutation>;
export type SetCourseClassLiveStateMutationOptions = Apollo.BaseMutationOptions<SetCourseClassLiveStateMutation, SetCourseClassLiveStateMutationVariables>;
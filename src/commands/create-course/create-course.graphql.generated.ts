import * as Types from '../../generated/localSchema.types';

import * as Operations from './create-course.graphql';
import * as Apollo from '@apollo/client';
export type CreateCourseMutationVariables = Types.Exact<{
  input: Types.CreateCourseInput;
  secret: Types.Scalars['String'];
}>;


export type CreateCourseMutation = { __typename?: 'Mutation', createCourse: { __typename: 'CreateCoursePayload', course: { __typename?: 'Course', id: string, code: string, name: string } } | { __typename: 'GenericError' } | { __typename: 'AuthenticationError' } };


export type CreateCourseMutationFn = Apollo.MutationFunction<CreateCourseMutation, CreateCourseMutationVariables>;
export function useCreateCourseMutation(baseOptions?: Apollo.MutationHookOptions<CreateCourseMutation, CreateCourseMutationVariables>) {
        return Apollo.useMutation<CreateCourseMutation, CreateCourseMutationVariables>(Operations.createCourse, baseOptions);
      }
export type CreateCourseMutationHookResult = ReturnType<typeof useCreateCourseMutation>;
export type CreateCourseMutationResult = Apollo.MutationResult<CreateCourseMutation>;
export type CreateCourseMutationOptions = Apollo.BaseMutationOptions<CreateCourseMutation, CreateCourseMutationVariables>;
import gql from "graphql-tag";

export const remoteSchema = gql`type AuthenticationError {
  _: Void
}

type CourseClassChapterCue {
  id: ID!
  name: String!
  startSeconds: Float!
  endSeconds: Float!
  courseClass: CourseClass
  createdAt: ISODate
  updatedAt: ISODate
  deletedAt: ISODate
  createdBy: User
  deletedBy: User
  updatedBy: User
}

type CourseClassList {
  id: ID!
  code: String!
  name: String
  classes: [CourseClass!]
  courseEdition: CourseEdition
  createdAt: ISODate
  updatedAt: ISODate
  deletedAt: ISODate
  createdBy: User
  updatedBy: User
  deletedBy: User
}

input CourseClassListRefById {
  id: ID!
}

input CourseClassListRefByCode {
  code: String!
}

input CourseClassListRef {
  byId: CourseClassListRefById
  byCode: CourseClassListRefByCode
}

type CourseClassLiveState {
  id: ID!
  html: String
  inProgress: Boolean
  startDate: ISODate
  courseClass: CourseClass
}

type CourseClass {
  id: ID!
  number: Int
  name: String
  liveState: CourseClassLiveState
  videos: [CourseClassVideo!]!
  chapterCues: [CourseClassChapterCue!]!
  courseClassList: CourseClassList
  visibility: CourseClassVisibility
  publishedAt: ISODate
  createdAt: ISODate
  updatedAt: ISODate
  createdBy: User
  updatedBy: User
}

enum CourseClassVisibility {
  PUBLIC
  HIDDEN
  DISABLED
}

input CourseClassRefById {
  id: ID!
}

input CourseClassRefByNumber {
  courseClassList: CourseClassListRef!
  number: Int!
}

input CourseClassRef {
  byId: CourseClassRefById
  byNumber: CourseClassRefByNumber
}

type CourseClassVideoFormat {
  id: ID!
  name: String
  url: String
  hasTorrent: Boolean
  quality: CourseClassVideoQuality
  createdAt: ISODate
  updatedAt: ISODate
  deletedAt: ISODate
  createdBy: User
  deletedBy: User
  updatedBy: User
}

type CourseClassVideoQuality {
  id: ID!
  height: Int
  width: Int
  video: CourseClassVideo
  formats: [CourseClassVideoFormat!]!
  createdAt: ISODate
  updatedAt: ISODate
  deletedAt: ISODate
  createdBy: User
  deletedBy: User
  updatedBy: User
}

type CourseClassVideo {
  id: ID!
  name: String
  qualities: [CourseClassVideoQuality!]!
  courseClass: CourseClass
  createdAt: ISODate
  updatedAt: ISODate
  deletedAt: ISODate
  createdBy: User
  deletedBy: User
  updatedBy: User
}

type CourseEdition {
  id: ID!
  name: String
  semester: Int
  year: Int
  courseClassLists: [CourseClassList!]!
  course: Course
  createdAt: ISODate
  updatedAt: ISODate
  deletedAt: ISODate
  createdBy: User
  updatedBy: User
  deletedBy: User
}

type Course {
  id: ID!
  code: String!
  name: String!
  iconUrl: String
  eva: String
  visibility: CourseVisibility
  editions: [CourseEdition!]!
  createdAt: ISODate
  updatedAt: ISODate
  deletedAt: ISODate
  createdBy: User
  updatedBy: User
  deletedBy: User
}

enum CourseVisibility {
  PUBLIC
  HIDDEN
  DISABLED
}

type Faq {
  id: ID!
  title: String!
  content: String!
  isHtml: Boolean
  createdAt: ISODate
  createdBy: User
  updatedAt: ISODate
  updatedBy: User
  deletedAt: ISODate
  deletedBy: User
}

type GenericError {
  _: Void
}

type Grant {
  token: String!
  refreshToken: String!
}

scalar ISODate

type InvalidEmailDomainError {
  _: Void
}

type InvalidEmailDomain {
  _: Void
}

type InvalidFormatError {
  _: Void
}

type MaxLengthError {
  max: Int!
}

type MinLengthError {
  min: Int!
}

input CreateCourseClassChapterCueInput {
  courseClassRef: CourseClassRef!
  data: CreateCourseClassChapterCueDataInput!
}

input CreateCourseClassChapterCueDataInput {
  name: String!
  startSeconds: Float!
  endSeconds: Float!
}

type CreateCourseClassChapterCuePayload {
  courseClassChapterCue: CourseClassChapterCue!
}

union CreateCourseClassChapterCueResult = CreateCourseClassChapterCuePayload | AuthenticationError | GenericError | NotFoundError

enum CreateCourseClassListInputVisibility {
  PUBLIC
  HIDDEN
  DISABLED
}

input CreateCourseClassListInput {
  courseCode: String!
  code: String!
  name: String!
  semester: Int!
  year: Int!
  visibility: CreateCourseClassListInputVisibility
}

type CreateCourseClassListPayload {
  courseClassList: CourseClassList!
}

union CreateCourseClassListResult = CreateCourseClassListPayload | GenericError | AuthenticationError

enum CreateCourseClassInputVisibility {
  PUBLIC
  HIDDEN
  DISABLED
}

input CreateCourseClassInput {
  courseClassListRef: CourseClassListRef!
  name: String!
  number: Int!
  visibility: CreateCourseClassInputVisibility
}

type CreateCourseClassPayload {
  courseClass: CourseClass!
}

union CreateCourseClassResult = CreateCourseClassPayload | GenericError | AuthenticationError

enum CreateCourseInputVisibility {
  PUBLIC
  HIDDEN
  DISABLED
}

input CreateCourseInput {
  code: String!
  name: String!
  eva: String
  visibility: CreateCourseInputVisibility
}

type CreateCoursePayload {
  course: Course!
}

union CreateCourseResult = CreateCoursePayload | GenericError | AuthenticationError

input DeleteCourseClassChapterCuesFromCourseClassInput {
  courseClassRef: CourseClassRef!
}

type DeleteCourseClassChapterCuesFromCourseClassPayload {
  courseClass: CourseClass!
}

union DeleteCourseClassChapterCuesFromCourseClassResult = DeleteCourseClassChapterCuesFromCourseClassPayload | GenericError | NotFoundError | AuthenticationError

input RefreshTokenInput {
  refreshToken: String!
}

type RefreshTokenPayload {
  grant: Grant!
}

union RefreshTokenResult = RefreshTokenPayload | GenericError | AuthenticationError

type Mutation {
  _: Void
  backupDb(secret: String!): Void
  createCourseClassChapterCue(input: CreateCourseClassChapterCueInput!): CreateCourseClassChapterCueResult!
  createCourseClassList(input: CreateCourseClassListInput!, secret: String!): CreateCourseClassListResult!
  createCourseClassList_v2(input: CreateCourseClassListInput!): CreateCourseClassListResult!
  createCourseClass(input: CreateCourseClassInput!, secret: String!): CreateCourseClassResult!
  createCourseClass_v2(input: CreateCourseClassInput!): CreateCourseClassResult!
  createCourse(input: CreateCourseInput!, secret: String!): CreateCourseResult!
  createCourse_v2(input: CreateCourseInput!): CreateCourseResult!
  deleteCourseClassChapterCuesFromCourseClass(input: DeleteCourseClassChapterCuesFromCourseClassInput!): DeleteCourseClassChapterCuesFromCourseClassResult!
  refreshToken(input: RefreshTokenInput!): RefreshTokenResult!
  restoreDb(secret: String!): Void
  restoreDb_v2: Void
  setCourseClassLiveState(input: SetCourseClassLiveStateInput!, secret: String!): SetCourseClassLiveStateResult!
  setCourseClassLiveState_v2(input: SetCourseClassLiveStateInput!): SetCourseClassLiveStateResult!
  signIn(input: SignInInput!): SignInResult!
  syncCourseClassVideosForClass(courseClassRef: CourseClassRef!): SyncCourseClassVideosForClassResult
  updateCourseClassList(ref: CourseClassListRef!, input: UpdateCourseClassListInput!, secret: String!): UpdateCourseClassListResult!
  updateCourseClassList_v2(ref: CourseClassListRef!, input: UpdateCourseClassListInput!): UpdateCourseClassListResult!
  updateCourseClass(ref: CourseClassRef!, input: UpdateCourseClassInput!, secret: String!): UpdateCourseClassResult!
  updateCourseClass_v2(ref: CourseClassRef!, input: UpdateCourseClassInput!): UpdateCourseClassResult!
  signUp(input: SignUpInput!): SignUpResult
}

input SetCourseClassLiveStateInput {
  courseClassRef: CourseClassRef!
  data: SetCourseClassLiveStateDataInput
}

input SetCourseClassLiveStateDataInput {
  inProgress: Boolean
  html: String
  startDate: ISODate
}

type SetCourseClassLiveStatePayload {
  courseClassLiveState: CourseClassLiveState
}

union SetCourseClassLiveStateResult = SetCourseClassLiveStatePayload | GenericError | AuthenticationError

input SignInInput {
  email: String!
  password: String!
}

type SignInPayload {
  grant: Grant!
}

union SignInEmailError = RequiredFieldError | InvalidFormatError

union SignInPasswordError = RequiredFieldError

type SignInValidationErrors {
  email: [SignInEmailError!]
  password: [SignInPasswordError!]
}

union SignInResult = SignInPayload | GenericError | AuthenticationError | SignInValidationErrors

type SyncCourseClassVideosForClassPayload {
  courseClass: CourseClass!
}

union SyncCourseClassVideosForClassResult = SyncCourseClassVideosForClassPayload | NotFoundError | AuthenticationError | GenericError

enum UpdateCourseClassListInputVisibility {
  PUBLIC
  HIDDEN
  DISABLED
}

input UpdateCourseClassListInput {
  name: String
  visibility: UpdateCourseClassListInputVisibility
}

type UpdateCourseClassListPayload {
  courseClassList: CourseClassList!
}

union UpdateCourseClassListResult = UpdateCourseClassListPayload | GenericError | AuthenticationError | NotFoundError

enum UpdateCourseClassInputVisibility {
  PUBLIC
  HIDDEN
  DISABLED
}

input UpdateCourseClassInput {
  name: String
  number: Int
  publishedAt: ISODate
  visibility: UpdateCourseClassInputVisibility
}

type UpdateCourseClassPayload {
  courseClass: CourseClass!
}

union UpdateCourseClassResult = UpdateCourseClassPayload | GenericError | AuthenticationError | NotFoundError

type NotFoundError {
  _: Void
}

union CourseByCodeResult = Course | NotFoundError

union CourseByIdResult = Course | NotFoundError

union CourseClassByIdResult = CourseClass | NotFoundError

type Query {
  _: Void
  courseByCode(code: String!): CourseByCodeResult!
  courseById(id: ID!): CourseByIdResult!
  courseClassById(id: ID!): CourseClassByIdResult!
  courseClassListByCode(code: String!): CourseClassListByCodeResult!
  courseClassListById(id: ID!): CourseClassListByIdResult!
  courseEditionById(id: ID!): CourseEditionByIdResult!
  courses: [Course!]!
  faqs: [Faq!]!
  latestCourseClasses: [CourseClass!]!
  userRoles: [UserRole!]!
}

union CourseClassListByCodeResult = CourseClassList | NotFoundError

union CourseClassListByIdResult = CourseClassList | NotFoundError

union CourseEditionByIdResult = CourseEdition | NotFoundError

type RequiredFieldError {
  _: Void
}

type UserRole {
  id: ID!
  code: String!
}

type User {
  id: ID!
  email: String!
  name: String
  uid: String
  roles: [UserRole!]!
  createdAt: ISODate
  updatedAt: ISODate
  deletedAt: ISODate
}

scalar Void

input SignUpInput {
  firstName: String!
  lastName: String
  email: String!
  password: String!
}

union SignUpEmailError = RequiredFieldError | InvalidEmailDomainError | InvalidFormatError | MaxLengthError

union SignUpFirstNameError = RequiredFieldError | MinLengthError | MaxLengthError

union SignUpLastNameError = MaxLengthError

union SignUpPasswordError = RequiredFieldError | MinLengthError | MaxLengthError

type SignUpValidationErrors {
  email: [SignUpEmailError!]
  firstName: [SignUpFirstNameError!]
  lastName: [SignUpLastNameError!]
  password: [SignUpPasswordError!]
}

union SignUpResult = GenericError | AuthenticationError | SignUpValidationErrors

enum CacheControlScope {
  PUBLIC
  PRIVATE
}

"""The \`Upload\` scalar type represents a file upload."""
scalar Upload
`
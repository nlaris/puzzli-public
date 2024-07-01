import { gql } from "@apollo/client";

export const SUBMIT_USER_GAME = gql`
  mutation SubmitUserGame (
    $userId: String!
    $date: String!
    $tiles: [TileInput!]!
    $elapsedTime: Int!
  ) {
    submitUserGame(
      input: {
        input: {
          userId: $userId,
          date: $date,
          elapsedTime: $elapsedTime,
          tiles: $tiles
        }
      }
    ) {
        errors
        solved
        success
        streak
    }
  }
`
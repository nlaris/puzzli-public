import { gql } from "@apollo/client";

export const GET_GAME_OF_THE_DAY = gql`
  query GameOfTheDay (
    $date: String!
  ) {
    gameOfTheDay(
      input: {
        date: $date, 
      }
    ) {
        date
        errors
        success
        numSolutions
        tiles {
            id
            adjustedPattern
            pattern
            rotation
            solutionIndex
        }
    }
  }
`
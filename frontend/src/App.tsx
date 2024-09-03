import React from 'react';
import './App.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink
} from "@apollo/client";
import GameOfTheDay from './GameOfTheDay';
import { getTodaysDate } from './utils/gameUtils';

const API_URL = process.env.REACT_APP_PUZZLI_API_URL;

const httpLink = new HttpLink({
  uri: API_URL,
  fetch,
  headers: {
    'Content-Type': 'application/json',
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <GameOfTheDay />
      </ApolloProvider>
    </div>
  );
}

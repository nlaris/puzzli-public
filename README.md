# Puzzli

Play Puzzli at [puzzligame.com](https://puzzligame.com/)

Puzzli is based on a tiling puzzle game, [IZZI](https://www.thinkfun.com/products/izzi/), in which the player must arrange 64 tiles in an 8x8 grid such that the edges of each tile match in color. Puzzli simplifies this concept by selecting 9 random IZZI tiles, challenging players to arrange them in a 3x3 grid instead. 

Each day, Puzzli generates a new puzzle, offering endless variations (no more than 120 million, actually) of a mini IZZI puzzle.

## Overview

Puzzli uses a React/TypeScript front end and a Ruby on Rails backend, connected via GraphQL API. The application itself is hosted on [Render](https://render.com/).

Throughout the project, each unique tile is represented by an 8-character string, consisting of only characters `W` (white) and `B` (black). The first character of the string represents the left-upper triangle area of the tile (think 9-10 o'clock), and the subsequent characters continue clockwise around the tile until it reaches the last character, which represents the left-lower area of the tile (8-9 o'clock). For example, here is what the `BWWBBWBW` tile looks like, along with the character indices of each area.

![BWWBBWBW](https://github.com/user-attachments/assets/87f15b5a-3d99-4f14-85a8-0ee4c805b03c)

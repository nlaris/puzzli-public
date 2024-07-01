import { useMutation, useQuery } from "@apollo/client";
import React, { useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core';
import { arraySwap, SortableContext, rectSwappingStrategy } from '@dnd-kit/sortable';
import Grid from './components/Grid';
import SortableItem from './components/SortableItem';
import Item from './components/Item';
import VictoryModal from "./components/VictoryModal";
import { GET_GAME_OF_THE_DAY } from "./graphql/Queries";
import { useLocalStorage } from "./utils/useLocalStorage";
import { SUBMIT_USER_GAME } from "./graphql/Mutations";
import HelpModal from "./components/HelpModal";
import GreetingModal from "./components/GreetingModal";
import NavigationBar from "./components/NavigationBar";
import useImage from "./utils/useImage";
import { Button } from "react-bootstrap";
import { trackEvent } from "./utils/analytics";
import { formatTime, getGameNumber, getSolutionsFontColor, getTodaysDate, getUserId } from "./utils/gameUtils";
import { GameOutput, TileOutput } from "./graphql-codegen/types";
import ErrorModal from "./components/ErrorModal";

export default function GameOfTheDay() {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const [gameTiles, setGameTiles] = useState<TileOutput[]>([]);
  const [activeId, setActiveId] = useState(null);
  const [activeGameDate, setActiveGameDate] = useState<string>(null);
  const [gameExists, setGameExists] = useState<boolean>(true);
  const [modalState, setModalState] = useState<string>('greeting');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [numSolutions, setNumSolutions] = useState(0);

  const { getItem: getStoredLatestDate, setItem: setStoredLatestDate } = useLocalStorage('latestDate');
  const { getItem: getStoredTileOrder, setItem: setStoredTileOrder} = useLocalStorage('tileOrder');
  const { getItem: getStoredCompleted, setItem: setStoredCompleted } = useLocalStorage('completed');
  const { getItem: getStoredUserId, setItem: setStoredUserId } = useLocalStorage('userId');
  const { getItem: getStoredElapsedTime, setItem: setStoredElapsedTime } = useLocalStorage('elapsedTime');
  const { getItem: getStoredStreak, setItem: setStoredStreak } = useLocalStorage('streak');
  const { getItem: getStoredHintUsed, setItem: setStoredHintUsed } = useLocalStorage('hintUsed');

  const { image: greetingIcon } = useImage("tiles/BBWBWWBW.webp")
  const { image: howToImg } = useImage("how-to.png")
  const { image: helpIcon } = useImage("help.png")
  const { image: gitIcon } = useImage("git.png")
  const { image: statsIcon } = useImage("stats.png")

  const { error: gameError, loading: gameLoading } = useQuery(GET_GAME_OF_THE_DAY, {
    variables: {
      date: getTodaysDate()
    },
    onCompleted: (gameData) => {
      setGameExists(gameData.gameOfTheDay.success)
      if (gameData.gameOfTheDay.success) {
        setActiveGameDate(gameData.gameOfTheDay.date);
        if (getStoredLatestDate() !== gameData.gameOfTheDay.date) {
          startNewGame(gameData.gameOfTheDay);
        } else {
          resumeGame();
        }
        setNumSolutions(gameData.gameOfTheDay.numSolutions);
      }
    }
  });

  function resumeGame() {
    setGameTiles(getStoredTileOrder());
    setElapsedTime(getStoredElapsedTime());
    setHintUsed(getStoredHintUsed());
  }

  function startNewGame(gameOfTheDay: GameOutput) {
    setStoredLatestDate(gameOfTheDay.date);
    setStoredCompleted(false);
    setGameTiles(gameOfTheDay.tiles);
    setStoredTileOrder(gameOfTheDay.tiles);
    setElapsedTime(0);
    setStoredElapsedTime(0);
    setStoredHintUsed(false);
    trackEvent('game started', {
      userId: getUserId(getStoredUserId, setStoredUserId),
      date: getTodaysDate()});
  }

  const [submitUserGameState] = useMutation(SUBMIT_USER_GAME, {
    onCompleted: (submitData) => {
      if (!submitData.submitUserGame.success) return;
      if (submitData.submitUserGame.solved) {
        setStoredStreak(submitData.submitUserGame.streak);
        setStoredCompleted(true);
        trackEvent('victory', {
          userId: getUserId(getStoredUserId, setStoredUserId), 
          elapsedTimeMs: elapsedTime, 
          elapsedTime: formatTime(elapsedTime), 
          date: getTodaysDate()});
        triggerVictory();
      }
    }
  });

  useEffect(() => {
    let interval = setInterval(() => {
      if (modalState === 'game' && !getStoredCompleted()) {
        setElapsedTime((elapsedTime) => elapsedTime + 100);
      }
    }, 100);
    if (!gameLoading) {
      setStoredElapsedTime(elapsedTime);
    }
    return () => {
      clearInterval(interval)
    }
  }, [gameTiles, elapsedTime, modalState])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    if (hintUsed && (event.over === null || gameTiles[4].pattern === event.over.id)) {
      setActiveId(null);
      return;
    }
    const { active, over } = event;

    if (over !== null && active.id !== over?.id) {
      let nextTiles: TileOutput[] = null;
      setGameTiles((gameTiles) => {
        const oldIndex = gameTiles.findIndex((tile) => tile.pattern === active.id);
        const newIndex = gameTiles.findIndex((tile) => tile.pattern === over.id);

        nextTiles = arraySwap(gameTiles, oldIndex, newIndex);
        if (getStoredCompleted() !== true) {
          setStoredTileOrder(nextTiles);
          if (solutionValid(nextTiles)) {
            submitGame(nextTiles);
          }
        }
        return nextTiles;
      });
    }
    setActiveId(null);
  }, [hintUsed]);

  function solutionValid(tiles: TileOutput[]) {
    for (let i = 0; i < tiles.length; i++) {
      let tile = tiles[i];
      if (i % 3 > 0) {
        let leftTile = tiles[i - 1];
        if (leftTile.adjustedPattern.charAt(3) !== tile.adjustedPattern.charAt(0) ||
          leftTile.adjustedPattern.charAt(4) !== tile.adjustedPattern.charAt(7)) {
          return false;
        }
      }
      if (i > 2) {
        let aboveTile = tiles[i - 3];
        if (aboveTile.adjustedPattern.charAt(5) !== tile.adjustedPattern.charAt(2) ||
          aboveTile.adjustedPattern.charAt(6) !== tile.adjustedPattern.charAt(1)) {
          return false;
        }
      }
    }
    return true;
  }

  function hint() {
    let nextTiles: TileOutput[] = null;
    setStoredHintUsed(true);
    setHintUsed(true);
    trackEvent('hint', {
      userId: getUserId(getStoredUserId, setStoredUserId), 
      elapsedTimeMs: elapsedTime, 
      elapsedTime: formatTime(elapsedTime), 
      date: getTodaysDate()});
    setGameTiles((gameTiles) => {
      const oldIndex = gameTiles.findIndex(tile => tile.solutionIndex === 4)!;
      const newIndex = 4; // Center tile

      nextTiles = arraySwap(gameTiles, oldIndex, newIndex);

      setStoredTileOrder(nextTiles);
      if (solutionValid(nextTiles)) {
        submitGame(nextTiles);
      }
      return nextTiles;
    });
  }

  function shuffle() {
    let nextTiles: TileOutput[] = null;
    setGameTiles((gameTiles) => {
      nextTiles = [...gameTiles];
      let currentIndex = nextTiles.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle
      while (currentIndex !== 0) {
    
        // Pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        // And swap it with the current element
        temporaryValue = nextTiles[currentIndex];
        nextTiles[currentIndex] = nextTiles[randomIndex];
        nextTiles[randomIndex] = temporaryValue;
      }

      if (hintUsed) {
        const oldIndex = nextTiles.findIndex(tile => tile.solutionIndex === 4)!;
        const newIndex = 4; // Center tile
  
        nextTiles = arraySwap(nextTiles, oldIndex, newIndex);
      }
      
      if (getStoredCompleted() !== true) {
        setStoredTileOrder(nextTiles);
      }
    
      return nextTiles;
    });
  }

  const triggerVictory = () => {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach((tile, index) => {
      setTimeout(() => {
        tile.classList.add('wave');
        setTimeout(() => {
          tile.classList.remove('wave');
        }, 1000);
      }, (index % 3) * 200);
    });
    setTimeout(() => {
      setModalState('victory');
    }, 1500)
  };

  const submitGame = (tiles: TileOutput[]) => {
    submitUserGameState({
      variables: {
        userId: getUserId(getStoredUserId, setStoredUserId),
        date: activeGameDate || getTodaysDate(),
        elapsedTime: getStoredElapsedTime(),
        tiles: tiles.map((tile) => {
          return {
            pattern: tile.pattern,
            rotation: tile.rotation
          }
        })
      }
    })
  }

  if (gameLoading || !gameExists || !gameTiles) return null;
  if (gameError) return <ErrorModal greetingIcon={greetingIcon}/>;

  return (
    <div>
      <GreetingModal 
        onGreetingClose={() => {
          setModalState('game');
          if (getStoredCompleted()) {
            setModalState('victory');
          }
        }}
        showModal={modalState === 'greeting'}
        gameNumber={getGameNumber()} 
        greetingIcon={greetingIcon}>
      </GreetingModal>
      <HelpModal 
        onHelpClose={() => setModalState('game')}
        showModal={modalState === 'help'}
        howToImg={howToImg}>
      </HelpModal>
      <VictoryModal 
        onVictoryClose={() => setModalState('game')}
        showModal={modalState === 'victory'}
        elapsedTime={formatTime(elapsedTime)}
        gameNumber={getGameNumber()} 
        streak={getStoredStreak()}
        hintUsed={hintUsed}>
      </VictoryModal>
      {
      modalState !== 'greeting' &&
        <div>
          <div style={{fontSize: window.innerWidth > 500 ? 100 : 80, fontWeight: 'bold'}}> Puzzli </div>
          <NavigationBar 
              onHelpOpen={() => setModalState('help')}
              onStatsOpen={() => setModalState('victory')}
              completed={(getStoredCompleted())}
              elapsedTime={formatTime(elapsedTime)} helpIcon={helpIcon} gitIcon={gitIcon} statsIcon={statsIcon}/>
          {
            gameExists ?
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={gameTiles.map(tile => tile.pattern)} strategy={rectSwappingStrategy}>
                <Grid columns={3}>
                  {gameTiles.map(tile => (
                    <SortableItem
                      id={tile.pattern}
                      key={tile.id}
                      pattern={tile.pattern}
                      rotation={tile.rotation}
                      activeId={activeId}
                      disabled={hintUsed && tile.solutionIndex === 4}
                    />
                  ))}
                </Grid>
              </SortableContext>
              <DragOverlay>
                {activeId ? (
                  <Item
                    pattern={gameTiles.find(tile => tile.pattern === activeId)!.pattern}
                    rotation={gameTiles.find(tile => tile.pattern === activeId)!.rotation}
                    isDragging
                    disabled={false}
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
            :
            <div style={{fontSize: 80}}> Error loading game. Check back soon! </div>
          }
        </div>
      }
      { numSolutions > 0 && 
        <div style={{fontSize: 22, margin: 15}}> 
          Total Solutions: <span style={{ color: getSolutionsFontColor(numSolutions) }}>{numSolutions}</span> 
        </div> 
      }
      <div style={{marginTop: numSolutions > 0 ? 0 : 40}}>
        <Button onClick={hint} className='game-button' disabled={hintUsed || getStoredCompleted()}>
          Hint 
        </Button>
        <Button onClick={shuffle} className='game-button' disabled={getStoredCompleted()}>
          Shuffle 
        </Button>
      </div>
    </div>
  );
}
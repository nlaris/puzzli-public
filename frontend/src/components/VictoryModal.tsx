import { useState } from "react";
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';
import CloseButton from 'react-bootstrap/CloseButton';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React from "react";

interface VictoryModalProps {
  onVictoryClose: ()=>void;
  showModal: boolean;
  elapsedTime: string;
  gameNumber: number;
  streak: number;
  hintUsed: boolean;
}

function VictoryModal(props: VictoryModalProps) {
  const [showToast, setShowToast] = useState(false);
  
  const width = Math.min(window.innerHeight, window.innerWidth) * 0.05;

  const getSquare = (lg: boolean, black: boolean) => {
    if (lg) {
      return black ? '⬛' : '⬜';
    }
    return black ? '◼️' : '◻️';
  }

  const getEmojis = (lg: boolean) => {
    let time: string[] = props.elapsedTime.split(":");
    let totalTime: number = +time[0] * 60 + +time[1];
    let results = '';
    for (let i = 1; i <= 9; i++) {
      results += i * 60 <= totalTime ? getSquare(lg, true) : getSquare(lg, false);
    }
    return results;
  }

  const getEmojisForModal = (emojis: string) => {
    return (
      <div>
        {emojis.substring(0, 3)}
        <br/> 
        {emojis.substring(3, 6)}
        <br/> 
        {emojis.substring(6, 9)}
      </div>
    )
  }

  const getEmojisToCopy = (emojis: string) => {
    return emojis.substring(0, 6) + "\n" +  emojis.substring(6, 12) + "\n" + emojis.substring(12, 18)
  }
  
  const copyResults = () => {
    navigator.clipboard.writeText(
      `Puzzli # ${props.gameNumber}\n` +
      `${props.elapsedTime}${props.hintUsed ? '💡' : ''}\n` +
      `${getEmojisToCopy(getEmojis(false))}`
    );
    setShowToast(true);
  }

  return (
    <>
      <Modal
        show={props.showModal}
        className='victory-modal'
        size='sm'
        animation={true}
      >
        <div className="close-button-container">
          <CloseButton onClick={() => props.onVictoryClose()} />
        </div>
        <Modal.Body style={{marginTop: width}}>
          <div style={{fontSize: 48, fontWeight: 'bold'}}> Congrats! </div>
          <div style={{fontSize: 32, marginTop: 10}}> Puzzli # {props.gameNumber} </div>
          <div style={{fontSize: 32, marginTop: 10}}> {getEmojisForModal(getEmojis(true))} </div>
          {props.hintUsed && <div style={{fontSize: 18, marginTop: 8}}> 💡 Hint Used </div>}
          <div style={{fontSize: 40, fontWeight: 'bold'}}> {props.elapsedTime} </div>
          <div style={{fontSize: 24}}> Streak: {props.streak} </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="primary"
            onClick={() => copyResults()} 
            style={{margin: 15, width: 120}}>
            Share Results
          </Button>
        </Modal.Footer>
        <ToastContainer position="middle-center">
          <Toast show={showToast} onClose={() => setShowToast(false)} delay={2000} autohide>
            <Toast.Body>Results copied to clipboard</Toast.Body>
          </Toast>
        </ToastContainer>
      </Modal>
    </>
  );
}

export default VictoryModal;
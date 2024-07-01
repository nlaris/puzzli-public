import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React from "react";

interface HelpModalProps {
  onHelpClose: ()=>void,
  showModal: boolean,
  howToImg: any
}

function HelpModal(props: HelpModalProps) {
  const width = Math.min(Math.min(window.innerHeight, window.innerWidth) * 0.8, 500);

  return (
    <>
      <Modal
        show={props.showModal}
        className='help-modal'
        size='lg'
        animation={true}
      >
        <Modal.Body style={{margin: window.innerHeight * .05}}>
          <div style={{fontSize: 48, fontWeight: 'bold'}}> How To Play </div>
          <div style={{fontSize: 24}}> Arrange the tiles to match<br/>all adjacent edges </div>
          <img src={props.howToImg} width={width} style={{ margin: 20, padding: 10 }} alt='how to play'/>
          <br/>
          <Button 
            variant="primary"
            onClick={() => props.onHelpClose()} 
            style={{width: 120}}>
            Play
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default HelpModal;
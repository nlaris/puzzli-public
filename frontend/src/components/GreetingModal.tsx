import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

interface GreetingModalProps {
  onGreetingClose: ()=>void,
  showModal: boolean,
  gameNumber: number,
  greetingIcon: any
}

function GreetingModal(props: GreetingModalProps) {
  return (
    <Modal
    show={props.showModal}
    className='greeting-modal'
    fullscreen={true}
    animation={false}
    >
      <Modal.Body style={{marginTop: window.innerHeight * .2}}>
        <img src={props.greetingIcon} width={100} style={{borderRadius: 12}} alt='icon'/>
        <div style={{fontSize: 70, fontWeight: 'bold'}}> Puzzli </div>
        <div style={{fontSize: 22}}> Arrange the tiles to match<br/>all adjacent edges </div>
        <Button 
          variant="primary"
          onClick={() => props.onGreetingClose()} 
          style={{margin: 20, width: 120}}>
          Start
        </Button>
        <div style={{fontSize: 24}}> {new Date().toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"}) } </div>
        <div style={{fontSize: 18}}> Game #{props.gameNumber} </div>
      </Modal.Body>
    </Modal>
  );
}

export default GreetingModal;
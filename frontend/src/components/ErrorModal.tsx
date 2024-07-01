import React from 'react';
import Modal from 'react-bootstrap/Modal';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function ErrorModal(icon: any) {
  return (
    <Modal
    show={true}
    className='greeting-modal'
    fullscreen={true}
    animation={false}
    >
      <Modal.Body style={{marginTop: window.innerHeight * .2}}>
        <img src={icon.greetingIcon} width={100} style={{borderRadius: 12}} alt='icon'/>
        <div style={{fontSize: 70, fontWeight: 'bold'}}> Puzzli </div>
        <div style={{fontSize: 30, marginBottom: 10}}> There's been an error.<br/>Check back soon! </div>
        <div style={{fontSize: 24}}> {new Date().toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"}) } </div>
      </Modal.Body>
    </Modal>
  );
}

export default ErrorModal;
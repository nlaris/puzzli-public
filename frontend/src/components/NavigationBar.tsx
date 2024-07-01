import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

interface NavigationBarProps {
  onStatsOpen: ()=>void,
  onHelpOpen: ()=>void,
  completed: boolean,
  elapsedTime: string,
  helpIcon: any,
  gitIcon: any,
  statsIcon: any,
}

function NavigationBar(props: NavigationBarProps) {

  function getFontColor() {
    return props.completed ? '#40c244' : 'black';
  }

  return (
    <Navbar style={{ marginBottom: 40, height: 40 }} className="bg-body-secondary">
      <Container>
        <Container />
        <div className="elapsed-time-container" style={{ color: getFontColor() }}>
          {props.elapsedTime}
        </div>
        <Container className="d-flex justify-content-end">
          {props.completed && (
            <img
              src={props.statsIcon}
              style={{ cursor: 'pointer' }}
              onClick={() => props.onStatsOpen()}
              className='icon'
              alt="stats"
            />
          )}
          <img
            src={props.helpIcon}
            style={{ cursor: 'pointer' }}
            onClick={() => props.onHelpOpen()}
            className='icon'
            alt="help"
          />
          {/* <a onClick={() => window.open("https://github.com/nlaris/puzzli-public", "_blank")}>
            <img
              src={props.gitIcon}
              style={{ cursor: 'pointer' }}
              className='icon'
              alt="github"
            />
          </a> */}
        </Container>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;

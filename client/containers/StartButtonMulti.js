import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { startCountdown, storeGameId, syncMultiplayerStatuses } from '../actions/index';
import { bindActionCreators } from 'redux';

class StartButtonMulti extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: 'Start!',
      buttonType: 'btn btn-raised btn-primary',
      buttonDisabled: false,
      handleMultiCalled: false
    }
  };

  componentDidUpdate() {
    // Listen for a 'multigame start' event from socket
    if (this.props.countingDown !== 'START_COUNTDOWN') {
      this.props.socket.on('multigame start', function(players) {
        this.startGameFromSocket();
        this.props.syncMultiplayerStatuses(players);
      }.bind(this));
    }
  };

  handleClick() {
    // startCountdown action
    if (!this.state.buttonDisabled) {
      this.props.startCountdown();

      // emit event to socket that multigame is starting
      this.props.socket.emit('game start', true, this.props.savedGame);

      this.setState({
        text: 'Go!',
        buttonType: 'go-btn btn btn-success',
        buttonDisabled: true
      });
    }
  };

  startGameFromSocket() {
    // startCountdown action
    this.props.startCountdown();

    this.setState({
      text: 'Go!',
      buttonType: 'go-btn btn btn-success',
      buttonDisabled: true
    });
  };

  render() {
    if (this.props.countingDown === 'START_COUNTDOWN') {
      return null;
    }

    return (
      <div className="row text-center" id="start-btn-container">
        <button
          id="start-btn"
          type="button"
          onClick={this.handleClick.bind(this)}
          className={this.state.buttonType}>
          {this.state.text}
        </button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    countingDown: state.countingDown,
    savedGame: state.savedGame
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({startCountdown: startCountdown, syncMultiplayerStatuses: syncMultiplayerStatuses, storeGameId: storeGameId }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StartButtonMulti)

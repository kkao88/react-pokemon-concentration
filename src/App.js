import React, { Component } from 'react';
import './App.css';
import _ from 'lodash';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
var classNames = require('classnames');

class Square extends React.Component {
  buttonStyle = {
    width: '235px',
    height: '300px',
    backgroundColor: 'white'
  };

  render() {
    var btnClass = {
      'unflipped-square': !(this.props.isTurned || this.props.permaTurned)
    };

    if (this.props.isTurned || this.props.permaTurned){
      btnClass[this.props.img] = true;
    }

    return (
        <button style={this.buttonStyle}
                onClick={() => this.props.onClick()} className={classNames(btnClass)}></button>
    );
  }
}

class App extends Component {

  constructor() {
    super();

    this.initialSquares = [{value: '1', img: 'bellsprout'}, {value: '1', img: 'bellsprout'}, {value: '0', img: 'oddish'}, {value: '0', img: 'oddish'},
      {value: '2', img: 'poliwag'}, {value: '2', img: 'poliwag'}, {value: '3', img: 'vulpix'}, {value: '3', img: 'vulpix'},
      {value: '4', img: 'meowth'}, {value: '4', img: 'meowth'}, {value: '5', img: 'pikachu'}, {value: '5', img: 'pikachu'},
      {value: '6', img: 'kabuto'}, {value: '6', img: 'kabuto'}, {value: '7', img: 'weedle'}, {value: '7', img: 'weedle'}];

    this.state = {
      squares: this.shuffleSquares(),
      tempTurnedCards: 0,
      movesRemaining: 15
    };
  }

  shuffleSquares() {
    return _.flatMap(_.shuffle(this.initialSquares), function(element, index){return {index: index, value: element.value, img: element.img}});
  }

  reset() {
    this.setState({
      squares: this.shuffleSquares(),
      tempTurnedCards: 0,
      movesRemaining: 15
    })
  }

  getStatus() {
    if (_.every(this.state.squares, {'permaTurned': true})){
      return 'Your Winner!';
    }
    else if (this.state.movesRemaining === 0){
      return 'Your Loser!';
    }
  }

  findTurnedCards() {
    return _.filter(this.state.squares, { 'turned': true});
  }

  handleClick(i) {

    if (this.state.squares[i].turned || this.state.squares[i].permaTurned ||
        this.getStatus() === 'Your Winner!' || this.getStatus() === 'Your Loser!' ||
        _.filter(this.state.squares, function(square){return square.turned;}).length >= 2) {
      return;
    }

    var squares = this.state.squares.slice();
    squares[i].turned = true;
    this.setState({
      squares: squares
    });

    if (this.state.tempTurnedCards === 0){
      this.setState({tempTurnedCards: 1});
    }
    else {
      var turnedCards = this.findTurnedCards();
      if (turnedCards[0].value === turnedCards[1].value){
        squares[turnedCards[0].index].permaTurned = true;
        squares[turnedCards[1].index].permaTurned = true;
        squares.forEach((square) => square.turned = false);
        this.setState({squares: squares, tempTurnedCards: 0, movesRemaining: this.state.movesRemaining - 1});
      }
      else {
        setTimeout(function() {
          squares.forEach((square) => square.turned = false);
          this.setState({squares: squares, tempTurnedCards: 0, movesRemaining: this.state.movesRemaining - 1});
        }.bind(this), 3000);
      }
    }
  }

  renderSquare(index){
    return <Square key={index} onClick={() => this.handleClick(index)} isTurned={this.state.squares[index].turned} permaTurned={this.state.squares[index].permaTurned}
                   img={this.state.squares[index].img} value={this.state.squares[index].value}></Square>;
  }

  render() {
    let status = (this.getStatus());

    return (
        <div className="container">
          <h1>{status}</h1>
          <h3>Moves Remaining: {this.state.movesRemaining}</h3>
          {this.state.squares.map((square, index) => this.renderSquare(index))}
          <div className="row"><button onClick={() => this.reset()}>Reset</button></div>
        </div>
    );
  }
}

export default App;

import React from 'react'


// Suggested initial states
const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at
const emailValid = true;

export default class AppClass extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
      isEmailValid: emailValid,
    };
  }


  getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    let x = (this.state.index % 3) + 1;
    let y;
    if (this.state.index < 3) y = 1;
    else if (this.state.index >= 3 && this.state.index < 6 ) y = 2;
    else if (this.state.index >= 6 && this.state.index < 9 ) y = 3;
    return [x, y];

    }

  
  getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    
    const [x, y] = this.getXY();
    return `Coordinates (${x}, ${y})`;
  }

  reset() {
     // Use this helper to reset all states to their initial values.
    this.setState({
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
    });

  }

  getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.

    const { index } = this.state;

    switch (direction) {
      case 'up':
        return index < 3 ? index : index - 3;
      case 'down':
        return index > 5 ? index : index + 3;
      case 'left':
        return index % 3 === 0 ? index : index - 1;
      case 'right':
        return (index - 2) % 3 === 0 ? index : index + 1;
      default: 
        return index;
    }
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.id;
    const nextIndex = this.getNextIndex(direction);

    if (nextIndex !== this.state.index) {
      this.setState((prevState) => ({
        index: nextIndex,
        steps: prevState.steps + 1,
        message: initialMessage,
      }));
    } else {
      this.setState({ message: `You can't go ${direction}` })
    }
  };

  updateMessage() {
    const message = this.getXYMessage();
    this.setState({ message });
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    const newEmail = evt.target.value;
    this.setState({ email: newEmail });
  };

  validateEmail(email) {
    return true;
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();

    if (!this.state.email) {
      this.setState({ message: 'Ouch: email is required' });
      return;
    }

    this.setState({ email: initialEmail });

    const [x, y] = this.getXY();

    const payload = {
      x,
      y,
      steps: this.state.steps,
      email: this.state.email,
    };

    console.log(payload)
    
    fetch('http://localhost:9000/api/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('res:', data);
        this.setState({ message: data.message });
      })
      .catch((error) => {
        console.error('Error w/ request:', error)
      });
  };

  gridMap() {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
      <div 
      key={idx}
      className={`square${idx === this.state.index ? ' active' : ''}`}
      >
        {idx === this.state.index ? 'B' : null}
      </div>
    ));
  }

  getMoveMessage() {
    const { steps } = this.state;
    if ( steps === 1) {
      return `You moved ${steps} time`;
    } else {
      return `You moved ${steps} times`;
    }
  }


  render() {
    return (
      <div id="wrapper" className={this.props.className}>
        <div className="info">
          <h3 id="steps">{this.getMoveMessage()}</h3>
          <h3 id="coordinates">{this.getXYMessage()}</h3>
        </div>

        <div id="grid"> {this.gridMap()} </div>

        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move} >LEFT</button>
          <button id="up"   onClick={this.move} >UP</button>
          <button id="right" onClick={this.move}>RIGHT</button>
          <button id="down"  onClick={this.move}>DOWN</button>
          <button id="reset" onClick={() => this.reset()}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input 
          id="email" 
          type="email" 
          placeholder="type email"
          onChange={this.onChange}
          value={this.state.email}
          />

          <button id="submit" type="submit">
            Submit NOW
          </button>
         
        </form>
      </div>
    );
  }
}

import React, {useState} from 'react'

// Suggested initial states
const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at
//const initialMoveMsg = '';
const emailValid = true;


export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [index, setIndex] = useState(initialIndex);
  const [steps, setSteps] = useState(initialSteps);
  const [isEmailValid, setIsEmailValid] = useState(emailValid);

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    let x = (index % 3) + 1
    let y 
    if (index < 3) y = 1
    else if (index >= 3 && index < 6) y = 2
    else if (index >= 6 && index < 9) y = 3
    return [x, y]

  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const [x, y] = getXY();
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
      switch (direction) {
        case 'up':
          return (index < 3) ? index : index - 3
        case 'down':
          return (index > 5) ? index : index + 3
        case 'left':
          return (index % 3 === 0) ? index : index - 1
        case 'right':
          return ((index - 2) % 3 === 0) ? index : index + 1
      }
    }
  

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.id;
    const nextIndex = getNextIndex(direction);

    if (nextIndex !== index) {
      setIndex(nextIndex) 
      setSteps(steps + 1)
      setMessage(initialMessage)
      } else {
        setMessage(`You can't go ${direction}`)
      }
    }
    
  

  //function updateMessage(){
  //  const message = getXYMessage()
  //  setMessage(message)
 // }
  
  function onChange(evt) {
    // You will need this to update the value of the input.
    const newEmail = evt.target.value;
    setEmail(newEmail);
    setIsEmailValid(validateEmail(newEmail))
  }

  function validateEmail(email) {
    return true;
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()

    if(!email) {
      setMessage("Ouch: email is required")
    }

    setEmail(initialEmail)

    const [x, y] = getXY()

    const payload = {
      x,
      y,
      steps,
      email,
    };
    console.log(payload)

    fetch('http://localhost:9000/api/result' , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('res:', data);
      setMessage(data.message);
    })
    .catch((error) => {
      console.error('Error w/ request:', error);
    });
  }

  function gridMap() {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
      <div key={idx} className={`square${idx === index ? 'active' : ''}`}>
        {idx === index ? 'B' : null}
      </div>
    ))
  }

  function getMoveMessage() {
    if(steps === 1) {
      return `You moved ${steps} time`;
    } else {
      return `You moved ${steps} times`
    }
  }

  

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">{getMoveMessage()}</h3>
      </div>
      <div id="grid">{gridMap()}</div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" onChange={onChange} value={email}></input>
        <button id="submit" type="submit"> Submit NOW</button>
      </form>
    </div>
  )
}

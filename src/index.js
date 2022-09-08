import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const Square = ({ value, onClick }) => {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
};

const Board = ({
  sticks,
  setSticks,
  pickList,
  setPickList,
  pickRow,
  setPickRow,
}) => {
  const handleClick = (row, col) => {
    const stick = sticks[row][col];
    if (stick === 1 && pickList.length === 0) {
      setPickRow(row);
    }
    if (pickRow !== null && pickRow !== row && pickList.length !== 0) {
      alert("不能跨行选择！");
      return;
    }
    const newSticks = sticks.map((stickRow, r) => {
      if (row === r) {
        return stickRow.map((stick, c) => {
          if (col === c) {
            if (stick === 0 && pickList.includes(c)) {
              const newPickList = pickList.filter((pick) => pick !== c);
              setPickList(newPickList);
              return 1;
            } else if (stick === 1) {
              const newPickList = [...pickList, c];
              setPickList(newPickList);
              return 0;
            }
          }
          return stick;
        });
      }
      return stickRow;
    });
    setSticks(newSticks);
  };

  return (
    <div>
      {sticks.map((stickRow, row) => {
        return (
          <div key={row} className="board-row">
            {stickRow.map((stick, col) => {
              return (
                <Square
                  key={col}
                  value={stick}
                  onClick={() => handleClick(row, col)}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const Game = () => {
  const [sticks, setSticks] = useState([
    [1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ]);
  const [player, setPlayer] = useState("A");
  const [pickRow, setPickRow] = useState(null);
  const [pickList, setPickList] = useState([]);

  const winner = calculateWinner(sticks, player);

  let status = "";
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = `The next player is: ${player}`;
  }

  const handleClickConfirm = () => {
    if (pickList.length === 0 || winner) {
      return;
    }
    const newPlayer = player === "A" ? "B" : "A";
    setPlayer(newPlayer);
    setPickRow(null);
    setPickList([]);
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board
          sticks={sticks}
          setSticks={setSticks}
          pickRow={pickRow}
          setPickRow={(row) => setPickRow(row)}
          pickList={pickList}
          setPickList={(pickList) => setPickList(pickList)}
        />
        <p>click to start game !</p>
        <button className="button" onClick={handleClickConfirm}>
          confirm picking
        </button>
        <button className="button" onClick={() => window.location.reload()}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
      </div>
    </div>
  );
};

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

const calculateWinner = (sticks, player) => {
  const gameOver = sticks.every((sticksRow) =>
    sticksRow.every((stick) => stick === 0)
  );
  if (gameOver) {
    return player === "A" ? "B" : "A";
  }
  return null;
};

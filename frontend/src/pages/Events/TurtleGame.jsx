// TurtleGame.jsx
import { useState } from "react";
import Confetti from "react-confetti"; // Import the Confetti component
import turtle1 from "../../images/game/turtle1.png";
import turtle2 from "../../images/game/turtle2.png";
import turtle3 from "../../images/game/turtle3.png";
import turtle4 from "../../images/game/turtle4.png";

const images = [turtle1, turtle2, turtle3, turtle4];
const correctOrder = [turtle1, turtle3, turtle4, turtle2]; // Define the correct order

const TurtleGame = () => {
  const initialBoard = [...images, null].sort(() => Math.random() - 0.5);
  const [board, setBoard] = useState(initialBoard);
  const [message, setMessage] = useState("");
  const [win, setWin] = useState(false); // State to manage winning condition

  const handleTileClick = (index) => {
    if (board[index] === null) return; // Can't move a null tile

    const emptyIndex = board.indexOf(null);
    const isAdjacent = [index - 1, index + 1, index - 2, index + 2].includes(
      emptyIndex
    );

    if (isAdjacent) {
      const newBoard = [...board];
      [newBoard[index], newBoard[emptyIndex]] = [
        newBoard[emptyIndex],
        newBoard[index],
      ];
      setBoard(newBoard);
    }
  };

  const checkWinningCondition = () => {
    const currentOrder = board.filter((img) => img !== null); // Filter out the null value
    if (JSON.stringify(currentOrder) === JSON.stringify(correctOrder)) {
      setMessage("You Win!");
      setWin(true); // Set win state to true
    } else {
      setMessage("Not yet, keep trying!");
      setWin(false); // Reset win state
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      {win && <Confetti />} {/* Render confetti when the user wins */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Turtle Puzzle Game
      </h1>
      <div className="grid grid-cols-2 gap-2 p-4 shadow-lg rounded-lg bg-white transform transition-transform hover:scale-105">
        {board.map((image, index) => (
          <div
            key={index}
            className="relative w-36 h-36 border-2 border-gray-300 cursor-pointer flex items-center justify-center transition-transform duration-200 hover:shadow-lg"
            onClick={() => handleTileClick(index)}
          >
            {image ? (
              <img
                src={image}
                alt={`Turtle ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300" />
            )}
          </div>
        ))}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={checkWinningCondition}
      >
        Submit
      </button>
      {message && <div className="mt-4 text-xl text-green-500">{message}</div>}
    </div>
  );
};

export default TurtleGame;

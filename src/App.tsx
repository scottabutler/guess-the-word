import { useEffect, useState } from "react";
import "./App.css";
import { PopularWords } from "./popularWords";

function App() {
    const [guesses, setGuesses] = useState<string[]>([]);
    const [guess, setGuess] = useState("");
    const [message, setMessage] = useState("");
    const [lastGuess, setLastGuess] = useState("");
    const [solved, setSolved] = useState(false);

    const [solution, _setSolution] = useState(PopularWords[randomIntFromInterval(0, PopularWords.length - 1)]);

    const [preGuesses, setPreGuesses] = useState<string[]>([]);
    const [postGuesses, setPostGuesses] = useState<string[]>([]);

    useEffect(() => {
        setPreGuesses(guesses.filter((x) => x < solution).sort((a, b) => a < b ? -1 : a > b ? 1 : 0));
        setPostGuesses(guesses.filter((x) => x > solution).sort((a, b) => a < b ? -1 : a > b ? 1 : 0));
    }, [guesses]);

    // https://stackoverflow.com/a/7228322
    function randomIntFromInterval(min: number, max: number) {
        // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        // Clear any existing message
        if (message)
            setMessage("");

        // Activate on Enter press
        if (event.key === "Enter") {

            // Lowercase the guess to prevent case conflicts
            const lowerGuess = guess.toLowerCase().trim();

            // If they've already guessed this word, ignore it
            if (guesses.includes(lowerGuess)) {
                setGuess("");
                return;
            }

            // If the guess is not between the two closest words, ignore it
            if (preGuesses.length > 0 && lowerGuess < preGuesses[preGuesses.length-1] ||
                postGuesses.length > 0 && lowerGuess > postGuesses[0]
            ) {
                setMessage("Your guess was before/after previous guesses.")
                setGuess("");
                return;
            }

            // Only check words that exist in the list
            if (PopularWords.includes(lowerGuess)) {

                // Add it to the list of guesses
                setGuesses([lowerGuess, ...guesses]);
                setLastGuess(lowerGuess);

                // Check if they've found the solution
                if (lowerGuess === solution) {
                    setSolved(true);
                    setMessage(`You win! You took ${guesses.length+1} guess(es).`)
                }

                // Clear the input field ready for another guess
                setGuess("");
            } else {
                setMessage("Word not in list");
            }
        }
    };

    const directionIndicator = !lastGuess
        ? <></>
        : lastGuess > solution
            ? <span>⬆️</span>
            : <span>⬇️</span>

    const letterDashes = solution.split('').map(_ => '_ ');

    return (
        <>
            <h1>Guess the Word</h1>
            <div className="card">
                {preGuesses.map((x) => {
                    return <p className="guess" key={`word-${x}`}>{x}</p>;
                })}
                {solved && <h3>✅ {solution} ✅</h3>}
                {!solved && <p>
                    {directionIndicator} <input
                        type="text"
                        placeholder="Guess a word"
                        value={guess}
                        onChange={(evt) => setGuess(evt.currentTarget.value)}
                        onKeyDown={handleKeyPress}
                    /> {directionIndicator}
                </p>}
                <p>{message}</p>
                {guesses.length >= 20 && <p>Hint: {letterDashes}</p>}
                {postGuesses.map((x) => {
                    return <p className="guess" key={`word-${x}`}>{x}</p>;
                })}
                <p>Guess count: {guesses.length}</p>
            </div>
        </>
    );
}

export default App;

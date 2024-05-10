import { useEffect, useState } from "react";
import sourceCode from "./SourceCode";

function userData() {
  const data = JSON.parse(localStorage.getItem("data"));
  if (!Array.isArray(data)) {
    return [];
  } else {
    return data;
  }
}

function App() {
  const [BreakLength, setBreakLength] = useState(5);
  const [SessionLength, setSessionLength] = useState(25);
  const [minutes, setMinutes] = useState(SessionLength);
  const [seconds, setSeconds] = useState(0);
  const [playBtn, setPlayBtn] = useState(false);
  const [int, setInt] = useState(null);
  const [handleBreak, setHandleBreak] = useState(false);
  const [reloadBreak, setReloadBreak] = useState(false);
  const [check, setCheck] = useState(false);
  const [allData, setAllData] = useState(userData());
  const audio = new Audio('aud1.mp3');

  function reset() {
    window.location.reload();
  }

  function incLength(data, setData) {
    setData(data <= 59 ? data + 1 : data);
  }

  function decLength(data, setData) {
    setData(data >= 2 ? data - 1 : data);
  }

  //it change the state of the minutes when session length  complete.
  useEffect(() => {
    setMinutes(handleBreak ? BreakLength : SessionLength);
  }, [SessionLength, BreakLength, handleBreak]);

  useEffect(() => {
    if (!reloadBreak && minutes === -1) {

      //if session length completed then set the minutes according to break length
      setMinutes(BreakLength);

      // if session length done then in minutes state break length will automatically add.
      setHandleBreak(true);

      //this is for if minutes == -1 then interval stop
      clearInterval(int);

      //play beep sound
      // audio.play();

      //this is for the alerting the user
      if (!reloadBreak) {
        audio.play();
        setTimeout(() => {
          alert("session done start break time")
        }, 100);
        
      }

      //setSeconds=0,because new breaklength came as session length and it will count form starting
      setSeconds(0);

      //i set true because if this useEffect run again then it will execute the next 'if' condition code, because this 'if' condition run for the session and break length,and next 'if' run if both time will complete
      setReloadBreak(true);

      //i set false because in startCounting function could run the interval
      setPlayBtn(false);
    }



    //it run if break and session length both will complete
    if (reloadBreak && minutes == -1) {
      clearInterval(int);
      audio.play();
      setTimeout(() => {
        alert("this session done completely if you want to set another session then start again")
      }, 100);
      const dateEl = new Date().toLocaleString(navigator.language);    
      setAllData(prev => [...prev, dateEl]);
      setTimeout(() => {
        window.location.reload();
      }, 110);
    }

    return ()=>{
      audio.currentTime=0;
    };


  }, [minutes, int, BreakLength, reloadBreak, seconds]);



  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(allData));
  }, [allData]);


  //this is for update seconds and minutes according to condition
  useEffect(() => {
    if (seconds === 0 && check) {
      setSeconds(60);
      setMinutes((prev) => prev - 1);
    }
  }, [seconds, check]);



  function startCounting() {
    // true because for set the seconds 60 when seconds reach at '0'
    setCheck(true);

    // this run according to playBtn boolean because I update the play and pause icon,and also for utilizing the paly & pause functionality
    if (!playBtn) {
      //it is true because if we call this startCounting function again then it will run the "else" condition code and stop the timer
      setPlayBtn(true);

      //this interval change the seconds every second
      setInt(
        setInterval(() => {
          setSeconds((prev) => prev - 1);
        }, 1000)
      );
    } else {
      //this is for pausing the time

      setPlayBtn(false);
      clearInterval(int);
    }
  }

  return (
    <>
      <div className=" mt-4 flex flex-col self-center shadow-md shadow-black mb-4 w-[95vw] p-5 bg-blue-900 rounded-lg ">
        • Developed & Designed by Ayaz Khan at 09-05-2024
        <a href="https://www.linkedin.com/in/ayaz-khan-8750o" className="text-sky-400" target="_blank">• LinkedIn Profile</a>
      </div>


      <div className="w-fit mt-4 text-base sm:text-2xl bg-blue-900 p-5 rounded-xl shadow-lg shadow-black m-auto ">
        <h1 className="p-4 text-red-400 rounded-md bg-black font-bold text-center mb-8">
          25 + 5 Clock (Pomodoro clock)
        </h1>

        <div className=" flex flex-row justify-between align-middle ">
          <div className=" text-center p-4  rounded-md bg-black flex flex-col mb-3 justify-between align-middle">
            <h2>Break Length</h2>
            <div className=" flex flex-row justify-around align-middle ">
              <i
                onClick={() => incLength(BreakLength, setBreakLength)}
                className="fa-solid fa-arrow-up"
              ></i>
              <h2 className="text-lime-600">{BreakLength}</h2>
              <i
                onClick={() => decLength(BreakLength, setBreakLength)}
                className="fa-solid fa-arrow-down"
              ></i>
            </div>
          </div>

          <div className="p-4 text-center rounded-md bg-black mb-3 flex flex-col justify-between align-middle ml-8">
            <h2>Session Length</h2>
            <div className="flex flex-row justify-around align-middle">
              <i
                onClick={() => incLength(SessionLength, setSessionLength)}
                className="fa-solid fa-arrow-up"
              ></i>
              <h2 className="text-lime-600">{SessionLength}</h2>
              <i
                onClick={() => decLength(SessionLength, setSessionLength)}
                className="fa-solid fa-arrow-down"
              ></i>
            </div>
          </div>
        </div>

        {/*time box */}
        <div className="text-lime-500 rounded-md text-2xl sm:text-4xl bg-black p-4 border-2 border-black text-center">
          <h3 className="m-2 text-center">{`${handleBreak ? "break left" : "session left"
            }`}</h3>
          {`${minutes}:${seconds}`}
        </div>

        {/* buttons */}
        <div className="rounded-md p-4  bg-black flex flex-row justify-center m-5 align-middle">
          {/* <i onClick={pause} className="m-5 fa-solid fa-pause"></i> */}
          <i
            onClick={startCounting}
            className={`text-2xl sm:text-4xl m-5 fa-solid fa-${playBtn ? "pause" : "play"}`}
          />
          <i
            onClick={reset}
            className="text-2xl sm:text-4xl m-5 fa-solid fa-rotate-right"
          ></i>

          {/* <audio
            id="beep"
            src="aud1.mp3"
          ></audio> */}
        </div>
      </div>

      <br />

      {/* completed session box */}
      <div className="w-[95vw] flex flex-col self-center shadow-md shadow-black mb-4 p-5 bg-black rounded-lg">
        <h1 className=" text-lg bg-blue-900 p-3 rounded-md ">
          Your all completed session is here :-
        </h1>

        {(allData && allData.length > 0) ?
          allData.map((val, ind) => {
            return (
              <div key={ind} className="mt-2 mb-1 text-lg bg-indigo-900 p-3 rounded-md ">
                {ind + 1} - {val}
              </div>
            );
          })
          :<div className="mt-2 mb-1 text-lg bg-indigo-900 p-3 rounded-md ">
                empty...
              </div>
        }

        <button className="mt-2 mb-1 text-lg bg-red-900 p-3 rounded-md " onClick={() => setAllData([])}>Delete All</button>
      </div>

      {/* this is for showing source code on browser */}
      <div className="flex flex-col self-center shadow-md shadow-black mb-4 w-[95vw] p-5 bg-black rounded-lg">
        <h1 className=" text-2xl bg-blue-800 p-3 rounded-md ">
          source code of App.jsx
        </h1>
        <pre className=" text-lime-400 text-wrap p-6 break-words">
          {sourceCode}
        </pre>
      </div>
    </>
  );
}

export default App;

 const sourceCode = `
import { useEffect, useState } from "react";

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
  const [handleBreak,setHandleBreak]=useState(false);
  const [reloadBreak,setReloadBreak]=useState(false);
  const [check,setCheck] =useState(false);
  const alarmSound=document.getElementById('beep');
  const [allData, setAllData] = useState(userData());

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
    setMinutes(handleBreak?BreakLength:SessionLength);
  }, [SessionLength,BreakLength,handleBreak]);


  useEffect(() => {

    if (!reloadBreak && minutes === -1) {
      //if session length completed then set the minutes according to break length
      setMinutes(BreakLength);

      // if session length done then in minutes state break length will automatically add.
      setHandleBreak(true);

      //this is for if minutes == -1 then interval stop
      clearInterval(int);

      //play beep sound 
      alarmSound.play();
      
      //this is for the alerting the user 
      if(!reloadBreak){alert("session done start break time")}

      //setSeconds=0,because new breaklength came as session length and it will count form starting
      setSeconds(0);

      //i set true because if this useEffect run again then it will execute the next 'if' condition code, because this 'if' condition run for the session and break length,and next 'if' run if both time will complete
      setReloadBreak(true);

      //i set false because in startCounting function could run the interval
      setPlayBtn(false);
    }

    //it run if break and session length both will complete
    if(reloadBreak && minutes == -1){
      clearInterval(int);
      alarmSound.play();
      alert("this session done completely if you want to set another session then start again");
      const dateEl = new Date().toLocaleString('en-US', { timeZone: 'UTC' });
      setAllData(prev=>[...prev,dateEl]);
      window.location.reload();
    } 

  }, [minutes, int,BreakLength,reloadBreak,seconds,alarmSound]);

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(allData));
  }, [allData]);


  //this is for update seconds and minutes according to condition
  useEffect(()=>{
    if(seconds===0 && check){
    setSeconds(60);
    setMinutes((prev) => prev - 1)}
  },[seconds,check]);

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
    } 
    else {
      //this is for pausing the time 

      setPlayBtn(false);
      clearInterval(int);
    }
  }
  return (
    <> 
  

    <div className=" text-2xl bg-slate-900 p-5 rounded-xl shadow-lg shadow-black">
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
      <div className="text-lime-500 rounded-md text-4xl bg-black p-4 border-2 border-black text-center">
        <h3 className="m-2 text-center">{\`\${handleBreak ? "break left" : "session left"}\`}</h3>
        {\`\${minutes}:\${seconds}\`}
      </div>
      <div className="rounded-md p-4  bg-black flex flex-row justify-center m-5 align-middle">
        <i
          onClick={startCounting}
          className={\`text-4xl m-5 fa-solid fa-\${playBtn ? "pause" : "play"}\`}
        />
        <i
          onClick={reset}
          className="text-4xl m-5 fa-solid fa-rotate-right"
        ></i>
        <audio id="beep" src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"></audio>
      </div>
    </div>


    <div className="flex flex-col self-center shadow-md shadow-black mb-4 w-[90vw] p-5 bg-black rounded-lg">
        <h1 className=" text-2xl bg-blue-900 p-3 rounded-md ">
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
        <button className="mt-2 mb-1 text-2xl bg-red-900 p-3 rounded-md " onClick={()=>setAllData([])}>Delete All</button>
      </div>
      </>
  );
}

export default App;
`;


export default sourceCode;

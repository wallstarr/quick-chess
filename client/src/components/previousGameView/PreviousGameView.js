import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Chessboard from "chessboardjsx";
import {NavLink, Outlet, useNavigate} from "react-router-dom";
import {analysisView, normalView} from "../../RouteString/RouteString";
import {getAnalysis} from "../../Redux/Action/Analysis";
import { LinearProgress } from '@mui/material';
import {NavBar} from "../NavBar/NavBar";



export default function PreviousGameView() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currIndx = useSelector(state=>state.PrevGameView.currIdx);
    const currPGNObj =  JSON.parse(useSelector(state=> state.PrevGameView.PGNOBJ));
    const result = currPGNObj.result
    const positionFENStr = currPGNObj.prevMoveListFEN[currIndx];
    let squareStyle = {};
    const [progressBar, setProgressBar] = useState(false)

    if (currIndx !== 0)   {
        const currFrom = currPGNObj.transition[currIndx - 1].from
        const currTo =  currPGNObj.transition[currIndx - 1].to
        squareStyle[currFrom] =  {backgroundColor: 'yellow'}
        squareStyle[currTo] = {backgroundColor: 'yellow'}
    }

    const handleAnalysisView =  async (e) => {
        e.preventDefault();
        await dispatch(getAnalysis(result))
        setProgressBar(false);
        navigate(analysisView)
    }

    useEffect(()=>{
        navigate(normalView);
    }, [])
  return (
    <>
        <div
            id={"PrevGameView"}
            className={"h-fit m-[2rem]"}
        >
            <div
                className={"h-[1%] p-[1rem]"}
                id={"NavBar"}
            >
                <NavBar />
            </div>
            <div
                id={"Header"}
                className={"h-[15%] p-[1rem] item-center"}
            >
                <span className={"text-3xl text-center text-custom-black"}><h1></h1></span>
            </div>
            <div
                id={"MainComponents"}
                className={"min-h-[650px] flex flex-row gap-x-[5rem] items-stretch justify-center p-[2rem]"}
            >
                <Chessboard
                            boardStyle={
                                {
                                    height: "600px"
                                }
                            }
                            position={positionFENStr}
                            draggable={false}
                            squareStyles={squareStyle} />
                <div
                    className={"flex flex-col min-h-[650x] w-[100%] bg-custom-grey rounded-lg "}
                >
                   <div
                       className={"grid grid-cols-2 h-[20%] w-[95%] p-[1rem]"}
                   >
                       <NavLink
                           className={(state)=> state.isActive ?  "text-white no-underline font-bold text-lg p-[2rem] mr-2 " +
                               "flex justify-center items-center backdrop-blur-md rounded-xl " +
                               "hover:bg-custom-black font-bold " +
                               " " +
                               "z-0"
                               :
                               "text-white no-underline font-bold text-lg p-[2rem] " +
                               "flex justify-center items-center rounded-xl" +
                               "hover:bg-custom-black font-bold " +
                               "z-1 " +
                               "shadow-custom-black shadow-[inset_0px_0px_10px_0.25px] p-[2rem] " }
                           to={normalView} >Normal View</NavLink>
                       <NavLink
                           className={(state)=> state.isActive ?  "text-white no-underline font-bold text-lg " +
                               "flex justify-center items-center rounded-xl " +
                               "hover:bg-custom-black font-bold " +
                               " " +
                               "z-0"
                               :
                               "text-white no-underline font-bold text-lg p-[2rem] ml-2 " +
                               "flex justify-center items-center rounded-xl" +
                               "hover:bg-custom-black font-bold " +
                               "z-1 " +
                               " " +
                               "shadow-custom-black rounded-xl shadow-[inset_0px_0px_10px_0.25px]" }
                           state={currIndx}
                           onClick = {async (e)=> {
                               setProgressBar(true)
                               await handleAnalysisView(e)
                           }}
                           to={analysisView}>Analysis View</NavLink>
                   </div>
                    {progressBar ? <LinearProgress />: ""}
                    <div
                        className={"h-[80%] w-[100%] "}
                    >
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    </>
  );
}

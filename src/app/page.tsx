'use client'

import { useState } from "react";
import stations from './stations.json';

export default function Home() {
  const [trenId, setTrenId] = useState("");
  const [lastStop, setLastStop] = useState("");

  const buscarTren = async () => {
    const response = await fetch(`https://api.transportam.cat/adif/train/${trenId}?all_control_points=true`);
    const data = await response.json();
    const lastStopCode = data[0]?.passthroughSteps?.findLast((x: { arrivalPassthroughStepSides: { timeType: string; }; }) => x.arrivalPassthroughStepSides?.timeType === "AUDITED")?.stationCode as keyof typeof stations;
    if(lastStopCode !== null) {
      setLastStop(stations[lastStopCode]?.stop_name ?? lastStopCode);
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <input type="text" onChange={(e) => setTrenId(e.target.value)} className="border" />
        <button onClick={(e) => {buscarTren(); e.preventDefault()}} className="border">Buscar</button>
        <p>Ultima estació: { lastStop }</p>
      </main>
    </div>
  );
}

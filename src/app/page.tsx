'use client'

import { useState } from "react";
import stations from './stations.json';
import moment from 'moment-timezone';
import useNetworkStatus from "@/hooks/network-status";

export default function Home() {
  const [trainId, setTrainId] = useState("");
  const [lastStop, setLastStop] = useState("");
  const [lastTime, setLastTime] = useState("");
  const [lastDelay, setLastDelay] = useState(0);
  const { isOffline } = useNetworkStatus();

  const findTrain = async () => {
    const startOfDay = moment().startOf('day');
    const epoch = startOfDay.valueOf();
    try {
      const response = await fetch(`https://api.transportam.cat/adif/train/${trainId}?all_control_points=true`);
      const data = await response.json();
      const lastStop = data?.find((x: { commercialPathInfo: { commercialPathKey: { commercialCirculationKey: { launchingDate: number; }; }; }; }) => x.commercialPathInfo.commercialPathKey.commercialCirculationKey.launchingDate === epoch)?.passthroughSteps?.findLast((x: { arrivalPassthroughStepSides: { timeType: string; }; }) => x.arrivalPassthroughStepSides?.timeType === "AUDITED");
      if(lastStop !== null) {
        const lastStopCode = lastStop?.stationCode as keyof typeof stations;

        setLastStop(stations[lastStopCode]?.stop_name ?? lastStopCode);
        setLastTime(moment(lastStop.arrivalPassthroughStepSides.plannedTime).add(lastStop.arrivalPassthroughStepSides.forecastedOrAuditedDelay, 's').format('HH:mm:ss'));
        setLastDelay(Math.round(lastStop.arrivalPassthroughStepSides.forecastedOrAuditedDelay / 60));
      } else {
        setLastStop("No trobat");
        setLastTime("");
        setLastDelay(0);
      }
    } catch {
      setLastStop("No trobat");
      setLastTime("");
      setLastDelay(0);
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <p>Introdueix el codi del tren de l&apos;app d&apos;ADIF:</p>
        <input type="text" onChange={(e) => setTrainId(e.target.value)} className="border dark:text-white dark:bg-transparent px-8 py-3 rounded focus:outline-none" />
        <button type="button" className="px-8 py-3 text-white bg-black rounded focus:outline-none disabled:text-gray-500"
        disabled={isOffline} onClick={(e) => {findTrain(); e.preventDefault()}}>
            Buscar
        </button>
        <p>{ isOffline ? "No tens connexió" : " " }</p>
        <p>Ultima estació: { lastStop }</p>
        <p>Hora de pas: { lastTime }</p>
        <p>Retard: { lastDelay } minuts</p>
      </main>
    </div>
  );
}

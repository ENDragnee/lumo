"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PauseIcon, PlayIcon } from 'lucide-react'; // Import these icons from lucide-react

interface ClockProps {
  onSessionEnd: (isStudySession: boolean) => void;
  style?: React.CSSProperties;
}

export function Clock({ onSessionEnd, style }: ClockProps) {
  const [time, setTime] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);
  const [studyDuration, setStudyDuration] = useState(30);
  const [restDuration, setRestDuration] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(studyDuration * 60);
  const [isStudyPeriod, setIsStudyPeriod] = useState(true);
  const [isTimerOn, setIsTimerOn] = useState(true);
  const [isPaused, setIsPaused] = useState(true);
  const [hasStarted, setHasStarted] = useState(false); // New state to track if timer
  const clockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clockTimer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(clockTimer);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerOn && !isPaused && hasStarted) {
      timer = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev === 0) {
            const nextIsStudyPeriod = !isStudyPeriod;
            setIsStudyPeriod(nextIsStudyPeriod);
            onSessionEnd(nextIsStudyPeriod);
            return (nextIsStudyPeriod ? studyDuration : restDuration) * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [
    isTimerOn,
    isPaused,
    isStudyPeriod,
    studyDuration,
    restDuration,
    onSessionEnd,
    hasStarted,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        clockRef.current &&
        !clockRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.clock-input')
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clockRef]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStudyDurationChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isPaused && isTimerOn && hasStarted) {
      alert("Please pause the timer before changing the duration!");
      return;
    }
    if (!isNaN(numValue) && numValue > 0) {
      setStudyDuration(numValue);
      if (isStudyPeriod) {
        setTimerSeconds(numValue * 60);
      }
    }
  };

  const handleRestDurationChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isPaused && isTimerOn && hasStarted) {
      alert("Please pause the timer before changing the duration!");
      return;
    }
    if (!isNaN(numValue) && numValue > 0) {
      setRestDuration(numValue);
      if (!isStudyPeriod) {
        setTimerSeconds(numValue * 60);
      }
    }
  };

  const togglePause = () => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    setIsPaused(!isPaused);
  };

  const handleTimerToggle = (checked: boolean) => {
    setIsTimerOn(checked);
    if (!checked) {
      setIsPaused(true);
      setHasStarted(false);
      setTimerSeconds(studyDuration * 60);
      setIsStudyPeriod(true);
    }
  };

  return (
    <div style={style}>
      <motion.div
        ref={clockRef}
        className="fixed top-4 left-1/2 z-50 cursor-pointer"
        initial={{ translateX: "-50%" }}
        animate={{
          translateX: "-50%",
          width: isExpanded ? "md:50% 75%" : "auto",
        }}
        transition={{
          duration: 1,
          ease: [0.19, 1, 0.22, 1],
        }}
      >
        <motion.div
          layout
          className="bg-zinc-200/80 dark:bg-zinc-800/80 backdrop-blur-sm shadow-lg overflow-hidden"
          initial={false}
          animate={{
            borderRadius: isExpanded ? "24px" : "40px",
          }}
          transition={{
            duration: 1,
            ease: [0.5, 1, 0.22, 1],
          }}
        >
          <motion.div
            layout
            className="flex items-center justify-between p-2"
            onClick={(e) => {
              if (!(e.target as HTMLElement).closest('.clock-input')) {
                setIsExpanded(!isExpanded);
              }
            }}
          >
            <div className="flex items-center md:gap-4 gap-2">
              <motion.div
                layout
                className="w-3 h-3 rounded-full bg-black/10 dark:bg-white/10"
              />
              <motion.div
                layout
                className={`font-medium tabular-nums ${isExpanded ? "md:text-md text-sm" : "md:text-lg text-md"}`}
              >
                {isExpanded ? formatTime(timerSeconds) : time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </motion.div>
              {isExpanded && (
                <motion.div layout>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePause()
                    }}
                    className="p-2"
                  >
                    {isPaused ? <PlayIcon size={20} className="text-slate-600"/> : <PauseIcon size={20} className="text-slate-600"/>}
                  </Button>
                </motion.div>
              )}
            </div>
            {isExpanded && (
              <motion.div
                layout
                className="flex items-center md:gap-3 gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="studyDuration" className={`md:text-sm text-[12px] ${isStudyPeriod ? "text-green-500 font-bold":""}`}>Study</Label>
                <Input
                  id="studyDuration"
                  type="number"
                  value={studyDuration}
                  onChange={(e) => handleStudyDurationChange(e.target.value)}
                  className="md:w-15 w-11 md:h-8 h-6 md:text-sm text-[12px] align-center border-slate-500 clock-input"
                  min={1}
                />
                <Label htmlFor="restDuration" className={`md:text-sm text-[12px] ${!isStudyPeriod ? "text-red-500 font-bold":""}`}>Rest</Label>
                <Input
                  id="restDuration"
                  type="number"
                  value={restDuration}
                  onChange={(e) => handleRestDurationChange(e.target.value)}
                  className="md:w-15 w-10 md:h-8 h-6 md:text-sm text-[12px] text-center border-slate-500 clock-input"
                  min={1}
                />
                <Switch
                  checked={isTimerOn}
                  onCheckedChange={handleTimerToggle}
                  className="h-5 w-10"
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
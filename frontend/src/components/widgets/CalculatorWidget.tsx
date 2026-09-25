"use client";
import React, { useState } from "react";

export default function CalculatorWidget() {
  const [calc, setCalc] = useState("0");
  const [prev, setPrev] = useState("");
  const [op, setOp] = useState("");

  const handleNum = (n: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (calc === "0" || calc === "Error") setCalc(n);
    else setCalc(calc + n);
  };

  const handleOp = (operation: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPrev(calc);
    setOp(operation);
    setCalc("0");
  };

  const calculate = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const a = parseFloat(prev);
      const b = parseFloat(calc);
      let res = 0;
      if (op === "+") res = a + b;
      else if (op === "-") res = a - b;
      else if (op === "*") res = a * b;
      else if (op === "/") res = a / b;
      setCalc(res.toString());
      setPrev("");
      setOp("");
    } catch {
      setCalc("Error");
    }
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCalc("0");
    setPrev("");
    setOp("");
  };

  const btnClass = "bg-gray-50 border border-gray-100 rounded-lg py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors h-full";
  const opClass = "bg-teal-50 border border-teal-100 rounded-lg py-1 text-sm font-bold text-teal-700 hover:bg-teal-100 active:bg-teal-200 transition-colors h-full";

  return (
    <div className="flex flex-col h-full justify-between pt-2">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-2 mb-2 text-right overflow-hidden shadow-inner flex-shrink-0">
        <div className="text-[10px] text-gray-400 min-h-[14px] leading-tight">{prev} {op}</div>
        <div className="text-lg md:text-xl font-mono text-gray-800 tracking-tight leading-tight">{calc}</div>
      </div>
      <div className="grid grid-cols-4 gap-1.5 flex-1 min-h-[120px]">
        <button onClick={(e) => clear(e)} className="col-span-3 bg-red-50 text-red-600 rounded-lg font-bold text-sm hover:bg-red-100 h-full">C</button>
        <button onClick={(e) => handleOp("/", e)} className={opClass}>÷</button>
        
        <button onClick={(e) => handleNum("7", e)} className={btnClass}>7</button>
        <button onClick={(e) => handleNum("8", e)} className={btnClass}>8</button>
        <button onClick={(e) => handleNum("9", e)} className={btnClass}>9</button>
        <button onClick={(e) => handleOp("*", e)} className={opClass}>×</button>
        
        <button onClick={(e) => handleNum("4", e)} className={btnClass}>4</button>
        <button onClick={(e) => handleNum("5", e)} className={btnClass}>5</button>
        <button onClick={(e) => handleNum("6", e)} className={btnClass}>6</button>
        <button onClick={(e) => handleOp("-", e)} className={opClass}>-</button>
        
        <button onClick={(e) => handleNum("1", e)} className={btnClass}>1</button>
        <button onClick={(e) => handleNum("2", e)} className={btnClass}>2</button>
        <button onClick={(e) => handleNum("3", e)} className={btnClass}>3</button>
        <button onClick={(e) => handleOp("+", e)} className={opClass}>+</button>
        
        <button onClick={(e) => handleNum("0", e)} className={`col-span-2 ${btnClass}`}>0</button>
        <button onClick={(e) => handleNum(".", e)} className={btnClass}>.</button>
        <button onClick={(e) => calculate(e)} className="bg-teal-500 text-white font-bold rounded-lg hover:bg-teal-600 h-full shadow-sm">=</button>
      </div>
    </div>
  );
}

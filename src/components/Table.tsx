"use client";
import { createContext } from "react";

type GridUnit = `${number}fr` | `${number}px` | `${number}%` | "auto";
type ColumnsArray = GridUnit[];

const TableContext = createContext();
function Table() {
  return <TableContext.Provider value={}></TableContext.Provider>;
}

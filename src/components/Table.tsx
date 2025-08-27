"use client";
import React, { createContext, ReactNode, useContext } from "react";
import useIsMounted from "@/hooks/useIsMounted";

export type GridColumnValue =
  | "auto"
  | "min-content"
  | "max-content"
  | `${number}fr`
  | `${number}px`
  | `${number}%`
  | `fit-content(${number}px)`
  | `minmax(${string},${string})`
  | `repeat(${number},${string})`;
type Column = GridColumnValue | GridColumnValue[];

interface TableContextProvidedValues {
  columns: Column;
  noDataMessage: string;
}

const TableContext = createContext<TableContextProvidedValues | undefined>(
  undefined
);

interface TableProps {
  columns: Column;
  children: ReactNode;
  noDataMessage: string;
}
function Table({ columns, children, noDataMessage }: TableProps) {
  return (
    <TableContext.Provider value={{ columns, noDataMessage }}>
      {children}
    </TableContext.Provider>
  );
}

interface CommonRowProps {
  children: ReactNode;
  columns: Column;
  className: string;
}
const CommonRow = ({ children, columns, className }: CommonRowProps) => {
  let gridTemplateColumns: string | undefined;
  if (!columns) gridTemplateColumns = undefined;
  else if (Array.isArray(columns)) gridTemplateColumns = columns.join(" ");
  else gridTemplateColumns = columns;

  return (
    <div
      role="row"
      style={gridTemplateColumns ? { gridTemplateColumns } : undefined}
      className={`grid items-center gap-x-10 transition-none ${className}`}
    >
      {children}
    </div>
  );
};

function Row({ children }: { children: ReactNode }) {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("Row must be used within a Table");
  }
  const { columns } = context;
  return (
    <CommonRow
      columns={columns}
      className="border-b border-gray-200 px-10 py-5 last:border-none"
    >
      {children}
    </CommonRow>
  );
}

function Header({ children }: { children: ReactNode }) {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("Row must be used within a Table");
  }
  const { columns } = context;

  return (
    <CommonRow
      columns={columns}
      className="border-b border-gray-200 bg-gray-100 px-10 py-7 font-semibold uppercase tracking-wide text-gray-600"
    >
      {children}
    </CommonRow>
  );
}

interface BodyProps<T> {
  data: T[];
  render: (item: T, index: number) => ReactNode;
}
function Body<T>({ render, data }: BodyProps<T>) {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("Row must be used within a Table");
  }
  const { noDataMessage } = context;

  if (!data.length) {
    return (
      <p className="m-10 text-center text-3xl font-medium">{noDataMessage}</p>
    );
  }
  return <section className="mx-0 my-[0.4rem]">{data.map(render)}</section>;
}

function Footer({ children }: { children: ReactNode }) {
  const isMounted = useIsMounted();

  if (!children || React.Children.count(children) === 0) {
    return null; // Do not render if there are no children
  }

  return (
    <footer className="flex justify-center border-t border-gray-200 bg-gray-50 px-10 py-5">
      {children}
    </footer>
  );
}

Table.Row = Row;
Table.Header = Header;
Table.Body = Body;
Table.Footer = Footer;

export default Table;

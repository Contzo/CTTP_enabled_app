import Connect from "./Connect";

export default function Header() {
  return (
    <header className="flex justify-between  w-full items-center border-b-2 border-b-gray-300 pb-2">
      <h2 className="font-bold">CTTP enabled USDC transfer dApp</h2>
      <Connect />
    </header>
  );
}

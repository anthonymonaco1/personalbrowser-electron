// Header Component containing logo and form
import React, { useEffect, useState } from 'react';

function Header({
  teamId,
  freeTransfers,
  gameWeek,
  setTeamId,
  setFreeTransfers,
  setGameWeek,
  handleSubmit,
  setLoading
}) {
  const [serverRunning, setServerRunning] = useState(false);

  const startServer = async () => {
    setLoading(true);
    try {
      await window.electronAPI.startPythonServer();
      setServerRunning(true);
    } catch (error) {
      console.error('Failed to start Python server:', error);
      alert(error.message || 'Failed to start Python server.');
    } finally {
      setLoading(false);
    }
  };

  const stopServer = async () => {
    setLoading(true);
    try {
      await window.electronAPI.stopPythonServer();
      setServerRunning(false);
    } catch (error) {
      console.error('Failed to stop Python server:', error);
      alert(error.message || 'Failed to stop Python server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-row items-center justify-start h-1/8 w-full bg-purple-800 relative pl-20">
      <img src={require('../FPL_logo.png')} alt="FPL Logo" className="h-3/4" />
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row p-6 items-center w-full justify-center">
          <div className="flex flex-col py-2 px-1 space-y-2 items-center">
            <label className="font-bold text-white">Your team ID:</label>
            <input
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="border-2 w-3/4 p-1 rounded-xl border-slate-400"
              placeholder="e.g. 447588"
            />
          </div>
          <div className="flex flex-col p-2 space-y-2 items-center">
            <label className="font-bold text-white">Free transfers:</label>
            <input
              value={freeTransfers}
              onChange={(e) => setFreeTransfers(e.target.value)}
              className="border-2 w-12 px-2 py-1 rounded-xl border-slate-400"
              type="number"
              max={5}
              min={0}
            />
          </div>
          <div className="flex flex-col p-2 space-y-2 items-center">
            <label className="font-bold text-white">Game Week:</label>
            <input
              value={gameWeek}
              onChange={(e) => setGameWeek(e.target.value)}
              className="border-2 w-12 px-2 py-1 rounded-xl border-slate-400"
              type="number"
              max={38}
              min={0}
            />
          </div>
          <div className="pl-10">
            <button
              type="submit"
              className="bg-cyan-500 h-1/2 text-white p-2 rounded-lg font-bold shadow-xl"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
      <div className="flex absolute right-5">
        {!serverRunning ? (
          <button
            className="bg-cyan-500 h-1/2 text-white p-2 rounded-lg font-bold shadow-xl"
            onClick={startServer}
          >
            Start Python Server
          </button>
        ) : (
          <button
            className="bg-cyan-500 h-1/2 text-white p-2 rounded-lg font-bold shadow-xl"
            onClick={stopServer}
          >
            Stop Python Server
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;

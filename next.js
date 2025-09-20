"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ZenPlayDAO from "../abi/ZenPlayDAO.json";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      if (!window.ethereum) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        "0xYourDAOAddress",
        ZenPlayDAO.abi,
        provider
      );

      const filter = contract.filters.MemberJoined();
const events = await contract.queryFilter(filter, 0, "latest");
const members = events.map(e => e.args.member);

        })
      );

      setLeaderboard(scores);
    }
    fetchLeaderboard();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">ZenPlay Leaderboard</h1>
      <ul>
        {leaderboard.map((m, i) => (
          <li key={i}>
            {m.addr} → {m.points} XP
          </li>
        ))}
      </ul>
    </div>
  );
}

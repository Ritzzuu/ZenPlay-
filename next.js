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

      // (contoh sederhana: ambil manual, sebaiknya ada backend indexer)
      const members = ["0x123...", "0x456..."];
      const scores = await Promise.all(
        members.map(async (addr) => {
          const points = await contract.activityPoints(addr);
          return { addr, points: points.toString() };
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

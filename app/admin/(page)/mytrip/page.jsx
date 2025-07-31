"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();

  const [userLevel, setUserLevel] = useState("");
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (status !== "authenticated") {
      if (status === "unauthenticated") {
        setErr("You must be signed in to view this page.");
        setLoading(false);
      }
      return;
    }
    if (!session?.user?.email) return;

    const controller = new AbortController();
    const email = encodeURIComponent(session.user.email);

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        // Fetch user & levels in parallel
        const [userRes, lvlRes] = await Promise.all([
          fetch(`/api/user/find-admin-byemail/${email}`, {
            signal: controller.signal,
            credentials: "include",
          }),
          fetch("/api/level/fetch/level", {
            signal: controller.signal,
            credentials: "include",
          }),
        ]);

        if (!userRes.ok) throw new Error(`User fetch failed (${userRes.status})`);
        const userData = await userRes.json();

        const lvlJson = await lvlRes.json();
        if (!lvlRes.ok || !lvlJson?.success) {
          throw new Error("Levels fetch failed");
        }

        // Keep levels as returned from API (original order)
        setUserLevel(userData.level || "");
        setLevels(lvlJson.data);
      } catch (e) {
        if (e.name !== "AbortError") {
          setErr(e.message || "Error loading data.");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [session?.user?.email, status]);

  const currentLevelIndex = useMemo(() => {
    return levels.findIndex((lvl) => lvl.level_name === userLevel);
  }, [levels, userLevel]);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">My Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl shadow-md border bg-gray-100 animate-pulse h-24"
            />
          ))}
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">My Trips</h2>
        <p className="text-center text-red-600">{err}</p>
      </div>
    );
  }

  return (
  <div className="p-6">
  <h2 className="text-2xl font-bold mb-6 text-center">My Trips</h2>

  <div className="space-y-4">
    {levels.map((level, index) => {
      const isAchieved = index <= currentLevelIndex;
      const isNext = index === currentLevelIndex + 1;

      return (
        <div
          key={level._id}
          className={`flex items-center justify-between  rounded p-2 shadow-md border transition-all ${
            isAchieved
              ? "bg-green-100 border-green-400"
              : isNext
              ? "bg-yellow-50 border-yellow-300 opacity-80"
              : "bg-gray-100 border-gray-300 opacity-50"
          }`}
        >
          {/* Level info */}
          <div>
            <h3 className="text-lg font-semibold">{level.level_name}</h3>
            {level.tour ? (
              <p className="text-gray-600">
                ✈️ Trip: <span className="font-medium">{level.tour}</span>
              </p>
            ) : (
              <p className="text-gray-500">No Trip Assigned</p>
            )}
          </div>

          {/* Status Badge */}
          <div>
            {isAchieved ? (
              <span className="text-sm font-semibold text-green-700 bg-green-200 px-3 py-1 rounded-full">
                ✅ Achieved
              </span>
            ) : isNext ? (
              <span className="text-sm font-semibold text-yellow-700 bg-yellow-200 px-3 py-1 rounded-full">
                ⏭ Upcoming
              </span>
            ) : (
              <span className="text-sm font-semibold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                Locked
              </span>
            )}
          </div>
        </div>
      );
    })}
  </div>
</div>

  );
}

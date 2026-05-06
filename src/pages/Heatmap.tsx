import { useEffect, useState } from "react";
import api from "../api/client";

type DayData = {
  date: string;
  score: number;
};

export default function Heatmap() {
  const [data, setData] = useState<DayData[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/prayers/history");
      setData(res.data);
    } catch (err) {
      console.error("Error fetching heatmap:", err);
    }
  };

  // 🎨 Color logic based on score
  const getColor = (score: number) => {
    if (score === 10) return "bg-green-600";   // perfect
    if (score >= 7) return "bg-green-400";     // good
    if (score >= 4) return "bg-yellow-400";    // average
    if (score > 0) return "bg-red-400";        // poor
    return "bg-gray-200";                      // no data
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">📅 Prayer Heatmap</h1>

      {/* Legend */}
      <div className="flex items-center gap-2 text-sm">
        <span>Less</span>
        <div className="w-4 h-4 bg-gray-200 rounded"></div>
        <div className="w-4 h-4 bg-red-400 rounded"></div>
        <div className="w-4 h-4 bg-yellow-400 rounded"></div>
        <div className="w-4 h-4 bg-green-400 rounded"></div>
        <div className="w-4 h-4 bg-green-600 rounded"></div>
        <span>More</span>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-5 gap-2">
        <p>{data.length} days loaded</p>
        {data.map((day, index) => (
          <div
            key={index}
            className={`w-10 h-10 rounded ${getColor(day.score)}`}
            title={`${day.date} - Score: ${day.score}`}
          ></div>
        ))}
      </div>

    </div>
  );
}
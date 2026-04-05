interface BarData {
  label: string;
  value: number;
  color: string;
}

interface BarChartProps {
  title: string;
  data: BarData[];
  variant: "horizontal" | "vertical";
}

export default function BarChart({ title, data, variant }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  if (variant === "horizontal") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">{title}</h3>
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-20 shrink-0">{item.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-7 overflow-hidden">
                <div
                  className="h-full rounded-full flex items-center justify-end px-2 transition-all duration-500"
                  style={{
                    width: `${Math.max((item.value / maxValue) * 100, 8)}%`,
                    backgroundColor: item.color,
                  }}
                >
                  <span className="text-xs font-bold text-white">{item.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">{title}</h3>
      <div className="flex items-end justify-between gap-2 h-48">
        {data.map((item) => (
          <div key={item.label} className="flex-1 flex flex-col items-center justify-end h-full">
            <span className="text-xs font-bold text-gray-700 mb-1">
              {item.value > 0 ? `S/${(item.value / 1000).toFixed(1)}k` : "0"}
            </span>
            <div
              className="w-full max-w-10 rounded-t-lg transition-all duration-500"
              style={{
                height: `${Math.max((item.value / maxValue) * 100, 4)}%`,
                backgroundColor: item.color,
              }}
            />
            <span className="text-xs text-gray-500 mt-2">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

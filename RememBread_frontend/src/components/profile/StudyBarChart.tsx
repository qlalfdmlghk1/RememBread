import { useState, useRef, useEffect, MouseEvent, TouchEvent } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStudyHistory } from "@/services/userService";
import { StudyHistoryYear } from "@/types/profile";

interface ChartDataPoint {
  day?: number;
  month?: number;
  study: number;
}

const StudyBarChart = () => {
  const [year, setYear] = useState<number>(2025);
  const [month, setMonth] = useState<number>(5);
  const [viewType, setViewType] = useState<"day" | "month">("day");
  // 일별: 15일 슬라이드
  const [dayStartIdx, setDayStartIdx] = useState<number>(() => {
    const today = new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(year, month, 0).getDate();
    // 오늘 날짜를 중앙에 오도록 설정
    const centerIdx = Math.max(0, Math.min(currentDay - 8, daysInMonth - 15));
    return centerIdx;
  }); // 일별 슬라이드 인덱스

  // 드래그 상태
  const dragStartX = useRef<number | null>(null);
  const dragging = useRef<boolean>(false);

  // 학습 기록 데이터
  const [studyHistoryData, setStudyHistoryData] = useState<StudyHistoryYear[]>([]);
  const [dailyData, setDailyData] = useState<ChartDataPoint[]>([]);
  const [monthlyData, setMonthlyData] = useState<ChartDataPoint[]>([]);

  // 학습 기록 조회 데이터 준비
  useEffect(() => {
    const fetchStudyHistory = async () => {
      let startDate = "";
      let endDate = "";
      
      
      if (viewType === "month") {
        startDate = `${year}-01-01`;
        endDate = `${year+1}-01-01`;
      } else {
        startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        // 12월인 경우 다음 해 1월로 처리
        if (month === 12) {
          endDate = `${year+1}-01-01`;
        } else {
          endDate = `${year}-${(month+1).toString().padStart(2, '0')}-01`;
        }
      }
      const response = await getStudyHistory(startDate, endDate);
      setStudyHistoryData(response.result.years);
    };
    fetchStudyHistory();
  }, [viewType, year, month]);

  // studyHistoryData를 차트 데이터로 가공
  useEffect(() => {
    if (!studyHistoryData.length) return;

    if (viewType === "month") {
      // 월별 데이터 가공
      const yearData = studyHistoryData.find(y => y.year === year);
      const monthlyChartData: ChartDataPoint[] = Array.from({ length: 12 }, (_, i) => {
        const monthData = yearData?.months.find(m => m.month === i + 1);
        return {
          month: i + 1,
          study: monthData?.totalStudyMinutes || 0
        };
      });
      setMonthlyData(monthlyChartData);
    } else {
      // 일별 데이터 가공
      const yearData = studyHistoryData.find(y => y.year === year);
      const monthData = yearData?.months.find(m => m.month === month);
      const daysInMonth = new Date(year, month, 0).getDate();
      
      const dailyChartData: ChartDataPoint[] = Array.from({ length: daysInMonth }, (_, i) => {
        const dayData = monthData?.days?.find(d => d.day === i + 1);
        return {
          day: i + 1,
          study: dayData?.totalStudyMinutes || 0
        };
      });
      setDailyData(dailyChartData);

      // 월이 변경될 때 오늘 날짜를 중앙에 오도록 설정
      const today = new Date();
      const currentDay = today.getDate();
      const centerIdx = Math.max(0, Math.min(currentDay - 8, daysInMonth - 15));
      setDayStartIdx(centerIdx);
    }
  }, [studyHistoryData, viewType, year, month]);

  // 일별: 15일치만 보여줌
  const visibleDailyData = dailyData.slice(dayStartIdx, dayStartIdx + 15);

  // 드래그 이벤트 핸들러 (일별)
  const handleDragStart = (e: MouseEvent | TouchEvent) => {
    dragging.current = true;
    if ("touches" in e) {
      dragStartX.current = e.touches[0].clientX;
    } else {
      dragStartX.current = e.clientX;
    }
  };
  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!dragging.current || dragStartX.current === null) return;
    let clientX;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    const diff = clientX - dragStartX.current;
    if (viewType === "day") {
      if (diff > 20 && dayStartIdx > 0) {
        setDayStartIdx(dayStartIdx - 1);
        dragStartX.current = clientX;
      } else if (diff < -20 && dayStartIdx < dailyData.length - 15) {
        setDayStartIdx(dayStartIdx + 1);
        dragStartX.current = clientX;
      }
    }
  };
  const handleDragEnd = () => {
    dragging.current = false;
    dragStartX.current = null;
  };

  // 월/연도 이동 핸들러
  const handleMonthChange = (dir: "prev" | "next") => {
    let newMonth = month + (dir === "prev" ? -1 : 1);
    let newYear = year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    setYear(newYear);
    setMonth(newMonth);
    setDayStartIdx(0); // 월 바뀌면 일별 인덱스 초기화
  };
  const handleYearChange = (dir: "prev" | "next") => {
    setYear(dir === "prev" ? year - 1 : year + 1);
  };

  // 차트 데이터/축 설정
  let chartData: any[] | null = null;
  let xKey = "day";
  let xTickFormatter = (v: any) => `${v}`;
  let tooltipLabelFormatter = (label: any) => `${label}일`;
  if (viewType === "month") {
    chartData = monthlyData;
    xKey = "month";
    xTickFormatter = (v: any) => `${v}`;
    tooltipLabelFormatter = (label: any) => `${label}월`;
  } else {
    chartData = visibleDailyData;
  }



  return (
    <div className="w-full min-h-[15rem] h-[30vh] bg-white rounded-xl px-4 relative">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-bold">
          공부 기록
          <span className="text-base font-normal text-neutral-400 ml-2 cursor-pointer select-none">
            (학습 시간)
          </span>
          <span className="text-base font-normal text-neutral-400 ml-2 cursor-pointer select-none">
            <Select
              value={viewType}
              onValueChange={(value) => {
                setViewType(value as "day" | "month");
                setDayStartIdx(0);
              }}
            >
              <SelectTrigger className="w-[120px] bg-transparent">
                <SelectValue placeholder="기록 보기" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">일별 기록</SelectItem>
                <SelectItem value="month">월별 기록</SelectItem>
              </SelectContent>
            </Select>
          </span>
        </div>
        <div className="flex items-center gap-2 text-neutral-400 text-base">
          {viewType !== "month" ? (
            <>
              <button onClick={() => handleMonthChange("prev")} className="hover:text-neutral-600">
                &#60;
              </button>
              <span className="text-neutral-400 text-sm">
                {year}년 {month}월
              </span>
              <button onClick={() => handleMonthChange("next")} className="hover:text-neutral-600">
                &#62;
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleYearChange("prev")} className="hover:text-neutral-600">
                &#60;
              </button>
              <span className="text-neutral-400 text-sm">{year}년</span>
              <button onClick={() => handleYearChange("next")} className="hover:text-neutral-600">
                &#62;
              </button>
            </>
          )}
        </div>
      </div>
      <div
        className="w-full h-full"
        style={{ touchAction: "pan-y", cursor: viewType !== "month" ? "grab" : "default" }}
        onMouseDown={viewType !== "month" ? handleDragStart : undefined}
        onMouseMove={viewType !== "month" ? handleDragMove : undefined}
        onMouseUp={viewType !== "month" ? handleDragEnd : undefined}
        onMouseLeave={viewType !== "month" ? handleDragEnd : undefined}
        onTouchStart={viewType !== "month" ? handleDragStart : undefined}
        onTouchMove={viewType !== "month" ? handleDragMove : undefined}
        onTouchEnd={viewType !== "month" ? handleDragEnd : undefined}
      >
        {!chartData || chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400 ">
            <div className="text-2xl mb-2">😴</div>
            <div className="text-sm font-medium">아직 기록이 없습니다</div>
            <div className="text-xs mt-1">테스트를 시작하면 여기에 그래프가 표시돼요!</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={xTickFormatter}
                interval={0}
                minTickGap={1}
              />
              <YAxis tick={{ fontSize: 13 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value: number) => `${value}분`}
                labelFormatter={tooltipLabelFormatter}
                cursor={{ fill: 'transparent' }}
              />
              <Bar 
                dataKey="study" 
                fill="#D2A06E" 
                radius={[4, 4, 0, 0]} 
                barSize={16}
                activeBar={{ fill: '#A67B51' }}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default StudyBarChart;


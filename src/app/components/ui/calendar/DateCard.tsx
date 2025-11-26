import { typography } from "@/app/styles/typography";
import { IoIosArrowForward } from "react-icons/io";
type HeaderType = "Today" | "Weekly" | "Monthly";

interface DateCardProps {
  type: HeaderType;
  text?: string;
  onClick?: () => void;
  isEmpty?: boolean;
  isWork?: boolean;
  date?: string;
  timeRange?: string;
  isToday?: boolean; // Add this prop
}

export function DateCard({
  text = "EPMTY CARD",
  date,
  onClick,
  isEmpty,
  isWork,
  type,
  timeRange,
  isToday = false, // Add this parameter
}: DateCardProps) {
  let barColor = "#b0b0b8";
  if (!isEmpty) {
    barColor = isWork ? "#6bb064" : "#255495";
  }

  const textSize = type === "Today" ? "text-[20px]" : "text-[16px]";
  const typographyClass =
    type === "Today" ? typography.display.body : typography.display.body;
  const fontBoldness = type === "Today" ? "font-medium" : "";

  return (
    <div
      className={`flex items-center gap-4 ${
        isToday ? "p-3 bg-blue-100 rounded-3xl" : ""
      }`}
    >
      {date && (
        <div className="flex flex-col items-center min-w-[60px]">
          <p
            className={`text-xs uppercase font-semibold ${
              isToday ? "text-blue-600" : "text-gray-500"
            }`}
          >
            {date.split(",")[0]}
          </p>
          <p
            className={`text-3xl font-bold leading-none ${
              isToday ? "text-blue-600" : "text-black"
            }`}
          >
            {date.split(",")[1]?.trim().split(" ")[1] || date}
          </p>
          <p
            className={`text-xs uppercase ${
              isToday ? "text-blue-600" : "text-gray-500"
            }`}
          >
            {date.split(",")[1]?.trim().split(" ")[0]}
          </p>
        </div>
      )}
      <button
        onClick={onClick}
        className="relative bg-white rounded-3xl shadow-lg px-6 py-4 flex items-center justify-between w-full min-h-[80px] hover:shadow-xl transition-shadow overflow-hidden"
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-3 rounded-l-3xl"
          style={{ backgroundColor: barColor }}
        />
        {isEmpty ? (
          <h2
            className={`${textSize} ${fontBoldness} text-black ${typographyClass}`}
          >
            {text}
          </h2>
        ) : (
          <div className="flex flex-col items-start gap-1">
            {timeRange && (
              <p className="text-sm text-gray-600 font-normal">{timeRange}</p>
            )}
            <h2
              className={`${textSize} ${fontBoldness} text-black ${typographyClass}`}
            >
              {text}
            </h2>
          </div>
        )}
        <IoIosArrowForward size={28} color="#b0b0b8" className="z-10" />
      </button>
    </div>
  );
}

interface DateCardContainerProps {
  cards: Array<{
    type: HeaderType;
    isWork: boolean;
    isEmpty: boolean;
    id: string | number;
    text: string;
    date?: string;
    timeRange?: string;
    isToday?: boolean; // Add this property
    onClick?: () => void;
  }>;
}

export function DateCardContainer({ cards }: DateCardContainerProps) {
  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {cards.map((card) => (
        <DateCard
          key={card.id}
          text={card.text}
          date={card.date}
          timeRange={card.timeRange}
          isToday={card.isToday}
          onClick={card.onClick}
          isEmpty={card.isEmpty}
          isWork={card.isWork}
          type={card.type}
        />
      ))}
    </div>
  );
}

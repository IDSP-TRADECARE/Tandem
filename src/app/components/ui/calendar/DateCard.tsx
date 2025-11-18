import { typography } from "@/app/styles/typography";
import { IoIosArrowForward } from "react-icons/io";
type HeaderType = 'Today' | 'Weekly' | 'Monthly';

interface DateCardProps {
  type: HeaderType;
  text?: string;
  onClick?: () => void;
  isEmpty?: boolean;
  isWork?: boolean;
  date?: string;
}

export function DateCard({ text = "EPMTY CARD", date, onClick, isEmpty, isWork, type }: DateCardProps) {
    let barColor = '#b0b0b8';
    if (!isEmpty) {
        barColor = isWork? '#6bb064' : "#255495";
    }
    
    const textSize = type === 'Today' ? 'text-[20px]' : 'text-[16px]';
    const typographyClass = type === 'Today' ? typography.display.body : typography.display.body;
    const fontBoldness = type === 'Today' ? 'font-medium' : '';
    
  return (
    <div className="flex items-center gap-4">
      <p>{date || "null"}</p>
      <button
        onClick={onClick}
        className="relative bg-white rounded-3xl shadow-lg px-8 py-8 flex items-center justify-between w-full h-16 hover:shadow-xl transition-shadow overflow-hidden"
      >
        <div 
          className="absolute left-0 top-0 bottom-0 w-3 rounded-l-3xl"
          style={{ backgroundColor: barColor }}
        />
        {isEmpty ? (
          <h2 className={`${textSize} ${fontBoldness} text-black ${typographyClass}`}>{text}</h2>
        ) : (
          <div className="flex flex-col items-start">
            <p className={`text-[14px] text-black ${typography.body.body}`}>Additional info</p>
            <h2 className={`${textSize} ${fontBoldness} text-black ${typographyClass}`}>{text}</h2>
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
          onClick={card.onClick}
          isEmpty={card.isEmpty}
          isWork={card.isWork}
          type={card.type}
        />
      ))}
    </div>
  );
}
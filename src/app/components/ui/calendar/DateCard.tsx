import { IoIosArrowForward } from "react-icons/io";

interface DateCardProps {
  text?: string;
  onClick?: () => void;
  isEmpty?: boolean;
}

export function DateCard({ text = "No Childcare booked !", onClick }: DateCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-3xl shadow-lg px-8 py-8 flex items-center justify-between w-full hover:shadow-xl transition-shadow"
    >

      <h2 className="text-2xl font-bold text-gray-900">{text}</h2>
        <IoIosArrowForward size={28} color="#b0b0b8" />
    </button>
  );
}

interface DateCardContainerProps {
  cards: Array<{
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
        />
      ))}
    </div>
  );
}
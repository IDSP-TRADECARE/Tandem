interface NavContainerProps {
  children: React.ReactNode;
}

export function NavContainer({ children }: NavContainerProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6">
      <div className="bg-primary-active rounded-[40px] shadow-2xl px-6 py-4 relative">
        <div className="flex items-center justify-around">
          {children}
        </div>
      </div>
    </nav>
  );
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col  md:gap-4 gap-2 py-4 mx-3 md:mx-5  md:py-6">
      {children}
    </div>
  );
}

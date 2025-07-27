export default function Layout({children}: {children: React.ReactNode}) {
    return (
     <div className="flex flex-1 flex-col mx-3 md:mx-5 gap-2 py-4  md:gap-4 md:py-6">
      {children}
      </div>
    );
}
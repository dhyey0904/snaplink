export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#dadce0] py-12 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
        <span className="text-xl font-bold tracking-tight text-[#202124] mb-4 sm:mb-0">
          Snap<span className="text-[#1a73e8]">Link</span>
        </span>
        <p className="text-[#5f6368] text-sm">
          &copy; {new Date().getFullYear()} SnapLink. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

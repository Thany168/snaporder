export default function Footer() {
  return (
    <footer
      className="flex items-center justify-between px-4 lg:px-6
      h-10 bg-white border-t border-gray-100 flex-shrink-0"
    >
      <p className="text-xs text-gray-400">SnapOrder v1.0</p>
      <div className="flex gap-4">
        <a
          href="#"
          className="text-xs text-gray-400 hover:text-blue-500
          transition-colors"
        >
          Docs
        </a>
        <a
          href="#"
          className="text-xs text-gray-400 hover:text-blue-500
          transition-colors"
        >
          Support
        </a>
      </div>
    </footer>
  );
}

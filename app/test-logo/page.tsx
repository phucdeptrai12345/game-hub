'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LogoPreviewPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Option 1: Classic Simple Controller
  const Option1SVG = ({ size = 'w-10 h-10' }) => (
    <svg
      className={`${size} text-accent transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg] shrink-0`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6H6a4 4 0 0 0-4 4v3a4 4 0 0 0 4 4h1.5a3 3 0 0 1 2.5 1.5L11 20a1 1 0 0 0 2 0l1-1.5a3 3 0 0 1 2.5-1.5H18a4 4 0 0 0 4-4v-3a4 4 0 0 0-4-4z" fill="currentColor" fillOpacity="0.15" />
      <path d="M6 12h4M8 10v4" />
      <circle cx="15" cy="11.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );

  // Option 2: The "P" shaped controller grip
  const Option2SVG = ({ size = 'w-10 h-10' }) => (
    <svg
      className={`${size} text-accent transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg] shrink-0`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.5 5h7C19 5 21 7 21 9.5v5c0 2.5-2 4.5-4.5 4.5h-1c-.8 0-1.5.5-1.8 1.2l-.7 1.8c-.3.7-1 1.2-1.8 1.2h-1c-1.5 0-2.5-1-2.5-2.5v-7.2c0-.3-.2-.5-.5-.5H6c-2 0-3.5-1.5-3.5-3.5S4 5 6 5h3.5z" fill="currentColor" fillOpacity="0.15" />
      <circle cx="6" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 9.5l3.5 2.5-3.5 2.5v-5z" fill="currentColor" />
      <circle cx="17" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="13" r="1" fill="currentColor" stroke="none" />
    </svg>
  );

  // Option 3: Play Button Controller
  const Option3SVG = ({ size = 'w-10 h-10' }) => (
    <svg
      className={`${size} text-accent transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg] shrink-0`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5.5 3.5c-.8-.5-1.8 0-1.8 1v15c0 1 1 1.5 1.8 1l13-7.5c.8-.5.8-1.5 0-2l-13-7.5z" fill="currentColor" fillOpacity="0.15" />
      <path d="M7 10v4M5 12h4" stroke="currentColor" strokeWidth="2" />
      <path d="M10 15a3.5 3.5 0 0 1-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2,2" />
      <circle cx="13.5" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );

  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#151324] text-white' : 'bg-[#faf9f6] text-[#1e293b]'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase title-display tracking-tight">
              Playza Logo Selector
            </h1>
            <p className="text-sm font-semibold opacity-70 mt-1">
              Xem trước và lựa chọn thiết kế Logo cho Playza dưới dạng SVG thực tế.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
                theme === 'light'
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                  : 'bg-transparent border-slate-600 opacity-60 hover:opacity-100'
              }`}
            >
              ☀️ Light Mode
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
                theme === 'dark'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-transparent border-slate-300 opacity-60 hover:opacity-100'
              }`}
            >
              🌙 Dark Mode
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Option 1 */}
          <div className="border border-slate-700/30 rounded-2xl p-6 bg-slate-500/5 backdrop-blur flex flex-col justify-between">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-400">
                  Option 1
                </span>
                <span className="text-xs font-bold opacity-60">Classic Simple</span>
              </div>
              <h2 className="text-lg font-black uppercase title-display mb-4">Tay Cầm Tối Giản</h2>
              <p className="text-xs font-semibold opacity-70 leading-relaxed mb-6">
                Giữ nguyên hình dáng tay cầm chơi game nguyên bản tinh tế trước đây, kết hợp màu đỏ Strawberry dịu nhẹ. Đơn giản, gọn gàng và quen thuộc.
              </p>
            </div>
            
            <div className="border border-slate-700/20 rounded-xl p-4 flex items-center justify-center min-h-[120px] bg-slate-500/5 mb-6 group cursor-pointer">
              <div className="flex items-center">
                <Option1SVG />
                <span className={`text-2xl font-black uppercase title-display tracking-tight ml-1 ${theme === 'dark' ? 'text-white' : 'text-[#1e293b]'}`}>
                  Play<span className="text-accent">za</span>
                </span>
              </div>
            </div>
          </div>

          {/* Option 2 */}
          <div className="border border-slate-700/30 rounded-2xl p-6 bg-slate-500/5 backdrop-blur flex flex-col justify-between">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400">
                  Option 2
                </span>
                <span className="text-xs font-bold opacity-60">Brand Integrated</span>
              </div>
              <h2 className="text-lg font-black uppercase title-display mb-4">Tay Cầm Cách Điệu Chữ P</h2>
              <p className="text-xs font-semibold opacity-70 leading-relaxed mb-6">
                Cách điệu báng cầm bên trái của tay cầm uốn cong hướng lên tạo thành chữ **P** đại diện cho **Playza**. Chính giữa là nút tam giác Play và các nút bấm Gaming bên phải.
              </p>
            </div>
            
            <div className="border border-slate-700/20 rounded-xl p-4 flex items-center justify-center min-h-[120px] bg-slate-500/5 mb-6 group cursor-pointer">
              <div className="flex items-center">
                <Option2SVG />
                <span className={`text-2xl font-black uppercase title-display tracking-tight ml-1 ${theme === 'dark' ? 'text-white' : 'text-[#1e293b]'}`}>
                  Play<span className="text-accent">za</span>
                </span>
              </div>
            </div>
          </div>

          {/* Option 3 */}
          <div className="border border-slate-700/30 rounded-2xl p-6 bg-slate-500/5 backdrop-blur flex flex-col justify-between">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400">
                  Option 3
                </span>
                <span className="text-xs font-bold opacity-60">Play Button Morph</span>
              </div>
              <h2 className="text-lg font-black uppercase title-display mb-4">Tay Cầm Hình Nút Play</h2>
              <p className="text-xs font-semibold opacity-70 leading-relaxed mb-6">
                Tay cầm cách điệu toàn bộ thành một nút **Play (hình tam giác)** hướng sang phải, tượng trưng cho hành động nhấn chơi game, tích hợp D-pad bên trái và nút bấm bên phải.
              </p>
            </div>
            
            <div className="border border-slate-700/20 rounded-xl p-4 flex items-center justify-center min-h-[120px] bg-slate-500/5 mb-6 group cursor-pointer">
              <div className="flex items-center">
                <Option3SVG />
                <span className={`text-2xl font-black uppercase title-display tracking-tight ml-1 ${theme === 'dark' ? 'text-white' : 'text-[#1e293b]'}`}>
                  Play<span className="text-accent">za</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 border-t border-slate-700/30 pt-6 text-center text-xs opacity-60 font-semibold">
          <p>Nhấp chuột vào bất kỳ tùy chọn nào để trải nghiệm hiệu ứng hover của Logo.</p>
          <p className="mt-2 text-rose-400">Hãy cho tôi biết lựa chọn cuối cùng của bạn trong ô chat để tôi kích hoạt toàn bộ hệ thống!</p>
          <div className="mt-4">
            <Link href="/" className="px-4 py-2 rounded-xl bg-slate-700 text-white text-xs font-bold hover:bg-slate-600 transition-colors">
              Quay lại Trang Chủ
            </Link>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        .text-accent {
          color: oklch(63% 0.26 28);
        }
        .title-display {
          font-family: var(--font-russo-one), "Russo One", sans-serif;
        }
      `}</style>
    </div>
  );
}

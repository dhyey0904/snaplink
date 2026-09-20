import re

with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

fab_code = '''      {/* FAB for Mobile Preview */}
      {!isMobilePreviewOpen && (
        <button 
          onClick={() => setIsMobilePreviewOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 border border-white/10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
        </button>
      )}
    </div>
  );
}'''

# Replace the last `    </div>\n  );\n}` with the FAB code
text = text.rsplit('    </div>\n  );\n}', 1)[0] + fab_code

with open('e:/snaplink/frontend/src/app/dashboard/bio/page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print("FAB added")

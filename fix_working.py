import re

with open("frontend/src/app/command-center/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

replacement = """
  // Local state for interactive tasks widget
  const [tasks, setTasks] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [newTaskText, setNewTaskText] = useState("");

  useEffect(() => {
    const savedTasks = localStorage.getItem("snapos_tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks([
        { id: 1, text: "Welcome to Snap OS", done: true },
        { id: 2, text: "Create your first short link", done: false }
      ]);
    }
  }, []);

  const toggleTask = (id: number) => {
    const newTasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    setTasks(newTasks);
    localStorage.setItem("snapos_tasks", JSON.stringify(newTasks));
  };

  const addTask = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTaskText.trim()) {
      const newTasks = [...tasks, { id: Date.now(), text: newTaskText, done: false }];
      setTasks(newTasks);
      localStorage.setItem("snapos_tasks", JSON.stringify(newTasks));
      setNewTaskText("");
    }
  };

  const removeTask = (id: number) => {
    const newTasks = tasks.filter(t => t.id !== id);
    setTasks(newTasks);
    localStorage.setItem("snapos_tasks", JSON.stringify(newTasks));
  };

  // Widget Renderer Engine
  const renderWidgetContent = (id: string, size: WidgetSize) => {
    switch (id) {
      case "links":
        const totalLinks = realData?.links?.total ?? 0;
        const totalClicks = realData?.links?.clicks ?? 0;
        return (
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-xs font-bold text-blue-500 mb-1 tracking-wider uppercase">SnapLinks</p>
              <h4 className="text-gray-900 font-bold text-sm md:text-base leading-tight mb-2">{totalLinks} Total Links</h4>
              {size === "large" || size === "full" ? (
                <div className="space-y-2 mt-4">
                  <div className="bg-blue-50 rounded-lg p-2 text-xs text-blue-700 flex justify-between">
                    <span className="font-medium truncate mr-2">Total Clicks</span>
                    <span className="font-bold">{totalClicks}</span>
                  </div>
                </div>
              ) : null}
            </div>
            {size !== "small" && (
              <a href="/dashboard/links" className="mt-4 w-full bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-xl text-xs font-bold transition-colors text-center block">
                Manage Links
              </a>
            )}
          </div>
        );
      case "files":
        const totalFiles = realData?.files?.total ?? 0;
        return (
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-600 mb-1 tracking-wider uppercase">Files</p>
              <h4 className="text-gray-900 font-bold text-sm md:text-base leading-tight mb-2">{totalFiles} Secure Files</h4>
            </div>
            {size !== "small" && (
              <a href="/dashboard/files" className="mt-4 w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 rounded-xl text-xs font-bold transition-colors text-center block">
                View Files
              </a>
            )}
          </div>
        );
      case "gmail":
        const isGoogleConnected = !!realData?.google;
        const unreadCount = realData?.google?.gmail?.unread ?? 0;
        
        return (
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-xs font-bold text-red-500 mb-1 tracking-wider uppercase">Inbox</p>
              {!isGoogleConnected ? (
                <p className="text-gray-500 text-sm font-medium mt-2">Connect Google to view unread emails.</p>
              ) : (
                <>
                  <h4 className="text-gray-900 font-bold text-sm md:text-base leading-tight mb-2">{unreadCount} unread emails.</h4>
                </>
              )}
            </div>
            {size !== "small" && (
              <a href="https://mail.google.com" target="_blank" className="mt-4 w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl text-xs font-bold transition-colors text-center block">
                Open Gmail
              </a>
            )}
          </div>
        );
      case "calendar":
        const isCalConnected = !!realData?.google;
        const nextEvent = realData?.google?.calendar?.[0];
        
        return (
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-xs font-bold text-blue-500 mb-1 tracking-wider uppercase">Next Event</p>
              {!isCalConnected ? (
                <p className="text-gray-500 text-sm font-medium mt-2">Connect Google to sync calendar.</p>
              ) : !nextEvent ? (
                <p className="text-gray-500 text-sm font-medium mt-2">No upcoming events today.</p>
              ) : (
                <h4 className="text-gray-900 font-bold text-sm md:text-base leading-tight truncate">{nextEvent.summary}</h4>
              )}
            </div>
            {size !== "small" && (
              <a href={nextEvent?.link || "https://calendar.google.com"} target="_blank" className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-bold transition-colors shadow-sm text-center block">
                {nextEvent?.link ? 'Join Meeting' : 'Open Calendar'}
              </a>
            )}
          </div>
        );
      case "tasks":
        return (
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-xs font-bold text-indigo-500 mb-1 tracking-wider uppercase">Tasks ({tasks.filter(t => !t.done).length} Pending)</p>
              <ul className="space-y-2 mt-3 max-h-[100px] overflow-y-auto pr-1">
                {tasks.map(t => (
                  <li key={t.id} className="flex items-center gap-2 group">
                    <button onClick={() => toggleTask(t.id)} className="shrink-0 flex items-center justify-center w-4 h-4 border-2 border-indigo-200 rounded text-indigo-600 focus:outline-none focus:border-indigo-500">
                      {t.done && <CheckSquare size={14} className="text-indigo-600 absolute" />}
                    </button>
                    <span className={`text-sm font-bold truncate flex-1 ${t.done ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                      {t.text}
                    </span>
                    <button onClick={() => removeTask(t.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100">
                      <Trash2 size={12}/>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {size !== "small" && (
              <div className="mt-4">
                <input 
                  type="text" 
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyDown={addTask}
                  placeholder="Add a task & press Enter" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                />
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // Convert logical size
"""

pattern = r'  // Widget Renderer Engine.*?  // Convert logical size'
new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open("frontend/src/app/command-center/page.tsx", "w", encoding="utf-8") as f:
    f.write(new_content)
print("Updated to working models.")

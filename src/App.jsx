import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './lib/supabase';
import HUD from './components/HUD';
import MarioSprite from './components/MarioSprite';
import TaskItem from './components/TaskItem';
import { Plus, Trash2, CheckCircle, Circle, LogOut, Ghost, Star, Clock, Search } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newDeadline, setNewDeadline] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('Overworld');
  const [theme, setTheme] = useState('light');
  const [marioState, setMarioState] = useState('running');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (!supabase) return;
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) fetchTasks();
    };
    fetchUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchTasks();
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => fetchTasks())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError(null);
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  };

  const fetchTasks = async () => {
    const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (data) {
      setTasks(data);
      setScore(data.filter(t => t.completed).length * 100);
      if (data.length > 0 && data.every(t => t.completed)) {
        if (marioState !== 'victory') setMarioState('fighting');
      } else {
        setMarioState('running');
      }
    }
  };

  useEffect(() => {
    if (marioState === 'fighting') {
      const timer = setTimeout(() => setMarioState('victory'), 3000);
      return () => clearTimeout(timer);
    }
  }, [marioState]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim() || !user) return;
    await supabase.from('tasks').insert([{
      title: newTask,
      user_id: user.id,
      category,
      priority: newPriority,
      deadline: newDeadline || null
    }]);
    setNewTask('');
    setNewDeadline('');
    setMarioState('jumping');
    setTimeout(() => setMarioState('running'), 500);
  };

  const toggleTask = async (task) => {
    const newStatus = !task.completed;
    if (newStatus) setMarioState('mushroom-spawn');
    const element = document.getElementById(`task-${task.id}`);
    if (element) {
      element.classList.add('hit-shake');
      setTimeout(() => element.classList.remove('hit-shake'), 300);
    }
    await supabase.from('tasks').update({ completed: newStatus }).eq('id', task.id);
  };

  const deleteTask = async (id) => {
    await supabase.from('tasks').delete().eq('id', id);
  };

  // Sorting Logic: Priority (High > Medium > Low) then Date
  const filteredTasks = tasks
    .filter(t => t.category === category)
    .filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const priorityMap = { high: 0, medium: 1, low: 2 };
      if (priorityMap[a.priority] !== priorityMap[b.priority]) {
        return priorityMap[a.priority] - priorityMap[b.priority];
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });

  if (!user) {
    return (
      <div className="min-h-screen bg-[#5C94FC] flex items-center justify-center p-4">
        <div className="pro-panel max-w-sm w-full text-center">
          <h1 className="text-2xl mb-8 uppercase tracking-widest font-black">Mario Tasks Pro</h1>
          <form onSubmit={handleAuth} className="space-y-5 mb-6">
            <input type="email" placeholder="EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-100 border-4 border-black p-3 font-pixel text-[10px] outline-none" required />
            <input type="password" placeholder="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-100 border-4 border-black p-3 font-pixel text-[10px] outline-none" required />
            {authError && <p className="text-red-600 text-[8px] uppercase">{authError}</p>}
            <button type="submit" className="pro-button w-full">{isSignUp ? 'JOIN QUEST' : 'START GAME'}</button>
          </form>
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-[8px] uppercase font-bold opacity-50 hover:opacity-100 transition-opacity mb-4">
            {isSignUp ? 'HAVE ACCOUNT? LOGIN' : 'NEW PLAYER? REGISTER'}
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-pixel">
        <h1 className="text-6xl mb-8 animate-pulse">GAME OVER</h1>
        <button onClick={() => setGameOver(false)} className="pro-button bg-white text-black">CONTINUE?</button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-700 relative overflow-hidden ${theme === 'light' ? 'bg-[#5C94FC]' : 'bg-[#101010]'}`}>

      {/* Dynamic Backgrounds */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-x-0 bottom-0 h-96 bg-repeat-x bg-bottom" style={{ backgroundImage: theme === 'light' ? 'url(/overworld.png)' : 'url(/underground.png)', backgroundSize: 'cover' }} />
        {theme === 'light' && <div className="absolute top-20 left-10 w-40 h-20 bg-white/20 rounded-full blur-3xl animate-pulse" />}
      </div>

      <HUD score={score} coins={tasks.filter(t => t.completed).length} lives={tasks.filter(t => !t.completed).length} world={category} />

      <main className="relative z-10 max-w-6xl mx-auto pt-36 pb-20 px-8">

        {/* Mario World Stage */}
        <div className="h-72 relative flex items-end justify-center mb-16 border-b-[20px] border-[#E45C10] group">
          <div className="absolute bottom-0 w-full h-12 bg-black/10" />
          <MarioSprite state={marioState} theme={theme} onCollectMushroom={() => setMarioState('running')} />

          <div className="absolute top-0 right-0">
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="pro-button-secondary text-[8px]">
              SWITCH TO {theme === 'light' ? 'DARK WORLD' : 'LIGHT WORLD'}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-12">
          {/* Quest Board */}
          <div className="space-y-10">
            <div className="pro-panel bg-white/90 backdrop-blur-sm">
              <h2 className="text-[12px] font-black mb-6 uppercase tracking-widest border-b-4 border-black pb-2 flex justify-between items-center">
                <span>Mission Board</span>
                <span className="text-[8px] bg-black text-white px-2 py-1">ACTIVE: {filteredTasks.length}</span>
              </h2>

              <form onSubmit={addTask} className="space-y-4">
                <div className="flex gap-4">
                  <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="ENTER NEW MISSION TITLE..." className="flex-1 bg-white border-4 border-black p-4 font-pixel text-[10px] outline-none focus:ring-4 focus:ring-yellow-400" required />
                  <button type="submit" className="pro-button py-2 px-6">ADD</button>
                </div>

                <div className="flex flex-wrap gap-4 items-center justify-between bg-black/5 p-4 border-[3px] border-black/10">
                  <div className="flex gap-4 items-center">
                    <span className="text-[8px] font-bold">PRIORITY:</span>
                    <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)} className="bg-white border-2 border-black p-1 font-pixel text-[8px] outline-none">
                      <option value="low">LOW (COIN)</option>
                      <option value="medium">MED (MUSHROOM)</option>
                      <option value="high">HIGH (STAR)</option>
                    </select>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="text-[8px] font-bold">DEADLINE:</span>
                    <input type="date" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} className="bg-white border-2 border-black p-1 font-pixel text-[8px] outline-none" />
                  </div>
                </div>
              </form>

              <div className="mt-8 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={16} />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="SEARCH MISSIONS..." className="w-full bg-black/5 border-b-4 border-black p-4 pl-12 font-pixel text-[10px] outline-none" />
              </div>
            </div>

            <AnimatePresence>
              <div className="space-y-4">
                {filteredTasks.map(task => (
                  <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                ))}
                {filteredTasks.length === 0 && (
                  <div className="text-center py-20 opacity-20 flex flex-col items-center gap-4">
                    <Ghost size={64} />
                    <p className="text-[10px] uppercase">No active missions in this world</p>
                  </div>
                )}
              </div>
            </AnimatePresence>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-12">
            <div className="pro-panel">
              <h3 className="text-[10px] text-center font-black mb-10 tracking-widest opacity-40 uppercase">World Selection</h3>
              <div className="flex justify-around items-end h-44">
                {['Overworld', 'Castle', 'Pipe'].map(cat => (
                  <div key={cat} onClick={() => setCategory(cat)} className={`pipe-item ${category === cat ? 'pipe-active scale-110 -translate-y-6' : 'opacity-30 grayscale hover:opacity-100'}`}>
                    <div className="pipe-head" />
                    <div className="pipe-body" />
                    <span className="text-[8px] mt-6 font-black uppercase text-center block w-full">{cat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleGiveUp} className="pro-button bg-black w-full py-8 flex items-center justify-center gap-6 hover:bg-[#222]">
              <Ghost size={32} />
              <span className="text-lg">SURRENDER</span>
            </button>

            <div className="text-center pt-8">
              <button onClick={() => supabase.auth.signOut()} className="text-[8px] font-bold opacity-30 hover:opacity-100 hover:text-red-600 transition-all border-b-2 border-black uppercase pb-1">
                TERMINATE SESSION
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

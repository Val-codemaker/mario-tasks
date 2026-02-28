import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from './lib/supabase';
import HUD from './components/HUD';
import MarioSprite from './components/MarioSprite';
import { Plus, Trash2, CheckCircle, Circle, LogOut, Ghost } from 'lucide-react';

function App() {
  console.log('App Rendering...');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('Overworld');
  const [theme, setTheme] = useState('light'); // light = overworld, dark = underground
  const [marioState, setMarioState] = useState('running');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (!supabase) {
      console.error('Supabase client not initialized. Check your .env file.');
      return;
    }
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

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError(null);
    if (!supabase) return;

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setAuthError('EMAIL NOT CONFIRMED! Check your inbox or disable "Confirm Email" in Supabase settings.');
      } else {
        setAuthError(error.message);
      }
    } else if (isSignUp) {
      setAuthError('Check your email for the confirmation link!');
    }
  };

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setTasks(data);
      const completedCount = data.filter(t => t.completed).length;
      setScore(completedCount * 100);

      if (data.length > 0 && data.every(t => t.completed)) {
        if (marioState !== 'victory') setMarioState('fighting');
      } else {
        setMarioState('running');
      }
    }
  };

  useEffect(() => {
    if (marioState === 'fighting') {
      const timer = setTimeout(() => {
        setMarioState('victory');
      }, 3000); // Fight for 3 seconds, then win
      return () => clearTimeout(timer);
    }
  }, [marioState]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim() || !user) return;

    await supabase.from('tasks').insert([
      { title: newTask, user_id: user.id, category }
    ]);
    setNewTask('');
  };

  const toggleTask = async (task) => {
    const newStatus = !task.completed;
    if (newStatus) setMarioState('mushroom-spawn');

    await supabase.from('tasks')
      .update({ completed: newStatus })
      .eq('id', task.id);
  };

  const deleteTask = async (id) => {
    await supabase.from('tasks').delete().eq('id', id);
  };

  const handleGiveUp = () => {
    setGameOver(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-mario-sky flex items-center justify-center p-4">
        <div className="retro-panel max-w-sm w-full text-center">
          <h1 className="text-2xl mb-8 uppercase">Mario Tasks</h1>

          <form onSubmit={handleAuth} className="space-y-4 mb-6">
            <input
              type="email"
              placeholder="EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-100 border-4 border-black p-2 font-pixel text-xs focus:outline-none"
              required
            />
            <input
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-100 border-4 border-black p-2 font-pixel text-xs focus:outline-none"
              required
            />
            {authError && <p className="text-red-600 text-[8px] uppercase">{authError}</p>}
            <button type="submit" className="retro-button w-full">
              {isSignUp ? 'REGISTER' : 'START GAME'}
            </button>
          </form>

          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[8px] uppercase underline mb-4 inline-block"
          >
            {isSignUp ? 'Instead: Login' : 'Instead: Create Account'}
          </button>

          <div className="border-t-4 border-black pt-4">
            <button
              onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
              className="retro-button w-full bg-white text-black flex items-center justify-center gap-2"
            >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" />
              LOGIN WITH GOOGLE
            </button>
          </div>
          <p className="text-[10px] mt-4 uppercase">Insert Coin to Start</p>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-pixel">
        <h1 className="text-6xl mb-8 animate-pulse">GAME OVER</h1>
        <button
          onClick={() => setGameOver(false)}
          className="retro-button bg-white text-black"
        >
          Continue?
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-700 relative overflow-hidden ${theme === 'light' ? 'bg-[#5C94FC]' : 'bg-[#000]'}`}>

      {/* Animated Parallax Background Layers */}
      {theme === 'light' && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 bg-repeat-x opacity-40"
            style={{
              backgroundImage: 'url(/overworld.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'bottom'
            }}
          />
          {/* Layered clouds for depth */}
          <div className="absolute top-20 left-10 w-32 h-16 bg-white/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-40 right-20 w-48 h-20 bg-white/10 rounded-full blur-2xl animate-bounce" />
        </div>
      )}

      <HUD score={score} coins={tasks.filter(t => t.completed).length} world={category} />

      <main className="relative z-10 max-w-5xl mx-auto pt-32 pb-12 px-6">

        {/* Mario Stage: Enhanced stage with ground details */}
        <div className="h-64 relative flex items-end justify-center mb-16 border-b-[16px] border-[#E45C10]">
          <div className="absolute bottom-0 w-full h-10 bg-[#8C3000]/40" />
          <div className="absolute bottom-10 left-0 w-full flex justify-around opacity-20 pointer-events-none">
            <div className="w-8 h-8 bg-green-800 rounded-full" />
            <div className="w-12 h-12 bg-green-700 rounded-full" />
            <div className="w-8 h-8 bg-green-800 rounded-full" />
          </div>
          <MarioSprite state={marioState} onCollectMushroom={() => setMarioState('running')} />

          <div className="absolute top-0 right-0">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="retro-button-premium text-[10px]"
            >
              {theme === 'light' ? 'UNDERGROUND' : 'OVERWORLD'}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_350px] gap-12">
          {/* Main Content: Tasks as Question Blocks */}
          <div className="space-y-8">
            <form onSubmit={addTask} className="flex gap-4 mb-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="TYPE NEW MISSION..."
                className="flex-1 bg-white border-4 border-black p-5 font-pixel text-sm focus:ring-8 focus:ring-yellow-400/50 outline-none"
              />
              <button type="submit" className="retro-button-premium h-[68px]">
                <Plus size={32} />
              </button>
            </form>

            <div className="space-y-6">
              {tasks.map(task => (
                <motion.div
                  layout
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  key={task.id}
                  className={`question-block flex items-center justify-between group transition-all ${task.completed ? 'grayscale opacity-40' : ''}`}
                >
                  <div className="flex items-center gap-8">
                    <button
                      onClick={() => toggleTask(task)}
                      className={`w-10 h-10 flex items-center justify-center border-4 border-black transition-colors ${task.completed ? 'bg-mario-grass' : 'bg-white hover:bg-mario-coin'}`}
                    >
                      {task.completed && <CheckCircle className="text-white" size={20} />}
                    </button>
                    <div className="flex flex-col">
                      <span className={`text-sm leading-relaxed ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </span>
                      <span className="text-[10px] mt-2 bg-black text-white px-2 py-1 inline-block w-fit">
                        {task.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-black hover:scale-125"
                  >
                    <Trash2 size={28} />
                  </button>
                </motion.div>
              ))}
              {tasks.length === 0 && (
                <div className="text-center py-20 bg-black/5 border-4 border-dashed border-black/20 rounded-xl">
                  <p className="text-black/30 text-sm">NO MISSIONS ACTIVE</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area: Categorized Pipes */}
          <div className="space-y-12">
            <div className="retro-panel bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xs mb-10 text-center font-bold tracking-widest text-black/40">SELECT WORLD</h3>
              <div className="flex justify-around items-end h-40">
                {['Overworld', 'Castle', 'Pipe'].map(cat => (
                  <div
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`cursor-pointer group flex flex-col items-center transition-all ${category === cat ? 'scale-110 -translate-y-4' : 'opacity-40 hover:opacity-80'}`}
                  >
                    <div className="mario-pipe-container">
                      <div className={`mario-pipe-top ${category === cat ? 'animate-pulse shadow-[0px_0px_20px_#80F800]' : ''}`} />
                      <div className="mario-pipe-body" />
                    </div>
                    <span className="text-[10px] mt-6 font-black uppercase text-center">{cat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleGiveUp}
              className="retro-button-premium bg-black w-full flex items-center justify-center gap-6 py-8 hover:bg-[#222]"
            >
              <Ghost size={32} />
              <span className="text-lg">GIVE UP</span>
            </button>

            <div className="text-center pt-10">
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-[10px] font-bold opacity-30 hover:opacity-100 hover:text-red-600 transition-all border-b-2 border-black"
              >
                LOGOUT SYSTEM
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

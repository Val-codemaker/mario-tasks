import React, { useState, useEffect } from 'react';
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
        setMarioState('fighting');
      } else {
        setMarioState('running');
      }
    }
  };

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
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'light' ? 'overworld-bg' : 'underground-bg'}`}>
      <HUD score={score} coins={tasks.filter(t => t.completed).length} world={category} />

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="retro-button text-xs"
            >
              {theme === 'light' ? 'GO UNDERGROUND' : 'GO OVERWORLD'}
            </button>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="text-black/50 hover:text-black">
            <LogOut size={24} />
          </button>
        </div>

        {/* Mario Animation Area */}
        <div className="h-40 relative flex items-end justify-center mb-12 overflow-hidden border-b-8 border-mario-ground">
          <MarioSprite state={marioState} onCollectMushroom={() => setMarioState('running')} />
        </div>

        <div className="grid md:grid-cols-[1fr_300px] gap-8">
          {/* Task List */}
          <div className="retro-panel min-h-[400px]">
            <form onSubmit={addTask} className="flex gap-2 mb-6">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="New Mission..."
                className="flex-1 bg-gray-100 border-4 border-black p-2 font-pixel text-sm focus:outline-none"
              />
              <button type="submit" className="retro-button p-2">
                <Plus size={20} />
              </button>
            </form>

            <div className="space-y-4">
              {tasks.map(task => (
                <div key={task.id} className={`flex items-center justify-between p-4 border-4 border-black ${task.completed ? 'bg-gray-100 opacity-60' : 'bg-white'}`}>
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleTask(task)}>
                      {task.completed ? <CheckCircle className="text-mario-pipe" /> : <Circle />}
                    </button>
                    <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
                  </div>
                  <button onClick={() => deleteTask(task.id)} className="text-red-600">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="text-center py-20 text-gray-400 uppercase text-xs">
                  No tasks in this world
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Pipes */}
          <div className="space-y-8">
            <div className="retro-panel">
              <h3 className="text-sm mb-4 uppercase">World Selector</h3>
              <div className="flex justify-around">
                {['Overworld', 'Castle', 'Pipe'].map(cat => (
                  <div key={cat} onClick={() => setCategory(cat)} className="cursor-pointer group flex flex-col items-center">
                    <div className="pipe-category bg-mario-pipe group-hover:bg-mario-pipeHighlight transition-colors duration-200">
                      <div className="pipe-top bg-mario-pipe group-hover:bg-mario-pipeHighlight"></div>
                    </div>
                    <span className="text-[8px] mt-2 uppercase">{cat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleGiveUp}
              className="retro-button bg-black text-white w-full flex items-center justify-center gap-2"
            >
              <Ghost size={20} /> GIVE UP
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CreditCard, CircleCheck, Circle, Plus, Trash2, Code2 } from 'lucide-react';

// --- 基础组件：拖拽卡片容器 ---
const Card = ({ children, className = "" }) => (
  <div 
    className={`bg-black/20 rounded-[2.5rem] p-7 border border-white/5 flex flex-col shadow-2xl ${className}`}
    style={{ WebkitAppRegion: 'drag', dataTauriDragRegion: true }}
  >
    {children}
  </div>
);

// --- 基础组件：防拖动内容区 ---
const NoDrag = ({ children, className="" }) => (
  <div style={{ WebkitAppRegion: 'no-drag' }} className={className}>
    {children}
  </div>
);

// --- 模块 1：付费账单监控 ---
const Subscriptions = () => {
  const [subs, setSubs] = useState(() => JSON.parse(localStorage.getItem('dash_subs')) || []);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('monthly');
  const [date, setDate] = useState('');

  useEffect(() => { localStorage.setItem('dash_subs', JSON.stringify(subs)); }, [subs]);

  const addSub = (e) => {
    e.preventDefault();
    if (!name || !amount || !date) return;
    setSubs([...subs, { id: Date.now(), name, amount: parseFloat(amount), period, date }]);
    setName(''); setAmount(''); setDate('');
  };

  const removeSub = (id) => setSubs(subs.filter(s => s.id !== id));

  const totalMonthly = subs.reduce((acc, sub) => {
    if (sub.period === 'weekly') return acc + sub.amount * 4.33;
    if (sub.period === 'yearly') return acc + sub.amount / 12;
    return acc + sub.amount;
  }, 0);

  return (
    <Card className="flex-1">
      <div className="flex items-center gap-3 mb-5 opacity-80 text-white">
        <CreditCard size={20} strokeWidth={1.5} />
        <h2 className="text-sm font-medium tracking-[0.2em] uppercase">Subscriptions</h2>
      </div>
      <NoDrag className="flex-1 flex flex-col gap-4 overflow-hidden">
        <form onSubmit={addSub} className="flex gap-2 flex-wrap text-white">
          <input type="text" placeholder="App Name" value={name} onChange={e => setName(e.target.value)}
            className="flex-1 bg-white/5 rounded-2xl px-3 py-2 text-sm outline-none border border-transparent focus:border-white/20 min-w-[80px] transition-all" />
          <input type="number" placeholder="$" value={amount} onChange={e => setAmount(e.target.value)}
            className="w-16 bg-white/5 rounded-2xl px-3 py-2 text-sm outline-none border border-transparent focus:border-white/20 transition-all" />
          <select value={period} onChange={e => setPeriod(e.target.value)} style={{ colorScheme: 'dark' }}
            className="w-16 bg-white/5 rounded-2xl px-2 py-2 text-sm outline-none appearance-none text-center border border-transparent">
            <option value="weekly">W</option>
            <option value="monthly">M</option>
            <option value="yearly">Y</option>
          </select>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ colorScheme: 'dark' }}
            className="w-full bg-white/5 rounded-2xl px-3 py-2 text-sm outline-none border border-transparent" />
          <button type="submit" className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-2xl transition-colors flex justify-center items-center">
            <Plus size={16} />
          </button>
        </form>
        
        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1 text-white">
          {subs.map(sub => {
            const nextDate = new Date(sub.date);
            const today = new Date();
            while (nextDate < today) {
               if (sub.period === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
               else if (sub.period === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
               else nextDate.setFullYear(nextDate.getFullYear() + 1);
            }
            const daysLeft = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={sub.id} className="group flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-transparent hover:border-white/10 transition-all">
                <div>
                  <div className="font-medium text-sm">{sub.name}</div>
                  <div className="text-[10px] opacity-40 uppercase tracking-wider">${sub.amount} / {sub.period.charAt(0)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-bold text-indigo-300">{daysLeft === 0 ? 'Today' : `${daysLeft}d left`}</div>
                    <div className="text-[10px] opacity-40">{nextDate.toLocaleDateString()}</div>
                  </div>
                  <button onClick={() => removeSub(sub.id)} className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="pt-4 border-t border-white/5 flex justify-between text-xs opacity-60 text-white uppercase tracking-wider">
          <span>Monthly: ${totalMonthly.toFixed(1)}</span>
          <span>Yearly: ${(totalMonthly * 12).toFixed(1)}</span>
        </div>
      </NoDrag>
    </Card>
  );
};

// --- 模块 2：紧急 DDL ---
const UrgentDDL = () => {
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('dash_ddl')) || []);
  const [taskName, setTaskName] = useState('');
  const [ddl, setDdl] = useState('');

  useEffect(() => { localStorage.setItem('dash_ddl', JSON.stringify(tasks)); }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!taskName || !ddl) return;
    setTasks([...tasks, { id: Date.now(), name: taskName, ddl }]);
    setTaskName(''); setDdl('');
  };

  const removeTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  const sortedTasks = [...tasks].sort((a, b) => new Date(a.ddl) - new Date(b.ddl));

  return (
    <Card className="flex-1">
      <div className="flex items-center gap-3 mb-5 opacity-80 text-white">
        <Clock size={20} strokeWidth={1.5} />
        <h2 className="text-sm font-medium tracking-[0.2em] uppercase">Urgent DDL</h2>
      </div>
      <NoDrag className="flex-1 flex flex-col gap-4 overflow-hidden text-white">
        <form onSubmit={addTask} className="flex flex-col gap-2">
          <input type="text" placeholder="Task description..." value={taskName} onChange={e => setTaskName(e.target.value)}
            className="w-full bg-white/5 rounded-2xl px-3 py-2 text-sm outline-none border border-transparent focus:border-white/20 transition-all" />
          <div className="flex gap-2">
            <input type="datetime-local" value={ddl} onChange={e => setDdl(e.target.value)} style={{ colorScheme: 'dark' }}
              className="flex-1 bg-white/5 rounded-2xl px-3 py-2 text-sm outline-none border border-transparent" />
            <button type="submit" className="bg-white/10 hover:bg-white/20 px-4 rounded-2xl transition-colors">
              <Plus size={16} />
            </button>
          </div>
        </form>
        
        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
          {sortedTasks.map((task, idx) => {
            const hoursLeft = (new Date(task.ddl) - new Date()) / (1000 * 60 * 60);
            const isClosest = idx === 0 && hoursLeft > 0;
            const isOverdue = hoursLeft <= 0;
            
            return (
              <div key={task.id} className={`group flex justify-between items-center p-3 rounded-2xl border transition-all ${
                isOverdue ? 'bg-red-500/10 border-red-500/20' :
                isClosest ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/5 border-transparent'
              }`}>
                <div className="flex-1 pr-3">
                  <div className={`text-sm ${isClosest || isOverdue ? 'font-medium' : 'font-light'}`}>{task.name}</div>
                  <div className={`text-[10px] uppercase tracking-wider mt-0.5 ${isOverdue ? 'text-red-300' : isClosest ? 'text-amber-300' : 'opacity-40'}`}>
                    {new Date(task.ddl).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                  </div>
                </div>
                <button onClick={() => removeTask(task.id)} className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-emerald-400 transition-all">
                  <CircleCheck size={18} />
                </button>
              </div>
            );
          })}
        </div>
      </NoDrag>
    </Card>
  );
};

// --- 模块 3：今明计划表 ---
const PlanBoard = () => {
  const [today, setToday] = useState(() => localStorage.getItem('dash_today') || '');
  const [tomorrow, setTomorrow] = useState(() => localStorage.getItem('dash_tomorrow') || '');

  useEffect(() => { localStorage.setItem('dash_today', today); }, [today]);
  useEffect(() => { localStorage.setItem('dash_tomorrow', tomorrow); }, [tomorrow]);

  return (
    <Card className="h-full">
      <div className="flex items-center gap-3 mb-6 opacity-80 text-white">
        <Calendar size={20} strokeWidth={1.5} />
        <h2 className="text-sm font-medium tracking-[0.2em] uppercase">Agenda</h2>
      </div>
      <NoDrag className="flex-1 flex flex-col gap-6 text-white">
        <div className="flex-1 flex flex-col">
          <div className="text-[10px] uppercase tracking-widest opacity-40 mb-2 pl-4">Today</div>
          <textarea value={today} onChange={e => setToday(e.target.value)}
            className="flex-1 bg-white/5 rounded-[2rem] p-5 outline-none resize-none border border-transparent focus:border-white/10 transition-all text-sm leading-relaxed custom-scrollbar font-light"
            placeholder="Focus of the day..." />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="text-[10px] uppercase tracking-widest opacity-40 mb-2 pl-4">Tomorrow</div>
          <textarea value={tomorrow} onChange={e => setTomorrow(e.target.value)}
            className="flex-1 bg-white/5 rounded-[2rem] p-5 outline-none resize-none border border-transparent focus:border-white/10 transition-all text-sm leading-relaxed custom-scrollbar font-light"
            placeholder="Plans for tomorrow..." />
        </div>
      </NoDrag>
    </Card>
  );
};

// --- 模块 4：研发任务看板 ---
const DevBoard = () => {
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('dash_dev')) || []);
  const [input, setInput] = useState('');

  useEffect(() => { localStorage.setItem('dash_dev', JSON.stringify(tasks)); }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!input) return;
    setTasks([{ id: Date.now(), text: input, done: false }, ...tasks]);
    setInput('');
  };

  const toggleTask = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const removeTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  return (
    <Card className="h-full">
      <div className="flex items-center gap-3 mb-6 opacity-80 text-white">
        <Code2 size={20} strokeWidth={1.5} />
        <h2 className="text-sm font-medium tracking-[0.2em] uppercase">Dev Board</h2>
      </div>
      <NoDrag className="flex-1 flex flex-col overflow-hidden text-white">
        <form onSubmit={addTask} className="mb-4">
          <input type="text" placeholder="Feature, bugfix, refactor..." value={input} onChange={e => setInput(e.target.value)}
            className="w-full bg-white/5 rounded-[1.5rem] px-4 py-3 text-sm outline-none border border-transparent focus:border-white/20 transition-all" />
        </form>
        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
          {tasks.map(task => (
            <div key={task.id} className="group flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
              <button onClick={() => toggleTask(task.id)} className="mt-0.5 text-white/30 hover:text-white transition-colors shrink-0">
                {task.done ? <CircleCheck size={18} className="text-emerald-400/80" /> : <Circle size={18} />}
              </button>
              <span className={`flex-1 text-sm font-light leading-snug transition-all ${task.done ? 'line-through opacity-30' : 'opacity-90'}`}>
                {task.text}
              </span>
              <button onClick={() => removeTask(task.id)} className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-rose-400 transition-all shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </NoDrag>
    </Card>
  );
};

// --- 主布局 ---
export default function App() {
  return (
    <div 
      className="w-screen h-screen p-8 flex gap-8 font-sans selection:bg-white/20 select-none"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* 栏 1：账单 + 紧急 DDL */}
      <div className="w-1/3 flex flex-col gap-8 h-full">
        <Subscriptions />
        <UrgentDDL />
      </div>
      
      {/* 栏 2：计划板 */}
      <div className="w-1/3 h-full">
        <PlanBoard />
      </div>

      {/* 栏 3：开发任务板 */}
      <div className="w-1/3 h-full">
        <DevBoard />
      </div>
    </div>
  );
}

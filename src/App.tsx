import TodoList from './components/TodoList';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 selection:bg-indigo-200 dark:selection:bg-indigo-900/50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute top-40 -left-20 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-20 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <TodoList />
      </div>
    </div>
  );
}

export default App;

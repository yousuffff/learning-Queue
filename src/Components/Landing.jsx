import MouseFollower from "./MouseFollower";

function Landing({ onLogin, onSignup }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-900 text-white overflow-hidden">
      <MouseFollower />

      <div className="text-center space-y-6 z-10">
        <h1 className="text-4xl font-bold">
          Learning Queue
        </h1>

        <p className="text-slate-400 max-w-sm mx-auto">
          Save, organize, and complete your learning resources in one place.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onLogin}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
          >
            Login
          </button>

          <button
            onClick={onSignup}
            className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;

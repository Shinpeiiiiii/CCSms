import Router from "../src/main/router/index"
import useIdleTimeout from "./hooks/useIdleTimeout"
import useAuthStore from "./modules/auth/state/auth-store"

function App() {

  const logout = useAuthStore((state) => state.logout);

  useIdleTimeout({
    timeout: 5 * 60 * 60 * 1000,
    onIdle: () => {
      console.log("Idle timeout reached");
      alert("Session expired due to inactivity.");
      logout();
    },
  });
  return (
    <Router
    
    />
  )
}

export default App
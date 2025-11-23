// Perfil.jsx
import { useAuth0 } from "@auth0/auth0-react";

function Perfil() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      {!isAuthenticated ? (
        <button 
          onClick={() => loginWithRedirect()} 
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Login
        </button>
      ) : (
        <>
          <h2>Hola, {user.name}</h2>
          <p>Email: {user.email}</p>
          <button 
            onClick={() => logout({ returnTo: window.location.origin })} 
            style={{ padding: "10px 20px", cursor: "pointer", marginTop: "10px" }}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default Perfil;

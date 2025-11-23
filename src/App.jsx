import React, { useState, useCallback, useEffect } from 'react';
import { Calendar, MapPin, Users, Search, LogOut, User, X, Bell } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import API_URL from "./config";

// =======================
// Datos simulados
// =======================
const mockEvents = [
  { id: 1, title: "Tech Summit 2025", category: "TECNOLOGÍA", description: "Conferencia anual sobre tecnologías emergentes: AI, ML Web3 y más.", date: "2025-11-15", location: "Centro de Convenciones", maxCapacity: 200, registered: 45, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop" },
  { id: 2, title: "Educación del Futuro", category: "EDUCACIÓN", description: "Encuentro para docentes y profesionales, con talleres prácticos sobre metodologías activas", date: "2025-11-20", location: "Universidad Central", maxCapacity: 150, registered: 78, image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop" },
  { id: 3, title: "Foro de Negocios & Startups", category: "NEGOCIOS", description: "Paneles de inversionistas, pitch de startups y mesas redondas con líderes del ecosistema", date: "2025-11-25", location: "Hotel Empresarial", maxCapacity: 100, registered: 92, image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=250&fit=crop" }
];

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null);
  const [events] = useState(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const { loginWithRedirect, logout, isAuthenticated, user: auth0User } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && auth0User) {
      setUser({
        name: auth0User.name,
        email: auth0User.email,
        picture: auth0User.picture,
        role: 'user',
        registeredEvents: [],
        createdEvents: []
      });
    }
  }, [isAuthenticated, auth0User]);

  const addNotification = (message, type = 'info') => {
    setNotifications(prev => [{ id: Date.now(), message, type }, ...prev]);
    setHasUnread(true);
  };

  const categories = ['all', 'TECNOLOGÍA', 'EDUCACIÓN', 'NEGOCIOS', 'CULTURA', 'DEPORTES'];
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesDate = !selectedDate || event.date === selectedDate;
    return matchesSearch && matchesCategory && matchesDate;
  });

  // =======================
  // LOGIN NORMAL (opcional)
  // =======================
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});

  const handleLogin = async () => {
    const errors = {};
    if (!loginForm.email) errors.email = "El correo es obligatorio.";
    else if (!loginForm.email.includes("@")) errors.email = "Correo electrónico inválido.";
    if (!loginForm.password) errors.password = "La contraseña es obligatoria.";
    else if (loginForm.password.length < 6) errors.password = "La contraseña es demasiado corta.";
    setLoginErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al iniciar sesión");

      if (data.token) localStorage.setItem("token", data.token);
      setUser({ ...data.user || data, registeredEvents: data.user?.registeredEvents || [], createdEvents: data.user?.createdEvents || [] });
      addNotification("Sesión iniciada correctamente ✅");
      setShowLoginModal(false);
      setLoginForm({ email: "", password: "" });
    } catch (error) {
      addNotification(error.message, "error");
    }
  };

  // =======================
  // LOGIN CON GOOGLE (Auth0)
  // =======================
  const handleGoogleLogin = () => {
    loginWithRedirect({ connection: 'google-oauth2' });
  };

  // =======================
  // LOGOUT
  // =======================
  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
    setUser(null);
    setShowLogoutConfirm(false);
    addNotification("Sesión cerrada correctamente", "info");
    setCurrentView("home");
  };

  // =======================
  // HEADER
  // =======================
  const Header = () => (
    <header className="bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setCurrentView('home'); setSelectedEvent(null); }}>
          <div className="bg-white rounded-lg p-2"><span className="text-purple-600 font-bold text-xl">EH</span></div>
          <h1 className="text-white text-2xl font-bold">EventHub</h1>
        </div>
        <div className="flex items-center gap-4 relative">
          {user && (
            <>
              <button className="relative text-white hover:bg-purple-500 p-2 rounded-lg" onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) setHasUnread(false); }}>
                <Bell className="w-6 h-6" />
                {hasUnread && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white shadow-2xl rounded-xl p-4 z-50 max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? <p className="text-gray-500 text-sm">No tienes notificaciones.</p> :
                    notifications.map(n => <div key={n.id} className="border-b last:border-none py-2"><p className={`text-sm ${n.type === 'error' ? 'text-red-600' : 'text-gray-800'}`}>{n.message}</p></div>)}
                </div>
              )}
              <button onClick={() => setCurrentView('profile')} className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition"><User className="w-5 h-5" />{user.name}</button>
            </>
          )}
          {!user ? (
            <>
              <button onClick={() => { setShowLoginModal(true); setIsRegisterMode(false); }} className="text-white border-2 border-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition">Iniciar</button>
              <button onClick={() => { setShowLoginModal(true); setIsRegisterMode(true); }} className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition">Registro</button>
            </>
          ) : (
            <button onClick={handleLogout} className="text-white hover:bg-purple-500 p-2 rounded-lg transition" title="Cerrar sesión"><LogOut className="w-5 h-5" /></button>
          )}
        </div>
      </div>
    </header>
  );

  // =======================
  // RENDER PRINCIPAL
  // =======================
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* MODAL LOGIN / REGISTRO */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{isRegisterMode ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
              <button onClick={() => setShowLoginModal(false)} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
            </div>

            {!isRegisterMode ? (
              <>
                <div className="space-y-4">
                  <input type="email" placeholder="Correo" className="w-full p-3 border rounded-lg" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
                  <input type={showPassword ? "text" : "password"} placeholder="Contraseña" className="w-full p-3 border rounded-lg" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
                  <button onClick={handleLogin} className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition">Iniciar Sesión</button>

                  {/* BOTÓN GOOGLE */}
                  <button onClick={handleGoogleLogin} className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition">Iniciar sesión con Google</button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <input type="text" placeholder="Nombre" className="w-full p-3 border rounded-lg" />
                  <input type="email" placeholder="Correo" className="w-full p-3 border rounded-lg" />
                  <input type="password" placeholder="Contraseña" className="w-full p-3 border rounded-lg" />
                  <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition">Crear Cuenta</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

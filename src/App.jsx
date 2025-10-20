import React, { useState, useCallback } from 'react';
import { Calendar, MapPin, Users, Search, LogOut, User, X, Eye, EyeOff, Bell } from 'lucide-react';
import API_URL from "./config";


// =======================
// Datos simulados
// =======================
const mockEvents = [
  {
    id: 1,
    title: "Tech Summit 2025",
    category: "TECNOLOGÍA",
    description: "Conferencia anual sobre tecnologías emergentes: AI, ML Web3 y más.",
    date: "2025-11-15",
    location: "Centro de Convenciones",
    maxCapacity: 200,
    registered: 45,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop"
  },
  {
    id: 2,
    title: "Educación del Futuro",
    category: "EDUCACIÓN",
    description: "Encuentro para docentes y profesionales, con talleres prácticos sobre metodologías activas",
    date: "2025-11-20",
    location: "Universidad Central",
    maxCapacity: 150,
    registered: 78,
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop"
  },
  {
    id: 3,
    title: "Foro de Negocios & Startups",
    category: "NEGOCIOS",
    description: "Paneles de inversionistas, pitch de startups y mesas redondas con líderes del ecosistema",
    date: "2025-11-25",
    location: "Hotel Empresarial",
    maxCapacity: 100,
    registered: 92,
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=250&fit=crop"
  }
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

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    location: "",
    max_capacity: "",
    image: ""
  });


  const [loginForm, setLoginForm] = useState({ name: '', email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '', email: '', password: '', role: 'user', nit: '', phone: '', document: ''
  });

  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);


  const addNotification = (message, type = 'info') => {
    setNotifications(prev => [
      { id: Date.now(), message, type },
      ...prev
    ]);
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

  // ======================
  // LOGIN CON VALIDACIONES
  // ======================
  const handleLogin = async () => {
    const errors = {};

    if (!loginForm.email) errors.email = "El correo es obligatorio.";
    else if (!loginForm.email.includes("@")) errors.email = "Correo electrónico inválido.";

    if (!loginForm.password) errors.password = "La contraseña es obligatoria.";
    else if (loginForm.password.length < 6)
      errors.password = "La contraseña es demasiado corta.";

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

      setUser(data.user);
      addNotification("Sesión iniciada correctamente ");
      setShowLoginModal(false);
      setLoginForm({ name: "", email: "", password: "" });
    } catch (error) {
      addNotification(error.message, "error");
    }
  };


  // ==========================
  // REGISTRO CON VALIDACIONES
  // ==========================
  const handleRegister = async () => {
    const errors = {};

    if (!registerForm.name) errors.name = "El nombre es obligatorio.";
    if (!registerForm.email) errors.email = "El correo es obligatorio.";
    else if (!registerForm.email.includes("@")) errors.email = "Correo electrónico inválido.";
    if (!registerForm.password) errors.password = "La contraseña es obligatoria.";
    else if (registerForm.password.length < 8)
      errors.password = "La contraseña debe tener al menos 8 caracteres.";

    setRegisterErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al registrarse");

      addNotification("Registro exitoso Bienvenido/a!");
      setUser(data.user);
      setShowLoginModal(false);
      setRegisterForm({
        name: "",
        email: "",
        password: "",
        role: "user",
        nit: "",
        phone: "",
        document: "",
      });
    } catch (error) {
      addNotification(error.message, "error");
    }
  };


  // =======================
  // INSCRIPCIONES
  // =======================
  const handleRegisterToEvent = useCallback((eventId) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (user.registeredEvents.includes(eventId)) {
      addNotification('Ya estás inscrito en este evento.', 'error');
      return;
    }
    setUser({
      ...user,
      registeredEvents: [...user.registeredEvents, eventId]
    });
    addNotification('Te has inscrito exitosamente en el evento.');
  }, [user]);

  const handleCancelRegistration = useCallback((eventId) => {
    setUser({
      ...user,
      registeredEvents: user.registeredEvents.filter(id => id !== eventId)
    });
    addNotification(' Has cancelado tu inscripción en el evento.');
  }, [user]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al crear evento");

      addNotification(`Evento "${data.title}" creado con éxito `, "success");
      setNewEvent({
        title: "",
        description: "",
        category: "",
        date: "",
        location: "",
        max_capacity: "",
        image: "",
      });
      setCurrentView("home");
    } catch (error) {
      addNotification(error.message, "error");
    }
  };



  // =======================
  // HEADER
  // =======================
  const Header = () => (
    <header className="bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => {
          setCurrentView('home');
          setSelectedEvent(null);
        }}>
          <div className="bg-white rounded-lg p-2">
            <span className="text-purple-600 font-bold text-xl">EH</span>
          </div>
          <h1 className="text-white text-2xl font-bold">EventHub</h1>
        </div>

        {/* Menú derecho */}
        <div className="flex items-center gap-4 relative">
          {user && (
            <>
              {/* Campanita de notificaciones */}
              <button
                className="relative text-white hover:bg-purple-500 p-2 rounded-lg"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) setHasUnread(false); // 🟣 al abrir la campana, se quita el punto
                }}
              >
                <Bell className="w-6 h-6" />
                {hasUnread && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </button>


              {/* Panel de notificaciones */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white shadow-2xl rounded-xl p-4 z-50 max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-gray-500 text-sm">No tienes notificaciones.</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="border-b last:border-none py-2">
                        <p className={`text-sm ${n.type === 'error' ? 'text-red-600' : 'text-gray-800'}`}>
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {user?.role === "organizer" && (
                <button
                  onClick={() => setCurrentView("create-event")}
                  className="text-white border-2 border-white px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition"
                >
                  Crear Evento
                </button>
              )}



              {/* Botón perfil */}
              <button
                onClick={() => setCurrentView('profile')}
                className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition"
              >
                <User className="w-5 h-5" />
                {user.name}
              </button>
            </>
          )}

          {/* Si NO hay usuario */}
          {!user ? (
            <>
              <button
                onClick={() => { setShowLoginModal(true); setIsRegisterMode(false); }}
                className="text-white border-2 border-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition"
              >
                Iniciar
              </button>
              <button
                onClick={() => { setShowLoginModal(true); setIsRegisterMode(true); }}
                className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition"
              >
                Registro
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="text-white hover:bg-purple-500 p-2 rounded-lg transition"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>


          )}
        </div>
      </div>
    </header>
  );


  // =======================
  // PERFIL DE USUARIO
  // =======================
  const ProfileView = () => {
    const userEvents = events.filter(e => user?.registeredEvents.includes(e.id));

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <span className="inline-block mt-2 px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                {user?.role === 'user' ? 'Usuario' : 'Organizador'}
              </span>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-6">Mis Eventos Inscritos</h3>

        {userEvents.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No estás inscrito en ningún evento aún</p>
            <button
              onClick={() => setCurrentView('home')}
              className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Explorar Eventos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userEvents.map(event => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
                onClick={() => {
                  setSelectedEvent(event);
                  setCurrentView('eventDetail');
                }}
              >
                <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
                <div className="p-6">
                  <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                    {event.category}
                  </span>
                  <h4 className="text-lg font-bold text-gray-900 mt-3 mb-2">{event.title}</h4>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(event.date).toLocaleDateString('es-ES')}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // =======================
  // DETALLE DEL EVENTO
  // =======================
  const EventDetailView = () => {
    if (!selectedEvent) return null;
    const isRegistered = user?.registeredEvents.includes(selectedEvent.id);

    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-80 object-cover" />
          <div className="p-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">{selectedEvent.title}</h2>
            <p className="text-purple-600 font-semibold mb-4">{selectedEvent.category}</p>
            <p className="text-gray-700 mb-6">{selectedEvent.description}</p>

            <div className="flex items-center text-gray-600 mb-4">
              <Calendar className="w-5 h-5 mr-2" />
              {new Date(selectedEvent.date).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center text-gray-600 mb-8">
              <MapPin className="w-5 h-5 mr-2" />
              {selectedEvent.location}
            </div>

            <div className="flex gap-4">
              {isRegistered ? (
                <button
                  onClick={() => handleCancelRegistration(selectedEvent.id)}
                  className="flex-1 bg-red-100 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-200 transition"
                >
                  Cancelar Inscripción
                </button>
              ) : (
                <button
                  onClick={() => handleRegisterToEvent(selectedEvent.id)}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Inscribirme
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  setCurrentView("home");
                }}
                className="px-6 py-3 rounded-lg border font-semibold hover:bg-gray-100 transition"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };


  // =======================
  // RENDER PRINCIPAL
  // =======================
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {currentView === 'home' && (
        <div className="min-h-screen">
          <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white py-16 px-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-5xl font-bold mb-4">Descubre Eventos Increíbles</h2>
                <p className="text-xl mb-8 text-purple-100">
                  Conecta con experiencias únicas, aprende de los mejores y forma parte de una comunidad vibrante.
                </p>

                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Buscar eventos..."
                      className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-300 focus:outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="px-6 py-4 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-300 focus:outline-none"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">Todas las categorías</option>
                    {categories.filter(c => c !== 'all').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    className="px-6 py-4 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-300 focus:outline-none"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900">Eventos Disponibles</h3>
              <p className="text-gray-600">{filteredEvents.length} eventos encontrados</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map(event => (
                <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                  <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                        {event.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        {event.registered}/{event.maxCapacity}
                      </div>
                    </div>

                    <h4 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h4>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">{event.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(event.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                    </div>

                    {user?.registeredEvents.includes(event.id) ? (
                      <button
                        onClick={() => handleCancelRegistration(event.id)}
                        className="w-full bg-red-100 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-200 transition"
                      >
                        Cancelar Inscripción
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegisterToEvent(event.id)}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition"
                        disabled={event.registered >= event.maxCapacity}
                      >
                        {event.registered >= event.maxCapacity ? 'Cupo Lleno' : 'Inscribirme'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentView === 'profile' && <ProfileView />}
      {currentView === 'eventDetail' && <EventDetailView />}

      {currentView === "create-event" && user?.role === "organizer" && (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-purple-700 mb-6">Crear Nuevo Evento</h2>

          <form onSubmit={handleCreateEvent} className="space-y-4">
            <input
              type="text"
              placeholder="Título del evento"
              className="w-full p-3 border rounded-lg"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Descripción"
              className="w-full p-3 border rounded-lg"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
            <input
              type="text"
              placeholder="Categoría"
              className="w-full p-3 border rounded-lg"
              value={newEvent.category}
              onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
            />
            <input
              type="date"
              className="w-full p-3 border rounded-lg"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            />
            <input
              type="text"
              placeholder="Ubicación"
              className="w-full p-3 border rounded-lg"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            />
            <input
              type="number"
              placeholder="Capacidad máxima"
              className="w-full p-3 border rounded-lg"
              value={newEvent.max_capacity}
              onChange={(e) => setNewEvent({ ...newEvent, max_capacity: e.target.value })}
            />
            <input
              type="text"
              placeholder="URL de imagen"
              className="w-full p-3 border rounded-lg"
              value={newEvent.image}
              onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition"
            >
              Crear Evento
            </button>
          </form>
        </div>
      )}



      {/* ===========================
          MODAL LOGIN / REGISTRO
      =========================== */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isRegisterMode ? 'Crear Cuenta' : 'Iniciar Sesión'}
                </h2>
                <button onClick={() => setShowLoginModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!isRegisterMode ? (
                // ======================
                // LOGIN
                // ======================
                <>
                  <div className="space-y-4">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        placeholder="tucorreo@ejemplo.com"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${loginErrors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      />
                      {loginErrors.email && <p className="text-red-500 text-sm mt-1">{loginErrors.email}</p>}
                    </div>

                    {/* Contraseña */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${loginErrors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {loginErrors.password && <p className="text-red-500 text-sm mt-1">{loginErrors.password}</p>}
                    </div>

                    <button
                      onClick={handleLogin}
                      className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                    >
                      Iniciar Sesión
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-4">
                      ¿No tienes cuenta?{' '}
                      <button
                        onClick={() => setIsRegisterMode(true)}
                        className="text-purple-600 font-semibold hover:underline"
                      >
                        Regístrate
                      </button>
                    </p>
                  </div>
                </>
              ) : (
                // ======================
                // REGISTRO
                // ======================
                <>
                  <div className="space-y-4">
                    {/* Nombre */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                      <input
                        type="text"
                        placeholder="Tu nombre"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${registerErrors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      />
                      {registerErrors.name && <p className="text-red-500 text-sm mt-1">{registerErrors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        placeholder="tucorreo@ejemplo.com"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${registerErrors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      />
                      {registerErrors.email && <p className="text-red-500 text-sm mt-1">{registerErrors.email}</p>}
                    </div>

                    {/* Contraseña */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                      <input
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${registerErrors.password ? 'border-red-500' : 'border-gray-300'
                          }`}
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      />
                      {registerErrors.password && (
                        <p className="text-red-500 text-sm mt-1">{registerErrors.password}</p>
                      )}
                    </div>

                    {/* Rol */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                      <select
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none border-gray-300"
                        value={registerForm.role}
                        onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                      >
                        <option value="user">Usuario</option>
                        <option value="organizer">Organizador</option>
                      </select>
                    </div>

                    {/* Campos adicionales solo si organizador */}
                    {registerForm.role === 'organizer' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">NIT</label>
                          <input
                            type="text"
                            placeholder="Número de NIT"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none border-gray-300"
                            value={registerForm.nit}
                            onChange={(e) => setRegisterForm({ ...registerForm, nit: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                          <input
                            type="text"
                            placeholder="Teléfono de contacto"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none border-gray-300"
                            value={registerForm.phone}
                            onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Documento</label>
                          <input
                            type="text"
                            placeholder="Documento o identificación"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none border-gray-300"
                            value={registerForm.document}
                            onChange={(e) => setRegisterForm({ ...registerForm, document: e.target.value })}
                          />
                        </div>
                      </>
                    )}

                    <button
                      onClick={handleRegister}
                      className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                    >
                      Crear Cuenta
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-4">
                      ¿Ya tienes cuenta?{' '}
                      <button
                        onClick={() => setIsRegisterMode(false)}
                        className="text-purple-600 font-semibold hover:underline"
                      >
                        Inicia sesión
                      </button>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===========================
          CONFIRMACIÓN LOGOUT
      =========================== */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">¿Cerrar sesión?</h2>
            <p className="text-gray-600 mb-6">¿Seguro que deseas salir de tu cuenta?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  handleLogout();
                  setShowLogoutConfirm(false);
                }}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Sí, salir
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;

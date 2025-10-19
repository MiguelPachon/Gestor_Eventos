import React, { useState } from 'react';
import { Calendar, MapPin, Users, Search, LogOut, User, X, Eye, EyeOff, Bell } from 'lucide-react';

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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({ name: '', email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    nit: '',
    phone: '',
    document: ''
  });

  const categories = ['all', 'TECNOLOGÍA', 'EDUCACIÓN', 'NEGOCIOS', 'CULTURA', 'DEPORTES'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLogin = () => {
    if (loginForm.email && loginForm.password) {
      setUser({
        id: 1,
        name: loginForm.name || loginForm.email.split('@')[0],
        email: loginForm.email,
        role: 'user',
        registeredEvents: [1],
        createdEvents: []
      });
      setShowLoginModal(false);
      setLoginForm({ name: '', email: '', password: '' });
    }
  };

  const handleRegister = () => {
    if (registerForm.name && registerForm.email && registerForm.password) {
      setUser({
        id: Date.now(),
        name: registerForm.name,
        email: registerForm.email,
        role: registerForm.role,
        registeredEvents: [],
        createdEvents: []
      });
      setShowLoginModal(false);
      setRegisterForm({
        name: '',
        email: '',
        password: '',
        role: 'user',
        nit: '',
        phone: '',
        document: ''
      });
    }
  };

  const handleGoogleLogin = () => {
    alert('Integración con Google OAuth pendiente en backend');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
  };

  const handleRegisterToEvent = (eventId) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setUser({
      ...user,
      registeredEvents: [...user.registeredEvents, eventId]
    });
    alert('¡Te has inscrito exitosamente! Recibirás un correo de confirmación.');
  };

  const handleCancelRegistration = (eventId) => {
    setUser({
      ...user,
      registeredEvents: user.registeredEvents.filter(id => id !== eventId)
    });
    alert('Tu inscripción ha sido cancelada.');
  };

  const AuthModal = () => (
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={loginForm.name}
                  onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Entrar
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">O continúa con</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
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
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <input
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de cuenta</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                >
                  <option value="user">Usuario</option>
                  <option value="organizer">Organizador</option>
                </select>
              </div>

              {registerForm.role === 'organizer' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">NIT</label>
                    <input
                      type="text"
                      placeholder="Número de identificación tributaria"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      value={registerForm.nit}
                      onChange={(e) => setRegisterForm({ ...registerForm, nit: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      placeholder="Número de contacto"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Documento de soporte</label>
                    <input
                      type="file"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Certificado académico o profesional</p>
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
          )}
        </div>
      </div>
    </div>
  );

  const Header = () => (
    <header className="bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="bg-white rounded-lg p-2">
              <span className="text-purple-600 font-bold text-xl">EH</span>
            </div>
            <h1 className="text-white text-2xl font-bold">EventHub</h1>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <button className="text-white hover:bg-purple-500 p-2 rounded-lg transition">
                  <Bell className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCurrentView('profile')}
                  className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition"
                >
                  <User className="w-5 h-5" />
                  {user.name}
                </button>
              </>
            )}
            
            {!user ? (
              <>
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setIsRegisterMode(false);
                  }}
                  className="text-white border-2 border-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition"
                >
                  Iniciar
                </button>
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setIsRegisterMode(true);
                  }}
                  className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition"
                >
                  Registro
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="text-white hover:bg-purple-500 p-2 rounded-lg transition"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );

  const HomeView = () => (
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
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-6 py-4 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-300"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Todas las categorías</option>
                {categories.filter(c => c !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button className="px-6 py-4 rounded-lg bg-white text-gray-700 hover:bg-gray-100">
                Fecha
              </button>
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
                    {event.registered >= event.maxCapacity ? 'Cupo Lleno' : 'Ver detalles'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
              <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {currentView === 'home' && <HomeView />}
      {currentView === 'profile' && <ProfileView />}
      {showLoginModal && <AuthModal />}
    </div>
  );
}

export default App;
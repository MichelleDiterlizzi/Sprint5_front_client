# Event Frontend Client

## 📝 Description
Frontend client developed in React to consume the events API. Allows users to register, log in, create, edit, view, and participate in events. The application provides an intuitive and visually appealing interface for managing events and users.

## 🚀 Features
- User registration and login
- Event listing and detailed view
- Event creation, editing, and deletion (by creator or administrator)
- Event participation (with guests)
- Profile page with created and attended events
- Form validation and error handling

## 🛠️ Technologies Used
- React 18.2.0
- React Router DOM 6.30.1
- Material UI 5.15.11
- Context API for state management
- Axios for HTTP requests
- Formik and Yup for form validation
- React Toastify for notifications
- JWT Decode for token handling
- Date-fns for date handling

## 📦 Installation
```bash
# Clone the repository
git clone [REPOSITORY_URL]

# Navigate to the project directory
cd front-api-event

# Install dependencies
npm install

# Start the development server
npm start
```

## 🏗️ Project Structure
```
src/
├── assets/          # Static resources (images, icons, etc.)
├── components/      # Reusable components
├── context/         # React contexts for state management
├── hooks/           # Custom hooks
├── pages/           # Main page components
├── providers/       # Context providers
├── services/        # API call services
└── utils/           # Utility functions
```

## 🔧 Configuration
The project is configured to run in development mode by default. To connect with the backend, it will be necessary to configure the corresponding environment variables.

## 🎨 UI Features
- Responsive design using Material UI
- Custom themes and styled components
- Form validation with Formik and Yup
- Notifications with React Toastify
- Smooth navigation with React Router

## 🤖 AI Model Description

### Why Claude 3.7 Sonnet?
For this project, I have selected Claude 3.7 Sonnet as the AI assistant for several key reasons that make it particularly suitable for software development. Additionally, the integration with Cursor, a modern and powerful IDE, has been fundamental for efficient project development.

1. **Advanced Contextual Understanding**
   - Ability to analyze and understand the complete project structure
   - Capacity to process and understand multiple files and folders provided in context
   - Deep understanding of relationships between different parts of the code
   - Perfect integration with Cursor for real-time code analysis

2. **Web Development Experience**
   - Deep knowledge of React and its ecosystems
   - Understanding of design patterns and best practices
   - Ability to generate clean and maintainable code
   - Experience in API and service integration
   - Support for development in Cursor with intelligent code suggestions

3. **Documentation Capabilities**
   - Generation of clear and detailed technical documentation
   - Step-by-step explanations of complex concepts
   - Ability to adapt technical level according to needs
   - Integration with Cursor's documentation system

4. **Continuous Learning**
   - Adaptation to specific project needs
   - Incorporation of feedback and corrections
   - Continuous improvement of proposed solutions
   - Learning of project-specific code patterns

### Integration with Cursor
The choice of Cursor as the IDE has been fundamental to maximize Claude 3.7 Sonnet's capabilities:

1. **Efficient Development**
   - Real-time code suggestions
   - Intelligent autocompletion
   - Fast file navigation
   - Perfect integration with the AI assistant

2. **Productivity Improvements**
   - Contextual code generation
   - Assisted refactoring
   - Integrated debugging
   - Simplified version control

3. **Enhanced Development Experience**
   - Modern and responsive interface
   - Integrated development tools
   - Support for multiple languages and frameworks
   - Development environment customization

This combination of Claude 3.7 Sonnet's capabilities and Cursor's features has resulted in a highly efficient and productive development environment, enabling rapid and high-quality project development.

## 🤖 Registro de Interacciones con la IA

### Fase 1: Configuración Inicial del Proyecto Frontend

#### Primera Interacción: Creación del Proyecto React

##### 🗨️ Prompt:
> ¿Cómo puedo crear un nuevo proyecto React desde cero para empezar a desarrollar el frontend de mi aplicación de eventos?

##### 🤖 Respuesta de Claude:
Para crear un nuevo proyecto React, utilizaremos Create React App, que es la herramienta oficial recomendada por React para crear aplicaciones de una sola página. Aquí te explico el proceso paso a paso:

1. **Creación del proyecto base**
```bash
npx create-react-app front-api-event
cd front-api-event
```

2. **Instalación de dependencias necesarias**
Para el desarrollo de la aplicación de eventos, necesitaremos algunas bibliotecas adicionales:
```bash
npm install react-router-dom @mui/material @mui/icons-material @emotion/react @emotion/styled
```

3. **Iniciar el servidor de desarrollo**
```bash
npm start
```

**Explicación de las dependencias:**
- `react-router-dom`: Para manejar la navegación entre diferentes páginas de la aplicación
- `@mui/material` y `@mui/icons-material`: Para utilizar componentes UI prediseñados y iconos
- `@emotion/react` y `@emotion/styled`: Para trabajar con estilos CSS en JavaScript

### Fase 2: Estructura y Componentes

#### Segunda Interacción: Diseño de la Página Principal

##### 🗨️ Prompt:
> Quiero empezar el frontend de mi aplicación de eventos en React, sin conectarlo todavía al backend.
> En la página de inicio (Home) quiero:
> - Un header con el nombre de la aplicación.
> - Un menú de navegación que incluya:
>   - Una barra de búsqueda.
>   - Dos iconos: uno para añadir un nuevo evento y otro para ir al perfil del usuario.
>   - Si el usuario no está logueado, el icono de perfil debe llevar al login.
> - En el cuerpo de la Home quiero mostrar:
>   - Todos los eventos disponibles.
>   - Secciones diferenciadas para:
>     - Los eventos más populares.
>     - Los eventos gratuitos.
>     - Las categorías de eventos.

##### 🤖 Respuesta de Claude:
Basado en tus requisitos, te propongo la siguiente estructura de archivos y componentes:

1. **Estructura de Carpetas**
```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Navbar.jsx
│   │   └── SearchBar.jsx
│   └── events/
│       ├── EventCard.jsx
│       ├── PopularEvents.jsx
│       ├── FreeEvents.jsx
│       └── EventCategories.jsx
├── pages/
│   └── Home.jsx
└── App.jsx
```

2. **Implementación de los Componentes**

**Header.js** - Componente simple para el encabezado:
```jsx
const Header = () => (
  <header>
    <h1>EventApp</h1>
  </header>
);
export default Header;
```

**Navbar.js** - Navegación con estado de autenticación:
```jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// ...importa iconos y estilos

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav>
      <input type="text" placeholder="Search events..." />
      <button onClick={() => navigate('/events/new')}>+</button>
      <button onClick={() => navigate(isAuthenticated ? '/profile' : '/login')}>
        <span role="img" aria-label="profile">👤</span>
      </button>
    </nav>
  );
};
export default Navbar;
```

**EventCard.js** - Tarjeta reutilizable para mostrar eventos:
```jsx
const EventCard = ({ event }) => (
  <div className="event-card">
    <h3>{event.title}</h3>
    <p>{event.description}</p>
    <span>{event.category}</span>
  </div>
);
export default EventCard;
```

**PopularEvents.js** - Sección de eventos populares:
```jsx
import EventCard from './EventCard';
const PopularEvents = ({ events }) => (
  <section>
    <h2>Eventos Populares</h2>
    {events.map(event => <EventCard key={event.id} event={event} />)}
  </section>
);
export default PopularEvents;
```

**FreeEvents.js** - Sección de eventos gratuitos:
```jsx
import EventCard from './EventCard';
const FreeEvents = ({ events }) => (
  <section>
    <h2>Eventos Gratuitos</h2>
    {events.filter(e => e.price === 0).map(event => <EventCard key={event.id} event={event} />)}
  </section>
);
export default FreeEvents;
```

**EventCategories.js** - Lista de categorías:
```jsx
const EventCategories = ({ categories, onSelect }) => (
  <section>
    <h2>Categorías</h2>
    <ul>
      {categories.map(cat => (
        <li key={cat} onClick={() => onSelect(cat)}>{cat}</li>
      ))}
    </ul>
  </section>
);
export default EventCategories;
```

### Fase 3: Comprensión de React

#### Tercera Interacción: Explicación de Conceptos

##### 🗨️ Prompt:
> No tengo experiencia previa con React. ¿Podrías explicarme, paso a paso y de forma sencilla, cómo funciona el código y la estructura de carpetas y componentes que me has propuesto para la Home y la navegación de la aplicación de eventos?
> Me gustaría entender:
> - Qué hace cada archivo y componente.
> - Cómo se conectan entre sí.
> - Qué hace cada fragmento de código que has mostrado.
> - Por qué se usan los hooks como useState o useNavigate.
> - Cómo funciona la navegación y el renderizado condicional según si el usuario está logueado o no.

##### 🤖 Respuesta de Claude:
Voy a explicarte React usando analogías sencillas y profundizando en los conceptos fundamentales:

1. **Componentes: Los Bloques de LEGO de tu Aplicación**
- **Concepto Fundamental**: Los componentes son las unidades básicas de construcción en React. Cada componente es una pieza de código que encapsula su propia lógica, estado y presentación.
- **Tipos de Componentes**:
  - **Componentes Funcionales**: Son funciones de JavaScript que retornan JSX. Son más simples y modernos.
  - **Componentes de Clase**: Son clases de JavaScript que extienden React.Component. Más complejos pero útiles en casos específicos.
- **Ventajas de los Componentes**:
  - Reutilización de código
  - Mantenimiento más sencillo
  - Separación de responsabilidades
  - Testing más fácil

Ejemplo de un componente simple:
```jsx
const Header = () => {
  return <h1>Mi Aplicación de Eventos</h1>
}
```

2. **Hooks: Los "Interruptores" de React**
- **useState**: 
  - **Propósito**: Gestiona el estado local de un componente
  - **Funcionamiento**: 
    ```jsx
    const [eventos, setEventos] = useState([]);
    // eventos = el contenido actual de la caja
    // setEventos = el método para cambiar lo que hay en la caja
    ```
  - **Ciclo de Vida**: 
    - Se ejecuta en cada renderizado
    - Mantiene el estado entre renderizados
    - Actualiza la UI cuando el estado cambia

- **useNavigate**: 
  - **Propósito**: Maneja la navegación programática
  - **Funcionamiento**:
    ```jsx
    const navigate = useNavigate();
    navigate('/login'); // Te lleva a la página de login
    ```
  - **Ventajas**:
    - Navegación declarativa
    - Manejo de historial del navegador
    - Integración con React Router

3. **Renderizado Condicional: El Semáforo de React**
- **Concepto**: Permite mostrar diferentes contenidos basados en condiciones
- **Implementación**:
  ```jsx
  {isLoggedIn ? <ProfileIcon /> : <LoginIcon />}
  // Si isLoggedIn es true, muestra ProfileIcon
  // Si isLoggedIn es false, muestra LoginIcon
  ```
- **Patrones Comunes**:
  - Operador ternario (condición ? verdadero : falso)
  - Operador && (condición && elemento)
  - Variables condicionales

4. **Estructura de Carpetas: La Organización de tu Casa**
- **Principios de Organización**:
  - `/components`: Componentes reutilizables
    - `/layout`: Componentes estructurales (Header, Footer)
    - `/ui`: Componentes de interfaz básicos
    - `/features`: Componentes específicos de funcionalidades
  - `/pages`: Componentes de página principales
  - `/hooks`: Hooks personalizados
  - `/context`: Contextos de React
  - `/services`: Servicios y llamadas a API
  - `/utils`: Funciones de utilidad

5. **Conexión entre Componentes: La Red de Comunicación**
- **Props (Properties)**:
  - **Definición**: Datos que se pasan de un componente padre a un hijo
  - **Ejemplo**:
    ```jsx
    // Componente padre
    const Home = () => {
      const [events, setEvents] = useState([]);
      return <PopularEvents events={events} />
    }

    // Componente hijo
    const PopularEvents = ({ events }) => {
      return events.map(event => <EventCard event={event} />)
    }
    ```
  - **Características**:
    - Flujo unidireccional (padre → hijo)
    - Inmutables
    - Pueden ser cualquier tipo de dato

6. **Context API: La Radio de la Casa**
- **Propósito**: Compartir estado entre componentes sin prop drilling
- **Implementación**:
  ```jsx
  const AuthContext = createContext();
  // Cualquier componente puede "sintonizar" y escuchar
  // si el usuario está autenticado o no
  ```
- **Ventajas**:
  - Estado global accesible
  - Evita prop drilling
  - Mejor organización del código

7. **Ciclo de Vida de los Componentes**
- **Montaje**: Cuando el componente se crea y se inserta en el DOM
- **Actualización**: Cuando el componente se actualiza
- **Desmontaje**: Cuando el componente se elimina del DOM
- **Hooks de Efecto**:
  ```jsx
  useEffect(() => {
    // Código a ejecutar
    return () => {
      // Limpieza
    };
  }, [dependencias]);
  ```

8. **Manejo de Eventos**
- **Sintaxis**:
  ```jsx
  const handleClick = (event) => {
    // Manejo del evento
  };
  return <button onClick={handleClick}>Click me</button>;
  ```
- **Características**:
  - Eventos sintéticos
  - Delegación de eventos
  - Prevención de comportamiento por defecto

9. **Optimización de Rendimiento**
- **useMemo**: Memoiza valores calculados
- **useCallback**: Memoiza funciones
- **React.memo**: Memoiza componentes
- **Virtual DOM**: Optimización de renderizado

10. **Testing en React**
- **Jest**: Framework de testing
- **React Testing Library**: Utilidades para testing de componentes
- **Cypress**: Testing end-to-end
- **Estrategias de Testing**:
  - Unit testing
  - Integration testing
  - End-to-end testing

Esta explicación detallada te proporciona una base sólida para entender React y su funcionamiento. Recuerda que React es una biblioteca que sigue el patrón de diseño de componentes, lo que significa que cada pieza de tu aplicación es un componente que puede ser reutilizado y combinado con otros para crear interfaces complejas.

### AI Interaction Process Summary

Throughout the project development, I have followed a structured method for interacting with the AI. This process can be summarized in three main phases:

1. **API and Base Structure Presentation**
   - Show the AI the API structure
   - Explain data models and their fields
   - Detail requirements and validations
   - Share available endpoints

2. **Desired Interface Description**
   - Explain the desired visual structure
   - Detail necessary components
   - Specify expected functionality
   - Describe target user experience

3. **Request for Explanations and Clarifications**
   - Ask for detailed explanations of generated code
   - Request clarifications on specific concepts
   - Seek to understand implemented logic
   - Ensure comprehension of technical decisions

This method has allowed me to:
- Maintain structured and coherent development
- Ensure the AI fully understands the requirements
- Obtain code that aligns with project needs
- Learn and better understand React concepts

## 🔍 Analysis of AI-Generated Code

The code generated for this event management project has been designed using React, a JavaScript library that allows us to create user interfaces in a simple and efficient way. Let's analyze the basic concepts and essential elements that have been implemented.

### Basic React Concepts

React is based on components, which are like building blocks that we can reuse. Each component is an independent piece of the interface that can contain its own logic and design. In our project, we have created components for different parts of the application, such as the header, navigation bar, and event cards.

Components can receive information through "props" (properties), which are like parameters that we pass to them to customize their behavior. For example, when we display an event card, we pass the event information as a prop so it knows what data to show.

### State and Navigation

React allows us to handle the "state" of our application, which is the information that can change over time. For example, when a user logs in, we store that information in the state to know they are authenticated. This allows us to show different content depending on whether the user is logged in or not.

Navigation between pages is handled with React Router, which allows us to create different routes for each section of our application. This way, when a user clicks on a link, the application knows which page to show without needing to reload the entire site.

### User Interface

To create an attractive and easy-to-use interface, we have used Material UI, a component library that provides predefined visual elements such as buttons, text fields, and cards. These components are customizable and automatically adapt to different screen sizes.

Forms, such as registration or event creation, have been implemented to be easy to use and provide immediate feedback to the user. For example, if a field is required and the user doesn't complete it, an error message is displayed.

### Project Organization

The project is organized in folders that separate different types of files:
- `components`: Contains reusable components
- `pages`: Contains the main pages of the application
- `context`: Contains the logic for handling global state
- `utils`: Contains utility functions used in different parts

This organization makes the code easier to understand and maintain, as each file has a specific purpose.

### Main Features

1. **Registration and Login**: Users can create an account and log in
2. **Event List**: All available events are displayed
3. **Event Creation**: Users can create new events
4. **User Profile**: Each user has their own profile page
5. **Search**: Users can search for events by name or category

### Improvements and Optimizations

To make the application faster and more efficient, we have implemented some basic improvements:
- Optimized image loading
- Clear and visible error messages
- Loading indicators when performing actions
- Design adaptable to different devices.

## 🤔 Learning Process Reflection

This project has been a revealing experience about the potential and challenges of using AI in software development. My personal experience with Claude as a development assistant has been a mix of amazement and constant learning.

### The Power of AI in Development

The ability of AI to accelerate development is truly impressive. In theory, creating a complete frontend client in a few hours is possible, and this represents a paradigm shift in how we develop software. However, my personal experience has been different, and this has led me to reflect deeply on the process.

### Personal Challenges and Learning

My initial lack of experience in effective communication with AI proved to be a significant obstacle. 

1. **Communication with AI**: Learning to formulate questions and requests effectively was a process in itself. AI requires clear and specific instructions, and my learning curve in this aspect was steeper than expected.

2. **Project Organization**: The lack of a clear structure in interactions with AI led to moments of confusion and setbacks. This taught me the importance of maintaining a coherent development plan, even when working with such a powerful tool.

3. **Problem Solving**: I encountered situations where AI got "stuck" in solutions that didn't work, especially with version conflicts. This made me aware of the importance of maintaining critical thinking and not relying exclusively on AI suggestions.

### Depth of Knowledge

Although AI is capable of explaining concepts in a detailed and contextual manner, I feel that my understanding of the framework and frontend client falls short. This is not necessarily a limitation of the methodology, but rather a consequence of:

1. **Limited Time**: The available time was not enough to delve into all aspects of the project as I would have liked.

2. **React Complexity**: The syntax and operation of React presented a steeper learning curve than expected, even with AI assistance.

### Reflections on Methodology

The temptation to let AI generate all the code quickly is great, but I have learned that this can have consequences:

1. **Code Understanding**: Although I tried to develop one view at a time, deep understanding of the generated code proved more challenging than anticipated.

2. **Balance between Speed and Understanding**: I found a difficult balance between development speed and real code understanding. AI can generate functional code quickly, but understanding each line and its purpose requires additional time and effort.

### Lessons Learned

This experience has taught me several important lessons:

1. **AI as a Tool, not a Solution**: AI is a powerful tool, but it requires skill to use it effectively. It is not a magical solution that eliminates the need for deep understanding.

2. **Importance of Critical Thinking**: Maintaining critical thinking and not blindly depending on AI suggestions is crucial for effective development.

3. **Value of Learning Time**: Although AI can accelerate development, the time dedicated to understanding the code and underlying concepts is invaluable.

4. **Effective Communication**: Learning to communicate effectively with AI is a skill in itself, requiring practice and refinement.

### Conclusion

This project has been a valuable learning experience that has shown me both the potential and limitations of AI in software development. Although AI can significantly accelerate the development process, it also requires careful approach and deep understanding of underlying concepts. The key is to find the right balance between leveraging AI capabilities and maintaining real control and understanding of the code being generated.






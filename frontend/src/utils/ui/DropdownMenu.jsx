import { useState, useEffect, useRef } from 'react';

const MENU_WIDTH = 144;    // w-36
const ITEM_HEIGHT = 32;

/**
 * Menú de acciones de una fila. Se abre con posición fija junto al botón para que no lo recorte
 * una tabla con desplazamiento horizontal (en móvil); se cierra al desplazar la página.
 */
function DropdownMenu({ icon, actions, hover = true, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  // Con el menú abierto, desplazar o cambiar el tamaño de la ventana lo cierra (su posición es fija).
  useEffect(() => {
    if (!isOpen) return undefined;
    const close = (event) => {
      if (menuRef.current && event.target instanceof Node && menuRef.current.contains(event.target)) return;
      setIsOpen(false);
    };
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [isOpen]);

  const toggle = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    const rect = buttonRef.current.getBoundingClientRect();
    const height = actions.length * ITEM_HEIGHT + 8;
    const below = rect.bottom + 4 + height <= window.innerHeight;
    setPosition({
      top: below ? rect.bottom + 4 : Math.max(8, rect.top - height - 4),
      left: Math.max(8, Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8)),
    });
    setIsOpen(true);
  };

  const handleActionClick = (actionCallback) => {
    actionCallback();
    setIsOpen(false);
  };

  const DefaultIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
         fill="currentColor" className="h-5 w-5">
      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  const triggerIcon = typeof icon === 'function' ? icon({ isOpen }) : icon;

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={`p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed ${hover ? 'hover:bg-gray-100' : ''}`}
        title="Acciones"
        aria-label="Acciones"
      >
        {triggerIcon || <DefaultIcon />}
      </button>

      {isOpen && position && (
        <div
          role="menu"
          style={{ top: position.top, left: position.left }}
          className="fixed z-50 w-36 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
        >
          {actions.map((action, index) => (
            <button
              key={index}
              type="button"
              role="menuitem"
              disabled={action.disabled}
              className={`block w-full px-3 py-2 text-left text-xs hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${action.className ?? ''}`}
              onClick={() => !action.disabled && handleActionClick(action.onClick)}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;
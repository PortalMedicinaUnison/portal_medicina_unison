import { useEffect, useMemo, useState } from 'react';
import { NavLink, matchPath, useLocation } from 'react-router-dom';

/**
 * SidebarCollapse
 * Bloque colapsable para secciones del sidebar con enlaces internos.
 *
 * Props:
 * - title: string
 * - links: Array<{ label: string, to: string, className?: string }>
 * - icon?: ReactNode | (ctx: { isOpen: boolean }) => ReactNode
 * - defaultOpen?: boolean  (false por defecto)
 * - className?: string
 * - iconClassName?: string
 * - linkClassName?: string
 */
export default function SidebarCollapse({
  title,
  links = [],
  icon,
  defaultOpen = false,
  className = '',
  iconClassName = '',
  linkClassName = '',
}) {
  
  const location = useLocation();

  // Abre automáticamente si alguna ruta hija está activa
  const hasActiveChild = useMemo(() => {
    return links.some(l =>
      matchPath({ path: l.to, end: false }, location.pathname) ||
      location.pathname.startsWith(l.to)
    );
  }, [links, location.pathname]);

  const [isOpen, setIsOpen] = useState(defaultOpen || hasActiveChild);

  useEffect(() => {
    if (hasActiveChild) setIsOpen(true);
  }, [hasActiveChild]);

  const TriggerIcon = typeof icon === 'function' ? icon({ isOpen }) : icon;

  return (
    <div className={`w-full ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(v => !v)}
        aria-expanded={isOpen}
        className="sidebar-item-group group"
      >
        {/* Icono izquierdo opcional */}
        {TriggerIcon ? (
          <span className={`sidebar-item-icon ${iconClassName}`}>
            {TriggerIcon}
          </span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`sidebar-item-icon ${iconClassName}`}
            viewBox="0 0 20 20"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3.5 5.5v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5a2 2 0 0 0-2-2h-6l-2-2h-2a2 2 0 0 0-2 2" />
          </svg>
        )}

        <span className="sidebar-item-text">{title}</span>

        {/* Caret derecha con rotación */}
        <svg
          className={`sidebar-toggle-icon transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          />
        </svg>
      </button>

      <div className={`${isOpen ? 'block' : 'hidden'} py-1`}>
        {links.map((l, i) => (
          <NavLink
            key={i}
            to={l.to}
            className={`sidebar-item-link ${linkClassName} ${l.className || ''}`}
          >
            {l.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

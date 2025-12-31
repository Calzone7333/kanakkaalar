import React, { createContext, useContext, useState } from "react";

const NavItemContext = createContext(null);

export function NavigationMenu({
  children,
  className,
  orientation = "horizontal",
}) {
  return (
    <nav className={className} aria-label="Primary">
      {children}
    </nav>
  );
}

export function NavigationMenuList({ children, className }) {
  return <ul className={className}>{children}</ul>;
}

export const NavigationMenuItem = React.forwardRef(function NavigationMenuItem(
  { children, className },
  ref,
) {
  const [open, setOpen] = useState(false);
  return (
    <li ref={ref} className={className}>
      <NavItemContext.Provider value={{ open, setOpen }}>
        {children}
      </NavItemContext.Provider>
    </li>
  );
});

export function NavigationMenuTrigger({ children, className }) {
  const ctx = useContext(NavItemContext);
  if (!ctx) return children;
  const { open, setOpen } = ctx;
  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={(e) => {
        e.stopPropagation();
        setOpen(!open);
      }}
      className={className}
    >
      {children}
    </button>
  );
}

export function NavigationMenuContent({ children, className }) {
  const ctx = useContext(NavItemContext);
  if (!ctx) return null;
  const { open, setOpen } = ctx;
  return (
    <div
      className={className}
      style={{ display: open ? "block" : "none" }}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
    </div>
  );
}

export function NavigationMenuLink({ children, asChild }) {
  // If asChild is true and children is a valid React element, render the child directly
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children);
  }
  return <div>{children}</div>;
}

export default NavigationMenu;
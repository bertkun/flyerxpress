import React, { createContext, useContext, useMemo, useState } from "react";

type Role = "buyer" | "seller" | null;

export type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  ticketsSold: number;
};

export type Ticket = {
  id: string;
  eventId: string;
  purchaserRole: "buyer" | "seller";
  createdAt: number;
};

type AppState = {
  currentRole: Role;
  events: EventItem[];
  tickets: Ticket[];
  login: (role: Exclude<Role, null>) => void;
  logout: () => void;
  addEvent: (data: Omit<EventItem, "id" | "ticketsSold">) => EventItem;
  buyTicket: (eventId: string) => Ticket | null;
};

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<Role>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const login = (role: Exclude<Role, null>) => setCurrentRole(role);
  const logout = () => setCurrentRole(null);

  const addEvent: AppState["addEvent"] = (data) => {
    const newEvent: EventItem = {
      id: String(Date.now()),
      title: data.title,
      date: data.date,
      location: data.location,
      description: data.description,
      ticketsSold: 0,
    };
    setEvents((prev) => [newEvent, ...prev]);
    return newEvent;
  };

  const buyTicket: AppState["buyTicket"] = (eventId) => {
    if (currentRole !== "buyer") return null;
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, ticketsSold: e.ticketsSold + 1 } : e))
    );
    const t: Ticket = {
      id: "T" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      eventId,
      purchaserRole: "buyer",
      createdAt: Date.now(),
    };
    setTickets((prev) => [t, ...prev]);
    return t;
  };

  const value = useMemo(
    () => ({ currentRole, events, tickets, login, logout, addEvent, buyTicket }),
    [currentRole, events, tickets]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

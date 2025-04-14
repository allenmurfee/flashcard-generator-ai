import React from "react";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  onLogout: () => Promise<void>;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { user } = useAuth();

  return (
    <header className="text-center mb-5">
      <h1 className="display-4 mb-3">
        <i className="bi-lightbulb-fill text-primary me-2"></i>
        Flashcard Generator AI
      </h1>
      {user && (
        <div className="d-flex justify-content-end align-items-center">
          <span className="me-3">
            <i className="bi-person-circle me-2"></i>
            {user.email}
          </span>
          <button onClick={onLogout} className="btn btn-outline-danger btn-sm">
            <i className="bi-box-arrow-right me-2"></i>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

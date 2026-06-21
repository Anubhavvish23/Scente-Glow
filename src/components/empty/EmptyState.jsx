import { Link } from "react-router-dom";
import "./EmptyState.css";

function EmptyState({ icon, title, description, action_label, action_to, on_action, className = "" }) {
  return (
    <div className={`sg-empty-state ${className}`}>
      <div className="sg-empty-state__icon" aria-hidden="true">
        {icon}
      </div>
      <h3 className="sg-empty-state__title">{title}</h3>
      <p className="sg-empty-state__description">{description}</p>
      {action_label && action_to && (
        <Link to={action_to} className="sg-empty-state__action" onClick={on_action}>
          {action_label}
        </Link>
      )}
      {action_label && !action_to && on_action && (
        <button type="button" className="sg-empty-state__action" onClick={on_action}>
          {action_label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;

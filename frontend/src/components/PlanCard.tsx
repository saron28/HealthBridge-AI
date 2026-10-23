import type { InsurancePlan } from "../types/insurance";
import Icon from "./Icon";

interface PlanCardProps {
  plan: InsurancePlan;
  selected?: boolean;
  onSelect?: (plan: InsurancePlan) => void;
}

export default function PlanCard({ plan, selected = false, onSelect }: PlanCardProps) {
  return (
    <article className={`plan-card${plan.recommended ? " plan-card-recommended" : ""}${selected ? " plan-card-selected" : ""}`}>
      {plan.recommended && <div className="recommended-label"><Icon name="sparkles" size={14} /> GOOD BALANCE</div>}
      <div className="plan-heading">
        <span className={`tier-badge tier-${plan.tier.toLowerCase()}`}>{plan.tier}</span>
        {selected && <span className="selected-mark"><Icon name="check" size={15} /></span>}
      </div>
      <h3>{plan.name}</h3>
      <p className="plan-summary">{plan.summary}</p>
      <div className="premium-row">
        <strong>${plan.monthlyPremium}</strong><span>/ member / month</span>
      </div>
      <div className="plan-metrics">
        <div><span>Annual deductible</span><strong>${plan.deductible.toLocaleString()}</strong></div>
        <div><span>Out-of-pocket max</span><strong>${plan.outOfPocketMax.toLocaleString()}</strong></div>
      </div>
      <div className="plan-features">
        {plan.features.map((feature) => (
          <div key={feature}><Icon name="check" size={15} />{feature}</div>
        ))}
      </div>
      {onSelect && (
        <button className={`button ${selected ? "button-secondary" : "button-primary"} button-full`} onClick={() => onSelect(plan)}>
          {selected ? "Selected" : "Choose this plan"}
          {!selected && <Icon name="arrow" size={17} />}
        </button>
      )}
    </article>
  );
}

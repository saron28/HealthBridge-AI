import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import PlanCard from "../components/PlanCard";
import { createEnrollment, getPlans } from "../services/api";
import type { EnrollmentResponse, InsurancePlan } from "../types/insurance";

const steps = ["Choose a plan", "Your details", "Review"];

export default function Enrollment() {
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan | null>(null);
  const [step, setStep] = useState(0);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<EnrollmentResponse | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", dateOfBirth: "" });

  useEffect(() => {
    let active = true;
    getPlans()
      .then((items) => { if (active) setPlans(items); })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "We couldn't load plans.");
      })
      .finally(() => { if (active) setLoadingPlans(false); });
    return () => { active = false; };
  }, []);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const goToReview = () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.dateOfBirth) {
      setError("Please complete each field before continuing.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a valid email address to continue.");
      return;
    }
    if (new Date(form.dateOfBirth) >= new Date()) {
      setError("Enter a valid date of birth in the past.");
      return;
    }
    setError("");
    setStep(2);
  };

  const submitEnrollment = async () => {
    if (!selectedPlan || !confirmed) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await createEnrollment({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        dateOfBirth: form.dateOfBirth,
        planId: selectedPlan.id,
      });
      if (!response.success) throw new Error("The demo enrollment request was not accepted. Please try again.");
      setResult(response);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We couldn't submit the demo request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-section">
      <div className="page-heading">
        <div className="eyebrow">A PLAN THAT FEELS RIGHT</div>
        <h1>Explore coverage options</h1>
        <p>Compare our fictional plans, then walk through a sample enrollment.</p>
      </div>

      {result ? (
        <div className="success-panel">
          <div className="success-icon"><Icon name="check" size={27} /></div>
          <div className="eyebrow">DEMO REQUEST RECEIVED</div>
          <h2>Thanks, {form.fullName.split(" ")[0]}.</h2>
          <p>{result.message}</p>
          <div className="reference-box"><span>Demo reference</span><strong>{result.referenceId}</strong></div>
          <p className="small-muted">This confirmation is for demonstration only and is not proof of insurance or coverage.</p>
          <button className="button button-secondary" onClick={() => { setResult(null); setStep(0); setConfirmed(false); }}>
            Explore another plan
          </button>
        </div>
      ) : (
        <>
          <div className="stepper" aria-label={`Step ${step + 1} of ${steps.length}: ${steps[step]}`}>
            {steps.map((label, index) => (
              <div className={`stepper-step${step === index ? " current" : ""}${step > index ? " complete" : ""}`} key={label}>
                <span className="step-number">{step > index ? <Icon name="check" size={14} /> : index + 1}</span>
                <span>{label}</span>
                {index < steps.length - 1 && <span className="step-line" />}
              </div>
            ))}
          </div>

          {step === 0 && (
            <div>
              <div className="subsection-heading"><h2>Choose the level that works for you</h2><p>All prices shown are fictional monthly premiums for this demo.</p></div>
              {loadingPlans ? <div className="loading-state"><span className="spinner" /> Loading demo plans…</div> : (
                <div className="plan-grid">
                  {plans.map((plan) => <PlanCard key={plan.id} plan={plan} selected={selectedPlan?.id === plan.id} onSelect={(item) => setSelectedPlan(item)} />)}
                </div>
              )}
              {error && <div className="form-error" role="alert"><Icon name="alert" size={17} />{error}</div>}
              {selectedPlan && <div className="step-actions"><span className="selected-plan-note"><Icon name="check" size={16} /> {selectedPlan.name} selected</span><button className="button button-primary" onClick={() => { setError(""); setStep(1); }}>Continue <Icon name="arrow" size={17} /></button></div>}
            </div>
          )}

          {step === 1 && selectedPlan && (
            <div className="form-panel">
              <div className="form-panel-header"><div><span className="eyebrow">STEP 2 OF 3</span><h2>Tell us a little about yourself</h2><p>Only use fictional details in this demo form.</p></div><span className="selected-plan-chip">{selectedPlan.tier} plan · ${selectedPlan.monthlyPremium}/mo</span></div>
              <div className="form-grid">
                <label className="field-label">Full name<input autoComplete="name" value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} placeholder="e.g. Alex Morgan" /></label>
                <label className="field-label">Email address<input type="email" autoComplete="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="alex@example.test" /></label>
                <label className="field-label">Date of birth<input type="date" value={form.dateOfBirth} onChange={(event) => updateField("dateOfBirth", event.target.value)} /></label>
              </div>
              {error && <div className="form-error" role="alert"><Icon name="alert" size={17} />{error}</div>}
              <div className="step-actions"><button className="button button-quiet" onClick={() => { setError(""); setStep(0); }}>Back to plans</button><button className="button button-primary" onClick={goToReview}>Review details <Icon name="arrow" size={17} /></button></div>
              <p className="privacy-note"><Icon name="lock" size={14} /> Do not enter real personal or health information.</p>
            </div>
          )}

          {step === 2 && selectedPlan && (
            <div className="form-panel review-panel">
              <div className="eyebrow">STEP 3 OF 3</div><h2>Review your demo enrollment</h2><p>Check the sample information before submitting your request.</p>
              <div className="review-list">
                <div><span>Selected plan</span><strong>{selectedPlan.name}</strong></div>
                <div><span>Fictional monthly premium</span><strong>${selectedPlan.monthlyPremium} / month</strong></div>
                <div><span>Name</span><strong>{form.fullName}</strong></div>
                <div><span>Email</span><strong>{form.email}</strong></div>
                <div><span>Date of birth</span><strong>{new Date(`${form.dateOfBirth}T00:00:00`).toLocaleDateString()}</strong></div>
              </div>
              <label className="checkbox-row"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /><span>I understand this is a fictional demo request and does not provide insurance coverage.</span></label>
              {error && <div className="form-error" role="alert"><Icon name="alert" size={17} />{error}</div>}
              <div className="step-actions"><button className="button button-quiet" onClick={() => { setError(""); setStep(1); }}>Edit details</button><button className="button button-primary" disabled={!confirmed || submitting} onClick={submitEnrollment}>{submitting ? <><span className="spinner spinner-light" /> Submitting…</> : <>Submit demo request <Icon name="arrow" size={17} /></>}</button></div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

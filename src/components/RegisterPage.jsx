import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { z } from "zod";
import eventsData from "../data/events";
import Header from "./Header";

const registerSchema = z.object({
  fullName: z.string().min(1, "ПІБ обов'язкове"),
  email: z.string().email("Невірний формат email"),
  birthDate: z.string().min(1, "Дата народження обов'язкова").refine((val) => {
    const birth = new Date(val);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age = age - 1;
    }
    return age >= 18;
  }, "Вам має бути не менше 18 років"),
  source: z.string().min(1, "Оберіть джерело"),
});

function RegisterPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const event = eventsData.find(e => e.id === Number(eventId));

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [source, setSource] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!event) {
    return (
      <div className="app">
        <Header showSearch={false} />
        <div style={{ padding: "40px", textAlign: "center" }}>
          <p>Подію не знайдено</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { fullName, email, birthDate, source };
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach(issue => {
        fieldErrors[issue.path[0]] = issue.message;
        });
      setErrors(fieldErrors);
      setSuccessMsg("");
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, eventId }),
      });

      if (response.ok) {
        setSuccessMsg("Реєстрацію успішно завершено!");
        setTimeout(() => {
          navigate(`/participants/${eventId}`);
        }, 1500);
      }
    } catch (err) {
      console.error("Помилка відправки:", err);
      setErrors({ submit: "Щось пішло не так, спробуйте ще раз" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Header showSearch={false} />

      <div className="register-page">
        <div className="register-form-wrapper">
          <h2>Реєстрація</h2>
          <p className="register-event-title">"{event.title}"</p>

          {successMsg && <p className="success-msg">{successMsg}</p>}
          {errors.submit && <p className="error">{errors.submit}</p>}

          <form onSubmit={handleSubmit} className="register-form">

            <div className="form-group">
              <label>ПІБ</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Введіть ПІБ"
              />
              {errors.fullName && <span className="error">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label>Пошта</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Дата народження</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
              {errors.birthDate && <span className="error">{errors.birthDate}</span>}
            </div>

            <div className="form-group">
              <label>Де ви почули про цю подію?</label>
              <div className="radio-group">
                {["Соціальні мережі", "Друзі", "Інше"].map(option => (
                  <label key={option} className="radio-label">
                    <input
                      type="radio"
                      name="source"
                      value={option}
                      checked={source === option}
                      onChange={(e) => setSource(e.target.value)}
                    />
                    {option}
                  </label>
                ))}
              </div>
              {errors.source && <span className="error">{errors.source}</span>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Надсилання..." : "Зареєструватися"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
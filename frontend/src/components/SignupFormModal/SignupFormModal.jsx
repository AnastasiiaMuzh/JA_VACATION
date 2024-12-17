import { useState } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import { useModal } from "../../context/Modal";
import "./SignupFormModal.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (name, value) => {
    const fieldErrors = { ...errors };
    if (!value) {
      fieldErrors[name] = `${name[0].toUpperCase() + name.slice(1)} is required.`;
    } else {
      switch (name) {
        case "email":
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            fieldErrors[name] = "Please provide a valid email.";
          } else {
            delete fieldErrors[name];
          }
          break;
        case "username":
          if (value.length < 4) {
            fieldErrors[name] = "Username must be at least 4 characters.";
          } else {
            delete fieldErrors[name];
          }
          break;
        case "password":
          if (value.length < 6) {
            fieldErrors[name] = "Password must be at least 6 characters.";
          } else {
            delete fieldErrors[name];
          }
          break;
        case "confirm Password":
          if (value !== formData.password) {
            fieldErrors[name] = "Passwords do not match.";
          } else {
            delete fieldErrors[name];
          }
          break;
        default:
          delete fieldErrors[name];
      }
    }
    setErrors(fieldErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).some((err) => err)) return;

    setIsLoading(true);
    try {
      await dispatch(sessionActions.signup(formData));
      closeModal();
    } catch (err) {
      setErrors(err.errors || { general: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled =
    Object.values(formData).some((val) => !val) ||
    Object.values(errors).some((err) => err) ||
    isLoading;

  return (
    <div className="signup-form-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} noValidate>
        {["firstName", "lastName", "email", "username",  "password", "confirmPassword"].map((field) => (
          <label key={field}>
            {field[0].toUpperCase() + field.slice(1).replace("Name", " Name")}
            <input
              type={field.includes("password") || field.includes("confirmPassword") ? "password" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
            {errors[field] && <p className="error-message">{errors[field]}</p>}
          </label>
        ))}
        {errors.general && <p className="error-message">{errors.general}</p>}
        <button type="submit" disabled={isDisabled}>
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;

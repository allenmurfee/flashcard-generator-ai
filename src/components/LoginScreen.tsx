import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      router.push("/"); // Redirect to home page after successful auth
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during authentication"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="text-center mb-5">
            <h1 className="display-4 mb-3">
              <i className="bi-lightbulb-fill text-primary me-2"></i>
              Flashcard AI Generator
            </h1>
            <p className="lead text-muted">
              <i className="bi-pencil-fill text-primary me-2"></i>
              Transform your lecture notes into effective study flashcards
            </p>
          </div>

          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">
                {isSignUp ? "Create your account" : "Sign in to your account"}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">
                    <i className="bi-envelope-fill text-primary me-2"></i>
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control form-control-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    <i className="bi-lock-fill text-primary me-2"></i>
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="form-control form-control-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="alert alert-danger mb-4" role="alert">
                    {error}
                  </div>
                )}

                <div className="d-grid gap-2 mb-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        {isSignUp ? "Creating account..." : "Signing in..."}
                      </>
                    ) : (
                      <>
                        <i
                          className={`bi-${
                            isSignUp ? "person-plus" : "box-arrow-in-right"
                          } me-2`}
                        ></i>
                        {isSignUp ? "Sign up" : "Sign in"}
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="btn btn-link text-decoration-none"
                  >
                    {isSignUp
                      ? "Already have an account? Sign in"
                      : "Don't have an account? Sign up"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

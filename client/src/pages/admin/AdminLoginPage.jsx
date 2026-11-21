import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { ensureDemoAdminToken } from "../../utils/demoAuth";
import toast from "react-hot-toast";

/**
 * Admin-only sign-in screen. Uses the same header/branding as the admin portal
 * (no storefront nav links, cart, or footer) so the admin deployment looks
 * consistent from the login page through the dashboard.
 */
export default function AdminLoginPage() {
  const { isAdmin, setIsAdmin, navigate, axios } = useAppContext();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  useEffect(() => {
    if (isAdmin) navigate("/admin", { replace: true });
  }, [isAdmin, navigate]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/api/admin/login", { email, password });
      if (data.success) {
        setIsAdmin(true);
        navigate("/admin");
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  const handleDemo = async () => {
    await ensureDemoAdminToken(axios);
    setIsAdmin(true);
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(157,191,175,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(224,160,48,0.10),transparent_30%)] bg-secondary-soft-beige text-primary-forest-green">
      <header className="sticky top-0 z-30 border-b border-primary-forest-green/10 bg-primary-warm-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img className="h-8 w-auto" src={assets.holisticAfLogoNoBg} alt="holisticAF logo" />
            <div className="leading-tight">
              <h1 className="text-sm font-semibold tracking-tight md:text-base">
                admin <span className="text-secondary-golden-honey">portal</span>
              </h1>
              <p className="text-xs text-primary-forest-green/55">Operations dashboard</p>
            </div>
          </div>
          <Link to="/" className="rounded-full border border-primary-forest-green/15 bg-primary-warm-white/70 px-3.5 py-1.5 text-sm font-medium transition hover:bg-primary-sage-green/15">
            Back to website
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
        <div className="w-full rounded-2xl border border-primary-forest-green/15 bg-primary-warm-white p-6 shadow-lg">
          <h2 className="text-2xl font-semibold tracking-tight">Admin sign in</h2>
          <p className="mt-1 text-sm text-primary-forest-green/60">
            Sign in with the program admin account or use the demo.
          </p>

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label htmlFor="admin-email" className="text-sm font-medium">Email</label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-primary-forest-green/30 bg-secondary-soft-beige px-3 py-2.5 outline-none focus:border-primary-forest-green"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="text-sm font-medium">Password</label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-primary-forest-green/30 bg-secondary-soft-beige px-3 py-2.5 outline-none focus:border-primary-forest-green"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="w-full rounded-full bg-primary-forest-green px-4 py-2.5 text-primary-cream font-medium transition hover:bg-secondary-deep-forest">
              Sign in
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-widest text-primary-forest-green/50">
            <span className="h-px flex-1 bg-primary-forest-green/15" />
            or
            <span className="h-px flex-1 bg-primary-forest-green/15" />
          </div>

          <button onClick={handleDemo} className="w-full rounded-full border border-secondary-golden-honey px-4 py-2.5 font-medium text-secondary-golden-honey transition hover:bg-secondary-golden-honey hover:text-primary-forest-green">
            Try demo admin
          </button>
        </div>
        <p className="mt-6 text-center text-xs text-primary-forest-green/50">
          Demo mode — data is stored in this browser.
        </p>
      </main>
    </div>
  );
}

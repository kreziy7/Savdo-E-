import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle2, XCircle } from 'lucide-react';
import useAuthStore from '../store/authStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const rules = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'One number', test: (p) => /\d/.test(p) },
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [touched, setTouched] = useState(false);
  const { register, login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const passwordValid = rules.every((r) => r.test(form.password));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (!passwordValid) return;
    try {
      await register(form);
      await login({ email: form.email, password: form.password });
      navigate('/');
    } catch (_) {}
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Create account</h1>
            <p className="text-gray-500 text-sm mt-1">Join Savdo-E today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              icon={User}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="John Doe"
              minLength={2}
            />
            <Input
              label="Email"
              type="email"
              icon={Mail}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="you@example.com"
            />
            <div>
              <Input
                label="Password"
                type="password"
                icon={Lock}
                value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); setTouched(true); }}
                required
                placeholder="e.g. MyPass123"
              />
              {/* Password strength checklist */}
              {(touched || form.password.length > 0) && (
                <ul className="mt-2 space-y-1">
                  {rules.map((rule) => {
                    const ok = rule.test(form.password);
                    return (
                      <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${ok ? 'text-green-600' : 'text-gray-400'}`}>
                        {ok
                          ? <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                          : <XCircle className="h-3.5 w-3.5 flex-shrink-0" />}
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

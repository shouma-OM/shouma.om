import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import shoumaNewLogo from "@assets/image_1772569182491.png";
import shoumaLogo from "@/assets/shouma-logo.png";
import { signInWithGoogle, loginWithEmail, registerWithEmail } from "@/lib/firebase";
import { apiRequest } from "@/lib/queryClient";

function OmaniLandscapeSVG() {
  return (
    <svg
      viewBox="0 0 1200 800"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a0a2e" />
          <stop offset="30%" stopColor="#2d1b4e" />
          <stop offset="60%" stopColor="#5c3d2e" />
          <stop offset="80%" stopColor="#c4703f" />
          <stop offset="100%" stopColor="#e8a87c" />
        </linearGradient>
        <linearGradient id="sandGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4a574" />
          <stop offset="100%" stopColor="#b8895a" />
        </linearGradient>
        <linearGradient id="fortGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B7355" />
          <stop offset="100%" stopColor="#6B5B45" />
        </linearGradient>
        <linearGradient id="towerGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9B8365" />
          <stop offset="100%" stopColor="#7B6B55" />
        </linearGradient>
        <linearGradient id="mountainGradient1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a4535" />
          <stop offset="100%" stopColor="#3d2e22" />
        </linearGradient>
        <linearGradient id="mountainGradient2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b5540" />
          <stop offset="100%" stopColor="#4a3828" />
        </linearGradient>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff8e7" stopOpacity="1" />
          <stop offset="40%" stopColor="#ffe4b5" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffe4b5" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1200" height="800" fill="url(#skyGradient)" />

      {[
        { cx: 150, cy: 80, r: 1.5, o: 0.7 }, { cx: 300, cy: 50, r: 1, o: 0.8 }, { cx: 450, cy: 120, r: 1.8, o: 0.65 },
        { cx: 600, cy: 40, r: 1.2, o: 0.9 }, { cx: 750, cy: 90, r: 1, o: 0.75 }, { cx: 900, cy: 60, r: 1.5, o: 0.85 },
        { cx: 1050, cy: 100, r: 1, o: 0.7 }, { cx: 200, cy: 150, r: 0.8, o: 0.6 }, { cx: 500, cy: 70, r: 1.3, o: 0.8 },
        { cx: 800, cy: 130, r: 0.9, o: 0.75 }, { cx: 1100, cy: 45, r: 1.4, o: 0.9 }, { cx: 350, cy: 160, r: 0.7, o: 0.65 },
        { cx: 700, cy: 30, r: 1.1, o: 0.85 }, { cx: 950, cy: 140, r: 0.8, o: 0.7 }, { cx: 100, cy: 200, r: 1, o: 0.8 },
        { cx: 550, cy: 180, r: 0.6, o: 0.6 }, { cx: 1000, cy: 170, r: 0.9, o: 0.75 }, { cx: 250, cy: 220, r: 0.7, o: 0.65 },
        { cx: 650, cy: 110, r: 1.2, o: 0.8 }, { cx: 850, cy: 190, r: 0.5, o: 0.7 },
      ].map((star, i) => (
        <circle key={i} cx={star.cx} cy={star.cy} r={star.r} fill="white" opacity={star.o}>
          <animate attributeName="opacity" values={`${0.4 + i * 0.02};${0.8 + i * 0.01};${0.4 + i * 0.02}`} dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}

      <circle cx="950" cy="120" r="60" fill="url(#moonGlow)" />
      <circle cx="950" cy="120" r="30" fill="#fff8e7" opacity="0.9" />
      <circle cx="940" cy="115" r="25" fill="#ffe8c8" opacity="0.3" />

      <path d="M0 500 L100 380 L200 420 L350 340 L450 390 L500 350 L600 430 L700 370 L800 400 L900 320 L1000 380 L1100 350 L1200 410 L1200 800 L0 800Z" fill="url(#mountainGradient1)" opacity="0.7" />
      <path d="M0 520 L150 440 L250 470 L400 400 L500 450 L650 380 L750 430 L900 390 L1000 440 L1100 400 L1200 460 L1200 800 L0 800Z" fill="url(#mountainGradient2)" opacity="0.8" />

      <rect x="180" y="430" width="120" height="120" fill="url(#fortGradient)" rx="2" />
      <rect x="175" y="420" width="130" height="15" fill="#7B6B55" rx="1" />
      {[180, 195, 210, 225, 240, 255, 270, 285].map((x, i) => (
        <rect key={`b1-${i}`} x={x} y="412" width="8" height="12" fill="url(#fortGradient)" rx="1" />
      ))}
      <rect x="155" y="380" width="35" height="170" fill="url(#towerGradient)" rx="2" />
      <polygon points="172.5,355 145,385 200,385" fill="#9B8365" />
      <rect x="290" y="390" width="35" height="160" fill="url(#towerGradient)" rx="2" />
      <polygon points="307.5,365 280,395 335,395" fill="#9B8365" />
      <rect x="220" y="470" width="30" height="80" fill="#5a4a3a" rx="4" />

      <rect x="750" y="440" width="160" height="110" fill="url(#fortGradient)" rx="2" />
      <rect x="745" y="430" width="170" height="15" fill="#7B6B55" rx="1" />
      <rect x="730" y="400" width="40" height="150" fill="url(#towerGradient)" rx="2" />
      <polygon points="750,370 720,405 780,405" fill="#9B8365" />
      <rect x="895" y="410" width="40" height="140" fill="url(#towerGradient)" rx="2" />
      <polygon points="915,380 885,415 945,415" fill="#9B8365" />
      <rect x="810" y="470" width="35" height="80" fill="#5a4a3a" rx="5" />

      <path d="M0 550 Q200 530 400 555 Q600 570 800 545 Q1000 530 1200 555 L1200 800 L0 800Z" fill="url(#sandGradient)" />
      <path d="M0 580 Q300 565 600 585 Q900 595 1200 575 L1200 800 L0 800Z" fill="#c49b6a" opacity="0.5" />

      {[80, 420, 620, 1000].map((x, i) => (
        <g key={`palm-${i}`} transform={`translate(${x}, ${545 + i * 5})`}>
          <rect x="-2" y="-60" width="4" height="60" fill="#5a4020" rx="2" />
          <ellipse cx="0" cy="-60" rx="25" ry="8" fill="#2d5a1e" opacity="0.8" transform="rotate(-20)" />
          <ellipse cx="0" cy="-60" rx="25" ry="8" fill="#3a6b28" opacity="0.7" transform="rotate(15)" />
          <ellipse cx="0" cy="-62" rx="22" ry="7" fill="#2d5a1e" opacity="0.6" transform="rotate(-50)" />
          <ellipse cx="0" cy="-58" rx="20" ry="6" fill="#3a7030" opacity="0.7" transform="rotate(45)" />
        </g>
      ))}

      <path d="M0 620 Q100 615 200 625 Q400 640 600 620 Q800 610 1000 630 Q1100 635 1200 625 L1200 800 L0 800Z" fill="#b8895a" opacity="0.4" />

      <text x="600" y="700" textAnchor="middle" fill="#fff8e7" opacity="0.08" fontSize="120" fontFamily="serif" fontWeight="bold">
        عُمان
      </text>
    </svg>
  );
}

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [errors, setErrors] = useState<{ username?: string; password?: string; email?: string }>({});

  const validateForm = () => {
    const fieldErrors: { username?: string; password?: string; email?: string } = {};
    if (!formData.username.trim()) {
      fieldErrors.username = t("usernameRequired") || (isRTL ? "اسم المستخدم أو البريد مطلوب" : "Username or email is required");
    }
    if (!formData.password || formData.password.length < 4) {
      fieldErrors.password = t("passwordRequired") || (isRTL ? "كلمة المرور مطلوبة (4 أحرف على الأقل)" : "Password is required");
    }
    if (!isLogin && formData.email && !formData.email.includes("@")) {
      fieldErrors.email = isRTL ? "البريد الإلكتروني غير صالح" : "Invalid email address";
    }

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { user, profile } = await signInWithGoogle();
      const username = profile?.username || user.displayName || user.email?.split("@")[0] || "user";
      localStorage.setItem("shouma-username", username);
      localStorage.setItem("shouma-auth-provider", "firebase-google");
      
      toast({
        title: isRTL ? "مرحباً بك!" : "Welcome!",
        description: isRTL ? `تم تسجيل الدخول بنجاح عبر حساب Google (${username})` : `Successfully signed in with Google (${username})`,
      });
      setLocation("/home");
    } catch (err: any) {
      toast({
        title: t("error") || "خطأ",
        description: err.message || (isRTL ? "فشل تسجيل الدخول بواسطة Google" : "Google sign-in failed"),
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const inputIdent = formData.username.trim();
      const pwd = formData.password.trim();

      if (isLogin) {
        // Try Firebase Authentication first
        try {
          const { user, profile } = await loginWithEmail(inputIdent, pwd);
          const activeUser = profile?.username || user.displayName || inputIdent;
          localStorage.setItem("shouma-username", activeUser);
          localStorage.setItem("shouma-auth-provider", "firebase");
          
          toast({
            title: t("loginSuccess") || "تم تسجيل الدخول بنجاح",
            description: t("welcomeMessage") || "أهلاً بك في منصة شومة",
          });
          setLocation("/home");
          return;
        } catch (firebaseErr: any) {
          // If user exists in local backend database (e.g. demo/admin), fall back to backend auth
          console.log("[FIREBASE AUTH] Falling back to backend auth:", firebaseErr.message);
          const response = await apiRequest("POST", "/api/auth/login", {
            username: inputIdent,
            password: pwd,
          });
          const data = await response.json();
          localStorage.setItem("shouma-username", data.username);
          localStorage.setItem("shouma-auth-provider", "local-backend");

          toast({
            title: t("loginSuccess") || "تم تسجيل الدخول بنجاح",
            description: t("welcomeMessage") || "أهلاً بك في منصة شومة",
          });
          setLocation("/home");
        }
      } else {
        // Register in Firebase and sync profile to Firestore
        const regEmail = formData.email?.trim() || `${inputIdent.toLowerCase()}@shouma.om`;
        try {
          const { profile } = await registerWithEmail(regEmail, pwd, inputIdent);
          localStorage.setItem("shouma-username", profile?.username || inputIdent);
          localStorage.setItem("shouma-auth-provider", "firebase");

          // Also inform backend storage for unified sessions
          await apiRequest("POST", "/api/auth/register", {
            username: inputIdent,
            password: pwd,
            email: regEmail,
            verifiedVia: "firebase",
          }).catch(() => null);

          toast({
            title: t("registerSuccess") || "تم إنشاء الحساب بنجاح",
            description: t("welcomeMessage") || "أهلاً بك في منصة شومة",
          });
          setLocation("/home");
        } catch (regErr: any) {
          // Fallback to local registration if needed
          const response = await apiRequest("POST", "/api/auth/register", {
            username: inputIdent,
            password: pwd,
            email: regEmail,
            verifiedVia: "direct",
          });
          const data = await response.json();
          localStorage.setItem("shouma-username", data.username);
          
          toast({
            title: t("registerSuccess") || "تم إنشاء الحساب بنجاح",
            description: t("welcomeMessage") || "أهلاً بك في منصة شومة",
          });
          setLocation("/home");
        }
      }
    } catch (err: any) {
      toast({
        title: t("error") || "خطأ في تسجيل الدخول",
        description: err.message || t("tryAgain") || "يرجى المحاولة مجدداً",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
        <ThemeToggle variant="icon-only" />
        <LanguageSwitcher />
      </div>

      <div className="absolute inset-0">
        <OmaniLandscapeSVG />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/30" />

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <img 
              src={shoumaNewLogo || shoumaLogo} 
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src !== shoumaLogo) {
                  target.src = shoumaLogo;
                }
              }}
              alt="شومة - Shouma"
              className="w-52 max-w-[210px] h-auto mx-auto mb-3 drop-shadow-2xl object-contain"
              data-testid="logo-login"
            />
            <p className="text-amber-100/90 text-base drop-shadow-md font-medium" data-testid="text-tagline">
              {t("homeSubtitle")}
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/10 dark:bg-black/30 border border-white/20 rounded-2xl shadow-2xl p-7" data-testid="card-login">
            <div className="text-center mb-5">
              <h2 className="text-2xl font-bold text-white tracking-wide" data-testid="text-form-title">
                {isLogin ? (isRTL ? "تسجيل الدخول" : "Welcome Back") : (isRTL ? "إنشاء حساب جديد" : "Create Account")}
              </h2>
              <p className="text-amber-100/75 mt-1 text-xs" data-testid="text-form-subtitle">
                {isLogin ? (isRTL ? "سجّل الدخول للوصول إلى حجوزاتك ومخططاتك" : "Sign in to access your bookings & plans") : (isRTL ? "انضم إلى مجتمع شومة واستكشف سلطنة عُمان" : "Join Shouma and explore the Sultanate")}
              </p>
            </div>

            {/* Google One-Click Sign-In */}
            <div className="mb-5">
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                variant="outline"
                className="w-full h-11 bg-white hover:bg-slate-100 text-slate-800 font-semibold border-white/40 shadow-md flex items-center justify-center gap-3 transition-all hover:scale-[1.01]"
                data-testid="button-google-login"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-700" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span className="text-sm">
                  {isRTL ? "تسجيل الدخول السريع عبر Google" : "Continue with Google"}
                </span>
              </Button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-white/20 w-full" />
                <span className="bg-transparent px-3 text-[11px] text-amber-100/60 uppercase tracking-wider whitespace-nowrap">
                  {isRTL ? "أو باستخدام الحساب" : "or with email/username"}
                </span>
                <div className="border-t border-white/20 w-full" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-xs font-semibold text-amber-100/90">
                  {isRTL ? "اسم المستخدم أو البريد الإلكتروني" : "Username or Email"}
                </Label>
                <Input
                  id="username"
                  data-testid="input-username"
                  type="text"
                  placeholder={isRTL ? "مثال: Ahmed أو ahmed@example.com" : "e.g. Ahmed or user@mail.com"}
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`h-11 text-sm bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-amber-400 focus:ring-amber-400/30 ${errors.username ? "border-red-400" : ""}`}
                />
                {errors.username && (
                  <p className="text-xs text-red-300" data-testid="error-username">{errors.username}</p>
                )}
              </div>

              {!isLogin && (
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-amber-100/90">
                    {isRTL ? "البريد الإلكتروني (اختياري)" : "Email (Optional)"}
                  </Label>
                  <Input
                    id="email"
                    data-testid="input-email"
                    type="email"
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`h-11 text-sm bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-amber-400 focus:ring-amber-400/30 ${errors.email ? "border-red-400" : ""}`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-300" data-testid="error-email">{errors.email}</p>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-amber-100/90">
                  {t("password") || (isRTL ? "كلمة المرور" : "Password")}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    data-testid="input-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`h-11 text-sm bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-amber-400 focus:ring-amber-400/30 ${isRTL ? "pl-11" : "pr-11"} ${errors.password ? "border-red-400" : ""}`}
                  />
                  <button
                    type="button"
                    data-testid="button-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-300" data-testid="error-password">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                data-testid="button-submit"
                className="w-full h-11 text-sm font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-white border-0 shadow-lg shadow-amber-950/40 transition-all duration-300 mt-2"
                disabled={loading || googleLoading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t("loading") || "جاري التحقق..."}</span>
                  </div>
                ) : isLogin ? (
                  isRTL ? "دخول فوري" : "Sign In"
                ) : (
                  isRTL ? "إنشاء الحساب فوراً" : "Create Account"
                )}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  data-testid="button-toggle-mode"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors({});
                  }}
                  className="text-xs text-amber-200/90 hover:text-amber-100 transition-colors font-medium underline underline-offset-4"
                >
                  {isLogin
                    ? `${t("noAccount") || "ليس لديك حساب؟"} ${t("createAccount") || "إنشاء حساب جديد"}`
                    : `${t("haveAccount") || "لديك حساب بالفعل؟"} ${t("loginHere") || "تسجيل الدخول"}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

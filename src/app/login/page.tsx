import { LoginForm } from "@/modules/auth/LoginForm"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景光晕装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-theme-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-theme-pinkLight/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient-mystical mb-2">
            知命阁 · AI
          </h1>
          <p className="text-slate-400 text-sm">
            探寻命运，启迪人生
          </p>
        </div>

        <div className="card-mystical p-8">
          <LoginForm />
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          还没有账号？{" "}
          <Link
            href="/register"
            className="text-theme-pinkLight hover:text-theme-pink transition-colors font-medium"
          >
            立即注册
          </Link>
        </p>

        <p className="text-center text-xs text-slate-600 mt-4">
          登录即表示同意我们的服务条款
        </p>
      </div>
    </div>
  )
}
import { RegisterForm } from "@/modules/auth/RegisterForm"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            ZGSM-AI
          </h1>
          <p className="text-slate-600">
            智能运势算命助手
          </p>
        </div>

        <div className="card-glow p-8">
          <RegisterForm />
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          已有账号？{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            立即登录
          </Link>
        </p>

        <p className="text-center text-xs text-slate-400 mt-4">
          注册即表示同意我们的服务条款
        </p>
      </div>
    </div>
  )
}
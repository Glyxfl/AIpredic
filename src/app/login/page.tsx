import { LoginForm } from "@/modules/auth/LoginForm"

export default function LoginPage() {
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
          <LoginForm />
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          登录即表示同意我们的服务条款
        </p>
      </div>
    </div>
  )
}
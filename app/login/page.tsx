import { Suspense } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LoginForm } from "./login-form"

export const metadata = { title: "Anmelden · ZAZU Admin" }

async function LoginFormWithError({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const initialError =
    error === "no-admin"
      ? "Dieses Konto hat keinen Zugriff auf das Admin-Panel."
      : undefined

  return <LoginForm initialError={initialError} />
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">ZAZU Admin</CardTitle>
          <CardDescription>
            Melde dich an, um die Inhalte der Berufswahl zu pflegen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoginForm />}>
            <LoginFormWithError searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  )
}

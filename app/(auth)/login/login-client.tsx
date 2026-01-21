"use client"

import * as React from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const schema = z.object({
  email: z.string().email("Ingresa un correo válido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
})

type Values = z.infer<typeof schema>

export function LoginPageClient() {
  const { login, isLoading } = useAuth()

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [step, setStep] = React.useState<1 | 2>(1)
  const [showPass, setShowPass] = React.useState(false)

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  })

  async function handleLogin(values: Values) {
    setErrorMessage(null)
    try {
      await login(values.email, values.password)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al iniciar sesión"
      setErrorMessage(message)
    }
  }

  async function nextStep() {
    setErrorMessage(null)
    const ok = await form.trigger(["email"])
    if (!ok) return
    setStep(2)
  }

  function prevStep() {
    setErrorMessage(null)
    setStep(1)
  }

  const progress = step === 1 ? 50 : 100

  const slides = React.useMemo(
    () => [
      {
        title: "Acceso seguro y rápido",
        desc: "Ingresa a tu panel con una experiencia clara y moderna.",
        img: "https://res.cloudinary.com/dbrkedvyp/image/upload/v1768499008/software-developer-coding-on-multiple-screens_jeumvy.jpg",
      },
      {
        title: "Diseño premium",
        desc: "Acentos Devwolf con estética confiable y profesional.",
        img: "https://res.cloudinary.com/dbrkedvyp/image/upload/v1768499004/network-server-room-with-fiber-optic-cables-and-sw_nv9eza.jpg",
      },
      {
        title: "UX enfocada",
        desc: "Solo lo necesario para autenticarte sin fricciones.",
        img: "https://res.cloudinary.com/dbrkedvyp/image/upload/v1768498991/3d-printer-manufacturing-custom-parts-closeup_g4pbug.jpg",
      },
    ],
    []
  )

  const [api, setApi] = React.useState<CarouselApi | null>(null)
  const [activeSlide, setActiveSlide] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    const onSelect = () => setActiveSlide(api.selectedScrollSnap())
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    onSelect()

    const id = window.setInterval(() => api.scrollNext(), 6500)
    return () => {
      window.clearInterval(id)
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api])

  return (
    // Fullscreen, sin fondo oscuro externo
    <div className="min-h-[100svh] w-full bg-[#000000]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        // Fullscreen real
        className="relative min-h-[100svh] w-full overflow-hidden"
      >
        {/* Fondo premium (NO bloquea clicks) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(26,88,127,0.16),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(68,198,209,0.12),transparent_55%)]" />
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />
        </div>

        {/* Layout:
            - mobile/tablet: 2 filas (hero + form) que llenan pantalla
            - desktop: 2 columnas a pantalla completa
        */}
        <div className="relative grid min-h-[100svh] grid-rows-[38svh_1fr] lg:grid-cols-2 lg:grid-rows-1">
          {/* LEFT */}
          <div className="relative z-0 overflow-hidden">
            <Carousel setApi={setApi} opts={{ loop: true, align: "start" }} className="absolute inset-0">
              <CarouselContent className="h-full">
                {slides.map((s, idx) => (
                  <CarouselItem key={idx} className="relative h-[38svh] lg:h-[100svh]">
                    <Image
                      src={s.img}
                      alt={s.title}
                      fill
                      className="object-cover"
                      priority={idx === 0}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.18),transparent_55%)]" />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Marca */}
            <div className="absolute left-4 top-4 z-10 flex items-center gap-3 sm:left-6 sm:top-6">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1F2933]/80 ring-1 ring-[#1A587F]/40 backdrop-blur">
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain scale-200"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold uppercase tracking-[0.20em] text-white/80">Devwolf</div>
                <div className="text-sm text-slate-300">Proformas & Finanzas</div>
              </div>
            </div>

            {/* Copy */}
            <div className="absolute bottom-4 left-4 right-4 z-10 sm:bottom-6 sm:left-6 sm:right-6">
              <AnimatePresence mode="wait" initial={false}>
                <motion.h3
                  key={`t-${activeSlide}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="text-lg font-semibold tracking-tight text-white sm:text-2xl lg:text-4xl"
                >
                  {slides[activeSlide].title}
                </motion.h3>
              </AnimatePresence>

              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={`d-${activeSlide}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.28, ease: "easeOut", delay: 0.03 }}
                  className="mt-1 max-w-md text-xs text-white/80 sm:mt-2 sm:text-sm"
                >
                  {slides[activeSlide].desc}
                </motion.p>
              </AnimatePresence>

              <div className="mt-3 flex items-center gap-2 sm:mt-5">
                {slides.map((_, i) => {
                  const isActive = i === activeSlide
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => api?.scrollTo(i)}
                      className={cn(
                        "h-2 rounded-full transition",
                        isActive
                          ? "w-10 bg-[#44C6D1]"
                          : "w-4 bg-[#44C6D1]/35 hover:bg-[#44C6D1]/55"
                      )}
                      aria-label={`Slide ${i + 1}`}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: IMPORTANT -> z-10 + pointer-events-auto para que puedas escribir siempre */}
          <div className="relative z-10 flex items-center justify-center px-4 py-6 pointer-events-auto lg:px-10">
            <div className="w-full max-w-md">
              <Card className="rounded-3xl border-[#1A587F]/30 bg-[#1F2933]/70 shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.20em] text-[#44C6D1]/80">
                        Devwolf Login
                      </div>
                      <CardTitle className="mt-2 text-2xl font-semibold tracking-tight text-[#44C6D1] sm:text-3xl">
                        Iniciar sesión
                      </CardTitle>
                      <CardDescription className="mt-1 text-slate-400">Paso {step} de 2</CardDescription>
                    </div>

                    <Button
                      asChild
                      className="group relative rounded-full border border-[#44C6D1]/30 bg-[#111827]/80 px-4 py-2 text-[11px] font-semibold text-[#44C6D1] hover:bg-[#111827]"
                    >
                      <a href="/register">
                        <span className="absolute inset-0 rounded-full ring-2 ring-[#44C6D1]/30 opacity-0 group-hover:animate-ping group-hover:opacity-100" />
                        Sign up
                      </a>
                    </Button>
                  </div>

                  <div className="pt-2">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#111827]/60">
                      <div
                        className="h-full rounded-full bg-[#44C6D1] transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                      >
                        <Alert className="mt-3 rounded-2xl border-red-500 bg-red-500/10 text-red-400">
                          <AlertDescription className="text-sm text-red-400">{errorMessage}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardHeader>

                <Separator />

                <CardContent className="pt-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                      <AnimatePresence mode="wait" initial={false}>
                        {step === 1 && (
                          <motion.div
                            key="step-email"
                            initial={{ opacity: 0, x: 14 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -14 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="space-y-4"
                          >
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">Email</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                      <Input
                                        {...field}
                                        type="email"
                                        placeholder="tu@email.com"
                                        autoComplete="email"
                                        inputMode="email"
                                        disabled={isLoading}
                                        className="h-11 rounded-2xl border-[#44C6D1]/30 bg-[#111827]/50 pl-9 text-white placeholder:text-gray-500"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <Button
                              type="button"
                              onClick={nextStep}
                              disabled={isLoading}
                              className="h-11 w-full rounded-2xl bg-[#44C6D1] text-slate-950 hover:bg-[#3ba8b0]"
                            >
                              Continuar <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </motion.div>
                        )}

                        {step === 2 && (
                          <motion.div
                            key="step-password"
                            initial={{ opacity: 0, x: 14 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -14 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="space-y-4"
                          >
                            <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">Contraseña</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                      <Input
                                        {...field}
                                        type={showPass ? "text" : "password"}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        disabled={isLoading}
                                        className="h-11 rounded-2xl border-[#44C6D1]/30 bg-[#111827]/50 pl-9 pr-11 text-white placeholder:text-gray-500"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setShowPass((v) => !v)}
                                        className="absolute right-1 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-slate-300 hover:bg-white/5"
                                        aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                                      >
                                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                      </button>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
                              <button
                                type="button"
                                onClick={prevStep}
                                className="text-left text-xs text-slate-400 hover:text-white cursor-pointer"
                              >
                                Volver al email
                              </button>
                              <a href="#" className="text-xs text-slate-400 hover:text-white cursor-pointer">
                                ¿Olvidaste tu contraseña?
                              </a>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={isLoading}
                                className="h-11 rounded-2xl border-[#44C6D1]/40 text-[#44C6D1] hover:bg-[#44C6D1]/10 cursor-pointer"
                              >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Atrás
                              </Button>

                              <Button
                                type="submit"
                                disabled={isLoading}
                                className="h-11 rounded-2xl bg-[#44C6D1] text-slate-950 hover:bg-[#3ba8b0] cursor-pointer"
                              >
                                {isLoading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Entrando...
                                  </>
                                ) : (
                                  "Login"
                                )}
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

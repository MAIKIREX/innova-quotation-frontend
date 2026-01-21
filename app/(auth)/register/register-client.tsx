"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import type { CreateUserPayload } from "@/types/api.types";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const schema = z
  .object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
    lastname: z
      .string()
      .min(2, "El apellido debe tener al menos 2 caracteres."),
    email: z.string().email("Ingresa un correo válido."),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres."),
    confirmPassword: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type Values = z.infer<typeof schema>;

export function RegisterPageClient() {
  const { register, isLoading } = useAuth();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [step, setStep] = React.useState<1 | 2>(1);
  const [showPass, setShowPass] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  async function onSubmit(values: Values) {
    setErrorMessage(null);
    const payload: CreateUserPayload = {
      email: values.email,
      password: values.password,
      profile: { name: values.name, lastname: values.lastname },
    };
    try {
      await register(
        payload.email,
        payload.password,
        payload.profile.name,
        payload.profile.lastname,
      );
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "No se pudo registrar",
      );
    }
  }

  async function nextStep() {
    setErrorMessage(null);
    const ok = await form.trigger(["name", "lastname", "email"]);
    if (!ok) return;
    setStep(2);
  }

  function prevStep() {
    setErrorMessage(null);
    setStep(1);
  }

  const progress = step === 1 ? 50 : 100;

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

  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [activeSlide, setActiveSlide] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => setActiveSlide(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    onSelect();

    const id = window.setInterval(() => api.scrollNext(), 6500);
    return () => {
      window.clearInterval(id);
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <div className="min-h-screen bg-[#000000] w-full">
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

        <div className="relative grid grid-cols-1 lg:grid-cols-2">
          <div className="relative min-h-[320px] lg:min-h-screen">
            <Carousel
              setApi={setApi}
              opts={{ loop: true, align: "start" }}
              className="absolute inset-0"
            >
              <CarouselContent className="h-full">
                {slides.map((s, idx) => (
                  <CarouselItem
                    key={idx}
                    className="relative h-[320px] lg:h-screen"
                  >
                    <Image
                      src={s.img}
                      alt={s.title}
                      fill
                      className="object-cover"
                      priority={idx === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/10" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.18),transparent_55%)]" />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <div className="absolute left-6 top-6 z-10 flex items-center gap-3">
              <div className="rounded-full grid h-12 w-12 place-items-center bg-[#1F2933]/80 text-sm font-semibold text-[#44C6D1] ring-1 ring-[#1A587F]/40 backdrop-blur">
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
                <div className="text-xs font-semibold uppercase tracking-[0.20em] text-white/80">
                  Devwolf
                </div>
                <div className="text-sm text-slate-300">
                  Proformas & Finanzas
                </div>
              </div>
            </div>

            <div className="absolute bottom-7 left-7 right-7 z-10 max-w-xl">
              <AnimatePresence mode="wait" initial={false}>
                <motion.h3
                  key={`t-${activeSlide}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="text-3xl font-semibold tracking-tight text-white sm:text-4xl"
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
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
                  className="mt-2 max-w-md text-sm text-white/80"
                >
                  {slides[activeSlide].desc}
                </motion.p>
              </AnimatePresence>

              <div className="mt-5 flex items-center gap-2">
                {slides.map((_, i) => {
                  const isActive = i === activeSlide;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => api?.scrollTo(i)}
                      className={cn(
                        "h-1.5 rounded-full transition",
                        isActive
                          ? "w-10 bg-[#44C6D1]"
                          : "w-4 bg-[#44C6D1]/35 hover:bg-[#44C6D1]/55",
                      )}
                      aria-label={`Slide ${i + 1}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center p-6 sm:p-10 lg:p-12">
            <div className="w-full max-w-md">
              <Card className="rounded-3xl border-[#1A587F]/30 bg-[#1F2933]/70 shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.20em] text-[#44C6D1]/80">
                        Devwolf Register
                      </div>
                      <CardTitle className="mt-2 text-2xl font-semibold tracking-tight text-[#44C6D1]">
                        Crear cuenta
                      </CardTitle>
                      <CardDescription className="mt-1 text-slate-400">
                        Paso {step} de 2
                      </CardDescription>
                    </div>

                    <Button
                      asChild
                      className="group relative rounded-full border border-[#44C6D1]/30 bg-[#111827]/80 px-4 py-2 text-[11px] font-semibold text-[#44C6D1] hover:bg-[#111827]"
                    >
                      <a href="/login">
                        <span className="absolute inset-0 rounded-full ring-2 ring-[#44C6D1]/30 opacity-0 group-hover:animate-ping group-hover:opacity-100" />
                        Sign in
                      </a>
                    </Button>
                  </div>

                  <div className="pt-1">
                    <div className="h-2 w-full overflow-hidden bg-[#111827]/60">
                      <div
                        className="h-full bg-[#44C6D1] transition-all"
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
                        <Alert className="mt-2 rounded-none border-red-500 bg-red-500/10 text-red-400">
                          <AlertDescription className="text-sm text-red-400">
                            {errorMessage}
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardHeader>

                <Separator />

                <CardContent className="pt-6">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {step === 1 && (
                          <motion.div
                            key="step-profile"
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="space-y-4"
                          >
                            <div className="grid grid-cols-2 gap-3">
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white">
                                      Nombre
                                    </FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                          {...field}
                                          type="text"
                                          placeholder="Juan"
                                          disabled={isLoading}
                                          className="h-11 rounded-2xl border-[#44C6D1]/30 bg-[#111827]/50 pl-9 text-white placeholder:text-gray-500"
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="lastname"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white">
                                      Apellido
                                    </FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                          {...field}
                                          type="text"
                                          placeholder="Pérez"
                                          disabled={isLoading}
                                          className="h-11 rounded-2xl border-[#44C6D1]/30 bg-[#111827]/50 pl-9 text-white placeholder:text-gray-500"
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">
                                    Email
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                      <Input
                                        {...field}
                                        type="email"
                                        placeholder="tu@email.com"
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
                              className="h-11 w-full rounded-2xl bg-[#44C6D1] text-slate-950 hover:bg-[#3ba8b0] cursor-pointer"
                            >
                              Continuar <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </motion.div>
                        )}

                        {step === 2 && (
                          <motion.div
                            key="step-password"
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="space-y-4"
                          >
                            <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">
                                    Contraseña
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                      <Input
                                        {...field}
                                        type={showPass ? "text" : "password"}
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                        className="h-11 rounded-2xl border-[#44C6D1]/30 bg-[#111827]/50 pl-9 text-white placeholder:text-gray-500"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setShowPass((v) => !v)}
                                        className="absolute right-1 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center text-slate-300 hover:bg-white/5"
                                        aria-label={
                                          showPass
                                            ? "Ocultar contraseña"
                                            : "Mostrar contraseña"
                                        }
                                      >
                                        {showPass ? (
                                          <EyeOff className="h-4 w-4" />
                                        ) : (
                                          <Eye className="h-4 w-4" />
                                        )}
                                      </button>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">
                                    Confirmar contraseña
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                      <Input
                                        {...field}
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                        className="h-11 rounded-2xl border-[#44C6D1]/30 bg-[#111827]/50 pl-9 text-white placeholder:text-gray-500"
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setShowConfirm((v) => !v)
                                        }
                                        className="absolute right-1 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center text-slate-300 hover:bg-white/5"
                                        aria-label={
                                          showConfirm
                                            ? "Ocultar confirmacion"
                                            : "Mostrar confirmacion"
                                        }
                                      >
                                        {showConfirm ? (
                                          <EyeOff className="h-4 w-4" />
                                        ) : (
                                          <Eye className="h-4 w-4" />
                                        )}
                                      </button>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="flex items-center justify-between gap-3 pt-1">
                              <button
                                type="button"
                                onClick={prevStep}
                                className="text-xs text-slate-400 hover:text-white"
                              >
                                Volver a datos
                              </button>
                              <a
                                href="/login"
                                className="text-xs text-slate-400 hover:text-white"
                              >
                                ¿Ya tienes cuenta?
                              </a>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={isLoading}
                                className="rounded-2xl border-[#44C6D1]/40 text-[#44C6D1] hover:bg-[#44C6D1]/10 cursor-pointer hover:text-white/80 "
                              >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Atrás
                              </Button>

                              <Button
                                type="submit"
                                disabled={isLoading}
                                className="rounded-2xl bg-[#44C6D1] text-slate-950 hover:bg-[#3ba8b0] cursor-pointer"
                              >
                                {isLoading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Registrando...
                                  </>
                                ) : (
                                  "Crear cuenta"
                                )}
                              </Button>
                            </div>

                            <p className="pt-2 text-center text-xs text-slate-400">
                              Registro por pasos con validacion básica.
                            </p>
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
  );
}
